"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/store/authStore";

interface AuthProviderProps {
  children: React.ReactNode;
  initialIsAuthenticated: boolean;
}

export function AuthProvider({ children, initialIsAuthenticated }: AuthProviderProps) {
  const initialized = useRef(false);

  // If server confirmed authentication via cookie, seed the store immediately
  if (!initialized.current) {
    if (initialIsAuthenticated) {
      useAuthStore.setState({ isAuthenticated: true });
    }
    initialized.current = true;
  }

  useEffect(() => {
    // Reconcile and initialize auth state on client mount
    useAuthStore.getState().initialize();
  }, [initialIsAuthenticated]);

  return <>{children}</>;
}
