import { test } from "../../utils/auth";

test.describe("Theme Toggle (Private)", () => {
  test("Authenticated user can toggle and persist theme", async ({ authPage }) => {
    await authPage.goto("/dashboard");

    const toggle = authPage.getByTestId("theme-toggle");

    await toggle.click();
    await expect(authPage.locator("html")).toHaveAttribute("class", /dark/);

    await authPage.reload();
    await expect(authPage.locator("html")).toHaveAttribute("class", /dark/);
  });
});
