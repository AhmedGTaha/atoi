import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { listCustomersForAdmin } from "@/lib/services/customerService";
import { PageHeader, Card, Badge, EmptyState } from "@/components/admin/ui";

export default async function AdminCustomersPage() {
  await requireAdmin();
  const customers = await listCustomersForAdmin();

  return (
    <div>
      <PageHeader title="Customers" description="Customer accounts created from project requests." />

      {customers.length === 0 ? (
        <EmptyState>No customers yet.</EmptyState>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-black/10 text-ink/50">
                <th className="px-5 py-3 text-start font-medium">Customer</th>
                <th className="px-5 py-3 text-start font-medium">Email</th>
                <th className="px-5 py-3 text-start font-medium">Phone</th>
                <th className="px-5 py-3 text-start font-medium">Projects</th>
                <th className="px-5 py-3 text-start font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.02]">
                  <td className="px-5 py-3">
                    <Link href={`/admin/customers/${c.id}`} className="font-semibold hover:underline">
                      {c.businessName || c.name || c.email}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-ink/70">{c.email}</td>
                  <td className="px-5 py-3 text-ink/70">{c.phoneE164}</td>
                  <td className="px-5 py-3 text-ink/70">{c._count.projects}</td>
                  <td className="px-5 py-3">
                    <Badge label={c.accountStatus} tone={c.accountStatus} />
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
