-- AlterTable
ALTER TABLE "company_settings" ADD COLUMN     "activeAppIconId" TEXT;

-- AddForeignKey
ALTER TABLE "company_settings" ADD CONSTRAINT "company_settings_activeAppIconId_fkey" FOREIGN KEY ("activeAppIconId") REFERENCES "logo_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
