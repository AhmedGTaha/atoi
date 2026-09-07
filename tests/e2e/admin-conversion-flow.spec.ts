import { test, expect } from "@playwright/test";
import { E2E_FIXTURES } from "./fixtures";

test.describe("Admin login and request conversion", () => {
  test("full flow: submit request -> admin login -> convert -> publish update", async ({
    page,
  }) => {
    const email = `admin-flow-${Date.now()}@example.com`;

    // 1. A visitor submits a project request from the public site.
    await page.goto("/");
    await page.getByRole("button", { name: "Start a project" }).first().click();
    const modal = page.getByRole("dialog");
    await modal
      .getByLabel(/What can we help with/)
      .fill("We need a loyalty app for our coffee shop chain.");
    await modal.getByLabel(/^Email/).fill(email);
    await modal.getByPlaceholder("Phone number").fill("36009999");
    await modal.getByRole("button", { name: "send inquiry" }).click();
    await expect(
      modal.getByRole("heading", { name: "Request received." }),
    ).toBeVisible();
    await modal.getByRole("button", { name: "Done" }).click();

    // 2. Universal login rejects wrong credentials.
    await page.goto("/login");
    await page.getByLabel("Email").fill(E2E_FIXTURES.admin.email);
    await page.getByLabel("Password").fill("wrong-password");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText(/incorrect email or password/i)).toBeVisible();

    // 3. Admin logs in successfully. React resets uncontrolled form fields
    // after a Server Action runs, so both fields need refilling here.
    await page.getByLabel("Email").fill(E2E_FIXTURES.admin.email);
    await page.getByLabel("Password").fill(E2E_FIXTURES.admin.password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/admin$/);
    await expect(
      page.getByRole("heading", { name: "Dashboard" }),
    ).toBeVisible();

    // 4. Find and open the submitted request.
    await page.goto("/admin/requests");
    await page.getByRole("link", { name: email }).click();
    await expect(page).toHaveURL(/\/admin\/requests\/[^/]+$/);
    await expect(
      page.getByRole("paragraph").filter({hasText:"We need a loyalty app for our coffee shop chain."}),
    ).toBeVisible();

    // 5. Convert it into a customer + project, assigning the seeded team member.
    await page.getByLabel("Project name").fill("Coffee Loyalty App");
    await page.getByLabel("Jordan").check();
    await page
      .getByRole("button", { name: "Create Customer & Project" })
      .click();

    await expect(page).toHaveURL(/\/admin\/projects\/[a-f0-9-]+$/);
    await expect(
      page.getByRole("heading", { name: "Coffee Loyalty App" }),
    ).toBeVisible();

    // 6. Publish a project update; email will fail in this environment
    // (no RESEND_API_KEY configured), but the update must still be saved.
    await page
      .getByLabel("Project update")
      .fill("Kickoff call scheduled for next week.");
    await page.getByRole("button", { name: "Publish update" }).click();
    await expect(page.getByText(/email failed to send/i)).toBeVisible();
    await expect(
      page.getByRole("paragraph").filter({hasText:"Kickoff call scheduled for next week."}),
    ).toBeVisible();
  });
});
