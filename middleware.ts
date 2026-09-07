import { NextResponse, type NextRequest } from "next/server";
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

  // /admin/login is retired in favor of the universal /login page — keep a
  // permanent redirect so old links/bookmarks still work.
  if (pathname === "/admin/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const session = token ? await verifyAdminToken(token) : null;
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*", "/team/:path*"],
};
