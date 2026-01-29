"use server";

import { db } from "@/lib/db";
import { getEzFinUser } from "@/lib/auth-helper";
import { revalidatePath } from "next/cache";

export async function updateSettings(formData: FormData) {
  // 1. Verificar quem está logado
  const user = await getEzFinUser();
  if (!user) return { error: "Usuário não autenticado" };

  // 2. Pegar os dados do formulário
  const currency = formData.get("currency") as string;

  // 4. Atualizar no Banco
  try {
    await db.user.update({
      where: { id: user.id },
      data: {
        currency: currency,
      },
    });

    // Atualiza a página para mostrar os dados novos
    revalidatePath("/dashboard", "layout");
    
    return { success: "Configurações salvas com sucesso!" };
    
  } catch (error) {
    return { error: "Erro ao atualizar. Tente novamente." };
  }
}