import { requireAdmin } from "@/lib/auth/guards";
import { PageHeader } from "@/components/admin/ui";
import { PortfolioForm } from "@/components/admin/PortfolioForm";
import { createPortfolioProjectAction } from "@/app/actions/portfolioActions";

export default async function NewPortfolioProjectPage() {
  await requireAdmin();

  return (
    <div>
      <PageHeader
        title="Add portfolio project"
        description="Create a new public portfolio project."
      />
      <PortfolioForm
        mode="create"
        action={createPortfolioProjectAction}
        submitLabel="Create project"
      />
    </div>
  );
}
