import { chromium } from "playwright";

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 820, height: 1180 },
  { name: "mobile-430", width: 430, height: 900 },
  { name: "mobile-375", width: 375, height: 812 },
  { name: "mobile-320", width: 320, height: 700 },
];

const browser = await chromium.launch();

for (const locale of ["en", "ar"]) {
  for (const theme of ["dark", "light"]) {
    for (const vp of viewports) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
      });
      const page = await context.newPage();
      await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

      if (theme === "light") {
        await page.evaluate(() => {
          document.documentElement.setAttribute("data-theme", "light");
          localStorage.setItem("theme", "light");
        });
      }

      if (locale === "ar") {
        const arButton = page.locator('button[aria-pressed]', { hasText: "AR" }).first();
        await arButton.click({ timeout: 10000 }).catch(() => {});
        await page.waitForTimeout(500);
      }

      const startBtn = page.getByRole("button", { name: /start a project|ابدأ مشروعك/i }).first();
      await startBtn.click({ timeout: 10000 }).catch(async () => {
        // fallback: any element with data-open-modal
        await page.locator("text=/start/i").first().click();
      });
      await page.waitForTimeout(500);
      const fname = `/private/tmp/claude-501/-Users-ahmed-Developer-atoi/69f85c40-7271-421c-a352-8221045a1099/scratchpad/${locale}-${theme}-${vp.name}.png`;
      await page.screenshot({ path: fname, fullPage: false });
      console.log("saved", fname);
      await context.close();
    }
  }
}

await browser.close();
