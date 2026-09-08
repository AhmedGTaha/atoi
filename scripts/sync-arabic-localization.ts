/**
 * Safe, idempotent sync for the Arabic localization quality pass.
 *
 * `defaultWebsiteContent.ts` now ships corrected Arabic copy (fixing the
 * literal "give us the problem, we'll ship the software" hero mistranslation
 * and similar issues across services/process/work/finalCta/footer). But
 * `websiteContentService.ts` lets database rows in `website_content`
 * override those defaults — so any row already persisted with the *old*
 * Arabic copy would keep shipping it to production even after this code
 * change, and any Arabic copy an admin has since customized through the CMS
 * editor must not be clobbered.
 *
 * This script updates a row's `valueAr` ONLY when it's empty or still
 * exactly matches the specific old/shipped Arabic string being replaced —
 * never when it differs (that means an admin likely customized it, so it's
 * left alone and logged as skipped). `valueEn` is never written by this
 * script under any circumstance, no rows are deleted, and no table other
 * than `website_content` is touched.
 *
 * Safe to re-run: once a row matches the new copy, it no longer matches an
 * old value, so subsequent runs make no further changes to it.
 *
 * Run manually after deploying this change:
 *   npx tsx scripts/sync-arabic-localization.ts
 *
 * `getWebsiteContent()` wraps its DB read in `unstable_cache` (tag
 * "website-content"), so rows changed by this script will not appear on the
 * live site until that cache is invalidated — e.g. by a redeploy/restart, or
 * by saving anything through the admin content editor (which calls
 * `revalidateTag("website-content")` as part of its normal save path).
 */
import { PrismaClient } from "@prisma/client";
import { DEFAULT_WEBSITE_CONTENT } from "../lib/content/defaultWebsiteContent";

const prisma = new PrismaClient();

/**
 * The exact Arabic string each key shipped with before this localization
 * pass. Only listed for keys whose Arabic copy actually changed — a row
 * matching one of these values is known-old-shipped-copy, safe to replace.
 * Keys not listed here are left to the empty-value fallback only.
 */
const OLD_SHIPPED_AR: Record<string, string> = {
  "hero.heading": "أعطنا المشكلة. سنشحن لك البرمجيات.",
  "hero.body":
    "نصمم ونبني مواقع إلكترونية وتطبيقات ويب وبرمجيات داخلية للشركات في البحرين وخارجها.",
  "hero.ctaPrimary": "ابدأ مشروعاً",
  "services.heading": "ستة أشياء، بإتقان.",
  "services.item1.description": "سريعة وواضحة وقابلة للتعديل من فريقك.",
  "services.item1.duration": "٣-٦ أسابيع",
  "services.item2.description": "حسابات وصلاحيات وشاشات مبنية للاستخدام اليومي.",
  "services.item2.duration": "٦-١٤ أسبوعاً",
  "services.item3.name": "منتجات ساس",
  "services.item3.description": "من الفكرة إلى منتج مدفوع، ثم تحديثات بعد الإطلاق.",
  "services.item4.description": "جدول البيانات الذي يدير عملك، معاد بناؤه بشكل صحيح.",
  "services.item4.duration": "٤-١٠ أسابيع",
  "services.item5.description": "أنظمة تتواصل مع بعضها؛ تقارير تكتب نفسها.",
  "services.item5.duration": "٢-٥ أسابيع",
  "services.item6.description": "الشيء الذي لا يقدمه أي منتج في السوق.",
  "services.item6.duration": "حسب النطاق",
  "process.heading": "من الفكرة إلى الإنتاج.",
  "process.step2.name": "شاهد التقدم كل أسبوع",
  "process.step2.description":
    "تحصل على إصدارات عمل على رابط حقيقي، وليس مجرد تحديثات حالة.",
  "process.step3.name": "امتلك ما نبنيه",
  "process.step3.description":
    "كود نظيف وتوثيق ومشروع يستطيع فريقك مواصلة تطويره.",
  "work.intro":
    "مشاريع حقيقية وتأثير حقيقي. نبني بتقنيات حديثة للشركات ذات النظرة المستقبلية.",
  "work.seeAllLabel": "عرض كل المشاريع",
  "finalCta.eyebrow": "ابدأ مشروعاً",
  "finalCta.heading": "هل لديك ما يستحق البناء؟",
  "finalCta.ctaLabel": "افتح نموذج الاستفسار",
  "footer.tagline": "حلول برمجية، بأسلوب مباشر.",
};

async function main() {
  let created = 0;
  let updated = 0;
  let skipped = 0;
  let unchanged = 0;

  for (const field of DEFAULT_WEBSITE_CONTENT) {
    const existing = await prisma.websiteContent.findUnique({
      where: { key: field.key },
    });

    if (!existing) {
      await prisma.websiteContent.create({
        data: { key: field.key, valueEn: field.valueEn, valueAr: field.valueAr },
      });
      created++;
      console.log(`Created ${field.key} with current defaults.`);
      continue;
    }

    const currentAr = existing.valueAr.trim();
    const oldShipped = OLD_SHIPPED_AR[field.key];
    const isEmpty = currentAr.length === 0;
    const matchesOldShipped = oldShipped !== undefined && currentAr === oldShipped;

    if (currentAr === field.valueAr) {
      unchanged++;
      continue;
    }

    if (isEmpty || matchesOldShipped) {
      await prisma.websiteContent.update({
        where: { key: field.key },
        data: { valueAr: field.valueAr },
      });
      updated++;
      console.log(`Updated ${field.key} (${isEmpty ? "was empty" : "matched old shipped copy"}).`);
    } else {
      skipped++;
      console.log(`Skipped ${field.key} because Arabic copy appears customized.`);
    }
  }

  console.log(
    `\nDone. ${created} created, ${updated} updated, ${skipped} skipped (customized), ${unchanged} already current.`,
  );
  if (updated > 0 || created > 0) {
    console.log(
      "\nNote: the site caches website content (tag \"website-content\"). Redeploy/restart the app, " +
        "or save any entry through the admin content editor, so these changes become visible.",
    );
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
