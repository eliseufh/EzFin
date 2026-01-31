# EzFin - AI Coding Agent Instructions

## Architecture Overview

**EzFin** is a personal finance management app built with **Next.js 16**, **Prisma ORM**, **Clerk authentication**, and **TailwindCSS**. The app tracks transactions, subscriptions, and savings goals.

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

- Prisma Client instantiated in [../src/lib/db.ts](../src/lib/db.ts) as singleton (prevents multiple instances in dev)
- Query pattern: `db.transaction.create()`, `db.user.findUnique()`, etc.
- Relations cascade on delete (User deletion removes transactions/subscriptions/goals)

## Build & Development

**Scripts** (package.json):

- `npm run dev` - Next.js dev server on localhost:3000
- `npm run build` - Runs `prisma generate && next build` (IMPORTANT: prisma generate must run first)
- `npm start` - Production server
- `npm run lint` - ESLint check

**Setup**:

1. Environment requires `DIRECT_URL` (PostgreSQL connection string)
2. Run `npm install` after cloning
3. Prisma client auto-generated to `src/generated/prisma/`

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
- **Always check `getEzFinUser()`** before accessing user data (can return null)
- **Prisma must run before build**: `prisma generate` happens in build script
- **Use TailwindCSS + CVA** for component styling, not inline CSS
- **Import from `@/components/ui/`** for shared components, not relative paths
- **Server vs Client Components**: Use `"use server"` for actions, `"use client"` for interactive dialogs only when needed

## Testing & Debugging

- Clerk auth issues: Check environment variables and Clerk dashboard
- Database changes: Update `prisma/schema.prisma`, run `prisma migrate`, restart dev server
- Stale data: Check for missing `revalidatePath()` in relevant server actions
- Build failures: Ensure `prisma generate` completes before TypeScript compilation
