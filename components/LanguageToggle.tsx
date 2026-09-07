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
      className={clsx("language-toggle", className)}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        disabled={isPending}
        onClick={() => switchTo("en")}
        aria-pressed={locale === "en"}
        className={clsx(
          "px-2.5 transition-colors",
          locale === "en"
            ? "language-active"
            : "text-muted hover:text-foreground",
        )}
      >
        EN
      </button>
      {className?.includes("public-language-toggle") ? (
        <span className="language-separator" aria-hidden="true">
          /
        </span>
      ) : null}
      <button
        type="button"
        disabled={isPending}
        onClick={() => switchTo("ar")}
        aria-pressed={locale === "ar"}
        className={clsx(
          "px-2.5 transition-colors",
          locale === "ar"
            ? "language-active"
            : "text-muted hover:text-foreground",
        )}
      >
        عربي
      </button>
    </div>
  );
}
