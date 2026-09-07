import "server-only";
import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db/client";
import { deletePortfolioImage as deleteBlobImage } from "@/lib/storage/blob";
import type { PortfolioProjectInput } from "@/lib/validation/portfolio";

export const PORTFOLIO_PUBLIC_TAG = "portfolio-public";

async function loadPublishedPortfolio() {
  return prisma.portfolioProject.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { displayOrder: "asc" }],
    include: { images: { orderBy: { displayOrder: "asc" } } },
  });
}

export const getPublishedPortfolio = unstable_cache(
  loadPublishedPortfolio,
  ["portfolio-public"],
  { tags: [PORTFOLIO_PUBLIC_TAG] },
);

export async function getAllPortfolioForAdmin() {
  return prisma.portfolioProject.findMany({
    orderBy: { displayOrder: "asc" },
    include: { images: { orderBy: { displayOrder: "asc" } } },
  });
}

export async function getPortfolioProjectById(id: string) {
  return prisma.portfolioProject.findUnique({
    where: { id },
    include: { images: { orderBy: { displayOrder: "asc" } } },
  });
}

export async function createPortfolioProject(input: PortfolioProjectInput) {
  const count = await prisma.portfolioProject.count();
  const project = await prisma.portfolioProject.create({
    data: { ...input, displayOrder: count },
  });
  revalidateTag(PORTFOLIO_PUBLIC_TAG);
  return project;
}

export async function updatePortfolioProject(
  id: string,
  input: PortfolioProjectInput,
) {
  const project = await prisma.portfolioProject.update({
    where: { id },
    data: input,
  });
  revalidateTag(PORTFOLIO_PUBLIC_TAG);
  return project;
}

export async function setPortfolioPublished(id: string, published: boolean) {
  await prisma.portfolioProject.update({ where: { id }, data: { published } });
  revalidateTag(PORTFOLIO_PUBLIC_TAG);
}

export async function setPortfolioFeatured(id: string, featured: boolean) {
  await prisma.portfolioProject.update({ where: { id }, data: { featured } });
  revalidateTag(PORTFOLIO_PUBLIC_TAG);
}

export async function deletePortfolioProject(id: string) {
  const project = await prisma.portfolioProject.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!project) return;

  await Promise.all(
    project.images.map((img) => deleteBlobImage(img.publicUrl)),
  );
  await prisma.portfolioProject.delete({ where: { id } });
  revalidateTag(PORTFOLIO_PUBLIC_TAG);
}

export async function movePortfolioProject(
  id: string,
  direction: "up" | "down",
) {
  const all = await prisma.portfolioProject.findMany({
    orderBy: { displayOrder: "asc" },
  });
  const ids = all.map((p) => p.id);
  const index = ids.indexOf(id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= ids.length) return;

  [ids[index], ids[swapWith]] = [ids[swapWith]!, ids[index]!];
  await reorderPortfolioProjects(ids);
}

export async function movePortfolioImage(
  imageId: string,
  direction: "up" | "down",
) {
  const image = await prisma.portfolioImage.findUniqueOrThrow({
    where: { id: imageId },
  });
  const all = await prisma.portfolioImage.findMany({
    where: { portfolioProjectId: image.portfolioProjectId },
    orderBy: { displayOrder: "asc" },
  });
  const ids = all.map((i) => i.id);
  const index = ids.indexOf(imageId);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= ids.length) return;

  [ids[index], ids[swapWith]] = [ids[swapWith]!, ids[index]!];
  await reorderPortfolioImages(image.portfolioProjectId, ids);
}

export async function reorderPortfolioProjects(orderedIds: string[]) {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.portfolioProject.update({
        where: { id },
        data: { displayOrder: index },
      }),
    ),
  );
  revalidateTag(PORTFOLIO_PUBLIC_TAG);
}

export async function addPortfolioImage(
  portfolioProjectId: string,
  asset: {
    storageKey: string;
    publicUrl: string;
    fileName?: string;
    fileSize?: number;
  },
) {
  const count = await prisma.portfolioImage.count({
    where: { portfolioProjectId },
  });
  if (count >= 10) {
    throw new Error("A portfolio project can contain at most 10 images.");
  }
  const image = await prisma.portfolioImage.create({
    data: {
      portfolioProjectId,
      storageKey: asset.storageKey,
      publicUrl: asset.publicUrl,
      fileName: asset.fileName,
      fileSize: asset.fileSize,
      isMain: count === 0,
      displayOrder: count,
    },
  });
  revalidateTag(PORTFOLIO_PUBLIC_TAG);
  return image;
}

export async function removePortfolioImage(imageId: string) {
  const image = await prisma.portfolioImage.findUnique({
    where: { id: imageId },
  });
  if (!image) return;
  await deleteBlobImage(image.publicUrl);
  await prisma.portfolioImage.delete({ where: { id: imageId } });

  if (image.isMain) {
    const next = await prisma.portfolioImage.findFirst({
      where: { portfolioProjectId: image.portfolioProjectId },
      orderBy: { displayOrder: "asc" },
    });
    if (next) {
      await prisma.portfolioImage.update({
        where: { id: next.id },
        data: { isMain: true },
      });
    }
  }
  revalidateTag(PORTFOLIO_PUBLIC_TAG);
}

export async function reorderPortfolioImages(
  portfolioProjectId: string,
  orderedIds: string[],
) {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.portfolioImage.update({
        where: { id },
        data: { displayOrder: index },
      }),
    ),
  );
  revalidateTag(PORTFOLIO_PUBLIC_TAG);
}

export async function setMainPortfolioImage(
  portfolioProjectId: string,
  imageId: string,
) {
  await prisma.$transaction([
    prisma.portfolioImage.updateMany({
      where: { portfolioProjectId },
      data: { isMain: false },
    }),
    prisma.portfolioImage.update({
      where: { id: imageId },
      data: { isMain: true },
    }),
  ]);
  revalidateTag(PORTFOLIO_PUBLIC_TAG);
}
