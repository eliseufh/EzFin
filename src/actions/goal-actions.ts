"use server";

import { db } from "@/lib/db";
import { getEzFinUser } from "@/lib/auth-helper";
import { revalidatePath } from "next/cache";

// Criar Meta (Recebe FormData do formulário)
export async function createGoal(formData: FormData) {
  const user = await getEzFinUser();
  if (!user) return { error: "Não autorizado" };

  const name = formData.get("name") as string;
  const target = formData.get("target") as string;
  const targetAmount = parseFloat(target);

  if (!name || isNaN(targetAmount)) {
    return { error: "Dados inválidos." };
  }

  await db.goal.create({
    data: {
      userId: user.id,
      name,
      targetAmount,
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

// Atualizar Valor (Recebe ID e Número direto do GoalCard)
export async function updateGoalAmount(id: string, newAmount: number) {
  const user = await getEzFinUser();
  if (!user) return { error: "Não autorizado" };

  await db.goal.update({
    where: { id },
    data: { currentAmount: newAmount },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

// Deletar Meta
export async function deleteGoal(id: string) {
  const user = await getEzFinUser();
  if (!user) return { error: "Não autorizado" };

  await db.goal.delete({
    where: { id },
  });

  revalidatePath("/dashboard");
  return { success: true };
}