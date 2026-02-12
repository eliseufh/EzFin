import "server-only";

import { and, desc, eq, gte, lte, sql } from "drizzle-orm";

import { db } from "@/db";
import { categories, transactions } from "@/db/schema";

export type DashboardSummary = {
  balance: number;
  income: number;
  expenses: number;
};

export type CategorySpend = {
  categoryId: string | null;
  categoryName: string;
  total: number;
};

export type RecentTransaction = {
  id: string;
  description: string;
  categoryName: string | null;
  type: "income" | "expense";
  amount: number;
  occurredAt: string;
};

function toNumber(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") return Number(v);
  return Number(v);
}

export async function getMonthSummary(params: {
  userId: string;
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
}): Promise<DashboardSummary> {
  const rows = await db
    .select({
      income: sql<string>`coalesce(sum(case when ${transactions.type} = 'income' then ${transactions.amount} end), 0)`,
      expenses: sql<string>`coalesce(sum(case when ${transactions.type} = 'expense' then ${transactions.amount} end), 0)`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, params.userId),
        gte(transactions.occurredAt, params.from),
        lte(transactions.occurredAt, params.to)
      )
    );

  const income = toNumber(rows[0]?.income ?? 0);
  const expenses = toNumber(rows[0]?.expenses ?? 0);

  return {
    income,
    expenses,
    balance: income - expenses,
  };
}

export async function getTopCategories(params: {
  userId: string;
  from: string;
  to: string;
  limit?: number;
}): Promise<CategorySpend[]> {
  const limit = params.limit ?? 6;

  const rows = await db
    .select({
      categoryId: transactions.categoryId,
      categoryName: sql<string>`coalesce(${categories.name}, 'Sem categoria')`,
      total: sql<string>`coalesce(sum(${transactions.amount}), 0)`,
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        eq(transactions.userId, params.userId),
        eq(transactions.type, "expense"),
        gte(transactions.occurredAt, params.from),
        lte(transactions.occurredAt, params.to)
      )
    )
    .groupBy(transactions.categoryId, categories.name)
    .orderBy(sql`sum(${transactions.amount}) desc`)
    .limit(limit);

  return rows.map((r) => ({
    categoryId: r.categoryId,
    categoryName: r.categoryName,
    total: toNumber(r.total),
  }));
}

export async function getRecentTransactions(params: {
  userId: string;
  limit?: number;
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
}): Promise<RecentTransaction[]> {
  const limit = params.limit ?? 8;

  const conditions = [
    eq(transactions.userId, params.userId),
    params.from ? gte(transactions.occurredAt, params.from) : undefined,
    params.to ? lte(transactions.occurredAt, params.to) : undefined,
  ].filter(Boolean);

  const where = and(...(conditions as [any, ...any[]]));

  const rows = await db
    .select({
      id: transactions.id,
      description: sql<string>`coalesce(${transactions.description}, '')`,
      categoryName: categories.name,
      type: transactions.type,
      amount: transactions.amount,
      occurredAt: transactions.occurredAt,
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(where)
    .orderBy(desc(transactions.occurredAt), desc(transactions.createdAt))
    .limit(limit);

  return rows.map((r) => ({
    id: r.id,
    description: r.description || "(sem descrição)",
    categoryName: r.categoryName ?? null,
    type: r.type,
    amount: toNumber(r.amount),
    occurredAt: r.occurredAt,
  }));
}
