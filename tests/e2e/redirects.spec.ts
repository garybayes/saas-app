// tests/e2e/redirects.spec.ts
import { test as guestTest, expect as guestExpect } from "./fixtures/guest";
import { test as authTest, expect as authExpect } from "./fixtures/auth";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

//
// --- Guest Route Protection ---
//
guestTest.describe("Guest access control", () => {
  const privateRoutes = ["/dashboard", "/connections", "/workflows", "/settings"];

  for (const route of privateRoutes) {
    guestTest(`unauthenticated users are redirected from ${route} to /login`, async ({ guestPage }) => {
      await guestPage.goto(`${BASE_URL}${route}`);
      await guestExpect(guestPage).toHaveURL(/\/login$/);
    });
  }
});

//
// --- Authenticated Route Protection ---
//
authTest.describe("Authenticated route control", () => {
  const publicRoutes = ["/login", "/signup"];

  for (const route of publicRoutes) {
    authTest(`authenticated users cannot access ${route}`, async ({ authenticatedPage }) => {
      await authenticatedPage.goto(`${BASE_URL}${route}`);
      await authExpect(authenticatedPage.url()).toMatch(/dashboard|connections/);
    });
  }
});
