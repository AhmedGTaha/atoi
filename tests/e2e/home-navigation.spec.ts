import { test, expect } from "@playwright/test";

test.describe("One-page anchor navigation", () => {
  test("clicking nav links scrolls to the matching section without leaving the page", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Services", exact: true }).click();
    await expect(page).toHaveURL(/\/#services$/);
    await expect(page.locator("#services")).toBeInViewport();

    await page.getByRole("link", { name: "Previous Work", exact: true }).click();
    await expect(page).toHaveURL(/\/#work$/);
    await expect(page.locator("#work")).toBeInViewport();

    await page.getByRole("link", { name: "About", exact: true }).click();
    await expect(page).toHaveURL(/\/#about$/);
    await expect(page.locator("#about")).toBeInViewport();

    await page.getByRole("link", { name: "Contact", exact: true }).click();
    await expect(page).toHaveURL(/\/#contact$/);
    await expect(page.locator("#contact")).toBeInViewport();
  });
});
