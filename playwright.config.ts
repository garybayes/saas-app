import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30 * 1000,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "on-first-retry",
    headless: true,
  },

  // 👇 Automatically start your Next.js app before running Playwright
  webServer: {
    command: "npm run dev",
    port: 3000,
    reuseExistingServer: !process.env.CI, // keeps local server alive between test runs
    timeout: 120 * 1000, // allow up to 2 minutes for the dev server to boot
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  outputDir: "test-results/",
});
