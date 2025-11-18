import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";

describe("Workflows API", () => {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  let user: any;

  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: "test@example.com" } });
    user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: "password",
        theme: "light",
      },
    });
  });

  afterAll(async () => {
// @ts-expect-error – workflow not yet implemented
    await prisma.workflow.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
  });

  it("creates and retrieves a workflow", async () => {
    const mock = await prisma.workflow.create({
      data: { userId: user.id, name: "Sample", data: {} },
    });

    const result = await prisma.workflow.findUnique({ where: { id: mock.id } });
    expect(result?.name).toBe("Sample");
  });
});
