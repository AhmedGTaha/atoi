import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { getProjectForAdmin } from "@/lib/services/projectService";
import { listActiveTeamMembers } from "@/lib/services/teamService";
import { PageHeader, Card, Badge } from "@/components/admin/ui";
import { ProjectEditForm } from "@/components/admin/ProjectEditForm";
import { PublishUpdateForm } from "@/components/admin/PublishUpdateForm";
import { statusLabel } from "@/lib/i18n/labels";

export default async function AdminProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const project = await getProjectForAdmin(id);
  if (!project) notFound();

  const activeTeamMembers = await listActiveTeamMembers();
  const currentMemberIds = project.members.map((m) => m.teamMemberId);

  // Include any already-assigned member even if since deactivated, so
  // saving this form doesn't silently drop their historical assignment —
  // only *new* assignments are restricted to active members.
  const alreadyAssignedInactive = project.members
    .filter((m) => !m.teamMember.isActive)
    .map((m) => m.teamMember);
  const teamMembers = [...activeTeamMembers, ...alreadyAssignedInactive];

  return (
    <div>
      <PageHeader
        title={project.name}
        description={`Customer: ${project.customer.businessName || project.customer.name || project.customer.email}`}
        action={
          <Badge
            label={statusLabel("en", project.status)}
            tone={project.status}
          />
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <h2 className="font-semibold">Project information</h2>
            <div className="mt-4">
              <ProjectEditForm
                project={project}
                teamMembers={teamMembers}
                currentMemberIds={currentMemberIds}
              />
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold">Send project update</h2>
            <div className="mt-4">
              <PublishUpdateForm projectId={project.id} />
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold">Update history</h2>
            <div className="mt-4 space-y-3">
              {project.updates.length === 0 && (
                <p className="text-sm text-muted">No updates yet.</p>
              )}
              {project.updates.map((update) => (
                <div key={update.id} className="activity-item">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                    <span>{update.createdAt.toLocaleString()}</span>
                    <span>
                      {statusLabel("en", update.statusSnapshot)} ·{" "}
                      {update.progressSnapshot}% ·{" "}
                      {update.emailDeliveryState === "SENT"
                        ? "Emailed"
                        : "Email failed"}
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm">
                    {update.body}
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    by {update.author?.name ?? update.authorTeamMember?.name}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="font-semibold">Support requests</h2>
            <div className="mt-4 space-y-3">
              {project.supportRequests.length === 0 && (
                <p className="text-sm text-muted">
                  No support requests for this project.
                </p>
              )}
              {project.supportRequests.map((s) => (
                <div key={s.id} className="activity-item">
                  <p className="text-xs text-muted">
                    {s.createdAt.toLocaleString()}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm">
                    {s.message}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="font-semibold">Customer contact</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Row label="Name" value={project.customer.name ?? "—"} />
              <Row
                label="Business"
                value={project.customer.businessName ?? "—"}
              />
              <Row label="Email" value={project.customer.email} />
              <Row label="Customer phone" value={project.customer.phoneE164} />
              <Row label="Project phone" value={project.phoneE164} />
              <Row
                label="Account status"
                value={project.customer.accountStatus}
              />
            </dl>
          </Card>
          <Card>
            <h2 className="font-semibold">Timeline</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Row
                label="Created"
                value={project.createdAt.toLocaleDateString()}
              />
              <Row
                label="Last updated"
                value={project.updatedAt.toLocaleDateString()}
              />
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-rule-soft pb-2">
      <dt className="text-muted">{label}</dt>
      <dd className="text-end font-medium">{value}</dd>
    </div>
  );
}
