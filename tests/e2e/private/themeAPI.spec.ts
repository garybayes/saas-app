import { test } from "../../utils/auth";
import type { Cookie } from "@playwright/test";

test.describe("Theme API (Private)", () => {
  test("Toggling theme via API updates DB & UI", async ({ authPage, browser }) => {
    const cookies = await authPage.context().cookies();
    const sessionCookie = cookies.find((c: Cookie) =>
      c.name.startsWith("next-auth.session-token")
    );

    const context = await browser.newContext({
      storageState: { cookies: [sessionCookie!] },
    });

    const page2 = await context.newPage();

    const res = await page2.request.post("/api/theme/toggle");
    expect(res.ok()).toBeTruthy();

    await page2.goto("/dashboard");

    await expect(page2.locator("html")).toHaveAttribute("class", /dark|light/);
  });
});
