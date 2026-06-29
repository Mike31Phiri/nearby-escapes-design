"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/store/authStore";

interface AuthProviderProps {
  children: React.ReactNode;
  initialIsAuthenticated: boolean;
}

export function AuthProvider({ children, initialIsAuthenticated }: AuthProviderProps) {
  const initialized = useRef(false);

  // Synchronously seed the store during the very first render before children mount.
  if (!initialized.current) {
    useAuthStore.setState({
      isAuthenticated: initialIsAuthenticated,
      isHydrating: true, // Keep true during SSR to ensure server/client match
    });
    initialized.current = true;
  }

  useEffect(() => {
    // Once mounted, resolve the hydration state
    if (initialIsAuthenticated) {
      useAuthStore.getState().initialize(); // This will eventually set isHydrating to false
    } else {
      useAuthStore.setState({ isAuthenticated: false, isHydrating: false });
    }
  }, [initialIsAuthenticated]);

  return <>{children}</>;
}
