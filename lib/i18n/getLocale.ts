import "server-only";
import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from "./locale";
import { PUBLIC_LOCALE_HEADER } from "./publicRoutes";

export async function getLocale(): Promise<Locale> {
  const headerList = await headers();
  const publicLocale = headerList.get(PUBLIC_LOCALE_HEADER);
  if (isLocale(publicLocale)) return publicLocale;

  const store = await cookies();
  const cookieValue = store.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieValue)) return cookieValue;

  const acceptLanguage = headerList.get("accept-language") ?? "";
  if (acceptLanguage.toLowerCase().startsWith("ar")) return "ar";

  return DEFAULT_LOCALE;
}
