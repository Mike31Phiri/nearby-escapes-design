import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
  }
  
  return NextResponse.next();
}

export const config = {
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
};
