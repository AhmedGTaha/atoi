-- AlterEnum
ALTER TYPE "SecureTokenType" ADD VALUE 'TEAM_MEMBER_INVITE';

-- AlterTable
ALTER TABLE "secure_tokens" ADD COLUMN     "teamMemberId" TEXT,
ALTER COLUMN "customerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "team_members" ADD COLUMN     "accountStatus" "AccountStatus" NOT NULL DEFAULT 'INVITED',
ADD COLUMN     "passwordHash" TEXT;

-- AddForeignKey
ALTER TABLE "secure_tokens" ADD CONSTRAINT "secure_tokens_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
