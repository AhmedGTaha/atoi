# ATOI Studio production design

The sole visual authority is `UI Mockups for ATOI/ATOI Studio.dc.html`. The reference is unchanged and is never imported into production. Existing routes, server actions, authorization, validation, localization and data services remain authoritative for behavior.

## Tokens and fonts

`app/globals.css` defines a single semantic palette exposed through Tailwind 4. The light canvas is white (`#ffffff`) and the third palette color (`#486fa6`) is the global accent. Canvas, surface, field, header, overlay, modal edge, foreground, secondary/faint text, three border strengths, accent, deep accent and semantic statuses follow Studio.

| Role        | Dark      | Light     |
| ----------- | --------- | --------- |
| Canvas      | `#0b0d10` | `#ffffff` |
| Panel       | `#11151b` | `#eceff1` |
| Foreground  | `#e8ebef` | `#0f1418` |
| Secondary   | `#9aa4b2` | `#414b55` |
| Metadata    | `#7b8493` | `#586269` |
| Accent      | `#486fa6` | `#486fa6` |
| Deep accent | derived   | derived   |
| Positive    | `#4ade80` | `#12703f` |
| Destructive | `#e8705a` | `#a63a25` |

IBM Plex Mono supplies headings, navigation, buttons, labels, status, metrics and metadata. IBM Plex Sans supplies readable body copy. Both are self-hosted through `next/font/google` with swap and fallbacks. Cairo is retained for Arabic glyph coverage. Controls and panels use square geometry. Motion has 150ms/220ms/300ms roles and respects reduced motion.

Dark is the default regardless of OS preference. The `atoi-theme` localStorage preference is applied before first paint by the root layout and persists across public, auth, portal and admin routes. Storage failures do not disable switching. Light mode uses the reference's deliberate palette; it does not invert the UI. Accent hover, pressed, soft and disabled treatments are derived from `#486fa6`; accent text uses subtle theme-aware derivatives for accessible contrast while fills and focus indicators retain the base accent.

## Components and routes

- `Panel` replaces `BlueprintPanel` and all corner marks. Buttons use primary, outline, ghost and destructive variants. The old neutral/steel ramps, cream/ink/blue aliases, Barlow fonts and condensed uppercase treatment are removed.
- The public page follows Studio's compact header, command prompt, mono hero, side panel, alternating work rows, service rows, readme/about, project CTA, inquiry modal and section status bar. All published projects and counts come from the existing portfolio service. No example commits, deployments, testimonials or activity are fabricated. Existing editable copy stays editable; the default English hero follows Studio.
- Public process content is presented inside readme/about. The duplicate process section and inline inquiry form were removed; all project triggers open the same real inquiry workflow.
- Authentication uses a square account panel with a compact header strip. Admin and portal navigation share typography, theme controls, rules and gutters. Admin mobile navigation uses the accessible modal with active-route indication.
- Dashboard metrics use a bordered grid; requests, support and project updates use line-and-dot activity rows. All admin tables, customer/request/project details, portfolio editing, team management, website content and settings use shared tokens and controls.
- Modal focus trapping, Escape dismissal, focus restoration, inert background and scroll locking are retained. Portfolio deletion now has an explicit accessible confirmation dialog.
- Forms retain real server validation and pending states. Inquiry fields use terminal rows; larger operational forms retain conventional labels and grouping. Native selects remain keyboard accessible and use theme-correct option colors.
- Empty states, loading skeletons, errors, form feedback, legal pages and not-found routes use the same palette and hierarchy. Tables scroll inside their own labeled focusable region on small screens.

## Route audit

`tests/e2e/design-system.spec.ts` reviews both themes at 1440×900, 1280×800, 1024×768, 768×1024, 430×932 and 390×844. It checks document overflow, actual fonts, canvas color, duplicate IDs, browser exceptions and axe accessibility; it saves full-page screenshots at desktop and mobile sizes.

Coverage: `/`, `/login`, `/forgot-password`, `/set-password` (missing token and reset mode), `/privacy`, `/terms`, not-found, `/portal`, `/portal/projects/[id]`, `/admin`, `/admin/requests`, `/admin/requests/[id]`, `/admin/projects`, `/admin/projects/[id]`, `/admin/customers`, `/admin/customers/[id]`, `/admin/portfolio`, `/admin/portfolio/new`, `/admin/portfolio/[id]`, `/admin/content`, `/admin/settings`, `/admin/team`. The additional existing browser suites cover real inquiry validation/submission, sign-in, conversion, project updates, support and Arabic RTL.

Use only isolated databases for automated tests: the test helpers reset their data. `.env.test` and `.env.e2e` are ignored local configuration. External email and storage credentials are intentionally omitted during local validation.

`ATOI_BUILD_DIR=.next-studio` isolates production validation output from a running dev server's `.next` directory. `scripts/prepare-data-cache.mjs` uses the same output directory and keeps persistent data caches scoped to their database. This setting is optional; the normal application still defaults to `.next`.
