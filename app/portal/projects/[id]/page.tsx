import { notFound } from "next/navigation";
import { requireCustomer } from "@/lib/auth/guards";
import { getOwnedCustomerProject } from "@/lib/services/projectService";
import { getLocale } from "@/lib/i18n/getLocale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { statusLabel } from "@/lib/i18n/labels";
import { SupportForm } from "@/components/portal/SupportForm";

export default async function PortalProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const customer = await requireCustomer();
  const { id } = await params;

  // Authorization-critical: getOwnedCustomerProject only returns the
  // project if it belongs to this customer, so an ID swap in the URL
  // cannot leak another customer's project.
  const project = await getOwnedCustomerProject(customer.id, id);
  if (!project) notFound();

  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <div>
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold tracking-tight">{project.name}</h1>
          <span className="rounded-full bg-blue-light/40 px-3 py-1 text-xs font-semibold text-blue-dark">
            {statusLabel(locale, project.status)}
          </span>
        </div>
        <p className="mt-3 text-ink/70">{project.description}</p>

        <div className="mt-5">
          <div className="flex items-center justify-between text-sm text-ink/60">
            <span>{dict.portal.progress}</span>
            <span>{project.progress}%</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-black/10">
            <div className="h-full rounded-full bg-blue-dark" style={{ width: `${project.progress}%` }} />
          </div>
        </div>

        <p className="mt-4 text-sm text-ink/50">
          {dict.portal.lastUpdated}: {project.updatedAt.toLocaleString()}
        </p>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-bold">{dict.portal.updates}</h2>
        <div className="mt-4 space-y-4">
          {project.updates.length === 0 ? (
            <p className="text-sm text-ink/50">{dict.portal.noUpdatesYet}</p>
          ) : (
            project.updates.map((update) => (
              <div key={update.id} className="border-s-2 border-blue-light ps-4">
                <p className="text-xs text-ink/50">{update.createdAt.toLocaleString()}</p>
                <p className="mt-1 whitespace-pre-wrap text-ink/80">{update.body}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-6">
        <SupportForm projectId={project.id} locale={locale} />
      </div>
    </div>
  );
}
