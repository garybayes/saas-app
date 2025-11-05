/**
 * Sprint 5 Validation Suite
 * MindForge SaaS-App
 * --------------------------------------------
 * Purpose:
 *  Ensures that authentication, dashboard rendering,
 *  and workflow CRUD features all function correctly
 *  before merging Sprint 5 into main.
 *
 *  Run:  npx playwright test tests/sprint5-validation.spec.ts
 */

import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

test.describe("Sprint 5 Validation", () => {
  // --- AUTHENTICATION TESTS ---
  test("User can reach login page", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page).toHaveTitle(/login/i);
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("User can log in and access dashboard", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: /sign in/i }).click();

    await page.waitForURL(`${BASE_URL}/dashboard`);
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByText(/welcome/i)).toBeVisible();
  });

  // --- DASHBOARD TESTS ---
  test("Dashboard loads with navigation and theme toggle", async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    await expect(page.getByRole("navigation")).toBeVisible();
    await expect(page.getByTestId("theme-toggle")).toBeVisible();

    // Optional: toggle dark/light
    await page.getByTestId("theme-toggle").click();
    await expect(page.locator("body")).toHaveAttribute("class", /dark/);
  });

  // --- WORKFLOW BUILDER TESTS ---
  test("User can create a new workflow", async ({ page }) => {
    await page.goto(`${BASE_URL}/workflows`);
    await page.getByRole("button", { name: /new workflow/i }).click();
    await page.getByLabel("Workflow Name").fill("Test Workflow");
    await page.getByRole("button", { name: /save/i }).click();

    await expect(page.getByText("Test Workflow")).toBeVisible();
  });

  test("User can edit and delete a workflow", async ({ page }) => {
    await page.goto(`${BASE_URL}/workflows`);
    const workflowCard = page.getByText("Test Workflow");

    // Edit
    await workflowCard.click();
    await page.getByLabel("Workflow Name").fill("Updated Workflow");
    await page.getByRole("button", { name: /save/i }).click();
    await expect(page.getByText("Updated Workflow")).toBeVisible();

    // Delete
    await page.getByRole("button", { name: /delete/i }).click();
    await expect(page.getByText("Updated Workflow")).not.toBeVisible();
  });

  // --- CONNECTIONS CRUD TESTS ---
  test("User can access Connections and perform CRUD", async ({ page }) => {
    await page.goto(`${BASE_URL}/connections`);
    await page.getByRole("button", { name: /add connection/i }).click();
    await page.getByLabel("Name").fill("Slack");
    await page.getByLabel("API Key").fill("testkey123");
    await page.getByRole("button", { name: /save/i }).click();

    await expect(page.getByText("Slack")).toBeVisible();

    // Delete test connection
    await page.getByRole("button", { name: /delete/i }).click();
    await expect(page.getByText("Slack")).not.toBeVisible();
  });

  // --- LOGOUT & CLEANUP ---
  test("User can log out successfully", async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    await page.getByRole("button", { name: /logout/i }).click();
    await expect(page).toHaveURL(`${BASE_URL}/login`);
  });
});
