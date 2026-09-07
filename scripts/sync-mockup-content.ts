/**
 * One-time content sync: this task realigned the public site's copy with
 * ATOI Studio.html (the authoritative design reference) — new section
 * structure (six services with durations, a flat "how we work" readme,
 * updated headings/CTAs). Existing seeded rows for changed keys need to be
 * force-synced to the new defaults (seed.ts's upsert only fills in missing
 * keys, it never overwrites ones that already exist), and rows for keys
 * that no longer exist anywhere in the app are removed so the admin
 * content editor doesn't show dead fields.
 *
 * Safe to re-run. Only touches the specific keys defined in
 * DEFAULT_WEBSITE_CONTENT plus a fixed list of retired keys — no other
 * data is affected.
 *
 * Run once after deploying this change:
 *   npx tsx scripts/sync-mockup-content.ts
 */
import { PrismaClient } from "@prisma/client";
import { DEFAULT_WEBSITE_CONTENT } from "../lib/content/defaultWebsiteContent";

const prisma = new PrismaClient();

const RETIRED_KEYS = [
  "about.heading",
  "about.body",
  "services.body",
  "process.step1.name",
  "process.step1.description",
  "process.step2.name",
  "process.step2.description",
  "process.step3.name",
  "process.step3.description",
];

async function main() {
  for (const field of DEFAULT_WEBSITE_CONTENT) {
    await prisma.websiteContent.upsert({
      where: { key: field.key },
      create: { key: field.key, valueEn: field.valueEn, valueAr: field.valueAr },
      update: { valueEn: field.valueEn, valueAr: field.valueAr },
    });
  }
  console.log(`Synced ${DEFAULT_WEBSITE_CONTENT.length} website_content row(s) to the ATOI Studio copy.`);

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
