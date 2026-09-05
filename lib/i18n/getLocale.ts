import "server-only";
import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from "./locale";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const cookieValue = store.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieValue)) return cookieValue;

  const headerList = await headers();
  const acceptLanguage = headerList.get("accept-language") ?? "";
  if (acceptLanguage.toLowerCase().startsWith("ar")) return "ar";

  return DEFAULT_LOCALE;
}
