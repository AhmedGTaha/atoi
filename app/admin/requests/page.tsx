import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { listProjectRequests } from "@/lib/services/requestService";
import { PageHeader, Card, Badge, EmptyState } from "@/components/admin/ui";
import { businessTypeLabel } from "@/lib/i18n/labels";
import type { BusinessType } from "@/lib/validation/shared";

export default async function AdminRequestsPage() {
  await requireAdmin();
  const requests = await listProjectRequests();

  return (
    <div>
      <PageHeader title="Requests" description="Project requests submitted from the public website." />

      {requests.length === 0 ? (
        <EmptyState>No project requests yet.</EmptyState>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-black/10 text-start text-ink/50">
                <th className="px-5 py-3 text-start font-medium">Contact</th>
                <th className="px-5 py-3 text-start font-medium">Business type</th>
                <th className="px-5 py-3 text-start font-medium">Description</th>
                <th className="px-5 py-3 text-start font-medium">Submitted</th>
                <th className="px-5 py-3 text-start font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.02]">
                  <td className="px-5 py-3">
                    <Link href={`/admin/requests/${r.id}`} className="font-semibold hover:underline">
                      {r.businessName || r.name || r.email}
                    </Link>
                    <p className="text-xs text-ink/50">{r.email}</p>
                  </td>
                  <td className="px-5 py-3 text-ink/70">
                    {r.businessType ? businessTypeLabel("en", r.businessType as BusinessType) : "—"}
                  </td>
                  <td className="max-w-xs px-5 py-3 text-ink/70">
                    <span className="line-clamp-1">{r.description}</span>
                  </td>
                  <td className="px-5 py-3 text-ink/60">{r.createdAt.toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <Badge label={r.state} tone={r.state} />
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
