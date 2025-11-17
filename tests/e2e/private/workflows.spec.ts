import { test } from "../../utils/auth";

test.describe("Workflows Module", () => {
  test("User can create and load workflow", async ({ authPage }) => {
    await authPage.goto("/workflows");

    await authPage.getByRole("button", { name: /create workflow/i }).click();
    await authPage.getByLabel("Workflow Name").fill("My Flow");
    await authPage.click("button[type=submit]");

    await expect(authPage.getByText("My Flow")).toBeVisible();
  });
});
