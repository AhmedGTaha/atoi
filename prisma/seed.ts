import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/auth/password";
import { DEFAULT_WEBSITE_CONTENT } from "../lib/content/defaultWebsiteContent";
import { DEFAULT_COMPANY_SETTINGS } from "../lib/content/defaultCompanySettings";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.INITIAL_ADMIN_EMAIL;
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const existing = await prisma.adminUser.findUnique({ where: { email: adminEmail } });
    if (!existing) {
      await prisma.adminUser.create({
        data: {
          name: "Atrio Admin",
          email: adminEmail,
          passwordHash: await hashPassword(adminPassword),
          isActive: true,
        },
      });
      console.log(`Created initial admin: ${adminEmail}`);
    } else {
      console.log(`Admin ${adminEmail} already exists, skipping.`);
    }
  } else {
    console.warn(
      "INITIAL_ADMIN_EMAIL / INITIAL_ADMIN_PASSWORD not set — skipping initial admin creation."
    );
  }

  const settingsCount = await prisma.companySettings.count();
  if (settingsCount === 0) {
    await prisma.companySettings.create({ data: DEFAULT_COMPANY_SETTINGS });
    console.log("Created default company settings.");
  }

  for (const field of DEFAULT_WEBSITE_CONTENT) {
    await prisma.websiteContent.upsert({
      where: { key: field.key },
      create: { key: field.key, valueEn: field.valueEn, valueAr: field.valueAr },
      update: { valueEn: field.valueEn, valueAr: field.valueAr },
    });
  }
  console.log(`Seeded ${DEFAULT_WEBSITE_CONTENT.length} website content fields (existing values kept).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
