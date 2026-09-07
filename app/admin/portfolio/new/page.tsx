import { requireAdmin } from "@/lib/auth/guards";
import { PageHeader, Card } from "@/components/admin/ui";
import { PortfolioForm } from "@/components/admin/PortfolioForm";
import { createPortfolioProjectAction } from "@/app/actions/portfolioActions";

export default async function NewPortfolioProjectPage() {
  await requireAdmin();

  return (
    <div>
      <PageHeader
        title="Add portfolio project"
        description="Showcase your work on the public website."
      />
      <Card className="portfolio-details-card">
        <h2 className="mb-5 font-display text-base">Project details</h2>
        <PortfolioForm
          action={createPortfolioProjectAction}
          submitLabel="Create project"
        />
        <p className="mt-5 border-t border-rule pt-4 text-xs text-muted">
          Save the project first to add, order, and preview up to 10 project
          images.
        </p>
      </Card>
    </div>
  );
}
