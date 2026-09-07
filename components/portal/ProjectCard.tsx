import Link from "next/link";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { statusLabel } from "@/lib/i18n/labels";
import type { Project } from "@prisma/client";

export function ProjectCard({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const dict = getDictionary(locale);

  return (
    <Link
      href={`/portal/projects/${project.id}`}
      className="block panel p-6 transition-colors hover:border-accent"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">{project.name}</h3>
        <span className="status">{statusLabel(locale, project.status)}</span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm text-muted">
          <span>{dict.portal.progress}</span>
          <span>{project.progress}%</span>
        </div>
        <div
          role="progressbar"
          aria-label={dict.portal.progress}
          aria-valuenow={project.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-1.5 h-1 w-full overflow-hidden bg-surface"
        >
          <div
            className="h-full bg-accent"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <p className="mt-4 text-sm text-muted">
        {dict.portal.lastUpdated}: {project.updatedAt.toLocaleDateString()}
      </p>
    </Link>
  );
}
