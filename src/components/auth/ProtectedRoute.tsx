"use client";

import { useAuth } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowRoles?: ("guest" | "host" | "admin")[];
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  allowRoles,
  fallback,
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait for auth to initialize (isAuthenticated will be false initially)
    // but we can check if the user object is explicitly null after initial load
    // In our AuthProvider, we set user to null if getSession fails.
    
    // This is a client-side check, middleware usually handles the redirect
    // but this ensures the UI doesn't flicker or show unauthorized content.
    if (isAuthenticated === false) {
      const loginUrl = new URL("/login", window.location.origin);
      loginUrl.searchParams.set("redirect", pathname);
      router.push(loginUrl.toString());
    } else if (isAuthenticated && allowRoles && user && !allowRoles.includes(user.role)) {
      router.push("/");
    }
  }, [isAuthenticated, user, router, pathname, allowRoles]);

  if (!isAuthenticated || (allowRoles && user && !allowRoles.includes(user.role))) {
    return (
      fallback || (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-56" />
        </div>
      )
    );
  }

  return <>{children}</>;
}
