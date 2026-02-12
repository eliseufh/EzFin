## EzFin

SaaS pessoal de gestão financeira (Next.js + TypeScript + Tailwind + shadcn/ui), com autenticação via Clerk e banco no Supabase Postgres.

## Getting Started

### 1) Variáveis de ambiente

Crie um arquivo `.env.local` baseado em [.env.example](.env.example) e preencha:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

> Dica: no painel do Clerk, configure também as URLs de Sign In/Sign Up para apontarem para `/sign-in` e `/sign-up`.

Além disso, configure `DATABASE_URL` (Postgres connection string do Supabase) para o Drizzle.

Veja [.env.example](.env.example).

### 2) Criar tabelas no Supabase

Execute o SQL em [supabase/schema.sql](supabase/schema.sql) no Supabase Dashboard (SQL Editor).

### 3) Rodar o projeto

Execute o servidor de desenvolvimento:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Após login, o usuário é direcionado para o dashboard em `/dashboard`.

Páginas principais:

- Landing: `src/app/page.tsx`
- Dashboard: `src/app/dashboard/page.tsx`
- Settings: `src/app/dashboard/settings/page.tsx`
- Auth (Clerk): `src/app/sign-in/[[...sign-in]]/page.tsx` e `src/app/sign-up/[[...sign-up]]/page.tsx`

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Próximos passos (planejado)

- Integrar Supabase (Postgres) para transações, categorias, subscrições e metas.
- Gráficos e histórico real.
- Melhorar i18n e preferências (moeda/tema/idioma) em todos os componentes.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
