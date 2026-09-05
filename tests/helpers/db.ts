import { prisma } from "@/lib/db/client";

/** Wipes every table between integration tests, in FK-safe order. */
export async function resetDatabase() {
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
}
