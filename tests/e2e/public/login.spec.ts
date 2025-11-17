import { test } from "../../utils/guest";
import { expect } from "@playwright/test";

test.describe("Public: Login Page", () => {
  test("loads login form", async ({ guestPage }) => {
    await guestPage.goto("/login");

    await expect(guestPage.getByRole("button", { name: /sign in/i })).toBeVisible();
  });
});
