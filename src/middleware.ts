import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/profile", "/host", "/inbox", "/booking", "/account"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("ne.session")?.value;
  const role = request.cookies.get("ne.role")?.value;

  // Guard admin routes
  if (pathname.startsWith("/admin")) {
    if (role === "admin") return NextResponse.next();
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Guard protected routes — redirect to login if no session
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  if (isProtected && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/host/:path*", "/inbox/:path*", "/booking/:path*", "/account/:path*"],
};
