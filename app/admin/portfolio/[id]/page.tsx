import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { getPortfolioProjectById } from "@/lib/services/portfolioService";
import { PageHeader, Card } from "@/components/admin/ui";
import { PortfolioForm } from "@/components/admin/PortfolioForm";
import { PortfolioImageManager } from "@/components/admin/PortfolioImageManager";
import { ConfirmAction } from "@/components/ui/ConfirmAction";
import {
  updatePortfolioProjectAction,
  deletePortfolioProjectAction,
} from "@/app/actions/portfolioActions";

export default async function EditPortfolioProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const project = await getPortfolioProjectById(id);
  if (!project) notFound();

  return (
    <div>
      <PageHeader
        title={project.titleEn}
        description="Edit public portfolio content and its ordered gallery."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(380px,.9fr)]">
        <Card className="portfolio-details-card">
          <h2 className="mb-5 font-display text-base">Project details</h2>
          <PortfolioForm
            project={project}
            action={updatePortfolioProjectAction.bind(null, project.id)}
            submitLabel="Save changes"
          />
        </Card>

        <div className="space-y-6">
          <Card>
            <PortfolioImageManager
              projectId={project.id}
              images={project.images}
            />
          </Card>

          <Card>
            <h2 className="mb-2 font-semibold">Danger zone</h2>
            <p className="mb-3 text-sm text-muted">
              Deleting a project removes it and all its images permanently.
            </p>
            <ConfirmAction
              action={deletePortfolioProjectAction.bind(null, project.id)}
              label="Delete project"
              description={`This permanently deletes ${project.titleEn} and its images. This cannot be undone.`}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
