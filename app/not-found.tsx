import Link from "next/link";
import { Panel } from "@/components/ui/Panel";
import { getLocale } from "@/lib/i18n/getLocale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function NotFound() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return (
    <main id="main-content" className="site-container py-16">
      <Panel className="max-w-xl p-8">
        <p className="section-marker mb-4">ATOI / 404</p>
        <h1>{dict.notFound.heading}</h1>
        <p className="my-6 text-muted">{dict.notFound.body}</p>
        <Link href="/" className="btn btn-primary">
          {dict.notFound.backHome}
        </Link>
      </Panel>
    </main>
  );
}
