import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface TokenPayload {
  sub?: string;
  id?: string;
  email?: string;
  role?: string;
  roles?: string[];
  exp?: number;
}

/**
 * Parses and verifies basic expiration of a JWT or session token.
 * Completely edge-runtime compatible (uses standard web APIs).
 */
function inspectToken(token: string | undefined): { isValid: boolean; payload: TokenPayload | null } {
  if (!token || typeof token !== "string") {
    return { isValid: false, payload: null };
  }

  const clean = token.trim();
  if (!clean) {
    return { isValid: false, payload: null };
  }

  // 1. Standard JWT (Header.Payload.Signature)
  const parts = clean.split(".");
  if (parts.length === 3) {
    try {
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
      const jsonPayload = decodeURIComponent(
        atob(padded)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      const payload: TokenPayload = JSON.parse(jsonPayload);

      // Check expiry if exp claim is present
      if (payload.exp && typeof payload.exp === "number") {
        const nowSec = Math.floor(Date.now() / 1000);
        if (payload.exp < nowSec) {
          return { isValid: false, payload: null };
        }
      }

      return { isValid: true, payload };
    } catch {
      return { isValid: false, payload: null };
    }
  }

  // 2. Custom or mock session token (e.g. userId:timestamp:signature)
  if (clean.includes(":")) {
    const segments = clean.split(":");
    if (segments.length >= 2 && segments[0]) {
      return { isValid: true, payload: { id: segments[0] } };
    }
  }

  // 3. Fallback bearer token string (at least 8 chars)
  if (clean.length >= 8) {
    return { isValid: true, payload: null };
  }

  return { isValid: false, payload: null };
}

const PROTECTED_ROUTE_PREFIXES = [
  "/host",
  "/admin",
  "/account",
  "/profile",
  "/settings",
  "/trips",
  "/notifications",
];

const AUTH_PAGES = ["/auth/login", "/auth/register"];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Retrieve token from request cookies
  const token =
    request.cookies.get("access_token")?.value ||
    request.cookies.get("ne_session")?.value ||
    request.cookies.get("nearby_access_token")?.value ||
    request.cookies.get("token")?.value;

  const { isValid, payload } = inspectToken(token);

  const isProtectedRoute = PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const isAuthPage = AUTH_PAGES.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`),
  );

  // If visiting a protected route without a valid session token -> redirect to login immediately
  if (isProtectedRoute && !isValid) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname + search);

    const redirectResponse = NextResponse.redirect(loginUrl);

    // Clean up stale or expired cookies so client doesn't retain dead tokens
    redirectResponse.cookies.delete("access_token");
    redirectResponse.cookies.delete("ne_session");
    redirectResponse.cookies.delete("nearby_access_token");
    redirectResponse.cookies.delete("token");

    return redirectResponse;
  }

  // Check role-based access for Admin routes if token payload carries roles
  if (isProtectedRoute && isValid && pathname.startsWith("/admin")) {
    const userRoles = payload?.roles || (payload?.role ? [payload.role] : []);
    if (userRoles.length > 0 && !userRoles.includes("admin")) {
      // Authenticated but not an admin -> redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Check role-based access for Host routes
  if (isProtectedRoute && isValid && pathname.startsWith("/host")) {
    const userRoles = payload?.roles || (payload?.role ? [payload.role] : []);
    // If roles are known and does not include host or admin, redirect to become-host
    if (userRoles.length > 0 && !userRoles.includes("host") && !userRoles.includes("admin")) {
      return NextResponse.redirect(new URL("/become-host", request.url));
    }
  }

  // If already authenticated and visiting auth pages (login / register) -> redirect to intended page or home
  if (isAuthPage && isValid) {
    const nextParam = request.nextUrl.searchParams.get("next");
    const destination =
      nextParam && nextParam.startsWith("/") && !nextParam.startsWith("/auth")
        ? nextParam
        : "/";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/host/:path*",
    "/admin/:path*",
    "/account/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/trips/:path*",
    "/notifications/:path*",
    "/auth/login",
    "/auth/register",
  ],
};
