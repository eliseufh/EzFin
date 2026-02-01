import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

/**
 * Verifica se o usuário tem uma subscrição ativa
 * Retorna true se tiver subscrição ativa, false caso contrário
 */
export async function checkSubscription(): Promise<boolean> {
  const user = await currentUser();
  
  if (!user) {
    return false;
  }

  // Lista de emails de admin (owners) que têm acesso total
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  const userEmail = user.emailAddresses[0]?.emailAddress;
  
  // Se for admin, permite acesso sem verificar subscrição
  if (userEmail && adminEmails.includes(userEmail)) {
    return true;
  }

  const dbUser = await db.user.findUnique({
    where: { clerkId: user.id },
    select: {
      subscriptionStatus: true,
      subscriptionEndsAt: true,
    },
  });

  if (!dbUser) {
    return false;
  }

  // Verifica se a subscrição está ativa
  const isActive = dbUser.subscriptionStatus === "active";

  // Se tiver data de fim, verifica se ainda não expirou
  if (dbUser.subscriptionEndsAt) {
    const hasNotExpired = new Date(dbUser.subscriptionEndsAt) > new Date();
    return isActive && hasNotExpired;
  }

  return isActive;
}

/**
 * Retorna os dados completos da subscrição do usuário
 */
export async function getSubscriptionData() {
  const user = await currentUser();
  
  if (!user) {
    return null;
  }

  // Busca o usuário no banco de dados pelo clerkId
  let dbUser = await db.user.findUnique({
    where: { clerkId: user.id },
    select: {
      plan: true,
      subscriptionStatus: true,
      subscriptionEndsAt: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
    },
  });

  // Se o usuário não existe no banco, cria com valores padrão
  if (!dbUser) {
    const fullName = [user.firstName, user.lastName]
      .filter(Boolean)
      .join(" ") || "Usuário";

    const newUser = await db.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: fullName,
        plan: "free",
        subscriptionStatus: "inactive",
      },
      select: {
        plan: true,
        subscriptionStatus: true,
        subscriptionEndsAt: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
      },
    });

    return newUser;
  }

  return dbUser;
}
