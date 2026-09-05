import type { PortfolioProject, PortfolioImage } from "@prisma/client";

export type PortfolioProjectWithImages = PortfolioProject & {
  images: PortfolioImage[];
};
