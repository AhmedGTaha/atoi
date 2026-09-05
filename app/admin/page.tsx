import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { dashboardCounts } from "@/lib/services/requestService";
import { PageHeader, Card, Badge } from "@/components/admin/ui";
import { statusLabel } from "@/lib/i18n/labels";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const { counts, recentRequests, activeProjectsList, recentSupport } = await dashboardCounts();

  return (
    <div>
      <PageHeader title="Dashboard" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="New Requests" value={counts.newRequests} />
        <StatCard label="Active Projects" value={counts.activeProjects} />
        <StatCard label="Support Requests" value={counts.supportRequests} />
        <StatCard label="Completed Projects" value={counts.completedProjects} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <h2 className="font-bold">Recent Requests</h2>
          <div className="mt-4 space-y-3">
            {recentRequests.length === 0 && <p className="text-sm text-ink/50">No new requests.</p>}
            {recentRequests.map((r) => (
              <Link
                key={r.id}
                href={`/admin/requests/${r.id}`}
                className="block rounded-xl border border-black/5 p-3 hover:border-black/15"
              >
                <p className="font-semibold">{r.businessName || r.name || r.email}</p>
                <p className="mt-0.5 line-clamp-1 text-sm text-ink/60">{r.description}</p>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-bold">Active Projects</h2>
          <div className="mt-4 space-y-3">
            {activeProjectsList.length === 0 && <p className="text-sm text-ink/50">No active projects.</p>}
            {activeProjectsList.map((p) => (
              <Link
                key={p.id}
                href={`/admin/projects/${p.id}`}
                className="block rounded-xl border border-black/5 p-3 hover:border-black/15"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{p.name}</p>
                  <Badge label={statusLabel("en", p.status)} tone={p.status} />
                </div>
                <p className="mt-0.5 text-sm text-ink/60">{p.customer.businessName || p.customer.name || p.customer.email}</p>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-bold">Recent Support Requests</h2>
          <div className="mt-4 space-y-3">
            {recentSupport.length === 0 && <p className="text-sm text-ink/50">No support requests yet.</p>}
            {recentSupport.map((s) => (
              <Link
                key={s.id}
                href={`/admin/projects/${s.projectId}`}
                className="block rounded-xl border border-black/5 p-3 hover:border-black/15"
              >
                <p className="font-semibold">{s.project.name}</p>
                <p className="mt-0.5 line-clamp-1 text-sm text-ink/60">{s.message}</p>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <p className="text-sm text-ink/50">{label}</p>
      <p className="mt-2 text-3xl font-extrabold">{value}</p>
    </Card>
  );
}
