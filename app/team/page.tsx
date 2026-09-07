import { requireTeamMember } from "@/lib/auth/guards";
import { getLocale } from "@/lib/i18n/getLocale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { listTeamMemberProjects } from "@/lib/services/teamService";
import { ProjectCard } from "@/components/portal/ProjectCard";

export default async function TeamDashboardPage() {
  const member = await requireTeamMember();
  const [locale, projects] = await Promise.all([
    getLocale(),
    listTeamMemberProjects(member.id),
  ]);
  const dict = getDictionary(locale);

  return (
    <div>
      <h1 className="page-header text-[length:var(--type-title)]">
        {dict.portal.welcome}, {member.name}
      </h1>
      <p className="mt-1 text-muted" dir="ltr">
        {member.email}
      </p>

      <h2 className="mt-8 text-sm font-semibold tracking-wide text-muted">
        Assigned projects
      </h2>
      {projects.length === 0 ? (
        <p className="mt-4 empty-state">
          You are not assigned to any projects yet.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              locale={locale}
              hrefBase="/team/projects"
            />
          ))}
        </div>
      )}
    </div>
  );
}
