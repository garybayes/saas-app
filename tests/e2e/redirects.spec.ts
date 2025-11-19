// tests/e2e/redirects.spec.ts
import { test as expect } from "@playwright/test";
import { test as guestTest } from "../utils/guest";
import { test as authTest } from "../utils/auth";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

guestTest.describe("Guest access control", () => {
  const privateRoutes = ["/dashboard", "/connections", "/workflows", "/settings"];

  for (const route of privateRoutes) {
    guestTest(`unauthenticated users are redirected from ${route}`, async ({ guestPage }) => {
      await guestPage.goto(`${BASE_URL}${route}`);
      await expect(guestPage).toHaveURL(/\/login$/);
    });
  }
});

authTest.describe("Authenticated route control", () => {
  const publicRoutes = ["/login", "/signup"];

  for (const route of publicRoutes) {
    authTest(`authenticated users cannot access ${route}`, async ({ authPage }) => {
      await authPage.goto(`${BASE_URL}${route}`);
      await expect(authPage.url()).toMatch(/dashboard|connections|workflows/);
    });
  }
});
