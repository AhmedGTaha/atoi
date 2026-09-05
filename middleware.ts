import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  CUSTOMER_SESSION_COOKIE,
  verifyAdminToken,
  verifyCustomerToken,
} from "@/lib/auth/session";

/**
 * Coarse-grained, edge-runtime gate for /admin and /portal. This only checks
 * that the session cookie is present and cryptographically valid; the
 * database-backed active-status check happens again in requireAdmin() /
 * requireCustomer() on each page, which also protects Server Actions that
 * middleware cannot see.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const session = token ? await verifyAdminToken(token) : null;
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};
