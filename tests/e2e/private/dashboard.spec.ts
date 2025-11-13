import { test, expect } from "../../utils/auth";

test.describe("Private: Dashboard", () => {
  test("should load dashboard for logged-in user", async ({ page }) => {
    await page.goto("http://localhost:3000/dashboard");
    await expect(page.getByRole("navigation")).toBeVisible();
    await expect(page.getByText(/welcome/i)).toBeVisible();
  });
});
