"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { login as apiLogin, register as apiRegister, logout as apiLogout, forgotPassword as apiForgotPassword, resetPassword as apiResetPassword, getSession } from "@/api/auth";
import { updateCurrentUser } from "@/api/users";

export type Role = "guest" | "host" | "admin";

export type User = {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: Role;
  bio?: string;
  location?: string;
  createdAt: string;
};

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: { email: string; password: string; fullName: string; phone?: string; location?: string }) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (patch: Partial<Omit<User, "id" | "createdAt" | "role">>) => Promise<void>;
  becomeHost: () => void;
  setRole: (role: Role) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getSession()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      async login(email, password) {
        const u = await apiLogin({ email, password });
        document.cookie = `ne.role=${u.role}; path=/; max-age=86400`;
        setUser(u);
      },
      async register({ email, password, fullName, phone, location }) {
        const u = await apiRegister({ email, password, fullName, phone, location });
        document.cookie = `ne.role=${u.role}; path=/; max-age=86400`;
        setUser(u);
      },
      async logout() {
        await apiLogout();
        document.cookie = "ne.role=; path=/; max-age=0";
        setUser(null);
      },
      async requestPasswordReset(email) {
        await apiForgotPassword({ email });
      },
      async resetPassword(token, newPassword) {
        await apiResetPassword({ token, newPassword });
      },
      async updateProfile(patch) {
        const u = await updateCurrentUser(patch);
        setUser(u);
      },
      becomeHost() {
        if (!user) return;
        document.cookie = `ne.role=host; path=/; max-age=86400`;
        setUser({ ...user, role: "host" });
      },
      setRole(role) {
        if (!user) return;
        document.cookie = `ne.role=${role}; path=/; max-age=86400`;
        setUser({ ...user, role });
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
