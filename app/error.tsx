"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { useI18n } from "@/lib/i18n/I18nProvider";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { dict } = useI18n();
  return (
    <main id="main-content" className="site-container py-16">
      <Panel className="max-w-xl p-8">
        <p className="section-marker mb-4">ATOI / {dict.errorPage.badgeLabel}</p>
        <h1>{dict.errorPage.heading}</h1>
        <p className="my-6 text-muted">{dict.errorPage.body}</p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={reset}>{dict.errorPage.retry}</Button>
          <Link className="btn btn-secondary" href="/">
            {dict.errorPage.backHome}
          </Link>
        </div>
      </Panel>
    </main>
  );
}
