"use server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import { goals } from "@/db/schema";

function assertNumberString(value: string, field: string) {
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Error(`Invalid ${field}`);
  return n;
}

export async function createGoal(input: {
  name: string;
  targetAmount: string;
  dueAt?: string | null;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const name = input.name.trim();
  if (!name) throw new Error("Name is required");

  const target = assertNumberString(input.targetAmount, "targetAmount");
  if (target <= 0) throw new Error("Target must be greater than zero");

  const dueAt = input.dueAt?.trim() ? input.dueAt.trim() : null;
  if (dueAt && !/^\d{4}-\d{2}-\d{2}$/.test(dueAt)) {
    throw new Error("Invalid date");
  }

  await db.insert(goals).values({
    userId,
    name,
    targetAmount: String(target.toFixed(2)),
    currentAmount: "0",
    dueAt,
  });
}
