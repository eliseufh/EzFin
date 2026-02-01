import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

export async function getEzFinUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null; 
  }

  // Procurar o utilizador na nossa base de dados
  const user = await db.user.findUnique({
    where: {
      email: clerkUser.emailAddresses[0].emailAddress,
    },
    cacheStrategy: { ttl: 300, swr: 600 },
  });

  // Criar o nome completo corretamente
  const fullName = [clerkUser.firstName, clerkUser.lastName]
    .filter(Boolean)
    .join(" ") || "Usuário";

  // Se o utilizador NÃO existe, cria um novo
  if (!user) {
    const newUser = await db.user.create({
      data: {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        name: fullName,
      },
    });
    return newUser;
  }

  // SE O UTILIZADOR JÁ EXISTE: 
  // Vamos verificar se o nome no Clerk mudou em relação ao que temos no Banco
  if (user.name !== fullName) {
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: { name: fullName },
    });
    return updatedUser;
  }

  return user;
}