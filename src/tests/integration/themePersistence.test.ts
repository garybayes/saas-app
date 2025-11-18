// src/tests/integration/themePersistence.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

describe("Theme persistence API", () => {
  let userId: string;

  beforeAll(async () => {
    const password = await bcrypt.hash("password123", 10);
    const user = await prisma.user.create({
      data: {
        email: "themeuser@example.com",
        password,
        theme: "light",
        displayName: "Theme Tester",
      },
    });
    userId = user.id;
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: userId } });
  });

  it("should update and persist theme preference in DB", async () => {
    // Simulate API theme update
    await prisma.user.update({
      where: { id: userId },
      data: { theme: "dark" },
    });

    const updatedUser = await prisma.user.findUnique({ where: { id: userId } });
    expect(updatedUser?.theme).toBe("dark");
  });
});
