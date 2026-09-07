import type { Locale } from "@/lib/i18n/locale";

const COLORS = {
  offWhite: "#F5F5F7",
  lightBlue: "#8EABD5",
  darkBlue: "#486FA6",
  black: "#000000",
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

/** Minimal, table-free responsive HTML email shell using the brand palette. */
export function emailShell(opts: EmailShellOptions): string {
  const dir = opts.locale === "ar" ? "rtl" : "ltr";
  const align = opts.locale === "ar" ? "right" : "left";

  // Every actionable email needs a fallback: some clients strip button
  // styling or block the link entirely, so the raw URL is always printed
  // as plain, selectable text right under the button.
  const cta =
    opts.ctaUrl && opts.ctaLabel
      ? `<div style="margin-top:28px;">
           <a href="${escapeAttr(opts.ctaUrl)}"
              style="display:inline-block;background:${COLORS.darkBlue};color:#ffffff;
                     text-decoration:none;font-weight:600;padding:14px 28px;
                     border-radius:999px;font-size:15px;">
             ${escapeHtml(opts.ctaLabel)}
           </a>
         </div>
         <p style="margin-top:14px;font-size:12px;line-height:1.6;color:#8a8a8a;word-break:break-all;">
           ${opts.locale === "ar" ? "أو انسخ هذا الرابط:" : "Or copy this link:"}
           <br />
           <a href="${escapeAttr(opts.ctaUrl)}" style="color:${COLORS.darkBlue};">${escapeHtml(opts.ctaUrl)}</a>
         </p>`
      : "";

  return `<!doctype html>
<html lang="${opts.locale}" dir="${dir}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(opts.heading)}</title>
  </head>
  <body style="margin:0;padding:0;background:${COLORS.offWhite};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    ${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(opts.preheader)}</div>` : ""}
    <div style="max-width:560px;margin:0 auto;padding:32px 24px;" dir="${dir}">
      <div style="font-weight:800;font-size:20px;color:${COLORS.black};letter-spacing:-0.02em;text-align:${align};">
        ${escapeHtml(opts.companyName)}
      </div>
      <div style="margin-top:24px;background:#ffffff;border-radius:20px;padding:32px;text-align:${align};">
        <h1 style="margin:0 0 16px 0;font-size:22px;line-height:1.3;color:${COLORS.black};">
          ${escapeHtml(opts.heading)}
        </h1>
        <div style="font-size:15px;line-height:1.6;color:#333333;">
          ${opts.bodyHtml}
        </div>
        ${cta}
      </div>
      <div style="margin-top:24px;font-size:12px;color:#8a8a8a;text-align:${align};">
        ${escapeHtml(opts.companyName)}
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
