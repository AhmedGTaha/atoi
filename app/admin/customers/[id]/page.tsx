import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { getCustomerForAdmin } from "@/lib/services/customerService";
import { PageHeader, Card, Badge } from "@/components/admin/ui";
import { ResendInviteButton } from "@/components/admin/ResendInviteButton";
import { statusLabel } from "@/lib/i18n/labels";

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const customer = await getCustomerForAdmin(id);
  if (!customer) notFound();

  return (
    <div>
      <PageHeader
        title={customer.businessName || customer.name || customer.email}
        description={customer.email}
        action={<Badge label={customer.accountStatus} tone={customer.accountStatus} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <h2 className="font-bold">Contact information</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Name" value={customer.name ?? "—"} />
            <Row label="Business" value={customer.businessName ?? "—"} />
            <Row label="Email" value={customer.email} />
            <Row label="Phone" value={customer.phoneE164} />
            <Row label="Preferred language" value={customer.preferredLocale === "ar" ? "Arabic" : "English"} />
          </dl>

          {customer.accountStatus === "INVITED" && (
            <div className="mt-5">
              <ResendInviteButton customerId={customer.id} />
            </div>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="font-bold">Projects</h2>
          <div className="mt-4 space-y-3">
            {customer.projects.length === 0 && <p className="text-sm text-ink/50">No projects yet.</p>}
            {customer.projects.map((p) => (
              <Link
                key={p.id}
                href={`/admin/projects/${p.id}`}
                className="flex items-center justify-between rounded-xl border border-black/5 p-4 hover:border-black/15"
              >
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm text-ink/50">{p.progress}% complete</p>
                </div>
                <Badge label={statusLabel("en", p.status)} tone={p.status} />
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-black/5 pb-2">
      <dt className="text-ink/50">{label}</dt>
      <dd className="text-end font-medium">{value}</dd>
    </div>
  );
}
