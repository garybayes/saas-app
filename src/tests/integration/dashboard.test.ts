import { describe, it, expect } from "vitest";
import { prisma } from "@/lib/prisma";

describe("Dashboard Module", () => {
  it("fetches valid user stats structure", async () => {
    const user = await prisma.user.findFirst();
    expect(user).toHaveProperty("email");
    expect(user).toHaveProperty("displayName");
  });
});
