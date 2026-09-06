import { requireAdmin } from "@/lib/auth/guards";
import { PageHeader, Card } from "@/components/admin/ui";
import { PortfolioForm } from "@/components/admin/PortfolioForm";
import { createPortfolioProjectAction } from "@/app/actions/portfolioActions";

export default async function NewPortfolioProjectPage() {
  await requireAdmin();

  return (
    <div>
      <PageHeader title="Add portfolio project" />
      <Card>
        <PortfolioForm
          action={createPortfolioProjectAction}
          submitLabel="Create project"
        />
      </Card>
    </div>
  );
}
