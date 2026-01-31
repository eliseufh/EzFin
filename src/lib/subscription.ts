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

  const dbUser = await db.user.findUnique({
    where: { clerkId: user.id },
    select: {
      plan: true,
      subscriptionStatus: true,
      subscriptionEndsAt: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
    },
  });

  return dbUser;
}
