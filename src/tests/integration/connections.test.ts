/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/crypto";
import { GET, POST } from "@/app/api/connections/route";

describe("Connections API Root Route", () => {
  it("exports valid handlers", () => {
    expect(typeof GET).toBe("function");
    expect(typeof POST).toBe("function");
  });
});

describe("Connections CRUD", () => {
  let testConnection: any;

  beforeAll(async () => {
    testConnection = await prisma.connection.create({
      data: {
        appName: "TestAPI",
        apiKey: encrypt("secretKey123"),
        userId: (await prisma.user.findFirst())?.id || "",
      },
    });
  });

  afterAll(async () => {
    await prisma.connection.deleteMany({ where: { appName: "TestAPI" } });
  });

  it("creates and decrypts a stored connection", async () => {
    const conn = await prisma.connection.findUnique({
      where: { id: testConnection.id },
    });
    const decrypted = decrypt(conn!.apiKey);
    expect(decrypted).toBe("secretKey123");
  });
});
