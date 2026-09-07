import { requireAdmin } from "@/lib/auth/guards";
import { listTeamMembers } from "@/lib/services/teamService";
import { PageHeader, Card } from "@/components/admin/ui";
import { AddTeamMemberForm } from "@/components/admin/AddTeamMemberForm";
import { TeamMembersTable } from "@/components/admin/TeamMembersTable";

export default async function AdminTeamPage() {
  await requireAdmin();
  const members = await listTeamMembers();

  return (
    <div>
      <PageHeader
        title="Team"
        description="Internal team members who can be assigned to projects."
      />

      <Card className="mb-6">
        <h2 className="font-semibold">Add team member</h2>
        <div className="mt-4">
          <AddTeamMemberForm />
        </div>
      </Card>

      <Card className="overflow-x-auto p-0">
        <TeamMembersTable members={members} />
      </Card>
    </div>
  );
}
