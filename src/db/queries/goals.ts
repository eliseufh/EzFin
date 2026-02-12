import "server-only";

import { asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { goals } from "@/db/schema";

export type GoalRow = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  dueAt: string | null;
};

function toNumber(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") return Number(v);
  return Number(v);
}

export async function getGoalsForUser(userId: string) {
  const rows = await db
    .select({
      id: goals.id,
      name: goals.name,
      targetAmount: goals.targetAmount,
      currentAmount: goals.currentAmount,
      dueAt: goals.dueAt,
    })
    .from(goals)
    .where(eq(goals.userId, userId))
    .orderBy(asc(goals.createdAt));

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    targetAmount: toNumber(r.targetAmount),
    currentAmount: toNumber(r.currentAmount),
    dueAt: r.dueAt ?? null,
  } satisfies GoalRow));
}
