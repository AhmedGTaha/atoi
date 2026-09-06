# ATOI interface system

The production interface follows `UI Mockups for ATOI/ATOI.dc.html`. The reference directory is read-only and is not imported into the production bundle. Its stylesheet supplies the neutral and steel-blue ramps, typography, spacing, and blueprint-frame construction.

## Foundations

`app/globals.css` owns the tokens and component styles; Tailwind 4 exposes the same tokens to route components. Existing cream/ink/blue utility names are aliases into this single palette.

| Role              | Token / value                                            |
| ----------------- | -------------------------------------------------------- |
| Background        | `--color-bg`: `#f2f2f3`                                  |
| Secondary surface | `--color-surface`: `#e9e9ea`                             |
| Text              | `--color-text`: `#1d1f20`                                |
| Steel accent      | `--color-accent`: `#5980a6`                              |
| Deep steel        | `--color-accent-900`: `#1d2d3d`                          |
| Muted text        | `--color-muted`: neutral 700                             |
| Borders           | `--color-rule`, `--color-rule-soft`                      |
| Feedback          | `--color-success`, `--color-warning`, `--color-danger`   |
| Heading / body    | Barlow Condensed / Barlow, loaded with `next/font`       |
| Arabic            | Existing Cairo family retained for Arabic glyphs and RTL |
| Layout            | `--page-width`, `--page-gutter`, `--section-space`       |
| Motion            | `--motion-fast`: 180ms; reduced-motion override          |

Small primary-button labels use accent 700 to meet text contrast requirements; the reference's base accent remains available for rules and structural detail. Heading scale and letter spacing provide the identity without shadows or decorative effects. User-uploaded portfolio images retain their actual colors.

## Components and behavior

- `BlueprintPanel` and `BlueprintMarks`: reusable transparent panels and registration marks. Use on major records, forms, and content regions; use plain rules for subordinate rows.
- `Button` / `LinkButton`: primary, secondary, ghost, cream, and destructive variants. Existing callers keep their API.
- Admin `PageHeader`, `Card`, `Badge`, and input helpers use the same tokens. Table cards expose a keyboard-focusable horizontal scroll region with a mobile hint, preserving every column.
- `AdminShell`, `AdminNav`, and `AdminBreadcrumbs`: fixed-width desktop navigation, visible active rule, compact mobile grid, shared page header and content gutters.
- `PortalShell`: consistent brand bar, project navigation, language control, and access to the public website.
- `AuthCard`: split composition with a blueprint-framed form, shared across customer/admin sign-in and password flows.
- `StartProjectModal` reuses the existing validated enquiry flow in both the public contact section and modal. Instances have distinct control IDs and independent form state.
- `Modal` supplies Escape dismissal, focus containment, focus restoration, inert background content, and a square surface. Mobile navigation uses this primitive too.
- `ScreenSkeleton`, route error recovery, custom 404, and inline feedback cover loading, unavailable records, validation, and submission states.

No application models, authorization guards, database services, server actions, or environment files were changed for this migration. CMS copy, company settings, portfolio records, project progress, and activity remain data-driven. The legacy Atrio wordmark is displayed as ATOI; custom company names and uploaded logos remain supported.

## Route coverage

All 22 page routes are covered by the implementation and browser review. Dynamic routes use dedicated e2e database records.

| Area           | Routes                                                                                                |
| -------------- | ----------------------------------------------------------------------------------------------------- |
| Public         | `/`, `/privacy`, `/terms`                                                                             |
| Account        | `/login`, `/admin/login`, `/forgot-password`, `/set-password` (invitation/reset/missing-token states) |
| Customer       | `/portal`, `/portal/projects/[id]`                                                                    |
| Operations     | `/admin`, `/admin/requests`, `/admin/requests/[id]`, `/admin/projects`, `/admin/projects/[id]`        |
| Customers      | `/admin/customers`, `/admin/customers/[id]`                                                           |
| Publishing     | `/admin/portfolio`, `/admin/portfolio/new`, `/admin/portfolio/[id]`, `/admin/content`                 |
| Administration | `/admin/team`, `/admin/settings`                                                                      |
| Feedback       | Root 404/error and public/admin/portal loading boundaries                                             |
| Metadata       | Existing `/robots.txt` and `/sitemap.xml` remain unchanged                                            |

## Verification

- `npm run format` / `npm run format:check`: format UI source without rewriting business services or the reference directory.
- `npm run lint`: production lint excludes prototype reference scripts.
- `npm run typecheck`: TypeScript validation.
- `npm test`: unit and real PostgreSQL integration tests against `atoi_test`.
- `npm run test:e2e`: seeds `atoi_e2e`, builds and launches the production server, and runs the functional and design suites.
- `npm run build`: independent production build.

`tests/e2e/design-system.spec.ts` checks every route at 1440, 1280, 1024, 768, 430, and 390 pixels, captures desktop/mobile screenshots under `test-results/`, checks page overflow, fonts, background tokens and duplicate IDs, runs automated WCAG checks, and exercises filters, mobile navigation, portfolio dialogs, and Arabic layout. Existing browser tests cover enquiry validation, focus restoration, admin conversion and project updates, customer support, and inaccessible project IDs.

Live email delivery and remote image storage require configured Resend and Vercel Blob credentials. The e2e environment intentionally has neither; tests verify that saved requests/updates remain available when email delivery fails. Browser fixtures are never written to the application database.

The npm build/start/dev hooks scope Next's persistent data cache to the configured database. Switching between the application and e2e databases clears only `fetch-cache`; compiler caches remain intact. This prevents a previous test run's portfolio or CMS content from appearing in the normal app.

## Final validation — 7 September 2026

Formatting, ESLint, TypeScript, all 64 unit/integration tests, all 12 browser tests, and the production build passed. The route review includes 144 viewport checks (24 route/state variants at six widths) and automated WCAG A/AA checks with no reported violations on the reviewed screens. Desktop/mobile screenshots are generated by the browser suite.
