import { test, expect } from "@playwright/test";

test.describe("Start a Project modal", () => {
  test("submits a minimal valid request with the Bahrain +973 default and shows success", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Start a project" }).first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // Bahrain must be the pre-selected default country.
    await expect(dialog.getByLabel("Country code")).toHaveValue("BH");

    // Leave optional fields (project type keeps its default, name is blank).
    await dialog.getByLabel(/describe/i).fill("We need a booking system for our salon in Manama.");
    await dialog.getByLabel(/^email/i).fill(`e2e-${Date.now()}@example.com`);
    await dialog.getByPlaceholder("3xxx xxxx").fill("36001234");

    await dialog.getByRole("button", { name: "send inquiry" }).click();

    await expect(dialog.getByRole("heading", { name: "Request received." })).toBeVisible();
    await dialog.getByRole("button", { name: "Done" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("shows a validation error for a description that is too short", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Start a project" }).first().click();
    const dialog = page.getByRole("dialog");

    await dialog.getByLabel(/describe/i).fill("short");
    await dialog.getByLabel(/^email/i).fill("valid@example.com");
    await dialog.getByPlaceholder("3xxx xxxx").fill("36001234");
    await dialog.getByRole("button", { name: "send inquiry" }).click();

    await expect(dialog.getByRole("alert")).toContainText(/20\+ characters/i);
  });

  test("rejects a phone number with the wrong length for the selected country", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Start a project" }).first().click();
    const dialog = page.getByRole("dialog");

    await dialog.getByLabel(/describe/i).fill("We need a booking system for our salon in Manama.");
    await dialog.getByLabel(/^email/i).fill("valid@example.com");
    // Bahrain numbers are 8 digits; this is only 5.
    await dialog.getByPlaceholder("3xxx xxxx").fill("36001");
    await dialog.getByRole("button", { name: "send inquiry" }).click();

    await expect(dialog.getByRole("alert")).toContainText(/8 digits/i);
  });

  test("changing the country updates the phone input's allowed length immediately", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Start a project" }).first().click();
    const dialog = page.getByRole("dialog");

    const phone = dialog.getByPlaceholder("3xxx xxxx");
    await expect(phone).toHaveAttribute("maxlength", "8"); // Bahrain

    await dialog.getByLabel("Country code").selectOption("SA");
    await expect(phone).toHaveAttribute("maxlength", "9"); // Saudi Arabia
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
