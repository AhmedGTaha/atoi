import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { PrismaClient } from "@prisma/client";
import { E2E_FIXTURES } from "./fixtures";

const widths = [1440, 1280, 1024, 768, 430, 390];
const db = new PrismaClient();
let projectId: string;
let customerId: string;
let requestId: string;
let portfolioId: string;

test.beforeAll(async ({ browser }) => {
  if (!process.env.DATABASE_URL?.includes("atoi_e2e"))
    throw new Error("Design checks require the dedicated atoi_e2e database");
  const project = await db.project.findFirstOrThrow({
    where: { name: "Bakery Ordering System" },
  });
  projectId = project.id;
  customerId = project.customerId;
  const request = await db.projectRequest.create({
    data: {
      email: "design-review@example.com",
      description: "Test enquiry for responsive route review.",
      phoneCountry: "BH",
      phoneE164: "+97336001234",
    },
  });
  requestId = request.id;
  const portfolio = await db.portfolioProject.findFirstOrThrow({
    where: { titleEn: "Review fixture" },
  });
  portfolioId = portfolio.id;
  // Saving through the real form also invalidates the persistent public cache.
  const page = await browser.newPage();
  await signIn(page, true);
  await page.goto(`/admin/portfolio/${portfolioId}`);
  const saved = page.waitForResponse(
    (response) =>
      response.request().method() === "POST" &&
      response.url().includes(portfolioId),
  );
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  expect((await saved).ok()).toBe(true);
  await page.goto(`/admin/portfolio/${portfolioId}`);
  await expect(
    page.getByRole("heading", { name: "Review fixture", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("alert").filter({ hasText: /invalid|required|characters/i }),
  ).toHaveCount(0);
  await page.close();
});
test.afterAll(async () => {
  await db.projectRequest.deleteMany({ where: { id: requestId } });
  await db.$disconnect();
});

async function signIn(page: Page, admin: boolean) {
  const account = admin ? E2E_FIXTURES.admin : E2E_FIXTURES.customer;
  await page.goto("/login");
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill(account.email);
  await page.getByLabel(/^Password/).fill(account.password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(admin ? /\/admin$/ : /\/portal$/);
}

async function reviewRoutes(
  page: Page,
  routes: string[],
  outputPath: (name: string) => string,
) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const route of routes) {
    await page.goto(route);
    await page.locator("h1").first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    for (const theme of ["dark", "light"] as const) {
      await page.evaluate((theme) => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem("atoi-theme", theme);
      }, theme);
      for (const width of widths) {
        const heights: Record<number, number> = {
          1440: 900,
          1280: 800,
          1024: 768,
          768: 1024,
          430: 932,
          390: 844,
        };
        await page.setViewportSize({ width, height: heights[width] });
        const metrics = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          bodyFont: getComputedStyle(document.body).fontFamily,
          headingFont: getComputedStyle(document.querySelector("h1")!)
            .fontFamily,
          background: getComputedStyle(document.body).backgroundColor,
          duplicateIds: [...document.querySelectorAll("[id]")]
            .map((el) => el.id)
            .filter((id, index, ids) => ids.indexOf(id) !== index),
        }));
        expect
          .soft(
            metrics.overflow,
            `${route} at ${width}: horizontal page overflow`,
          )
          .toBe(false);
        expect.soft(metrics.bodyFont).toContain("IBM Plex Sans");
        expect.soft(metrics.headingFont).toContain("IBM Plex Mono");
        expect
          .soft(metrics.background)
          .toBe(theme === "dark" ? "rgb(11, 13, 16)" : "rgb(245, 247, 248)");
        expect
          .soft(metrics.duplicateIds, `${route}: duplicate element IDs`)
          .toEqual([]);
        if (width === 1440 || width === 390)
          await page.screenshot({
            animations: "disabled",
            path: outputPath(
              `${route.replace(/[^a-z0-9]/gi, "-") || "home"}-${theme}-${width}.png`,
            ),
            fullPage: true,
          });
      }
      const audit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect
        .soft(
          audit.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
          `Accessibility on ${route} in ${theme}`,
        )
        .toEqual([]);
    }
  }
  expect(errors).toEqual([]);
}

test("all public and account routes use the design system at six widths", async ({
  page,
}, info) => {
  test.setTimeout(360_000);
  await reviewRoutes(
    page,
    [
      "/",
      "/login",
      "/forgot-password",
      "/set-password",
      "/set-password?token=test&mode=reset",
      "/privacy",
      "/terms",
      "/missing-page",
    ],
    info.outputPath.bind(info),
  );
});

