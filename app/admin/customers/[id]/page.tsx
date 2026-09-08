import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { getCustomerForAdmin } from "@/lib/services/customerService";
import { listActiveTeamMembers } from "@/lib/services/teamService";
import { PageHeader, Card, Badge } from "@/components/admin/ui";
import { ResendInviteButton } from "@/components/admin/ResendInviteButton";
import { CustomerProjectsPanel } from "@/components/admin/CustomerProjectsPanel";

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const customer = await getCustomerForAdmin(id);
  if (!customer) notFound();

  const teamMembers = await listActiveTeamMembers();

  return (
    <div>
      <PageHeader
        title={customer.businessName || customer.name || customer.email}
        description={customer.email}
        action={
          <Badge label={customer.accountStatus} tone={customer.accountStatus} />
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <h2 className="font-semibold">Contact information</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Name" value={customer.name ?? "—"} />
            <Row label="Business" value={customer.businessName ?? "—"} />
            <Row label="Email" value={customer.email} />
            <Row label="Phone" value={customer.phoneE164} />
            <Row
              label="Preferred language"
              value={customer.preferredLocale === "ar" ? "Arabic" : "English"}
            />
          </dl>

          {customer.accountStatus === "INVITED" && (
            <div className="mt-5">
              <ResendInviteButton customerId={customer.id} />
            </div>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <CustomerProjectsPanel
            customerId={customer.id}
            projects={customer.projects.map((p) => ({
              id: p.id,
              name: p.name,
              progress: p.progress,
              status: p.status,
              phoneE164: p.phoneE164,
            }))}
            teamMembers={teamMembers}
          />
        </Card>
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
