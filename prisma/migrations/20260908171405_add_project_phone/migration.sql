-- AlterTable: add per-project phone, backfilling existing rows from the
-- owning customer's phone before enforcing NOT NULL.
ALTER TABLE "projects" ADD COLUMN     "phoneCountry" "GccCountry",
ADD COLUMN     "phoneE164" TEXT;

UPDATE "projects" p
SET "phoneCountry" = c."phoneCountry",
    "phoneE164" = c."phoneE164"
FROM "customers" c
WHERE c.id = p."customerId";

ALTER TABLE "projects" ALTER COLUMN "phoneCountry" SET NOT NULL,
ALTER COLUMN "phoneE164" SET NOT NULL;
