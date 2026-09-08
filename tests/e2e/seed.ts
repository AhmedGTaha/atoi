import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../../lib/auth/password";
import { DEFAULT_WEBSITE_CONTENT } from "../../lib/content/defaultWebsiteContent";
import { DEFAULT_COMPANY_SETTINGS } from "../../lib/content/defaultCompanySettings";
import { E2E_FIXTURES } from "./fixtures";

const prisma = new PrismaClient();

async function main() {
  await prisma.secureToken.deleteMany();
  await prisma.supportRequest.deleteMany();
  await prisma.projectUpdate.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.projectRequest.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.portfolioImage.deleteMany();
  await prisma.portfolioProject.deleteMany();
  await prisma.websiteContent.deleteMany();
  await prisma.companySettings.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.adminUser.deleteMany();

  await prisma.adminUser.create({
    data: {
      name: "Test Admin",
      email: E2E_FIXTURES.admin.email,
      passwordHash: await hashPassword(E2E_FIXTURES.admin.password),
      isActive: true,
    },
  });

  await prisma.companySettings.create({
    data: { ...DEFAULT_COMPANY_SETTINGS, supportFallbackRecipients: ["fallback@atrio.bh"] },
  });

  for (const field of DEFAULT_WEBSITE_CONTENT) {
    await prisma.websiteContent.create({
      data: { key: field.key, valueEn: field.valueEn, valueAr: field.valueAr },
    });
  }

  const teamMember = await prisma.teamMember.create({
    data: { name: "Jordan", email: E2E_FIXTURES.teamMember.email, isActive: true },
  });

  const customer = await prisma.customer.create({
    data: {
      name: "Sam Customer",
      businessName: "Sam's Bakery",
      email: E2E_FIXTURES.customer.email,
      passwordHash: await hashPassword(E2E_FIXTURES.customer.password),
      phoneCountry: "BH",
      phoneE164: "+97336001234",
      accountStatus: "ACTIVE",
    },
  });

  await prisma.project.create({
    data: {
      customerId: customer.id,
      name: "Bakery Ordering System",
      description: "An online ordering system for Sam's Bakery.",
      status: "DEVELOPMENT",
      progress: 45,
      phoneCountry: "BH",
      phoneE164: "+97312345678",
      members: { create: [{ teamMemberId: teamMember.id }] },
    },
  });

  await prisma.portfolioProject.create({
    data: {
      titleEn: "Review fixture", titleAr: "مشروع تجريبي",
      descriptionEn: "A portfolio record used only in the test database.",
      descriptionAr: "مشروع لاختبار الواجهة فقط.",
      published: true, problemEn: "Test problem", builtEn: "Test build", resultEn: "Test result",
    },
  });

  console.log("E2E fixtures seeded.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
