import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { getProjectRequest } from "@/lib/services/requestService";
import { listActiveTeamMembers } from "@/lib/services/teamService";
import { PageHeader, Card, Badge } from "@/components/admin/ui";
import { ConvertRequestForm } from "@/components/admin/ConvertRequestForm";
import { businessTypeLabel } from "@/lib/i18n/labels";
import type { BusinessType } from "@/lib/validation/shared";
import { archiveRequestAction } from "@/app/actions/requestActions";

export default async function AdminRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const request = await getProjectRequest(id);
  if (!request) notFound();

  const teamMembers = await listActiveTeamMembers();

  return (
    <div>
      <PageHeader
        title={request.businessName || request.name || request.email}
        description={`Submitted ${request.createdAt.toLocaleString()}`}
        action={<Badge label={request.state} tone={request.state} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-bold">Submitted details</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Name" value={request.name ?? "—"} />
            <Row label="Business name" value={request.businessName ?? "—"} />
            <Row
              label="Business type"
              value={request.businessType ? businessTypeLabel("en", request.businessType as BusinessType) : "—"}
            />
            <Row label="Email" value={request.email} />
            <Row label="Phone" value={request.phoneE164} />
            <Row label="Preferred language" value={request.preferredLocale === "ar" ? "Arabic" : "English"} />
            <Row label="Confirmation email" value={request.confirmationEmailState} />
            <Row label="Internal notification email" value={request.internalEmailState} />
          </dl>
          <div className="mt-4">
            <p className="text-sm font-semibold">Description</p>
            <p className="mt-1 whitespace-pre-wrap text-ink/70">{request.description}</p>
          </div>

          {request.state === "NEW" && (
            <form action={archiveRequestAction.bind(null, request.id)} className="mt-5">
              <button type="submit" className="text-sm font-semibold text-ink/60 hover:text-ink">
                Archive request
              </button>
            </form>
          )}
        </Card>

        <Card>
          {request.state === "CONVERTED" ? (
            <div>
              <h2 className="font-bold">Already converted</h2>
              <p className="mt-2 text-ink/70">This request has already been converted.</p>
              {request.convertedProjectId && (
                <Link
                  href={`/admin/projects/${request.convertedProjectId}`}
                  className="mt-3 inline-block font-semibold text-blue-dark hover:underline"
                >
                  View project →
                </Link>
              )}
            </div>
          ) : (
            <div>
              <h2 className="font-bold">Create Customer & Project</h2>
              <p className="mt-1 text-sm text-ink/60">
                Review and edit the details below before creating the account.
              </p>
              <div className="mt-4">
                <ConvertRequestForm request={request} teamMembers={teamMembers} />
              </div>
            </div>
          )}
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
