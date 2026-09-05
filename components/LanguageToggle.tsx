"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocaleAction } from "@/lib/i18n/actions";
import type { Locale } from "@/lib/i18n/locale";
import clsx from "clsx";

export function LanguageToggle({ locale, className }: { locale: Locale; className?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale || isPending) return;
    startTransition(async () => {
      await setLocaleAction(next);
      router.refresh();
    });
  }

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border border-black/15 px-1 py-1 text-sm font-medium",
        className
      )}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => switchTo("en")}
        aria-pressed={locale === "en"}
        className={clsx(
          "rounded-full px-2.5 py-1 transition-colors",
          locale === "en" ? "bg-black text-white" : "text-black/70 hover:text-black"
        )}
      >
        EN
      </button>
      <span className="text-black/30" aria-hidden="true">
        |
      </span>
      <button
        type="button"
        onClick={() => switchTo("ar")}
        aria-pressed={locale === "ar"}
        className={clsx(
          "rounded-full px-2.5 py-1 transition-colors",
          locale === "ar" ? "bg-black text-white" : "text-black/70 hover:text-black"
        )}
      >
        عربي
      </button>
    </div>
  );
}
