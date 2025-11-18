// vitest.config.ts
import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import path from "path";

export default defineConfig(({ mode }) => {
  // Load environment variables from .env
  const env = loadEnv(mode, process.cwd(), "");

  return {
    test: {
      globals: true,
      environment: "node",
      env, // exposes all .env values, including ENCRYPTION_KEY
      exclude: [
        "node_modules",
        "tests/e2e/**",   // 👈 prevent Vitest from running Playwright tests
      ],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});
