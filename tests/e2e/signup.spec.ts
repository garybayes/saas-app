import { test, expect } from "@playwright/test";

test("Signup page loads", async ({ page }) => {
  await page.goto("/signup");

  await expect(page.getByRole("heading", { name: "Create your account" })).toBeVisible();
  await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
  await expect(page.getByPlaceholder("************")).toBeVisible();
});
