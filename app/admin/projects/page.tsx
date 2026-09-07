import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { listProjectsForAdmin } from "@/lib/services/projectService";
import { PageHeader, Card, Badge, EmptyState } from "@/components/admin/ui";
import { statusLabel } from "@/lib/i18n/labels";
import {
  PROJECT_STATUSES,
  isValidProjectStatus,
} from "@/lib/validation/shared";

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  await requireAdmin();
  const { q, status } = await searchParams;
  const validStatus =
    status && isValidProjectStatus(status) ? status : undefined;
  const projects = await listProjectsForAdmin({
    search: q,
    status: validStatus,
  });

  return (
    <div>
      <PageHeader
        title="Projects"
        description="All active and completed customer projects."
      />

      <form className="filter-bar">
        <input
          type="search"
          aria-label="Search projects"
          name="q"
          defaultValue={q}
          placeholder="Search by project, customer, email…"
          className="min-w-0 flex-1 border border-rule bg-canvas px-3.5 py-2.5"
        />
        <select
          aria-label="Project status"
          name="status"
          defaultValue={validStatus ?? ""}
          className="border border-rule bg-canvas px-3.5 py-2.5"
        >
          <option value="">All statuses</option>
          {PROJECT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabel("en", s)}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">
          Filter
        </button>
      </form>

      {projects.length === 0 ? (
        <EmptyState>No projects match.</EmptyState>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-rule text-muted">
                <th className="px-5 py-3 text-start font-medium">Project</th>
                <th className="px-5 py-3 text-start font-medium">Customer</th>
                <th className="px-5 py-3 text-start font-medium">Status</th>
                <th className="px-5 py-3 text-start font-medium">Progress</th>
                <th className="px-5 py-3 text-start font-medium">Members</th>
                <th className="px-5 py-3 text-start font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-rule-soft last:border-0 hover:bg-surface"
                >
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/projects/${p.id}`}
                      className="font-semibold hover:underline"
                    >
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-foreground/70">
                    {p.customer.businessName ||
                      p.customer.name ||
                      p.customer.email}
                  </td>
                  <td className="px-5 py-3">
                    <Badge
                      label={statusLabel("en", p.status)}
                      tone={p.status}
                    />
                  </td>
                  <td className="px-5 py-3 text-foreground/70">
                    {p.progress}%
                  </td>
                  <td className="px-5 py-3 text-foreground/70">
                    {p.members.map((m) => m.teamMember.name).join(", ") || "—"}
                  </td>
                  <td className="px-5 py-3 text-muted">
                    {p.updatedAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
