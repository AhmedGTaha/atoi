import { requireAdmin } from "@/lib/auth/guards";
import { listProjectRequests } from "@/lib/services/requestService";
import { PageHeader } from "@/components/admin/ui";
import { RequestsTable } from "@/components/admin/RequestsTable";
import { businessTypeLabel } from "@/lib/i18n/labels";
import type { BusinessType } from "@/lib/validation/shared";

export default async function AdminRequestsPage() {
  await requireAdmin();
  const requests = await listProjectRequests();

  return (
    <div>
      <PageHeader
        title="Requests"
        description="Project requests submitted from the public website."
      />

      <RequestsTable
        requests={requests.map((request) => ({
          id: request.id,
          contact: request.businessName || request.name || request.email,
          email: request.email,
          businessType: request.businessType
            ? businessTypeLabel("en", request.businessType as BusinessType)
            : "—",
          description: request.description,
          submitted: request.createdAt.toLocaleDateString(),
          state: request.state,
        }))}
      />
    </div>
  );
}
