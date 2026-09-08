"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Locale } from "@/lib/i18n/locale";

/** Intrinsic aspect ratio (width / height) of the wordmark PNGs in public/branding. */
const WORDMARK_ASPECT: Record<Locale, number> = {
  en: 3244 / 1344,
  ar: 2924 / 1954,
};
const LOGO_HEIGHT = 32;

/**
 * The public site's colour theme is resolved client-side only (see the
 * inline script in app/layout.tsx that sets document.documentElement's
 * data-theme before hydration to avoid a flash). To keep server and first
 * client render identical — and so avoid a hydration mismatch — this
 * component always starts in "light" and only switches to the real theme,
 * and stays in sync with later toggles, from an effect that runs after
 * mount.
 */
function useResolvedTheme(): "light" | "dark" {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    const read = () =>
      setTheme(root.dataset.theme === "dark" ? "dark" : "light");
    read();

    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return theme;
}

export function Logo({
  name,
  locale = "en",
  logoUrl,
  lightLogoUrl,
  darkLogoUrl,
}: {
  name: string;
  /** Selects the default ATOI wordmark when no admin-configured logo is set. */
  locale?: Locale;
  /** Single-mode override; used by contexts (e.g. the footer) that don't need theme-aware swapping. */
  logoUrl?: string | null;
  lightLogoUrl?: string | null;
  darkLogoUrl?: string | null;
}) {
  const theme = useResolvedTheme();
  const themedUrl = theme === "dark" ? darkLogoUrl : lightLogoUrl;
  const resolvedUrl = logoUrl ?? themedUrl;

  if (resolvedUrl) {
    return (
      <Image
        src={resolvedUrl}
        alt={name}
        width={110}
        height={32}
        className="h-8 w-auto object-contain"
        priority
        unoptimized={resolvedUrl.startsWith("blob:")}
      />
    );
  }

  const width = Math.round(LOGO_HEIGHT * WORDMARK_ASPECT[locale]);
  return (
    <Image
      src={`/branding/atoi-wordmark-${locale}.png`}
      alt="ATOI"
      width={width}
      height={LOGO_HEIGHT}
      className="h-8 w-auto object-contain"
      priority
    />
  );
}
