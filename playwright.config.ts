// playwright.config.ts
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "tests/test-results",
  timeout: 60 * 1000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  retries: 0,

  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "tests/playwright-report" }],
  ],

  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },

  projects: [
    // 1) Setup project: runs setup.setup.ts AFTER web server is started
    {
      name: "setup",
      testMatch: "tests/setup/**/*.setup.ts",
      use: { ...devices["Desktop Chrome"] },
    },

    // 2) Public tests
    {
      name: "Public",
      use: { ...devices["Desktop Chrome"] },
      testMatch: "tests/e2e/public/**/*.spec.ts",
      dependencies: ["setup"],
    },

    // 3) Private tests (need storage state)
    {
      name: "Private",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "tests/.auth/state.json",
      },
      testMatch: "tests/e2e/private/**/*.spec.ts",
      dependencies: ["setup"],
    },
  ],
});
