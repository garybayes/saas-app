import { test } from "../../utils/guest";
import { expect } from "@playwright/test";

test.describe("Public: Signup Page", () => {
  test("loads signup form", async ({ guestPage }) => {
    await guestPage.goto("/signup");

    await expect(guestPage.getByRole("button", { name: /create account/i })).toBeVisible();
  });
});
