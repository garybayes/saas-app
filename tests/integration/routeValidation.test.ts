import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import url from "url";

const apiRoot = path.resolve(__dirname, "../../../app/api");

function findRouteFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findRouteFiles(fullPath));
    } else if (entry.isFile() && entry.name === "route.ts") {
      files.push(fullPath);
    }
  }
  return files;
}

describe("🧭 API Route Export Validation", () => {
  const routeFiles = findRouteFiles(apiRoot);
  const moduleRoot = url.pathToFileURL(apiRoot).href.replace(/\/$/, "");

  it("should discover at least one route file", () => {
    expect(routeFiles.length).toBeGreaterThan(0);
  });

  for (const file of routeFiles) {
    const rel = file.replace(apiRoot, "").replace(/\\/g, "/");
    const fileUrl = url.pathToFileURL(file).href;

    it(`validates exports in ${rel}`, async () => {
      const mod = await import(fileUrl);
      const exportKeys = Object.keys(mod);

      expect(exportKeys.length, "no exports found").toBeGreaterThan(0);

      for (const key of exportKeys) {
        const val = mod[key];

        // HTTP method should be uppercase & known
        const isHttpMethod = ["GET", "POST", "PUT", "PATCH", "DELETE"].includes(key);
        expect(isHttpMethod, `Unexpected export '${key}' in ${rel}`).toBe(true);

        // Handler must be a function
        expect(typeof val, `${key} is not a function in ${rel}`).toBe("function");

        // Basic argument length check (1–2 params)
        const argCount = val.length;
        expect(argCount, `${key} handler should accept 1–2 args`).toBeLessThanOrEqual(2);
        expect(argCount).toBeGreaterThanOrEqual(1);
      }
    });
  }
});
