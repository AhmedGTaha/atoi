import { notFound } from "next/navigation";
import { requireTeamMember } from "@/lib/auth/guards";
import { getAssignedTeamMemberProject } from "@/lib/services/teamService";
import { getLocale } from "@/lib/i18n/getLocale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { statusLabel } from "@/lib/i18n/labels";

export default async function TeamProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const member = await requireTeamMember();
  const { id } = await params;

  // Authorization-critical: getAssignedTeamMemberProject only returns the
  // project if this team member is actually assigned to it, so an ID swap
  // in the URL cannot leak a project they have no business seeing.
  const project = await getAssignedTeamMemberProject(member.id, id);
  if (!project) notFound();

  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <div>
      <div className="panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-normal">{project.name}</h1>
          <span className="status">{statusLabel(locale, project.status)}</span>
        </div>
        <p className="mt-3 text-foreground/70">{project.description}</p>

        <div className="mt-5">
          <div className="flex items-center justify-between text-sm text-muted">
            <span>{dict.portal.progress}</span>
            <span>{project.progress}%</span>
          </div>
          <div
            role="progressbar"
            aria-label={dict.portal.progress}
            aria-valuenow={project.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            className="mt-1.5 h-1 w-full overflow-hidden bg-surface"
          >
            <div className="h-full bg-accent" style={{ width: `${project.progress}%` }} />
          </div>
        </div>

        <p className="mt-4 text-sm text-muted">
          {dict.portal.lastUpdated}: {project.updatedAt.toLocaleString()}
        </p>
      </div>

      <div className="mt-6 panel p-6">
        <h2 className="font-semibold">Customer</h2>
        <p className="mt-2 text-foreground/80">
          {project.customer.businessName || project.customer.name || project.customer.email}
        </p>
        <p className="mt-1 text-sm text-muted" dir="ltr">
          {project.customer.email}
        </p>
      </div>

      <div className="mt-6 panel p-6">
        <h2 className="font-semibold">{dict.portal.updates}</h2>
        <div className="mt-4 space-y-4">
          {project.updates.length === 0 ? (
            <p className="text-sm text-muted">{dict.portal.noUpdatesYet}</p>
          ) : (
            project.updates.map((update) => (
              <div key={update.id} className="activity-item">
                <p className="text-xs text-muted">{update.createdAt.toLocaleString()}</p>
                <p className="mt-1 whitespace-pre-wrap text-foreground/80">{update.body}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
