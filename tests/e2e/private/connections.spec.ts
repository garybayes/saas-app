import { test } from "../../utils/auth";

const appName = "Notion";
const apiKey = "testkey123";

test.describe("Connections Module", () => {
  test("Connections page loads", async ({ authPage }) => {
    await authPage.goto("/connections");
    await expect(authPage.getByRole("heading", { name: /connections/i })).toBeVisible();
  });

  test("User can add a new connection", async ({ authPage }) => {
    await authPage.goto("/connections");

    await authPage.getByRole("button", { name: /add connection/i }).click();
    await authPage.getByLabel("App Name").fill(appName);
    await authPage.getByLabel("API Key").fill(apiKey);
    await authPage.getByRole("button", { name: /save/i }).click();

    await expect(authPage.getByText(appName)).toBeVisible();
  });

  test("User can delete a connection", async ({ authPage }) => {
    await authPage.goto("/connections");

    const item = authPage.getByText(appName);
    await expect(item).toBeVisible();

    await authPage.getByRole("button", { name: /delete/i }).click();
    await expect(item).not.toBeVisible();
  });
});
