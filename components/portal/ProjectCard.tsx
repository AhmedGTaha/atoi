import Link from "next/link";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { statusLabel } from "@/lib/i18n/labels";
import type { Project } from "@prisma/client";

export function ProjectCard({ project, locale }: { project: Project; locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <Link
      href={`/portal/projects/${project.id}`}
      className="block rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold">{project.name}</h3>
        <span className="rounded-full bg-blue-light/40 px-3 py-1 text-xs font-semibold text-blue-dark">
          {statusLabel(locale, project.status)}
        </span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm text-ink/60">
          <span>{dict.portal.progress}</span>
          <span>{project.progress}%</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-black/10">
          <div className="h-full rounded-full bg-blue-dark" style={{ width: `${project.progress}%` }} />
        </div>
      </div>

      <p className="mt-4 text-sm text-ink/50">
        {dict.portal.lastUpdated}: {project.updatedAt.toLocaleDateString()}
      </p>
    </Link>
  );
}
