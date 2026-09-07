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
  const { locale } = useI18n();
  const ar = locale === "ar";
  return (
    <main id="main-content" className="site-container py-16">
      <Panel className="max-w-xl p-8">
        <p className="section-marker mb-4">
          ATOI / {ar ? "تعذر التحميل" : "Unable to load"}
        </p>
        <h1>{ar ? "تعذر إكمال الطلب" : "We couldn’t complete that request"}</h1>
        <p className="my-6 text-muted">
          {ar
            ? "يرجى إعادة المحاولة. إذا استمرت المشكلة، تواصل مع فريقنا."
            : "Please try again. If the problem continues, contact our team."}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={reset}>{ar ? "إعادة المحاولة" : "Try again"}</Button>
          <Link className="btn btn-secondary" href="/">
            {ar ? "الرئيسية" : "Back home"}
          </Link>
        </div>
      </Panel>
    </main>
  );
}
