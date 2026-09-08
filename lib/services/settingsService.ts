import "server-only";
import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db/client";
import type { CompanySettingsInput } from "@/lib/validation/settings";
import type { Prisma } from "@prisma/client";
import { DEFAULT_COMPANY_SETTINGS } from "@/lib/content/defaultCompanySettings";

export const COMPANY_SETTINGS_TAG = "company-settings";
export { DEFAULT_COMPANY_SETTINGS };

const settingsInclude = {
  activeLightLogo: true,
  activeDarkLogo: true,
  activeAppIcon: true,
} as const;

export type CompanySettingsWithLogos = Prisma.CompanySettingsGetPayload<{
  include: typeof settingsInclude;
}>;

async function loadSettings() {
  const existing = await prisma.companySettings.findFirst({
    include: settingsInclude,
  });
  if (existing) return existing;
  return prisma.companySettings.create({
    data: DEFAULT_COMPANY_SETTINGS,
    include: settingsInclude,
  });
}

export const getCompanySettings = unstable_cache(loadSettings, ["company-settings"], {
  tags: [COMPANY_SETTINGS_TAG],
});

export async function getCompanySettingsForAdmin(): Promise<CompanySettingsWithLogos> {
  return loadSettings();
}

export async function updateCompanySettings(input: CompanySettingsInput): Promise<void> {
  const existing = await loadSettings();
  await prisma.companySettings.update({
    where: { id: existing.id },
    data: input,
  });
  revalidateTag(COMPANY_SETTINGS_TAG);
}
