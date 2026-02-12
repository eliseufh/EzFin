"use server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import { subscriptions } from "@/db/schema";

function assertNumberString(value: string, field: string) {
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Error(`Invalid ${field}`);
  return n;
}

export async function createSubscription(input: {
  name: string;
  amount: string;
  billingCycle: "monthly" | "yearly";
  nextDueAt: string; // YYYY-MM-DD
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const name = input.name.trim();
  if (!name) throw new Error("Name is required");

  const amount = assertNumberString(input.amount, "amount");
  if (amount <= 0) throw new Error("Amount must be greater than zero");

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.nextDueAt)) {
    throw new Error("Invalid date");
  }

  await db.insert(subscriptions).values({
    userId,
    name,
    amount: String(amount.toFixed(2)),
    billingCycle: input.billingCycle,
    nextDueAt: input.nextDueAt,
    isActive: true,
  });
}
