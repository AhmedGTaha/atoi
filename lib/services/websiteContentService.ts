import "server-only";
import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db/client";
import {
  DEFAULT_WEBSITE_CONTENT,
  DEFAULT_WEBSITE_CONTENT_MAP,
} from "@/lib/content/defaultWebsiteContent";
import type { WebsiteContentEntryInput } from "@/lib/validation/websiteContent";

export const WEBSITE_CONTENT_TAG = "website-content";

export type WebsiteContentMap = Record<string, { valueEn: string; valueAr: string }>;

async function loadWebsiteContent(): Promise<WebsiteContentMap> {
  const rows = await prisma.websiteContent.findMany();
  const map: WebsiteContentMap = { ...DEFAULT_WEBSITE_CONTENT_MAP };
  for (const row of rows) {
    map[row.key] = { valueEn: row.valueEn, valueAr: row.valueAr };
  }
  return map;
}

/** Cached read used by the public homepage. Revalidated by tag on save. */
export const getWebsiteContent = unstable_cache(loadWebsiteContent, ["website-content"], {
  tags: [WEBSITE_CONTENT_TAG],
});

/** Uncached read for the admin CMS editor, always showing the latest data. */
export async function getWebsiteContentForAdmin(): Promise<WebsiteContentMap> {
  return loadWebsiteContent();
}

export function websiteContentFieldDefinitions() {
  return DEFAULT_WEBSITE_CONTENT;
}

export async function saveWebsiteContent(entries: WebsiteContentEntryInput[]): Promise<void> {
  await prisma.$transaction(
    entries.map((entry) =>
      prisma.websiteContent.upsert({
        where: { key: entry.key },
        create: entry,
        update: { valueEn: entry.valueEn, valueAr: entry.valueAr },
      })
    )
  );
  revalidateTag(WEBSITE_CONTENT_TAG);
}
