import { test, expect } from "@playwright/test";

test("Login page loads", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
  await expect(page.getByPlaceholder("Email")).toBeVisible();
  await expect(page.getByPlaceholder("Password")).toBeVisible();
});