test("every admin route remains usable at six widths", async ({
  page,
}, info) => {
  test.setTimeout(360_000);
  await signIn(page, true);
  await reviewRoutes(
    page,
    [
      "/admin",
      "/admin/requests",
      `/admin/requests/${requestId}`,
      "/admin/projects",
      `/admin/projects/${projectId}`,
      "/admin/customers",
      `/admin/customers/${customerId}`,
      "/admin/portfolio",
      "/admin/portfolio/new",
      `/admin/portfolio/${portfolioId}`,
      "/admin/content",
      "/admin/settings",
      "/admin/team",
    ],
    info.outputPath.bind(info),
  );
  await page.goto("/admin/projects");
  await page.getByRole("searchbox").fill("no-matching-project");
  await page.getByRole("button", { name: "Filter" }).click();
  await expect(page.getByText("No projects match.")).toBeVisible();
});

test("portal routes and Arabic layout remain usable", async ({
  page,
}, info) => {
  test.setTimeout(180_000);
  await signIn(page, false);
  await reviewRoutes(
    page,
    ["/portal", `/portal/projects/${projectId}`],
    info.outputPath.bind(info),
  );
  await page.getByRole("button", { name: "العربية" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  for (const width of widths) {
    await page.setViewportSize({ width, height: 960 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
  }
  await page.screenshot({
    animations: "disabled",
    path: info.outputPath("portal-arabic-390.png"),
    fullPage: true,
  });
});

test("mobile navigation and dialogs trap focus and restore it", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Menu", exact: true });
  await menu.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Shift+Tab");
  expect(
    await dialog.evaluate((el) => el.contains(document.activeElement)),
  ).toBe(true);
  await page.screenshot({
    animations: "disabled",
    path: info.outputPath("mobile-menu.png"),
  });
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await page.getByRole("button", { name: "Start a project" }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.screenshot({
    animations: "disabled",
    path: info.outputPath("enquiry-mobile.png"),
  });
  expect(
    await page.evaluate(() =>
      [...document.querySelectorAll("[id]")]
        .map((el) => el.id)
        .filter((id, index, ids) => ids.indexOf(id) !== index),
    ),
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: /Review fixture/ }).click();
  await expect(
    page.getByRole("dialog").getByRole("heading", { name: "Review fixture" }),
  ).toBeVisible();
  await page.screenshot({
    animations: "disabled",
    path: info.outputPath("portfolio-dialog.png"),
  });
});

test("theme preference persists across routes and reloads; inquiry is accessible in both modes", async ({
  page,
}, info) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page
    .getByRole("button", { name: "Switch colour mode" })
    .filter({ visible: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.goto("/login");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.goto("/");
  for (const theme of ["light", "dark"]) {
    if (theme === "dark")
      await page
        .getByRole("button", { name: "Switch colour mode" })
        .filter({ visible: true })
        .click();
    await page
      .getByRole("button", { name: "Start a project", exact: true })
      .first()
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      audit.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
    await page.screenshot({ path: info.outputPath(`inquiry-${theme}.png`) });
    await page.keyboard.press("Escape");
  }
});

test("admin mobile menu and deletion confirmation retain keyboard behavior", async ({
  page,
}, info) => {
  await signIn(page, true);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Menu / Dashboard" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "Settings", exact: true })
    .click();
  await expect(page).toHaveURL(/\/admin\/settings$/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goto(`/admin/portfolio/${portfolioId}`);
  const trigger = page.getByRole("button", {
    name: "Delete project",
    exact: true,
  });
  for (const theme of ["dark", "light"]) {
    await page.evaluate(
      (theme) => (document.documentElement.dataset.theme = theme),
      theme,
    );
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(
      dialog.getByRole("heading", { name: "Delete project?" }),
    ).toBeVisible();
    await page.keyboard.press("Shift+Tab");
    expect(
      await dialog.evaluate((el) => el.contains(document.activeElement)),
    ).toBe(true);
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(audit.violations.map((v) => v.id)).toEqual([]);
    await page.screenshot({
      path: info.outputPath(`confirmation-${theme}.png`),
    });
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    await expect(trigger).toBeFocused();
  }
  expect(await db.portfolioProject.count({ where: { id: portfolioId } })).toBe(
    1,
  );
});
