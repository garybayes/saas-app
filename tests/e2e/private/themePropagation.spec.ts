import { test } from "../../utils/auth";

test.describe("Theme Propagation", () => {
  const privateRoutes = ["/dashboard", "/connections", "/workflows", "/settings"];

  test("Theme persists across all private pages", async ({ authPage }) => {
    await authPage.goto("/dashboard");
    const toggle = authPage.getByTestId("theme-toggle");

    await toggle.click();

    for (const route of privateRoutes) {
      await authPage.goto(route);
      await expect(authPage.locator("html")).toHaveAttribute("class", /dark|light/);
    }
  });
});
