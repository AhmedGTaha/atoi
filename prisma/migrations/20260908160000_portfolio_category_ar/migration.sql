-- Arabic label for the free-text portfolio category field, mirroring the
-- titleEn/titleAr bilingual pattern already used on this model. Additive
-- and nullable: existing rows fall back to the English category text.
ALTER TABLE "portfolio_projects"
ADD COLUMN "categoryAr" TEXT;
