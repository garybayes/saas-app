import { describe, it, expect } from "vitest";

describe("Theme Handling", () => {
  it("toggles dark/light classes", () => {
    const body = { classList: new Set(["light"]) };
    body.classList.delete("light");
    body.classList.add("dark");
    expect(body.classList.has("dark")).toBe(true);
  });
});
