import "server-only";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db/client";
import { deletePortfolioImage as deleteBlobAsset } from "@/lib/storage/blob";
import { COMPANY_SETTINGS_TAG } from "@/lib/services/settingsService";

export type LogoMode = "light" | "dark";

export async function getLogoAssets() {
  return prisma.logoAsset.findMany({ orderBy: { createdAt: "desc" } });
}

export async function addLogoAsset(asset: {
  storageKey: string;
  publicUrl: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
}) {
  const created = await prisma.logoAsset.create({ data: asset });
  revalidateTag(COMPANY_SETTINGS_TAG);
  return created;
}

export async function setActiveLogo(assetId: string, mode: LogoMode) {
  const settings = await prisma.companySettings.findFirst();
  if (!settings) throw new Error("Company settings have not been initialised.");

  await prisma.companySettings.update({
    where: { id: settings.id },
    data:
      mode === "light"
        ? { activeLightLogoId: assetId }
        : { activeDarkLogoId: assetId },
  });
  revalidateTag(COMPANY_SETTINGS_TAG);
}

export async function unsetActiveLogo(mode: LogoMode) {
  const settings = await prisma.companySettings.findFirst();
  if (!settings) return;

  await prisma.companySettings.update({
    where: { id: settings.id },
    data:
      mode === "light" ? { activeLightLogoId: null } : { activeDarkLogoId: null },
  });
  revalidateTag(COMPANY_SETTINGS_TAG);
}

export async function deleteLogoAsset(assetId: string) {
  const asset = await prisma.logoAsset.findUnique({ where: { id: assetId } });
  if (!asset) return;

  // The FK columns are ON DELETE SET NULL, so any settings record pointing
  // at this asset is cleared automatically by Postgres as part of the same
  // delete — no orphaned/broken logo URL is left behind.
  await prisma.logoAsset.delete({ where: { id: assetId } });
  await deleteBlobAsset(asset.publicUrl);
  revalidateTag(COMPANY_SETTINGS_TAG);
}
