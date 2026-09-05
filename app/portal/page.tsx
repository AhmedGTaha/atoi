import { requireCustomer } from "@/lib/auth/guards";
import { getLocale } from "@/lib/i18n/getLocale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { listCustomerProjects } from "@/lib/services/projectService";
import { ProjectCard } from "@/components/portal/ProjectCard";

export default async function PortalDashboardPage() {
  const customer = await requireCustomer();
  const [locale, projects] = await Promise.all([getLocale(), listCustomerProjects(customer.id)]);
  const dict = getDictionary(locale);

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">
        {dict.portal.welcome}
        {customer.name ? `, ${customer.name}` : ""}
      </h1>

      <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-ink/50">{dict.portal.yourProjects}</h2>
      {projects.length === 0 ? (
        <p className="mt-4 rounded-2xl bg-white p-8 text-center text-ink/50">{dict.portal.noProjects}</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
