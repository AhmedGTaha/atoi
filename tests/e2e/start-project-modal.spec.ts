import { test, expect } from "@playwright/test";

test.describe("Start a Project modal", () => {
  test("submits a minimal valid request with the Bahrain +973 default and shows success", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Start a project" }).first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // Bahrain must be the pre-selected default country.
    await expect(dialog.getByLabel("Country code")).toHaveValue("BH");

    // Leave optional fields (business type, name) blank.
    await dialog.getByLabel(/What can we help with/).fill("We need a booking system for our salon in Manama.");
    await dialog.getByLabel(/^Email/).fill(`e2e-${Date.now()}@example.com`);
    await dialog.getByPlaceholder("Phone number").fill("36001234");

    await dialog.getByRole("button", { name: "Send request" }).click();

    await expect(dialog.getByRole("heading", { name: "Request received." })).toBeVisible();
    await dialog.getByRole("button", { name: "Done" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("shows a validation error for a description that is too short", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Start a project" }).first().click();
    const dialog = page.getByRole("dialog");

    await dialog.getByLabel(/What can we help with/).fill("short");
    await dialog.getByLabel(/^Email/).fill("valid@example.com");
    await dialog.getByPlaceholder("Phone number").fill("36001234");
    await dialog.getByRole("button", { name: "Send request" }).click();

    await expect(dialog.getByRole("alert")).toContainText(/at least 10 characters/i);
  });

  test("closes with Escape and restores focus to the trigger", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Start a project" }).first();
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });
});
