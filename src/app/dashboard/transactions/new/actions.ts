"use server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import { transactions } from "@/db/schema";

function assertNumberString(value: string, field: string) {
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Error(`Invalid ${field}`);
  return n;
}

export async function createTransaction(input: {
  type: "income" | "expense";
  amount: string; // from input
  occurredAt: string; // YYYY-MM-DD
  categoryId?: string | null;
  description?: string | null;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const amount = assertNumberString(input.amount, "amount");
  if (amount <= 0) throw new Error("Amount must be greater than zero");

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.occurredAt)) {
    throw new Error("Invalid date");
  }

  await db.insert(transactions).values({
    userId,
    type: input.type,
    amount: String(amount.toFixed(2)),
    occurredAt: input.occurredAt,
    categoryId: input.categoryId ?? null,
    description: input.description?.trim() ? input.description.trim() : null,
  });
}
