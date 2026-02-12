"use server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/db";
import { categories } from "@/db/schema";

export async function createCategory(input: {
  name: string;
  type: "income" | "expense";
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const name = input.name.trim();
  if (!name) throw new Error("Name is required");

  await db.insert(categories).values({
    userId,
    name,
    type: input.type,
  });
}
