-- AlterTable
ALTER TABLE "company_settings" ADD COLUMN     "activeDarkLogoId" TEXT,
ADD COLUMN     "activeLightLogoId" TEXT;

-- CreateTable
CREATE TABLE "logo_assets" (
    "id" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "publicUrl" TEXT NOT NULL,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "logo_assets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "company_settings" ADD CONSTRAINT "company_settings_activeLightLogoId_fkey" FOREIGN KEY ("activeLightLogoId") REFERENCES "logo_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_settings" ADD CONSTRAINT "company_settings_activeDarkLogoId_fkey" FOREIGN KEY ("activeDarkLogoId") REFERENCES "logo_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- DataMigration: back-fill the logo asset library from the legacy single
-- logo column so existing installations keep showing their uploaded logo
-- (as both the light and dark asset) instead of falling back to the
-- wordmark after this deploy.
INSERT INTO "logo_assets" ("id", "storageKey", "publicUrl", "createdAt", "updatedAt")
SELECT gen_random_uuid(), "logoStorageKey", "logoPublicUrl", now(), now()
FROM "company_settings"
WHERE "logoPublicUrl" IS NOT NULL;

UPDATE "company_settings" cs
SET "activeLightLogoId" = la.id,
    "activeDarkLogoId" = la.id
FROM "logo_assets" la
WHERE cs."logoPublicUrl" IS NOT NULL
  AND la."publicUrl" = cs."logoPublicUrl"
  AND cs."activeLightLogoId" IS NULL
  AND cs."activeDarkLogoId" IS NULL;
