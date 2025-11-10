import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const apiRoot = path.resolve(__dirname, "../../../app/api");
const testRoot = path.resolve(__dirname);

function listRoutes(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return listRoutes(full);
      return entry.name === "route.ts" ? [full] : [];
    });
}

function findMatchingTest(routePath: string): boolean {
  const rel = routePath.replace(apiRoot, "").replace(/\\/g, "/").replace("/route.ts", ".test.ts");
  const expected = path.join(testRoot, rel);
  return fs.existsSync(expected);
}

describe("🧩 API Route Coverage", () => {
  const routes = listRoutes(apiRoot);
  it("should have tests for every route file", () => {
    const missing = routes.filter((r) => !findMatchingTest(r));
    expect(missing, `Missing tests for: ${missing.join(", ")}`).toHaveLength(0);
  });
});
