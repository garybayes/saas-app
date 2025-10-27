// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { encrypt, decrypt } from "./crypto";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// 🧩 Fields that need encryption/decryption
const SENSITIVE_FIELDS = [
  "apiKey",
  "clientSecret",
  "refreshToken",
  "accessToken",
  "password",
];

// ✅ Attach middleware only if available
if (typeof prisma.$use === "function") {
  prisma.$use(async (params, next) => {
    // Encrypt before writes
    if (["create", "update", "upsert"].includes(params.action)) {
      const { data } = params.args;
      if (data) {
        for (const field of SENSITIVE_FIELDS) {
          if (data[field]) {
            data[field] = encrypt(data[field]);
          }
        }
      }
    }

    const result = await next(params);

    // Decrypt after reads
    if (["findUnique", "findMany", "findFirst"].includes(params.action)) {
      const records = Array.isArray(result) ? result : [result];
      for (const record of records) {
        if (!record) continue;
        for (const field of SENSITIVE_FIELDS) {
          if (record[field]) {
            try {
              record[field] = decrypt(record[field]);
            } catch {
              // ignore decryption errors (possibly already plain text)
            }
          }
        }
      }
    }

    return result;
  });
}

export default prisma;
