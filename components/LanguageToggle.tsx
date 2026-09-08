"use client";

import { useTransition } from "react";
import { setLocaleAction } from "@/lib/i18n/actions";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import clsx from "clsx";

export function LanguageToggle({
  locale,
  className,
  onLocaleChange,
}: {
  locale: Locale;
  className?: string;
  onLocaleChange?: (locale: Locale) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const dict = getDictionary(locale);

  function switchTo(next: Locale) {
    if (next === locale || isPending) return;
    if (onLocaleChange) {
      onLocaleChange(next);
      return;
    }
    startTransition(async () => {
      await setLocaleAction(next);
    });
  }

  return (
    <div
      className={clsx("language-toggle", className)}
      role="group"
      aria-label={dict.languageToggle.groupLabel}
    >
      <button
        type="button"
        disabled={isPending}
        onClick={() => switchTo("en")}
        aria-pressed={locale === "en"}
        aria-label={dict.languageToggle.englishAccessible}
        className={clsx(
          "px-2.5 transition-colors",
          locale === "en"
            ? "language-active"
            : "text-muted hover:text-foreground",
        )}
      >
        {dict.languageToggle.englishVisible}
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
        aria-label={dict.languageToggle.arabicAccessible}
        className={clsx(
          "px-2.5 transition-colors",
          locale === "ar"
            ? "language-active"
            : "text-muted hover:text-foreground",
        )}
      >
        {dict.languageToggle.arabicVisible}
      </button>
    </div>
  );
}
