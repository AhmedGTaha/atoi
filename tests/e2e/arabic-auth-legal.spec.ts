import { test, expect } from "@playwright/test";
import { E2E_FIXTURES } from "./fixtures";

/** Switches to Arabic via the language toggle so the locale cookie is set,
 * matching how a real visitor would reach a localized auth/legal page. */
async function switchToArabic(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "العربية" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
}

test.describe("Arabic auth screens", () => {
  test("login page is fully Arabic and rejects bad credentials in Arabic", async ({ page }) => {
    await switchToArabic(page);
    await page.goto("/login");

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("heading", { name: "تسجيل الدخول" })).toBeVisible();
    await expect(page.getByText("ادخل إلى حسابك في ATOI.")).toBeVisible();
    await expect(page.getByRole("button", { name: "تسجيل الدخول" })).toBeVisible();
    await expect(page.getByRole("link", { name: "هل نسيت كلمة المرور؟" })).toBeVisible();

    await page.getByLabel("البريد الإلكتروني").fill(E2E_FIXTURES.customer.email);
    await page.getByLabel("كلمة المرور").fill("definitely-the-wrong-password");
    await page.getByRole("button", { name: "تسجيل الدخول" }).click();

    await expect(
      page.getByText("البريد الإلكتروني أو كلمة المرور غير صحيحة."),
    ).toBeVisible();
  });

  test("forgot-password page is Arabic and shows the privacy-preserving success message", async ({ page }) => {
    await switchToArabic(page);
    await page.goto("/forgot-password");

    await expect(page.getByRole("heading", { name: "إعادة تعيين كلمة المرور" })).toBeVisible();
    await expect(
      page.getByText("أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور."),
    ).toBeVisible();

    await page.getByLabel("البريد الإلكتروني").fill("someone@example.com");
    await page.getByRole("button", { name: "إرسال رابط إعادة التعيين" }).click();

    await expect(
      page.getByText(
        "إذا كان هناك حساب مرتبط بهذا البريد الإلكتروني، فقد أرسلنا رابطًا لإعادة تعيين كلمة المرور.",
      ),
    ).toBeVisible();
  });

  test("set-password page shows the Arabic invalid-link state without a token", async ({ page }) => {
    await switchToArabic(page);
    await page.goto("/set-password");

    await expect(page.getByRole("heading", { name: "الرابط غير صالح" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "طلب رابط جديد" }),
    ).toBeVisible();
  });
});

test.describe("Arabic legal pages", () => {
  test("privacy policy renders in Arabic with RTL direction", async ({ page }) => {
    await switchToArabic(page);
    await page.goto("/privacy");

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("heading", { name: "سياسة الخصوصية" })).toBeVisible();
    await expect(page.getByRole("link", { name: /العودة إلى الرئيسية/ })).toBeVisible();
  });

  test("terms of service renders in Arabic with RTL direction", async ({ page }) => {
    await switchToArabic(page);
    await page.goto("/terms");

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("heading", { name: "شروط الخدمة" })).toBeVisible();
  });
});
