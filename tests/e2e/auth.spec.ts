import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

test.describe("Authentication", () => {
  test("Login page loads", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("User can log in successfully", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForURL(`${BASE_URL}/dashboard`);
    await expect(page.getByText(/welcome/i)).toBeVisible();
  });

  test("User can log out", async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    await page.getByRole("button", { name: /logout/i }).click();
    await expect(page).toHaveURL(`${BASE_URL}/login`);
  });
});
