import { PrismaClient } from "@prisma/client";

declare global {
  // Prevent multiple instances of Prisma Client in development
  // (important for Next.js hot reload)
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
