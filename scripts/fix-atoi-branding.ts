/**
 * One-time, idempotent data fix: replaces stale "Atrio"/"أتريو" placeholder
 * branding left over from before the ATOI rename with the real ATOI copy.
 *
 * Safe to re-run. Only touches values that still literally contain the old
 * placeholder text — anything an admin has already customized is left
 * untouched. Never deletes rows or resets unrelated fields.
 *
 * Run once after deploying this change:
 *   npx tsx scripts/fix-atoi-branding.ts
 */
import { PrismaClient } from "@prisma/client";
import { DEFAULT_COMPANY_SETTINGS } from "../lib/content/defaultCompanySettings";

const prisma = new PrismaClient();

function replaceBrand(value: string): string {
  return value.replace(/Atrio/g, "ATOI").replace(/أتريو/g, "ATOI");
}

async function fixCompanySettings() {
  const settings = await prisma.companySettings.findFirst();
  if (!settings) return;

  const data: Record<string, string> = {};

  if (/atrio/i.test(settings.companyName)) data.companyName = DEFAULT_COMPANY_SETTINGS.companyName;
  if (settings.companyEmail.toLowerCase() === "hello@atrio.bh") {
    data.companyEmail = DEFAULT_COMPANY_SETTINGS.companyEmail;
  }
  if (/atrio|أتريو/i.test(settings.seoTitleEn)) data.seoTitleEn = replaceBrand(settings.seoTitleEn);
  if (/atrio|أتريو/i.test(settings.seoTitleAr)) data.seoTitleAr = replaceBrand(settings.seoTitleAr);
  if (/atrio|أتريو/i.test(settings.seoDescriptionEn)) {
    data.seoDescriptionEn = replaceBrand(settings.seoDescriptionEn);
  }
  if (/atrio|أتريو/i.test(settings.seoDescriptionAr)) {
    data.seoDescriptionAr = replaceBrand(settings.seoDescriptionAr);
  }

  if (Object.keys(data).length > 0) {
    await prisma.companySettings.update({ where: { id: settings.id }, data });
    console.log(`Updated CompanySettings: ${Object.keys(data).join(", ")}`);
  } else {
    console.log("CompanySettings already clean.");
  }
}

async function fixAdminUsers() {
  const admins = await prisma.adminUser.findMany({ where: { name: { contains: "Atrio", mode: "insensitive" } } });
  for (const admin of admins) {
    await prisma.adminUser.update({ where: { id: admin.id }, data: { name: replaceBrand(admin.name) } });
  }
  console.log(admins.length > 0 ? `Updated ${admins.length} admin_users row(s).` : "admin_users already clean.");
}

async function fixWebsiteContent() {
  const rows = await prisma.websiteContent.findMany();
  let touched = 0;

  for (const row of rows) {
    const valueEn = /atrio/i.test(row.valueEn) ? replaceBrand(row.valueEn) : row.valueEn;
    const valueAr = /أتريو/i.test(row.valueAr) ? replaceBrand(row.valueAr) : row.valueAr;

    if (valueEn !== row.valueEn || valueAr !== row.valueAr) {
      await prisma.websiteContent.update({ where: { id: row.id }, data: { valueEn, valueAr } });
      touched += 1;
    }
  }

  console.log(touched > 0 ? `Updated ${touched} website_content row(s).` : "website_content already clean.");
}

async function main() {
  await fixCompanySettings();
  await fixAdminUsers();
  await fixWebsiteContent();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
