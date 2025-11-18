import { test, expect } from "../../utils/auth";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

test.describe("Connections Module", () => {
  test("Connections page loads and lists existing connections", async ({ page }) => {
    await page.goto(`${BASE_URL}/connections`);
    await expect(page.getByRole("heading", { name: /connections/i })).toBeVisible();
  });

  test("User can add a new connection", async ({ page }) => {
    await page.goto(`${BASE_URL}/connections`);
    await page.getByRole("button", { name: /add connection/i }).click();
    await page.getByLabel("App Name").fill("Notion");
    await page.getByLabel("API Key").fill("testkey123");
    await page.getByRole("button", { name: /save/i }).click();
    await expect(page.getByText("Notion")).toBeVisible();
  });

  test("User can delete a connection", async ({ page }) => {
    await page.goto(`${BASE_URL}/connections`);
    const connection = page.getByText("Notion");
    await connection.waitFor({ state: "visible" });
    await page.getByRole("button", { name: /delete/i }).click();
    await expect(connection).not.toBeVisible();
  });
});
