import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if we are trying to access the admin area
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const role = request.cookies.get("ne.role")?.value;
    
    // Allow access if role is admin
    if (role === "admin") {
      return NextResponse.next();
    }
    
    // Redirect to home if not admin
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
