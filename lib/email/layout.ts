import type { Locale } from "@/lib/i18n/locale";
import { appUrl } from "@/lib/utils/appUrl";

export const EMAIL_ACCENT = "#486FA6";
/** Intrinsic aspect ratio (width / height) of the wordmark PNGs in public/branding. */
const WORDMARK_ASPECT: Record<Locale, number> = {
  en: 3244 / 1344,
  ar: 2924 / 1954,
};
export const EMAIL_LIGHT_CANVAS = "#FFFFFF";
const EMAIL_ACCENT_DARK_FOREGROUND = "#6D8CB8";

const LIGHT = {
  canvas: EMAIL_LIGHT_CANVAS,
  onAccent: "#F5F7F8",
  panel: "#FFFFFF",
  paper: "#0F1418",
  dim: "#414B55",
  line: "#D8DEE3",
  accent: EMAIL_ACCENT,
};

export interface EmailShellOptions {
  locale: Locale;
  preheader?: string;
  heading: string;
  bodyHtml: string;
  ctaUrl?: string;
  ctaLabel?: string;
  companyName: string;
}

/** A compact, email-safe version of the public site's system-aware UI. */
export function emailShell(opts: EmailShellOptions): string {
  const dir = opts.locale === "ar" ? "rtl" : "ltr";
  const align = opts.locale === "ar" ? "right" : "left";
  // Arabic prose needs an Arabic-capable face — Courier New falls back
  // inconsistently across mail clients for Arabic glyphs. Latin/technical
  // tokens (the brand wordmark, raw URLs) stay monospace regardless of
  // locale since they're decorative, not prose.
  const proseFont =
    opts.locale === "ar" ? "Tahoma, Arial, sans-serif" : "'Courier New', Courier, monospace";
  const notificationLabel = opts.locale === "ar" ? "إشعار" : "NOTIFICATION";
  const footerTagline =
    opts.locale === "ar" ? "استوديو برمجيات من البحرين" : "Bahrain-based software studio";
  const logoWidth = opts.locale === "ar" ? 92 : 118;
  const logoHeight = Math.round(logoWidth / WORDMARK_ASPECT[opts.locale]);

  // Every actionable email needs a fallback: some clients strip button
  // styling or block the link entirely, so the raw URL is always printed
  // as plain, selectable text right under the button.
  const cta =
    opts.ctaUrl && opts.ctaLabel
      ? `<div style="margin-top:28px;">
           <a href="${escapeAttr(opts.ctaUrl)}"
              class="email-cta" style="display:inline-block;background:${LIGHT.accent};color:${LIGHT.onAccent};
                     text-decoration:none;font-family:${proseFont};font-weight:700;
                     padding:16px 24px;border-radius:0;font-size:14px;letter-spacing:.01em;">
             ${escapeHtml(opts.ctaLabel)}
           </a>
         </div>
         <p class="email-fallback" style="margin:18px 0 0;font-family:${proseFont};font-size:11px;line-height:1.7;color:${LIGHT.dim};word-break:break-all;">
           ${opts.locale === "ar" ? "أو انسخ هذا الرابط:" : "Or copy this link:"}
           <br />
           <a href="${escapeAttr(opts.ctaUrl)}" class="email-link" style="color:${LIGHT.accent};">${escapeHtml(opts.ctaUrl)}</a>
         </p>`
      : "";

  return `<!doctype html>
<html lang="${opts.locale}" dir="${dir}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>${escapeHtml(opts.heading)}</title>
    <style>
      :root { color-scheme: light dark; supported-color-schemes: light dark; }
      @media (prefers-color-scheme: dark) {
        .email-body { background:#0B0D10 !important; color:#E8EBEF !important; }
        .email-rule { border-color:#303741 !important; }
        .email-brand, .email-heading, .email-value { color:#E8EBEF !important; }
        .email-panel { background:#11151B !important; border-color:#303741 !important; }
        .email-copy, .email-footer, .email-fallback, .email-label { color:#9AA4B2 !important; }
        .email-accent, .email-link { color:${EMAIL_ACCENT_DARK_FOREGROUND} !important; }
        .email-marker, .email-cta { background:${EMAIL_ACCENT} !important; }
        .email-cta { color:${LIGHT.onAccent} !important; }
        .email-quote { background:#0B0D10 !important; border-color:${EMAIL_ACCENT} !important; color:#E8EBEF !important; }
        .email-status { border-color:#303741 !important; color:#9AA4B2 !important; }
      }
    </style>
  </head>
  <body class="email-body" style="margin:0;padding:0;background:${LIGHT.canvas};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${LIGHT.paper};">
    ${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(opts.preheader)}</div>` : ""}
    <div style="max-width:560px;margin:0 auto;padding:40px 24px 32px;" dir="${dir}">
      <div class="email-rule" style="border-top:1px solid ${LIGHT.line};border-bottom:1px solid ${LIGHT.line};padding:20px 0;text-align:${align};">
        <img
          src="${appUrl(`/branding/atoi-wordmark-${opts.locale}.png`)}"
          width="${logoWidth}"
          height="${logoHeight}"
          alt="ATOI"
          style="display:inline-block;vertical-align:middle;border:0;outline:none;max-width:100%;"
        />
      </div>
      <div class="email-panel" style="margin-top:24px;background:${LIGHT.panel};border:1px solid ${LIGHT.line};padding:32px;text-align:${align};">
        <div class="email-accent" style="margin-bottom:18px;font-family:${proseFont};font-size:11px;line-height:1;color:${LIGHT.accent};letter-spacing:.08em;">ATOI / ${notificationLabel}</div>
        <h1 class="email-heading" style="margin:0 0 18px;font-family:${proseFont};font-size:24px;font-weight:500;line-height:1.25;letter-spacing:-.03em;color:${LIGHT.paper};">
          ${escapeHtml(opts.heading)}
        </h1>
        <div class="email-copy" style="font-size:15px;line-height:1.7;color:${LIGHT.dim};">
          ${opts.bodyHtml}
        </div>
        ${cta}
      </div>
      <div class="email-footer email-rule" style="margin-top:20px;padding-top:18px;border-top:1px solid ${LIGHT.line};font-family:${proseFont};font-size:11px;line-height:1.6;color:${LIGHT.dim};text-align:${align};">
        ${escapeHtml(opts.companyName)} · ${footerTagline}
      </div>
    </div>
  </body>
</html>`;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(value: string): string {
  return escapeHtml(value);
}
