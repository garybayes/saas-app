import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

test.describe("Theme Toggle", () => {
  test("Theme toggle switches between light and dark", async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    const toggle = page.getByTestId("theme-toggle");
    await expect(toggle).toBeVisible();

    // Capture initial theme class
    const initialTheme = await page.locator("body").getAttribute("class");

    await toggle.click();
    const newTheme = await page.locator("body").getAttribute("class");

    expect(newTheme).not.toBe(initialTheme);
  });
});
