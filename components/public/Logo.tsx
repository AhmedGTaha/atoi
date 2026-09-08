"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Locale } from "@/lib/i18n/locale";

/** Intrinsic aspect ratio (width / height) of the wordmark PNGs in public/branding. */
const WORDMARK_ASPECT: Record<Locale, number> = {
  en: 3244 / 1344,
  ar: 2924 / 1954,
};
/**
 * Rendered height per locale. The Arabic wordmark's tight alpha-crop carries
 * a lot of built-in vertical space (a decorative flourish above the word and
 * a diacritic dot below it), so its letterforms sit in a much smaller
 * fraction of the image than the English wordmark's do. Matching pixel
 * heights therefore makes the Arabic mark read as noticeably smaller — this
 * per-locale height keeps the two optically balanced instead.
 */
const LOGO_HEIGHT: Record<Locale, number> = { en: 32, ar: 52 };

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
  height: heightOverride,
  logoUrl,
  lightLogoUrl,
  darkLogoUrl,
}: {
  name: string;
  /** Selects the default ATOI wordmark when no admin-configured logo is set. */
  locale?: Locale;
  /** Rendered height in px. Defaults to a per-locale size tuned for the public nav/footer. */
  height?: number;
  /** Single-mode override; used by contexts (e.g. the footer) that don't need theme-aware swapping. */
  logoUrl?: string | null;
  lightLogoUrl?: string | null;
  darkLogoUrl?: string | null;
}) {
  const theme = useResolvedTheme();
  const themedUrl = theme === "dark" ? darkLogoUrl : lightLogoUrl;
  const resolvedUrl = logoUrl ?? themedUrl;

  if (resolvedUrl) {
    const height = heightOverride ?? 32;
    return (
      <Image
        src={resolvedUrl}
        alt={name}
        width={Math.round(height * (110 / 32))}
        height={height}
        style={{ height, width: "auto" }}
        className="w-auto object-contain"
        priority
        unoptimized={resolvedUrl.startsWith("blob:")}
      />
    );
  }

  const height = heightOverride ?? LOGO_HEIGHT[locale];
  const width = Math.round(height * WORDMARK_ASPECT[locale]);
  return (
    <Image
      src={`/branding/atoi-wordmark-${locale}.png`}
      alt="ATOI"
      width={width}
      height={height}
      style={{ height, width: "auto" }}
      className="w-auto object-contain"
      priority
    />
  );
}
