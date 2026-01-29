"use server";

import { db } from "@/lib/db";
import { getEzFinUser } from "@/lib/auth-helper";
import { revalidatePath } from "next/cache";

// 1. Criar Transação (Entrada ou Saída)
export async function createTransaction(formData: FormData) {
  const user = await getEzFinUser();
  if (!user) return { error: "Usuário não logado" };

  const amount = parseFloat(formData.get("amount") as string);
  const description = formData.get("description") as string;
  const type = formData.get("type") as string; // 'income' ou 'expense'
  const category = formData.get("category") as string;

  if (!description || !amount) {
    return { error: "Preencha todos os campos." };
  }

  await db.transaction.create({
    data: {
      userId: user.id,
      amount,
      description,
      type,
      category,
      date: new Date(), // Pega a data de agora
    },
  });

  revalidatePath("/dashboard"); // Atualiza a tela instantaneamente
  return { success: true };
}

// 2. Criar Assinatura (Gasto Recorrente)
export async function createSubscription(formData: FormData) {
  const user = await getEzFinUser();
  if (!user) return { error: "Usuário não logado" };

  const name = formData.get("name") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const billingDay = parseInt(formData.get("billingDay") as string);

  await db.subscription.create({
    data: {
      userId: user.id,
      name,
      amount,
      billingDay,
      active: true,
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

// 3. Deletar Transação
export async function deleteTransaction(id: string) {
  const user = await getEzFinUser();
  if (!user) return { error: "Não autorizado" };

  // Garante que a transação pertence mesmo ao usuário antes de deletar
  await db.transaction.delete({
    where: {
      id: id,
      userId: user.id, 
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

// 4. Deletar Assinatura
export async function deleteSubscription(id: string) {
  const user = await getEzFinUser();
  if (!user) return { error: "Não autorizado" };

  await db.subscription.delete({
    where: {
      id: id,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

// 5. Atualizar Transação
export async function updateTransaction(formData: FormData) {
  const user = await getEzFinUser();
  if (!user) return { error: "Não autorizado" };

  const id = formData.get("id") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const type = formData.get("type") as string;

  if (!id || !amount || !description) {
    return { error: "Dados inválidos." };
  }

  // Verifica se a transação é mesmo desse usuário antes de alterar
  const transaction = await db.transaction.findFirst({
    where: { id, userId: user.id },
  });

  if (!transaction) return { error: "Transação não encontrada." };

  await db.transaction.update({
    where: { id },
    data: {
      amount,
      description,
      category,
      type,
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}