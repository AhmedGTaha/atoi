-- Store the technology labels shown on public case-study cards.
ALTER TABLE "portfolio_projects"
ADD COLUMN "technologies" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Keep upload metadata so the admin image manager can identify uploaded files.
ALTER TABLE "portfolio_images"
ADD COLUMN "fileName" TEXT,
ADD COLUMN "fileSize" INTEGER;
