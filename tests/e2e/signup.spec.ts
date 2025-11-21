import { test, expect } from "@playwright/test";

test("Signup page loads", async ({ page }) => {
  await page.goto("/signup");

  await expect(page.getByRole("heading", { name: "Create Account" })).toBeVisible();
  await expect(page.getByPlaceholder("Display Name")).toBeVisible();
  await expect(page.getByPlaceholder("Email")).toBeVisible();
  await expect(page.getByPlaceholder("Password")).toBeVisible();
});
