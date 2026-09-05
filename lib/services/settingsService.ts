import "server-only";
import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db/client";
import type { CompanySettingsInput } from "@/lib/validation/settings";
import type { CompanySettings } from "@prisma/client";
import { DEFAULT_COMPANY_SETTINGS } from "@/lib/content/defaultCompanySettings";

export const COMPANY_SETTINGS_TAG = "company-settings";
export { DEFAULT_COMPANY_SETTINGS };

async function loadSettings(): Promise<CompanySettings> {
  const existing = await prisma.companySettings.findFirst();
  if (existing) return existing;
  return prisma.companySettings.create({ data: DEFAULT_COMPANY_SETTINGS });
}

export const getCompanySettings = unstable_cache(loadSettings, ["company-settings"], {
  tags: [COMPANY_SETTINGS_TAG],
});

export async function getCompanySettingsForAdmin(): Promise<CompanySettings> {
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

export async function updateCompanyLogo(storageKey: string, publicUrl: string): Promise<void> {
  const existing = await loadSettings();
  await prisma.companySettings.update({
    where: { id: existing.id },
    data: { logoStorageKey: storageKey, logoPublicUrl: publicUrl },
  });
  revalidateTag(COMPANY_SETTINGS_TAG);
}
