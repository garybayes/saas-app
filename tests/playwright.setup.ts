import { chromium } from "@playwright/test";
import fs from "fs/promises";

export default async function globalSetup() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    extraHTTPHeaders: {
      "x-test-mode": "1"   // 🔥 Forces middleware bypass during setup
    },
  });
  const page = await context.newPage();

  console.log("🌐 Setup: visiting /login ...");
  await page.goto("http://localhost:3000/login");

  // Wait for login inputs
  await page.waitForSelector('[placeholder="Email"]', { timeout: 20000 });
  await page.waitForSelector('[placeholder="Password"]', { timeout: 20000 });

  // Fill form
  await page.fill('[placeholder="Email"]', "test@example.com");
  await page.fill('[placeholder="Password"]', "password123");

  // Click submit
  await page.click('button[type="submit"]');

  // Wait for dashboard content to load instead of URL redirect
  await page.waitForSelector("text=Dashboard", { timeout: 30000 });

  // Save auth state
  await fs.mkdir("tests/.auth", { recursive: true });
  await context.storageState({ path: "tests/.auth/state.json" });

  await browser.close();
}
