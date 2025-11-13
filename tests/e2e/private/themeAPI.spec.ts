// tests/e2e/private/themeAPI.spec.ts
import { test, expect } from "../fixtures/auth";
import { request } from "../../utils/auth";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

test.describe("Theme API + DB Sync", () => {
  test("Toggling theme via API updates DB and reflects in UI", async ({ authenticatedPage, browser }) => {
    // 1️⃣ Retrieve session cookie from authenticatedPage
    const cookies = await authenticatedPage.context().cookies();
    const sessionCookie = cookies.find((c) => c.name.startsWith("next-auth.session-token"));
    expect(sessionCookie).toBeDefined();

    // 2️⃣ Create authenticated API request context
    const apiContext = await request.newContext({
      baseURL: BASE_URL,
      extraHTTPHeaders: {
        cookie: `${sessionCookie?.name}=${sessionCookie?.value}`,
      },
    });

    // 3️⃣ Call the theme API to toggle to "dark"
    const response = await apiContext.post("/api/settings/theme", {
      data: { theme: "dark" },
    });
    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    expect(json.theme).toBe("dark");

    // 4️⃣ Verify the theme in the database through the page reload
    await authenticatedPage.reload();
    const themeClass = await authenticatedPage.locator("html").getAttribute("class");
    expect(themeClass).toContain("dark");

    // 5️⃣ Switch back via API (optional cleanup)
    await apiContext.post("/api/settings/theme", {
      data: { theme: "light" },
    });
    await authenticatedPage.reload();
    const finalTheme = await authenticatedPage.locator("html").getAttribute("class");
    expect(finalTheme).toContain("light");
  });
});
