import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

<<<<<<< HEAD
const PROTECTED_ROUTES = ["/profile", "/host", "/inbox", "/booking", "/account"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get("ne.session")?.value;
  const role = request.cookies.get("ne.role")?.value;

  // Guard admin routes
  if (pathname.startsWith("/admin")) {
    if (role === "admin") return NextResponse.next();
    return NextResponse.redirect(new URL("/", request.url));
=======
// Paths that require authentication
const protectedPaths = [
  "/account",
  "/admin",
  "/booking",
  "/checkout",
  "/host",
  "/inbox",
  "/profile"
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if it's a protected path
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  
  if (isProtectedPath) {
    const session = request.cookies.get("ne.session")?.value;
    
    // Redirect to register/login if no session
    if (!session) {
      return NextResponse.redirect(new URL("/register", request.url));
    }
    
    // Admin specific check
    if (pathname.startsWith("/admin")) {
      const role = request.cookies.get("ne.role")?.value;
      if (role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
>>>>>>> e3378f9791f92d62290a9cdd2efb69f29fde11d8
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
<<<<<<< HEAD
  matcher: ["/admin/:path*", "/profile/:path*", "/host/:path*", "/inbox/:path*", "/booking/:path*", "/account/:path*"],
=======
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ],
>>>>>>> e3378f9791f92d62290a9cdd2efb69f29fde11d8
};
