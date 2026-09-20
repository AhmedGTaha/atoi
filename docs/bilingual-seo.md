# Bilingual public URLs

English remains at `/`, `/privacy`, and `/terms`. Their Arabic counterparts are
`/ar`, `/ar/privacy`, and `/ar/terms`. No language detection redirects are used.

The published service pages are `/services/custom-software-development` and
`/services/pos-system-development`, each with an `/ar` counterpart. Their bilingual
companions are `/services/business-management-systems` and
`/services/inventory-management-systems`, also with `/ar` counterparts. Their bilingual
copy lives in `lib/content/services.ts`; both use the existing public shell,
project inquiry modal, and delivery-process content. Only the custom software page
shows published portfolio records; no POS case studies are inferred from them.

Middleware recognizes only these published public paths. It overwrites an internal
request locale header and rewrites Arabic requests to the existing page modules,
keeping the Arabic URL in the browser. `getLocale()` uses this URL-derived locale
before cookies or browser language, so the root HTML language, direction, page
content, and metadata agree. English URLs always serve English.

Existing dictionaries and bilingual database fields supply the content; no new
translations or database migrations are required. The public switcher saves the
existing preference cookie and performs a document navigation to the counterpart
URL, preserving query strings and fragments. A document navigation ensures the
shared root layout refreshes its HTML `lang` and `dir`. Preview callbacks and
private-page language switching retain their previous behavior.

`lib/i18n/publicRoutes.ts` is the registry for published bilingual pages.
`lib/publicMetadata.ts` uses it for self-canonicals, localized Open Graph URLs,
and reciprocal `en`, `ar`, and English `x-default` alternates. Sitemap entries
use the same registry. URLs are absolute to retain the English homepage's exact
trailing slash through Next 15's metadata resolver.

When adding a genuinely new bilingual public page, add the page and its existing,
reviewed translations, then register its unprefixed path and add both exact paths
to the middleware matcher. Do not register pages before they exist. Do not use a
catch-all Arabic rewrite: private and unknown paths must not acquire public aliases.
Only the four registered service pages are published. Future Gulf location pages
require useful regional content, not duplicated text with country names replaced.

Migration: users with an Arabic cookie now see English at `/`; their Arabic entry
point is `/ar`. Deploy routing, locale resolution, metadata, and sitemap together.
Private guards, noindex declarations, robots.txt, and cookie-based private locale
selection remain unchanged. Locale is not part of the database cache key because
cached records already contain both languages; language selection happens later.
