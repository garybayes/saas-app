// src/tests/integration/routeCoverage.test.ts
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

/*
  This test ensures that every route file under src/app/api/.../route.ts
  has at least one corresponding integration test file.
  Matching is based on the route folder name (e.g. "connections", "settings"),
  not the literal filename "route.ts".
*/

describe("🧩 API Route Coverage", () => {
  const routeDir = path.resolve("src/app/api");
  const testDir = path.resolve("src/tests/integration");

  // Recursively list all files in a directory
  function listFiles(dir: string): string[] {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .flatMap((entry) => {
        const full = path.join(dir, entry.name);
        return entry.isDirectory() ? listFiles(full) : [full];
      });
  }

  const routeFiles = listFiles(routeDir).filter((f) => f.endsWith("route.ts"));
  const testFiles = listFiles(testDir).filter((f) => f.endsWith(".test.ts"));

  function findMatchingTest(routePath: string): boolean {
    const folderName = path.basename(path.dirname(routePath)); // e.g., "connections"
    return testFiles.some((t) => t.toLowerCase().includes(folderName.toLowerCase()));
  }

  it("should have tests for every API route file", () => {
    const missing = routeFiles.filter((r) => !findMatchingTest(r));

    const ignored = [
      "[...nextauth]",
      "signup",
      "user",
      "[id]",
    ];

    const filtered = missing.filter(
      (r) => !ignored.some((ig) => r.includes(ig))
    );

    expect(
      filtered,
      `Missing tests for: ${filtered.join(", ")}`
    ).toHaveLength(0);
  });
});
