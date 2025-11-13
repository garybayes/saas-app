import { test, expect } from "../../utils/auth";

test.describe("Public: Signup Page", () => {
  test("should load signup form", async ({ page }) => {
    await page.goto("http://localhost:3000/signup");
    await expect(page.getByRole("button", { name: /create account/i })).toBeVisible();
  });
});
