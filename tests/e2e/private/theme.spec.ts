// tests/e2e/private/theme.spec.ts
import { test, expect } from "../../utils/auth";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

test.describe("Theme Toggle (Private)", () => {
  test("Authenticated user can toggle and persist theme", async ({ authPage }) => {
    // Go to dashboard (or any authenticated page)
    await authPage.goto(`${BASE_URL}/dashboard`);

    const toggle = authPage.getByTestId("theme-toggle");
    await expect(toggle).toBeVisible();

    // Capture initial theme
    const initial = await authPage.locator("html").getAttribute("class");

    // Toggle dark/light
    await toggle.click();

    // Confirm class changes
    const updated = await authPage.locator("html").getAttribute("class");
    expect(updated).not.toBe(initial);

    // Reload page to confirm persistence from DB
    await authPage.reload();
    const reloaded = await authPage.locator("html").getAttribute("class");
    expect(reloaded).toBe(updated);
  });
});
