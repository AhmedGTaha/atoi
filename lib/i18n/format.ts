import type { ReactNode } from "react";
import type { Locale } from "./locale";

/** Bahrain-appropriate Intl locale tag for the given app locale. */
export function localeTag(locale: Locale): string {
  return locale === "ar" ? "ar-BH" : "en-GB";
}

export function formatDate(locale: Locale, date: Date): string {
  return new Intl.DateTimeFormat(localeTag(locale), {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(locale: Locale, date: Date): string {
  return new Intl.DateTimeFormat(localeTag(locale), {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatNumber(locale: Locale, value: number): string {
  return new Intl.NumberFormat(localeTag(locale)).format(value);
}

export function formatPercent(locale: Locale, value: number): string {
  return new Intl.NumberFormat(localeTag(locale), {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(value / 100);
}

/** Replaces `{key}` placeholders in `template` with `params[key]`. */
export function interpolate(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in params ? String(params[key]) : match,
  );
}

/**
 * Like `interpolate`, but substitutes React nodes instead of strings —
 * for cases like an email address that needs its own `<a>`/`<bdi>` wrapper
 * rather than being flattened into plain text. Callers should give each
 * node its own `key` since it may end up as an array child.
 */
export function interpolateNodes(
  template: string,
  params: Record<string, ReactNode>,
): ReactNode[] {
  return template.split(/(\{\w+\})/g).map((part) => {
    const match = /^\{(\w+)\}$/.exec(part);
    return match && match[1] in params ? params[match[1]] : part;
  });
}
