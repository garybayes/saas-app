// tests/e2e/private/themePropagation.spec.ts
import { test, expect } from "../../utils/auth";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

test.describe("Theme Propagation Across Private Pages", () => {
  const privateRoutes = ["/dashboard", "/connections", "/workflows", "/settings"];

  test("Theme toggle propagates to all authenticated pages", async ({ authPage }) => {
    // Start from dashboard and toggle theme
    await authPage.goto(`${BASE_URL}/dashboard`);
    const toggle = authPage.getByTestId("theme-toggle");
    await expect(toggle).toBeVisible();

    const initial = await authPage.locator("html").getAttribute("class");
    await toggle.click();
    const toggled = await authPage.locator("html").getAttribute("class");
    expect(toggled).not.toBe(initial);

    // Visit each private route and verify same theme class
    for (const route of privateRoutes) {
      await authPage.goto(`${BASE_URL}${route}`);
      const currentClass = await authPage.locator("html").getAttribute("class");
      expect(currentClass).toBe(toggled);
    }
  });
});
