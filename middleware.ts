import { NextResponse, type NextRequest } from "next/server";
import { PUBLIC_LOCALE_HEADER, publicRouteFromPath } from "@/lib/i18n/publicRoutes";
import {
  ADMIN_SESSION_COOKIE,
  CUSTOMER_SESSION_COOKIE,
  TEAM_SESSION_COOKIE,
  verifyAdminToken,
  verifyCustomerToken,
  verifyTeamToken,
} from "@/lib/auth/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete(PUBLIC_LOCALE_HEADER);
  const publicRoute = publicRouteFromPath(pathname);
  if (publicRoute) {
    requestHeaders.set(PUBLIC_LOCALE_HEADER, publicRoute.locale);
    const options = { request: { headers: requestHeaders } };
    if (publicRoute.locale === "ar") {
      const url = request.nextUrl.clone();
      url.pathname = publicRoute.path;
      return NextResponse.rewrite(url, options);
    }
    return NextResponse.next(options);
  }

  // /admin/login is retired in favor of the universal /login page — keep a
  // permanent redirect so old links/bookmarks still work.
  if (pathname === "/admin/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin")) {
    // Team member = Admin: a valid admin session OR a valid team session
    // both grant access here — the deeper per-page/action check (requireAdmin
    // in lib/auth/guards.ts) re-verifies against the database.
    const adminToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const teamToken = request.cookies.get(TEAM_SESSION_COOKIE)?.value;
    const session =
      (adminToken ? await verifyAdminToken(adminToken) : null) ??
      (teamToken ? await verifyTeamToken(teamToken) : null);
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/portal")) {
    const token = request.cookies.get(CUSTOMER_SESSION_COOKIE)?.value;
    const session = token ? await verifyCustomerToken(token) : null;
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/team")) {
    const token = request.cookies.get(TEAM_SESSION_COOKIE)?.value;
    const session = token ? await verifyTeamToken(token) : null;
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/",
    "/privacy",
    "/terms",
    "/ar",
    "/ar/privacy",
    "/ar/terms",
    "/login",
    "/forgot-password",
    "/set-password",
    "/admin/:path*",
    "/admin-preview/:path*",
    "/portal/:path*",
    "/team/:path*",
  ],
};
