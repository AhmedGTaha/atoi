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
  reorderPortfolioImages,
  setMainPortfolioImage,
  getPortfolioProjectById,
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
    categoryAr: formData.get("categoryAr") || null,
    technologies: String(formData.get("technologies") || "")
      .split(/[\n,]/)
      .map((technology) => technology.trim())
      .filter(Boolean),
    liveUrl: formData.get("liveUrl") || null,
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  });
}

export async function createPortfolioProjectAction(
  _prevState: PortfolioFormState,
  formData: FormData,
): Promise<PortfolioFormState> {
  await requireAdmin();
  const parsed = readPortfolioForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const files = formData
    .getAll("images")
    .filter((file): file is File => file instanceof File && file.size > 0);
  if (files.length > 10) {
    return { error: "Upload no more than 10 images at once." };
  }
  for (const file of files) {
    const validation = validateImageFile(file);
    if (!validation.ok) return { error: validation.error };
  }

  const project = await createPortfolioProject(parsed.data);
  let uploaded = 0;

  if (files.length > 0) {
    try {
      for (const file of files) {
        const asset = await uploadPortfolioImage(file, "portfolio");
        await addPortfolioImage(project.id, {
          ...asset,
          fileName: file.name,
          fileSize: file.size,
        });
        uploaded += 1;
      }
      const coverIndex = Number(formData.get("coverIndex") ?? 0);
      if (coverIndex > 0) {
        const withImages = await getPortfolioProjectById(project.id);
        const cover = withImages?.images[coverIndex];
        if (cover) await setMainPortfolioImage(project.id, cover.id);
      }
    } catch (err) {
      console.error(
        "[portfolio] Image upload failed during project creation:",
        err,
      );
      // The project (and any images uploaded before the failure) have already
      // been persisted. Redirect to its editor with an explicit warning so a
      // retry adds only the missing files instead of creating a duplicate.
      redirect(
        `/admin/portfolio/${project.id}?imageUpload=failed&uploaded=${uploaded}&total=${files.length}`,
      );
    }
  }

  redirect(`/admin/portfolio/${project.id}`);
}

export async function updatePortfolioProjectAction(
  projectId: string,
  _prevState: PortfolioFormState,
  formData: FormData,
): Promise<PortfolioFormState> {
  await requireAdmin();
  const parsed = readPortfolioForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await updatePortfolioProject(projectId, parsed.data);
  return {};
}

export async function setPortfolioPublishedAction(
  id: string,
  published: boolean,
) {
  await requireAdmin();
  await setPortfolioPublished(id, published);
}

export async function setPortfolioFeaturedAction(
  id: string,
  featured: boolean,
) {
  await requireAdmin();
  await setPortfolioFeatured(id, featured);
}

export async function deletePortfolioProjectAction(id: string) {
  await requireAdmin();
  await deletePortfolioProject(id);
  redirect("/admin/portfolio");
}

export async function movePortfolioProjectAction(
  id: string,
  direction: "up" | "down",
) {
  await requireAdmin();
  await movePortfolioProject(id, direction);
}

export interface ImageUploadState {
  error?: string;
}

export async function uploadPortfolioImageAction(
  projectId: string,
  _prevState: ImageUploadState,
  formData: FormData,
): Promise<ImageUploadState> {
  await requireAdmin();

  const files = formData
    .getAll("image")
    .filter((file): file is File => file instanceof File && file.size > 0);
  if (files.length === 0) {
    return { error: "Choose an image file." };
  }

  if (files.length > 10)
    return { error: "Upload no more than 10 images at once." };
  const project = await getPortfolioProjectById(projectId);
  if (!project) return { error: "Portfolio project not found." };
  if (project.images.length + files.length > 10) {
    return {
      error: `This project can contain 10 images. It currently has ${project.images.length}.`,
    };
  }
  for (const file of files) {
    const validation = validateImageFile(file);
    if (!validation.ok) return { error: validation.error };
  }

  try {
    for (const file of files) {
      const asset = await uploadPortfolioImage(file, "portfolio");
      await addPortfolioImage(projectId, {
        ...asset,
        fileName: file.name,
        fileSize: file.size,
      });
    }
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

export async function movePortfolioImageAction(
  imageId: string,
  direction: "up" | "down",
) {
  await requireAdmin();
  await movePortfolioImage(imageId, direction);
}

export async function reorderPortfolioImagesAction(
  projectId: string,
  orderedIds: string[],
) {
  await requireAdmin();
  const project = await getPortfolioProjectById(projectId);
  if (!project || orderedIds.length !== project.images.length) return;
  const knownIds = new Set(project.images.map((image) => image.id));
  if (
    orderedIds.some((id) => !knownIds.has(id)) ||
    new Set(orderedIds).size !== orderedIds.length
  )
    return;
  await reorderPortfolioImages(projectId, orderedIds);
}

export async function setMainPortfolioImageAction(
  projectId: string,
  imageId: string,
) {
  await requireAdmin();
  await setMainPortfolioImage(projectId, imageId);
}
