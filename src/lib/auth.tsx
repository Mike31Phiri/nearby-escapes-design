"use client";

import { createContext, useContext, type ReactNode } from "react";

interface AuthContextValue {
  isAuthenticated: boolean;
  user: null;
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  user: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={{ isAuthenticated: false, user: null }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
