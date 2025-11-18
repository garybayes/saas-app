import { test } from "../../utils/auth";

test.describe("Dashboard (Private)", () => {
  test("loads successfully for authenticated user", async ({ authPage }) => {
    await authPage.goto("/dashboard");

    await expect(authPage.getByRole("navigation")).toBeVisible();
    await expect(authPage.getByText(/welcome/i)).toBeVisible();
  });
});
