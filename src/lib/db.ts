import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

// Definimos o tipo do cliente estendido para evitar erros de TypeScript
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  }).$extends(withAccelerate());
};

type PrismaClientConfigured = ReturnType<typeof prismaClientSingleton>;

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClientConfigured | undefined;
}

// Exportamos a instância "db" já com o Accelerate ativado
export const db = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

/**
 * NOTA PARA SERVERLESS (Netlify):
 * Removi o 'beforeExit' porque em ambientes serverless as funções são "congeladas" 
 * e o processo não termina de forma tradicional, o que poderia causar erros.
 * O Prisma Accelerate gere o fecho das conexões automaticamente através do Proxy.
 */