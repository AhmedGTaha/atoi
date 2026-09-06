import Link from "next/link";
import Image from "next/image";
import { requireAdmin } from "@/lib/auth/guards";
import { getAllPortfolioForAdmin } from "@/lib/services/portfolioService";
import { PageHeader, Card, Badge, EmptyState, LinkButtonSmall } from "@/components/admin/ui";
import {
  setPortfolioPublishedAction,
  setPortfolioFeaturedAction,
  movePortfolioProjectAction,
} from "@/app/actions/portfolioActions";

export default async function AdminPortfolioPage() {
  await requireAdmin();
  const projects = await getAllPortfolioForAdmin();

  return (
    <div>
      <PageHeader
        title="Previous Work"
        description="Portfolio projects shown in the public Selected Work section."
        action={<LinkButtonSmall href="/admin/portfolio/new">Add project</LinkButtonSmall>}
      />

      {projects.length === 0 ? (
        <EmptyState>No portfolio projects yet.</EmptyState>
      ) : (
        <div className="space-y-3">
          {projects.map((project, index) => {
            const mainImage = project.images.find((i) => i.isMain) ?? project.images[0];
            return (
              <Card key={project.id} className="flex flex-wrap items-center gap-4">
                <div className="relative h-16 w-24 shrink-0 overflow-hidden bg-cream-dim">
                  {mainImage && (
                    <Image src={mainImage.publicUrl} alt="" fill sizes="96px" className="object-cover" />
                  )}
                </div>

                <div className="min-w-[180px] flex-1">
                  <Link href={`/admin/portfolio/${project.id}`} className="font-semibold hover:underline">
                    {project.titleEn}
                  </Link>
                  <p className="text-sm text-muted">{project.category || "—"}</p>
                </div>

                <Badge label={project.published ? "Published" : "Hidden"} tone={project.published ? "ACTIVE" : "DISABLED"} />
                {project.featured && <Badge label="Featured" tone="ACTIVE" />}

                <div className="flex items-center gap-1">
                  <form action={movePortfolioProjectAction.bind(null, project.id, "up")}>
                    <button type="submit" aria-label={`Move ${project.titleEn} up`} disabled={index === 0} className="border border-black/10 px-2 py-1 text-xs disabled:opacity-30">
                      ↑
                    </button>
                  </form>
                  <form action={movePortfolioProjectAction.bind(null, project.id, "down")}>
                    <button
                      type="submit"
                      aria-label={`Move ${project.titleEn} down`} disabled={index === projects.length - 1}
                      className="border border-black/10 px-2 py-1 text-xs disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </form>
                </div>

                <form action={setPortfolioFeaturedAction.bind(null, project.id, !project.featured)}>
                  <button type="submit" className="text-sm font-semibold text-ink/70 hover:text-ink">
                    {project.featured ? "Unfeature" : "Feature"}
                  </button>
                </form>

                <form action={setPortfolioPublishedAction.bind(null, project.id, !project.published)}>
                  <button type="submit" className="text-sm font-semibold text-ink/70 hover:text-ink">
                    {project.published ? "Hide" : "Publish"}
                  </button>
                </form>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
