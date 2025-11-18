// src/tests/integration/settingsProfile.test.ts
import { describe, it, expect } from "vitest";

describe("Settings › Profile API", () => {
  it("has a valid route handler", async () => {
    const mod = await import("../../app/api/settings/profile/route");
    expect(mod).toHaveProperty("GET");
    expect(typeof mod.GET).toBe("function");
  });
});
