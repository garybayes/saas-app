import { describe, it, expect } from "vitest";
import dotenv from "dotenv";

dotenv.config();

describe("Startup & Environment", () => {
  it("loads environment variables", () => {
    expect(process.env.DATABASE_URL).toBeDefined();
    expect(process.env.ENCRYPTION_KEY).toBeDefined();
  });
});
