import { test, expect } from "../../utils/auth";

test.describe("Public: Login Page", () => {
  test("should display login form", async ({ page }) => {
    await page.goto("http://localhost:3000/login");
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("should reject invalid credentials", async ({ page }) => {
    await page.goto("http://localhost:3000/login");
    await page.fill('input[name="email"]', "wrong@example.com");
    await page.fill('input[name="password"]', "wrongpass");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=Invalid credentials")).toBeVisible();
  });
});
