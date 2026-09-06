"use client";

import { useTransition } from "react";
import { setLocaleAction } from "@/lib/i18n/actions";
import type { Locale } from "@/lib/i18n/locale";
import clsx from "clsx";

export function LanguageToggle({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale || isPending) return;
    startTransition(async () => {
      await setLocaleAction(next);
    });
  }

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-1  border border-rule px-1 py-1 text-sm font-medium",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        disabled={isPending}
        onClick={() => switchTo("en")}
        aria-pressed={locale === "en"}
        className={clsx(
          " px-2.5 py-1 transition-colors",
          locale === "en"
            ? "bg-blue-dark text-cream"
            : "text-muted hover:text-ink",
        )}
      >
        EN
      </button>
      <span className="text-black/30" aria-hidden="true">
        |
      </span>
      <button
        type="button"
        disabled={isPending}
        onClick={() => switchTo("ar")}
        aria-pressed={locale === "ar"}
        className={clsx(
          " px-2.5 py-1 transition-colors",
          locale === "ar"
            ? "bg-blue-dark text-cream"
            : "text-muted hover:text-ink",
        )}
      >
        عربي
      </button>
    </div>
  );
}
