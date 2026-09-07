/**
 * One-time content sync: the "how we work" readme section (process.*) got
 * new copy — new heading, and each step's name/description text changed.
 * seed.ts's upsert only fills in missing keys, so the already-seeded
 * process.heading/process.step1-3.name/description rows need to be
 * force-synced to the new defaults. Also clears out the flat
 * process.step1-3 keys from an earlier, abandoned migration, in case any
 * environment still has them, so the admin content editor doesn't show
 * dead fields.
 *
 * Safe to re-run. Only touches the specific keys defined in
 * DEFAULT_WEBSITE_CONTENT plus a fixed list of retired keys — no other
 * data is affected.
 *
 * Run once after deploying this change:
 *   npx tsx scripts/sync-how-we-work-content.ts
 */
import { PrismaClient } from "@prisma/client";
import { DEFAULT_WEBSITE_CONTENT } from "../lib/content/defaultWebsiteContent";

const prisma = new PrismaClient();

const RETIRED_KEYS = ["process.step1", "process.step2", "process.step3"];

async function main() {
  const processFields = DEFAULT_WEBSITE_CONTENT.filter((field) => field.section === "process");

  for (const field of processFields) {
    await prisma.websiteContent.upsert({
      where: { key: field.key },
      create: { key: field.key, valueEn: field.valueEn, valueAr: field.valueAr },
      update: { valueEn: field.valueEn, valueAr: field.valueAr },
    });
  }
  console.log(`Synced ${processFields.length} process website_content row(s).`);

  const removed = await prisma.websiteContent.deleteMany({ where: { key: { in: RETIRED_KEYS } } });
  console.log(`Removed ${removed.count} retired website_content row(s).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
