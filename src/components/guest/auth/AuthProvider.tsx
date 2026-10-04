"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/store/authStore";

interface AuthProviderProps {
  children: React.ReactNode;
  initialIsAuthenticated?: boolean;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      // Reconcile and verify auth state with server on mount
      useAuthStore.getState().initialize();
    }
  }, []);

  return <>{children}</>;
}
