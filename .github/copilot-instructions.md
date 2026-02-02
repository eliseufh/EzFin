# EzFin - AI Coding Agent Instructions

## Architecture Overview

**EzFin** is a personal finance management app built with **Next.js 16**, **Prisma ORM + Accelerate**, **Clerk authentication**, and **TailwindCSS**. The app tracks transactions, subscriptions, and savings goals. Deployed on **Vercel** with **Supabase** (PostgreSQL) database.

### Tech Stack

- **Framework**: Next.js 16.1.5 (App Router, Turbopack)
- **Database**: PostgreSQL (Supabase) + Prisma ORM 6.19.2
- **Cache Layer**: Prisma Accelerate (global edge cache)
- **Authentication**: Clerk
- **Payments**: Stripe (subscriptions)
- **Deployment**: Vercel (Edge Functions)
- **Styling**: TailwindCSS + Shadcn UI (Radix UI primitives)
- **Charts**: Recharts
- **i18n**: Custom hook-based (pt/en)

### Core Data Model (Prisma)

- **User**: Authentication via Clerk, stores currency preference and plan
- **Transaction**: Income/expense entries with category, amount, date
- **Subscription**: Recurring charges (Netflix, rent) with billing day
- **Goal**: Savings targets with current/target amounts

### Key Directories

- `src/app/` - Next.js App Router pages (layout.tsx, page.tsx structure)
- `src/components/ui/` - Shadcn UI components (from Radix UI + TailwindCSS)
- `src/components/ui/dashboard/` - Custom dashboard components (dialogs, charts)
- `src/actions/` - Server actions for data mutations (Next.js 15+ pattern)
- `src/lib/` - Utilities: `db.ts` (Prisma singleton), `auth-helper.ts` (Clerk integration)

## Critical Patterns & Workflows

### Server Actions (src/actions/)

- **All data mutations use "use server"** at the top of action files
- Always check authentication with `getEzFinUser()` - returns null if not logged in
- Use `revalidatePath("/dashboard")` after mutations to update UI immediately
- Accept `FormData` from client-side dialogs, parse with `formData.get()` and `parseInt()`/`parseFloat()`
- Return `{ success: true }` or `{ error: "message" }` for client feedback
- Example: [../src/actions/transaction-actions.ts](../src/actions/transaction-actions.ts)

### Authentication Flow

- Clerk provides `currentUser()` from `@clerk/nextjs/server`
- `getEzFinUser()` syncs Clerk user with EzFin database (auto-creates if missing)
- Use Clerk components in Client Components: `<SignInButton>`, `<SignedIn>`, `<SignedOut>`, `<UserButton>`
- Always call `getEzFinUser()` in server components that need user context

### UI Components

- Use **Shadcn UI** pattern: Import from `@/components/ui/` (TailwindCSS + Radix UI)
- Components use `cva` (class-variance-authority) for variants: `variant="outline" size="lg"`
- Styling is TailwindCSS; dark mode supported via `next-themes`
- Dialogs/forms use Radix UI primitives wrapped with custom styling
- Example Button variants: `default`, `destructive`, `outline`, `ghost`, `link`

### Dashboard Features

- **Dynamic routing with searchParams**: Month/year filters passed via URL (e.g., `?month=1&year=2026`)
- **Month selector**: Custom component for date navigation
- **Dialogs**: `AddTransactionDialog`, `AddSubscriptionDialog`, `AddGoalDialog` (client-side forms)
- **Charts**: `CategoryChart` uses Recharts for expense breakdown
- **Force dynamic rendering**: Add `export const dynamic = "force-dynamic"` for pages that need real-time data

### Database Access

- Prisma Client with **Accelerate extension** instantiated in [../src/lib/db.ts](../src/lib/db.ts) as singleton
- **Always use `cacheStrategy`** in queries for optimal performance (see Performance section)
- Query pattern: `db.transaction.create()`, `db.user.findUnique({ cacheStrategy: {...} })`, etc.
- Relations cascade on delete (User deletion removes transactions/subscriptions/goals)
- **Database Indexes**: All user-filtered queries have indexes on `userId`, `date`, `type` for fast lookups

### Performance & Caching Strategy

**Critical for production performance:**

1. **Prisma Accelerate Cache** (global edge cache):

```typescript
// Short-lived data (transactions, aggregates)
db.transaction.findMany({
  where: { userId: user.id },
  cacheStrategy: { ttl: 60, swr: 120 }, // Cache 60s, stale-while-revalidate 120s
});

// Long-lived data (subscriptions, goals)
db.subscription.findMany({
  where: { userId: user.id },
  cacheStrategy: { ttl: 120, swr: 240 },
});

// Auth data (rarely changes)
db.user.findUnique({
  where: { email: user.email },
  cacheStrategy: { ttl: 300, swr: 600 }, // 5min cache
});
```

2. **Query Parallelization**:
   - ALWAYS use `Promise.all()` for independent queries
   - Example: Dashboard fetches 8 queries in parallel (not sequential)
   - Reduces total time from sum of queries to longest single query

