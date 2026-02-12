import "server-only";

import { asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { subscriptions } from "@/db/schema";

export type SubscriptionRow = {
  id: string;
  name: string;
  amount: number;
  billingCycle: "monthly" | "yearly";
  nextDueAt: string;
  isActive: boolean;
};

function toNumber(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") return Number(v);
  return Number(v);
}

export async function getSubscriptionsForUser(userId: string) {
  const rows = await db
    .select({
      id: subscriptions.id,
      name: subscriptions.name,
      amount: subscriptions.amount,
      billingCycle: subscriptions.billingCycle,
      nextDueAt: subscriptions.nextDueAt,
      isActive: subscriptions.isActive,
    })
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(asc(subscriptions.nextDueAt));

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    amount: toNumber(r.amount),
    billingCycle: r.billingCycle,
    nextDueAt: r.nextDueAt,
    isActive: r.isActive,
  } satisfies SubscriptionRow));
}
