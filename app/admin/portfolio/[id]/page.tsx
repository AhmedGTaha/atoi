import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { getPortfolioProjectById } from "@/lib/services/portfolioService";
import { PageHeader, Card } from "@/components/admin/ui";
import { PortfolioForm } from "@/components/admin/PortfolioForm";
import { ConfirmAction } from "@/components/ui/ConfirmAction";
import {
  updatePortfolioProjectAction,
  deletePortfolioProjectAction,
} from "@/app/actions/portfolioActions";

export default async function EditPortfolioProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    imageUpload?: string;
    uploaded?: string;
    total?: string;
  }>;
}) {
  await requireAdmin();
  const [{ id }, uploadStatus] = await Promise.all([params, searchParams]);
  const project = await getPortfolioProjectById(id);
  if (!project) notFound();

  const uploaded = Number(uploadStatus.uploaded);
  const total = Number(uploadStatus.total);
  const hasImageUploadWarning = uploadStatus.imageUpload === "failed";
  const hasUploadCounts =
    Number.isInteger(uploaded) &&
    Number.isInteger(total) &&
    uploaded >= 0 &&
    total >= uploaded;

  return (
    <div>
      <PageHeader
        title={project.titleEn}
        description="Edit public portfolio content and its ordered gallery."
      />

      {hasImageUploadWarning && (
        <p role="alert" className="mb-6 text-sm text-danger">
          Project created, but image processing did not finish.
          {hasUploadCounts
            ? ` ${uploaded} of ${total} selected images were uploaded. Add any remaining images below before publishing.`
            : " Check the gallery below and add any missing images before publishing."}
        </p>
      )}

      <PortfolioForm
        mode="edit"
        project={project}
        action={updatePortfolioProjectAction.bind(null, project.id)}
        submitLabel="Save changes"
        rightPanelExtra={
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
        }
      />
    </div>
  );
}
