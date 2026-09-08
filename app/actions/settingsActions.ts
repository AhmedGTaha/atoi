"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { companySettingsSchema } from "@/lib/validation/settings";
import { updateCompanySettings } from "@/lib/services/settingsService";
import {
  addLogoAsset,
  deleteLogoAsset,
  setActiveLogo,
  unsetActiveLogo,
  type LogoMode,
} from "@/lib/services/logoService";
import { validateImageFile, uploadPortfolioImage } from "@/lib/storage/blob";

export interface SettingsFormState {
  error?: string;
  success?: boolean;
}

export async function updateSettingsAction(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  const parsed = companySettingsSchema.safeParse({
    companyName: formData.get("companyName"),
    companyEmail: formData.get("companyEmail"),
    companyPhone: formData.get("companyPhone"),
    whatsappPhone: formData.get("whatsappPhone") || null,
    locationEn: formData.get("locationEn"),
    locationAr: formData.get("locationAr"),
    instagramUrl: formData.get("instagramUrl") || null,
    linkedinUrl: formData.get("linkedinUrl") || null,
    seoTitleEn: formData.get("seoTitleEn"),
    seoTitleAr: formData.get("seoTitleAr"),
    seoDescriptionEn: formData.get("seoDescriptionEn"),
    seoDescriptionAr: formData.get("seoDescriptionAr"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await updateCompanySettings(parsed.data);
  revalidatePath("/admin/settings");
  return { success: true };
}

export interface LogoUploadState {
  error?: string;
  success?: boolean;
}

export async function uploadLogoAction(
  _prevState: LogoUploadState,
  formData: FormData,
): Promise<LogoUploadState> {
  await requireAdmin();

  const file = formData.get("logo");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image file." };
  }

  const validation = validateImageFile(file);
  if (!validation.ok) {
    return { error: validation.error };
  }

  try {
    const asset = await uploadPortfolioImage(file, "logo");
    await addLogoAsset({
      ...asset,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    });
  } catch (err) {
    console.error("[settings] Logo upload failed:", err);
    return { error: "Upload failed. Check that image storage is configured." };
  }

  revalidatePath("/admin/settings");
  return { success: true };
}

export async function setActiveLogoAction(assetId: string, mode: LogoMode) {
  await requireAdmin();
  await setActiveLogo(assetId, mode);
  revalidatePath("/admin/settings");
}

export async function unsetActiveLogoAction(mode: LogoMode) {
  await requireAdmin();
  await unsetActiveLogo(mode);
  revalidatePath("/admin/settings");
}

export async function deleteLogoAssetAction(assetId: string) {
  await requireAdmin();
  await deleteLogoAsset(assetId);
  revalidatePath("/admin/settings");
}
