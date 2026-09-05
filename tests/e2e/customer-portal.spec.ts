import { test, expect } from "@playwright/test";
import { E2E_FIXTURES } from "./fixtures";

test.describe("Customer portal", () => {
  test("customer logs in, views their project, and submits a support request", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(E2E_FIXTURES.customer.email);
    await page.getByLabel("Password").fill(E2E_FIXTURES.customer.password);
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/portal$/);
    await expect(page.getByText("Bakery Ordering System")).toBeVisible();
    await expect(page.getByText("45%")).toBeVisible();

    await page.getByText("Bakery Ordering System").click();
    await expect(page).toHaveURL(/\/portal\/projects\/[a-f0-9-]+$/);

    await page.getByPlaceholder(/Tell us what's going on/).fill("The order form is not saving my address.");
    await page.getByRole("button", { name: "Send Support Request" }).click();

    // No RESEND_API_KEY is configured in this environment, so email
    // delivery fails, but the request must still be saved and acknowledged.
    await expect(page.getByText(/team will still see it/i)).toBeVisible();
  });

  test("cannot view a project via a made-up ID", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(E2E_FIXTURES.customer.email);
    await page.getByLabel("Password").fill(E2E_FIXTURES.customer.password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/portal$/);

    await page.goto("/portal/projects/00000000-0000-0000-0000-000000000000");
    await expect(page.getByText(/this page could not be found/i)).toBeVisible();
  });
});
