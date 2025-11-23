// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,

  use: {
    baseURL: "http://localhost:3000",
    extraHTTPHeaders: {
      "x-test-mode": "true",   // ✅ triggers middleware bypass
    },
    storageState: "tests/.auth/state.json",
  },

  globalSetup: "./tests/playwright.setup.ts",

  webServer: {
    command:
      "cross-env NEXTAUTH_URL=http://localhost:3000 " +
      "NEXTAUTH_SECRET=FJ21aPkdJ0DPpSj+GkQfKIxHbxuU9juXUPasjYF4ofs= " +
      "ENCRYPTION_KEY=v94oNiDBqrZqzzlKpiFLPFmuq0d/bKiPU1+JWGqS0+k= " +
      "JWT_SECRET=BMGU8tYvdFUMXzWNCT0IkK9Z371F5nWuV1YcxWz74oo= " +
      "AUTH_SECRET=FJ21aPkdJ0DPpSj+GkQfKIxHbxuU9juXUPasjYF4ofs= " +
      "AUTH_SALT=MDJaxVmmxmFNiQ9LhnDlykh5VrMYmX0RKrvkuKKFPo0= " +
      "next dev --port=3000",
    url: "http://localhost:3000",
    reuseExistingServer: true,   // Allows dev server to keep running if needed
    timeout: 60_000,
  },
});
