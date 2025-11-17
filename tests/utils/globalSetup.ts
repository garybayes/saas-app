import { chromium, FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to login page
  await page.goto(`${baseURL}/login`);

  // Fill in login form
  await page.getByLabel("Email").fill(process.env.TEST_USER_EMAIL!);
  await page.getByLabel("Password").fill(process.env.TEST_USER_PASSWORD!);
  await page.getByRole("button", { name: "Log In" }).click();

  // Wait for dashboard redirect
  await page.waitForURL(`${baseURL}/dashboard`);

  // Save authenticated storage state
  await context.storageState({ path: "tests/.auth/state.json" });

  await browser.close();
}

export default globalSetup;
