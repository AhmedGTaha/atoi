import { PUBLIC_ORIGIN } from "@/lib/i18n/publicRoutes";

export function appUrl(path: string = ""): string {
  const configuredBase = process.env.APP_URL ?? "http://localhost:3000";
  const baseUrl = new URL(configuredBase);

  if (["atoi.online", "www.atoi.online"].includes(baseUrl.hostname)) {
    const canonicalUrl = new URL(PUBLIC_ORIGIN);
    baseUrl.protocol = canonicalUrl.protocol;
    baseUrl.hostname = canonicalUrl.hostname;
    baseUrl.port = canonicalUrl.port;
  }

  const base = baseUrl.href.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
