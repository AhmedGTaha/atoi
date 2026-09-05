import { test, expect } from "@playwright/test";

test.describe("Arabic RTL", () => {
  test("switching language sets RTL direction and localizes the modal", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "عربي" }).click();
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");

    await page.getByRole("button", { name: "ابدأ مشروعاً" }).first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "أخبرنا بما تحتاجه." })).toBeVisible();

    await dialog.getByLabel(/بماذا يمكننا مساعدتك/).fill("نحتاج نظام حجوزات لصالوننا في المنامة.");
    await dialog.getByLabel(/البريد الإلكتروني/).fill(`e2e-ar-${Date.now()}@example.com`);
    await dialog.getByPlaceholder("رقم الهاتف").fill("36001234");
    await dialog.getByRole("button", { name: "إرسال الطلب" }).click();

    await expect(dialog.getByRole("heading", { name: "تم استلام الطلب." })).toBeVisible();
  });
});
