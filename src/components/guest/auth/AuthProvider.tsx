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
      // Sync local auth state synchronously without firing blocking network requests
      useAuthStore.getState().syncLocalSession();
    }
  }, []);

  return <>{children}</>;
}
