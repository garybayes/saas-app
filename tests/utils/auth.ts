// tests/utils/auth.ts
/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, expect, type Page } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { BASE_URL, AUTH_FILE } from "./constants.js";

// Define custom fixture type
type AuthFixtures = {
  authPage: Page;
};

// Extend Playwright base test
export const test = base.extend<AuthFixtures>({
  authPage: async ({ page }, use) => {
    if (fs.existsSync(AUTH_FILE)) {
      // Load saved cookies for authenticated session
      const cookies = JSON.parse(fs.readFileSync(AUTH_FILE, "utf8")).cookies;
      await page.context().addCookies(cookies);
    } else {
      // Perform login
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL ?? "");
      await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD ?? "");
      await page.click('button[type="submit"]');

      // Wait for redirect
      await page.waitForURL(/(dashboard|connections)/, { timeout: 60000 });

      // Save cookies to disk for reuse
      const state = await page.context().storageState();
      fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
      fs.writeFileSync(AUTH_FILE, JSON.stringify(state));
    }

    await use(page);
  },
});

export { expect };
