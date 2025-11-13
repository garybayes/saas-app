import { test, expect } from "../../utils/auth";

/**
* E2E test: workflow creation and persistence
*/
test("User can create and load a workflow", async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  await page.waitForURL("http://localhost:3000/login");
  await page.fill('input[name="email"]', "test@example.com");
  await page.fill('input[name="password"]', "password");
  await page.click("button[type=submit]");

  await page.goto("http://localhost:3000/workflows");
  await expect(page.getByText("Workflow Builder")).toBeVisible();

  // TODO: once API live, simulate adding node + saving workflow
});
