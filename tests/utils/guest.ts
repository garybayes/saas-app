import { test as base, Page } from "@playwright/test";

export const test = base.extend<{
  guestPage: Page;
}>({
  guestPage: async (
    { page },
    use
  ) => {
    await page.goto("/login");   // baseURL handled automatically
    await use(page);
  },
});
