// tests/utils/guest.ts
/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, expect, type Page } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";
import { BASE_URL } from "./constants.js";

// 🔹 Reconstruct __dirname safely in ESM context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * GuestFixtures define a browser page without authentication.
 * This is useful for testing public routes like:
 * - /login
 * - /signup
 * - redirects for unauthenticated access
 */
type GuestFixtures = {
  guestPage: Page;
};

// 🔹 Extend Playwright base with a guest page context
export const test = base.extend<GuestFixtures>({
  guestPage: async ({ page }, use) => {
    // Ensure a clean, non-authenticated session
    await page.context().clearCookies();
    await page.goto(BASE_URL);
    await use(page);
  },
});

export { expect };
