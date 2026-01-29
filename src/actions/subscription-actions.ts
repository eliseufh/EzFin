"use server";

import { db } from "@/lib/db";
import { getEzFinUser } from "@/lib/auth-helper";
import { revalidatePath } from "next/cache";

// Ação para apagar uma conta fixa
export async function deleteSubscription(id: string) {
  const user = await getEzFinUser();
  if (!user) return { error: "Não autorizado" };

  try {
    await db.subscription.delete({
      where: {
        id: id,
        userId: user.id, // Segurança extra: garante que o user só apaga o que é dele
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erro ao apagar assinatura:", error);
    return { error: "Erro ao excluir a assinatura." };
  }
}

// Caso precises da ação de criar no futuro neste mesmo ficheiro:
export async function createSubscription(formData: FormData) {
  const user = await getEzFinUser();
  if (!user) return { error: "Não autorizado" };

  const name = formData.get("name") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const billingDay = parseInt(formData.get("billingDay") as string);

  try {
    await db.subscription.create({
      data: {
        userId: user.id,
        name,
        amount,
        billingDay,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Erro ao criar assinatura." };
  }
}