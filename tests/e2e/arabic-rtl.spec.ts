import { test, expect } from "@playwright/test";

test.describe("Arabic RTL", () => {
  test("switching language sets RTL direction and localizes the modal", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "العربية" }).click();
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");

    // Regression guard: the hero must never regress to the literal
    // "give us the problem, we'll ship the software" mistranslation.
    await expect(page.getByText("أخبرنا بالمشكلة. ونحن نبني الحل البرمجي.")).toBeVisible();
    await expect(page.getByText("سنشحن لك البرمجيات")).toHaveCount(0);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflow).toBe(false);

    await page.getByRole("button", { name: "ابدأ مشروعك" }).first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "أخبرنا عن مشروعك." })).toBeVisible();

    await dialog.getByLabel("صف مشروعك").fill("نحتاج نظام حجوزات لصالوننا في المنامة.");
    await dialog.getByLabel(/البريد الإلكتروني/).fill(`e2e-ar-${Date.now()}@example.com`);
    await dialog.getByPlaceholder("3xxx xxxx").fill("36001234");
    await dialog.getByRole("button", { name: "إرسال الطلب" }).click();

    await expect(dialog.getByRole("heading", { name: "تم استلام طلبك." })).toBeVisible();
  });

  test("GCC phone select shows Arabic country names and an Arabic accessible label", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "العربية" }).click();

    await page.getByRole("button", { name: "ابدأ مشروعك" }).first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const countrySelect = dialog.getByLabel("رمز الدولة");
    await expect(countrySelect).toBeVisible();
    await expect(countrySelect.locator("option", { hasText: "البحرين" })).toHaveCount(1);
    await expect(countrySelect.locator("option", { hasText: "المملكة العربية السعودية" })).toHaveCount(1);
  });

  test("submitting invalid data in Arabic shows Arabic validation messages, not English", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "العربية" }).click();

    await page.getByRole("button", { name: "ابدأ مشروعك" }).first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await dialog.getByLabel("صف مشروعك").fill("قصير");
    await dialog.getByLabel(/البريد الإلكتروني/).fill("not-an-email");
    await dialog.getByPlaceholder("3xxx xxxx").fill("123");
    await dialog.getByRole("button", { name: "إرسال الطلب" }).click();

    await expect(dialog.getByText("أدخل بريدًا إلكترونيًا صالحًا.")).toBeVisible();
    await expect(dialog.getByText(/^(Enter|Select|Email|Phone|Password)/)).toHaveCount(0);
  });
});
