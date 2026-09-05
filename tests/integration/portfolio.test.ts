import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { resetDatabase } from "../helpers/db";
import { prisma } from "@/lib/db/client";
import {
  createPortfolioProject,
  setPortfolioPublished,
  getPublishedPortfolio,
} from "@/lib/services/portfolioService";

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

const baseInput = {
  titleEn: "Retail Systems",
  titleAr: "أنظمة تجزئة",
  descriptionEn: "A point of sale system.",
  descriptionAr: "نظام نقاط بيع.",
  category: "Retail",
  clientName: null,
  problemEn: null,
  problemAr: null,
  builtEn: null,
  builtAr: null,
  resultEn: null,
  resultAr: null,
  liveUrl: null,
  featured: false,
  published: false,
};

describe("portfolio publish/hide", () => {
  it("hides unpublished projects from the public listing", async () => {
    const project = await createPortfolioProject(baseInput);

    const published = await getPublishedPortfolio();
    expect(published.find((p) => p.id === project.id)).toBeUndefined();
  });

  it("shows a project once published, and hides it again once unpublished", async () => {
    const project = await createPortfolioProject(baseInput);

    await setPortfolioPublished(project.id, true);
    let published = await getPublishedPortfolio();
    expect(published.find((p) => p.id === project.id)).toBeDefined();

    await setPortfolioPublished(project.id, false);
    published = await getPublishedPortfolio();
    expect(published.find((p) => p.id === project.id)).toBeUndefined();
  });
});
