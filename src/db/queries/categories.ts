import "server-only";

import { asc, eq } from "drizzle-orm";

import { db } from "@/db";
import { categories } from "@/db/schema";

const DEFAULT_EXPENSE_CATEGORIES = [
  { name: "Alimentação", icon: "utensils" },
  { name: "Casa", icon: "home" },
  { name: "Transporte", icon: "car" },
  { name: "Saúde", icon: "heart" },
  { name: "Lazer", icon: "gamepad-2" },
  { name: "Compras", icon: "shopping-bag" },
  { name: "Educação", icon: "graduation-cap" },
  { name: "Contas", icon: "receipt" },
] as const;

const DEFAULT_INCOME_CATEGORIES = [
  { name: "Salário", icon: "briefcase" },
  { name: "Freelance", icon: "laptop" },
  { name: "Investimentos", icon: "line-chart" },
  { name: "Bônus", icon: "sparkles" },
] as const;

export async function ensureDefaultCategoriesForUser(userId: string) {
  const existing = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.userId, userId))
    .limit(1);

  if (existing.length > 0) return;

  await db.insert(categories).values([
    ...DEFAULT_EXPENSE_CATEGORIES.map((c) => ({
      userId,
      name: c.name,
      type: "expense" as const,
      icon: c.icon,
    })),
    ...DEFAULT_INCOME_CATEGORIES.map((c) => ({
      userId,
      name: c.name,
      type: "income" as const,
      icon: c.icon,
    })),
  ]);
}

export async function getCategoriesForUser(userId: string) {
  return await db
    .select({
      id: categories.id,
      name: categories.name,
      type: categories.type,
      icon: categories.icon,
    })
    .from(categories)
    .where(eq(categories.userId, userId))
    .orderBy(asc(categories.name));
}
