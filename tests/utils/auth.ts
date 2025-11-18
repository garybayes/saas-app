import { test as base, Browser, Page, BrowserContext } from "@playwright/test";

export const test = base.extend<{
  authPage: Page;
}>({
  authPage: async (
    { browser }: { browser: Browser },
    use
  ) => {
    const context = await browser.newContext({
      storageState: "tests/.auth/state.json",
    });

    const page = await context.newPage();

    await use(page);

    await context.close();
  },
});
