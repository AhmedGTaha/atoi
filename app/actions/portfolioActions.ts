"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { portfolioProjectSchema } from "@/lib/validation/portfolio";
import { validateImageFile, uploadPortfolioImage } from "@/lib/storage/blob";
import {
  createPortfolioProject,
  updatePortfolioProject,
  deletePortfolioProject,
  setPortfolioPublished,
  setPortfolioFeatured,
  movePortfolioProject,
  addPortfolioImage,
  removePortfolioImage,
  movePortfolioImage,
  setMainPortfolioImage,
} from "@/lib/services/portfolioService";

export interface PortfolioFormState {
  error?: string;
}

function readPortfolioForm(formData: FormData) {
  return portfolioProjectSchema.safeParse({
    titleEn: formData.get("titleEn"),
    titleAr: formData.get("titleAr"),
    descriptionEn: formData.get("descriptionEn"),
    descriptionAr: formData.get("descriptionAr"),
    category: formData.get("category") || null,
    clientName: formData.get("clientName") || null,
    problemEn: formData.get("problemEn") || null,
    problemAr: formData.get("problemAr") || null,
    builtEn: formData.get("builtEn") || null,
    builtAr: formData.get("builtAr") || null,
    resultEn: formData.get("resultEn") || null,
    resultAr: formData.get("resultAr") || null,
    liveUrl: formData.get("liveUrl") || null,
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  });
}

export async function createPortfolioProjectAction(
  _prevState: PortfolioFormState,
  formData: FormData
): Promise<PortfolioFormState> {
  await requireAdmin();
  const parsed = readPortfolioForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const project = await createPortfolioProject(parsed.data);
  redirect(`/admin/portfolio/${project.id}`);
}

export async function updatePortfolioProjectAction(
  projectId: string,
  _prevState: PortfolioFormState,
  formData: FormData
): Promise<PortfolioFormState> {
  await requireAdmin();
  const parsed = readPortfolioForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await updatePortfolioProject(projectId, parsed.data);
  return {};
}

export async function setPortfolioPublishedAction(id: string, published: boolean) {
  await requireAdmin();
  await setPortfolioPublished(id, published);
}

export async function setPortfolioFeaturedAction(id: string, featured: boolean) {
  await requireAdmin();
  await setPortfolioFeatured(id, featured);
}

export async function deletePortfolioProjectAction(id: string) {
  await requireAdmin();
  await deletePortfolioProject(id);
  redirect("/admin/portfolio");
}

export async function movePortfolioProjectAction(id: string, direction: "up" | "down") {
  await requireAdmin();
  await movePortfolioProject(id, direction);
}

export interface ImageUploadState {
  error?: string;
}

export async function uploadPortfolioImageAction(
  projectId: string,
  _prevState: ImageUploadState,
  formData: FormData
): Promise<ImageUploadState> {
  await requireAdmin();

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image file." };
  }

  const validation = validateImageFile(file);
  if (!validation.ok) {
    return { error: validation.error };
  }

  try {
    const asset = await uploadPortfolioImage(file, "portfolio");
    await addPortfolioImage(projectId, asset);
  } catch (err) {
    console.error("[portfolio] Image upload failed:", err);
    return { error: "Upload failed. Check that image storage is configured." };
  }

  return {};
}

export async function removePortfolioImageAction(imageId: string) {
  await requireAdmin();
  await removePortfolioImage(imageId);
}

export async function movePortfolioImageAction(imageId: string, direction: "up" | "down") {
  await requireAdmin();
  await movePortfolioImage(imageId, direction);
}

export async function setMainPortfolioImageAction(projectId: string, imageId: string) {
  await requireAdmin();
  await setMainPortfolioImage(projectId, imageId);
}
