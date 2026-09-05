import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { resetDatabase } from "../helpers/db";
import { prisma } from "@/lib/db/client";
import { saveWebsiteContent, getWebsiteContent } from "@/lib/services/websiteContentService";

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("website content update", () => {
  it("persists an edited value and reflects it in the public content map", async () => {
    await saveWebsiteContent([
      { key: "hero.heading", valueEn: "New heading", valueAr: "عنوان جديد" },
    ]);

    const content = await getWebsiteContent();
    expect(content["hero.heading"]).toEqual({ valueEn: "New heading", valueAr: "عنوان جديد" });

    const row = await prisma.websiteContent.findUniqueOrThrow({ where: { key: "hero.heading" } });
    expect(row.valueEn).toBe("New heading");
  });

  it("falls back to the built-in default for a key that has never been edited", async () => {
    const content = await getWebsiteContent();
    expect(content["hero.heading"]).toEqual({
      valueEn: "Software built around your business.",
      valueAr: "برمجيات مصممة حول أعمالك.",
    });
  });

  it("updates an existing key in place rather than duplicating it", async () => {
    await saveWebsiteContent([{ key: "hero.heading", valueEn: "First", valueAr: "أول" }]);
    await saveWebsiteContent([{ key: "hero.heading", valueEn: "Second", valueAr: "ثاني" }]);

    const count = await prisma.websiteContent.count({ where: { key: "hero.heading" } });
    expect(count).toBe(1);

    const row = await prisma.websiteContent.findUniqueOrThrow({ where: { key: "hero.heading" } });
    expect(row.valueEn).toBe("Second");
  });
});
