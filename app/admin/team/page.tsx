import { requireAdmin } from "@/lib/auth/guards";
import { listTeamMembers } from "@/lib/services/teamService";
import { PageHeader, Card, Badge } from "@/components/admin/ui";
import { AddTeamMemberForm } from "@/components/admin/AddTeamMemberForm";
import { setTeamMemberActiveAction } from "@/app/actions/teamActions";

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
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-rule text-muted">
              <th className="px-5 py-3 text-start font-medium">Name</th>
              <th className="px-5 py-3 text-start font-medium">Email</th>
              <th className="px-5 py-3 text-start font-medium">Projects</th>
              <th className="px-5 py-3 text-start font-medium">Status</th>
              <th className="px-5 py-3 text-start font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr
                key={m.id}
                className="border-b border-rule-soft last:border-0"
              >
                <td className="px-5 py-3 font-semibold">{m.name}</td>
                <td className="px-5 py-3 text-ink/70">{m.email}</td>
                <td className="px-5 py-3 text-ink/70">{m._count.projects}</td>
                <td className="px-5 py-3">
                  <Badge
                    label={m.isActive ? "Active" : "Inactive"}
                    tone={m.isActive ? "ACTIVE" : "DISABLED"}
                  />
                </td>
                <td className="px-5 py-3 text-end">
                  <form
                    action={setTeamMemberActiveAction.bind(
                      null,
                      m.id,
                      !m.isActive,
                    )}
                  >
                    <button
                      type="submit"
                      className="text-sm font-semibold text-ink/70 hover:text-ink"
                    >
                      {m.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
