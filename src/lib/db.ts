import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// Previne múltiplas instâncias do Prisma Client
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
};

export const db = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// Garantir que conexões sejam fechadas corretamente
if (process.env.NODE_ENV === "production") {
  process.on('beforeExit', async () => {
    await db.$disconnect();
  });
}