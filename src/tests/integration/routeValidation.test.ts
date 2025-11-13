// src/tests/integration/routeValidation.test.ts
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("🧭 API Route Export Validation", () => {
  const routeDir = path.resolve("src/app/api");

  function findRouteFiles(dir: string): string[] {
    const files: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) files.push(...findRouteFiles(full));
      else if (entry.name === "route.ts") files.push(full);
    }
    return files;
  }

  const routeFiles = findRouteFiles(routeDir);

  it("should discover at least one route file", () => {
    expect(routeFiles.length).toBeGreaterThan(0);
  });

  routeFiles.forEach((file) => {
    it(`validates exports in ${file.replace(routeDir, "")}`, async () => {
      const mod = await import(path.resolve(file));
      const entries = Object.entries(mod);

      for (const [key, val] of entries) {
        const allowedExtras = ["authOptions"];

        // Allow standard HTTP verbs or approved extras
        const isHttp = ["GET", "POST", "PUT", "PATCH", "DELETE"].includes(key);
        const isAllowedExtra = allowedExtras.includes(key);
        expect(
          isHttp || isAllowedExtra,
          `Unexpected export '${key}' in ${file}`
        ).toBe(true);

        // Skip function checks for non-handler exports
        if (!isHttp) continue;

        // Handlers must be functions
        expect(typeof val, `${key} is not a function in ${file}`).toBe("function");
        // Accept 0–2 args
        const argCount = val.length ?? 0;
        expect(argCount).toBeGreaterThanOrEqual(0);
        expect(argCount).toBeLessThanOrEqual(2);
      }
    });
  });
});
