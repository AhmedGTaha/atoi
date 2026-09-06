import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { getPortfolioProjectById } from "@/lib/services/portfolioService";
import { PageHeader, Card } from "@/components/admin/ui";
import { PortfolioForm } from "@/components/admin/PortfolioForm";
import { PortfolioImageManager } from "@/components/admin/PortfolioImageManager";
import { updatePortfolioProjectAction, deletePortfolioProjectAction } from "@/app/actions/portfolioActions";

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
      <PageHeader title={project.titleEn} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-bold">Details</h2>
          <PortfolioForm
            project={project}
            action={updatePortfolioProjectAction.bind(null, project.id)}
            submitLabel="Save changes"
          />
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 font-bold">Images</h2>
            <PortfolioImageManager projectId={project.id} images={project.images} />
          </Card>

          <Card>
            <h2 className="mb-2 font-bold">Danger zone</h2>
            <p className="mb-3 text-sm text-muted">
              Deleting a project removes it and all its images permanently.
            </p>
            <form action={deletePortfolioProjectAction.bind(null, project.id)}>
              <button type="submit" className="text-sm font-semibold text-danger hover:text-danger">
                Delete project
              </button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