3. **Database Indexes** (already configured):
   - `Transaction`: `@@index([userId])`, `@@index([userId, date])`, `@@index([userId, type])`
   - `Subscription`: `@@index([userId])`, `@@index([userId, active])`
   - `Goal`: `@@index([userId])`

4. **Loading States**:
   - Use `loading.tsx` files for instant skeleton UI
   - Users see layout immediately while data loads

## Build & Development

**Scripts** (package.json):

- `npm run dev` - Next.js dev server on localhost:3000
- `npm run build` - Runs `prisma generate --no-engine && next build` (optimized for Accelerate)
- `npm start` - Production server
- `npm run lint` - ESLint check

**Setup**:

1. Environment requires:
   - `DATABASE_URL` - Prisma Accelerate URL (starts with `prisma+postgres://`)
   - `DIRECT_URL` - Direct PostgreSQL connection (for migrations only)
2. Run `npm install` after cloning
3. Prisma Client generated to `node_modules/@prisma/client` (not committed)

**Deployment (Vercel)**:

- Push to `main` branch triggers automatic deployment
- Environment variables configured in Vercel dashboard
- Build time: ~2 minutes
- Cold start: <100ms (Vercel Edge Functions)
- Hot path: <50ms

**Environment Variables Required**:

```bash
# Database (Prisma Accelerate)
DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=xxx
DIRECT_URL=postgresql://user:pass@host:5432/db

# Clerk Auth
CLERK_SECRET_KEY=sk_xxx
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxx

# Stripe
STRIPE_SECRET_KEY=sk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_xxx
STRIPE_MONTHLY_PRICE_ID=price_xxx
STRIPE_ANNUAL_PRICE_ID=price_xxx

# Admin
ADMIN_EMAILS=admin@example.com

# App URL (Vercel provides automatically)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## Important Implementation Details

### Date Handling

- Use `new Date()` for current timestamp in transactions
- `date-fns` library available for date formatting/manipulation
- Month values in queries are 1-indexed (January = 1, December = 12)

### Currency & Formatting

- User.currency stored in DB (defaults to "EUR")
- Use `formatCurrency()` from [../src/lib/utils.ts](../src/lib/utils.ts) for display
- Transaction amounts stored as Float in Prisma

### Internationalization

- Code contains Portuguese comments ("gasto" = expense, "ganho" = income)
- UI should support user-selected currency

### Form Submission Pattern

```typescript
// In action file (server)
export async function createTransaction(formData: FormData) {
  const user = await getEzFinUser();
  if (!user) return { error: "Usuário não logado" };
  // ... create transaction ...
  revalidatePath("/dashboard");
  return { success: true };
}

// In dialog component (client)
<form action={createTransaction}>
  <input name="amount" type="number" />
  <button type="submit">Adicionar</button>
</form>
```

## Avoid Common Pitfalls

- **Don't forget `revalidatePath()`** in server actions or changes won't appear immediately
- **Always use `cacheStrategy`** in Prisma queries for optimal performance
- **Always check `getEzFinUser()`** before accessing user data (can return null)
- **Prisma must run before build**: `prisma generate --no-engine` happens in build script
- **Use TailwindCSS + CVA** for component styling, not inline CSS
- **Import from `@/components/ui/`** for shared components, not relative paths
- **Server vs Client Components**: Use `"use server"` for actions, `"use client"` for interactive dialogs only when needed
- **Parallel queries**: Use `Promise.all()` for independent database queries
- **Cache TTL**: Short TTL (60s) for transactional data, longer (300s) for auth data

## Performance Best Practices

1. **Always parallelize independent queries**:

```typescript
// ✅ Good - parallel
const [transactions, subscriptions, goals] = await Promise.all([
  db.transaction.findMany({ where: {...}, cacheStrategy: {...} }),
  db.subscription.findMany({ where: {...}, cacheStrategy: {...} }),
  db.goal.findMany({ where: {...}, cacheStrategy: {...} }),
]);

// ❌ Bad - sequential
const transactions = await db.transaction.findMany({...});
const subscriptions = await db.subscription.findMany({...});
const goals = await db.goal.findMany({...});
```

2. **Always add cacheStrategy to queries**:

```typescript
// ✅ Good
const user = await db.user.findUnique({
  where: { email },
  cacheStrategy: { ttl: 300, swr: 600 },
});

// ❌ Bad - no cache
const user = await db.user.findUnique({ where: { email } });
```

3. **Use appropriate TTL values**:
   - Auth data: 300s (5 minutes)
   - Transactions/aggregates: 60s (1 minute)
   - Subscriptions/goals: 120s (2 minutes)
   - Static configuration: 600s (10 minutes)

## Testing & Debugging

- Clerk auth issues: Check environment variables and Clerk dashboard
- Database changes: Update `prisma/schema.prisma`, run `prisma migrate`, restart dev server
- Stale data: Check for missing `revalidatePath()` in relevant server actions
- Build failures: Ensure `prisma generate` completes before TypeScript compilation
