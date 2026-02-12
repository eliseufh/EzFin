-- EzFin schema (Supabase Postgres)
--
-- How to apply (dev):
--   Supabase Dashboard -> SQL Editor -> paste & run.
--
-- Notes:
-- - Uses Clerk user ids as TEXT (`user_id`).
-- - Includes RLS policies that depend on `request.jwt.claim.sub`.
--   (These policies are primarily useful when querying via Supabase PostgREST.)

create extension if not exists pgcrypto;

-- Enums
do $$ begin
  create type transaction_type as enum ('income', 'expense');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type billing_cycle as enum ('monthly', 'yearly');
exception
  when duplicate_object then null;
end $$;

-- Tables
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  name text not null,
  type transaction_type not null,
  color text,
  icon text,
  created_at timestamptz not null default now()
);

create index if not exists categories_user_id_idx on public.categories (user_id);
create index if not exists categories_user_name_idx on public.categories (user_id, name);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  type transaction_type not null,
  amount numeric(12,2) not null,
  description text,
  occurred_at date not null,
  category_id uuid references public.categories(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_id_idx on public.transactions (user_id);
create index if not exists transactions_occurred_at_idx on public.transactions (user_id, occurred_at);
create index if not exists transactions_category_idx on public.transactions (user_id, category_id);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  name text not null,
  amount numeric(12,2) not null,
  billing_cycle billing_cycle not null,
  next_due_at date not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists subscriptions_next_due_idx on public.subscriptions (user_id, next_due_at);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  name text not null,
  target_amount numeric(12,2) not null,
  current_amount numeric(12,2) not null default 0,
  due_at date,
  created_at timestamptz not null default now()
);

create index if not exists goals_user_id_idx on public.goals (user_id);

-- RLS
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.subscriptions enable row level security;
alter table public.goals enable row level security;

-- Helper: Clerk user id from JWT (works when requests go through PostgREST)
create or replace function public.clerk_user_id()
returns text
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '');
$$;

-- Policies (idempotent-ish via drop+create)

do $$ begin
  drop policy if exists "categories_select_own" on public.categories;
  create policy "categories_select_own" on public.categories
    for select
    using (user_id = public.clerk_user_id());

  drop policy if exists "categories_mutate_own" on public.categories;
  create policy "categories_mutate_own" on public.categories
    for all
    using (user_id = public.clerk_user_id())
    with check (user_id = public.clerk_user_id());
exception when undefined_table then null;
end $$;

do $$ begin
  drop policy if exists "transactions_select_own" on public.transactions;
  create policy "transactions_select_own" on public.transactions
    for select
    using (user_id = public.clerk_user_id());

  drop policy if exists "transactions_mutate_own" on public.transactions;
  create policy "transactions_mutate_own" on public.transactions
    for all
    using (user_id = public.clerk_user_id())
    with check (user_id = public.clerk_user_id());
exception when undefined_table then null;
end $$;

do $$ begin
  drop policy if exists "subscriptions_select_own" on public.subscriptions;
  create policy "subscriptions_select_own" on public.subscriptions
    for select
    using (user_id = public.clerk_user_id());

  drop policy if exists "subscriptions_mutate_own" on public.subscriptions;
  create policy "subscriptions_mutate_own" on public.subscriptions
    for all
    using (user_id = public.clerk_user_id())
    with check (user_id = public.clerk_user_id());
exception when undefined_table then null;
end $$;

do $$ begin
  drop policy if exists "goals_select_own" on public.goals;
  create policy "goals_select_own" on public.goals
    for select
    using (user_id = public.clerk_user_id());

  drop policy if exists "goals_mutate_own" on public.goals;
  create policy "goals_mutate_own" on public.goals
    for all
    using (user_id = public.clerk_user_id())
    with check (user_id = public.clerk_user_id());
exception when undefined_table then null;
end $$;
