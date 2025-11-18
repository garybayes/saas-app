// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "tests/test-results", // <— this line
  timeout: 60 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  retries: 0, // set to 1 or 2 for CI runs if needed
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "tests/playwright-report" }],
  ],
use: {
  baseURL: process.env.BASE_URL || "http://localhost:3000",
  storageState: "tests/.auth/state.json",
  screenshot: "only-on-failure",
  trace: "retain-on-failure",
},
  projects: [
    {
      name: "Public (Chromium)",
      testMatch: ["**/*.spec.ts"],
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Private (Chromium)",
      testMatch: ["**/*.spec.ts"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "tests/.auth/state.json",
      },
      dependencies: ["authSetup"],
    },
    {
      name: "authSetup",
      testMatch: /tests\/utils\/auth\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Run dev server automatically when testing locally
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});

