-- DropForeignKey
ALTER TABLE "project_updates" DROP CONSTRAINT "project_updates_authorAdminId_fkey";

-- AlterTable
ALTER TABLE "project_updates" ADD COLUMN     "authorTeamMemberId" TEXT,
ALTER COLUMN "authorAdminId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "project_updates" ADD CONSTRAINT "project_updates_authorAdminId_fkey" FOREIGN KEY ("authorAdminId") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_updates" ADD CONSTRAINT "project_updates_authorTeamMemberId_fkey" FOREIGN KEY ("authorTeamMemberId") REFERENCES "team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Exactly one author (admin or team member) must be set for every update.
ALTER TABLE "project_updates" ADD CONSTRAINT "project_updates_author_xor" CHECK (
  ("authorAdminId" IS NOT NULL) <> ("authorTeamMemberId" IS NOT NULL)
);
