"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { login as apiLogin, register as apiRegister, logout as apiLogout, forgotPassword as apiForgotPassword, resetPassword as apiResetPassword, getSession } from "@/api/auth";
import { updateCurrentUser } from "@/api/users";
import { toast } from "sonner";

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
        try {
          const u = await apiLogin({ email, password });
          document.cookie = `ne.role=${u.role}; path=/; max-age=86400; samesite=lax`;
          document.cookie = `ne.session=true; path=/; max-age=86400; samesite=lax`;
          setUser(u);
          toast.success(`Welcome back, ${u.fullName}!`);
        } catch (error: any) {
          toast.error(error.message || "Failed to sign in. Please check your credentials.");
          throw error;
        }
      },
      async register({ email, password, fullName, phone, location }) {
        try {
          const u = await apiRegister({ email, password, fullName, phone, location });
          document.cookie = `ne.role=${u.role}; path=/; max-age=86400; samesite=lax`;
          document.cookie = `ne.session=true; path=/; max-age=86400; samesite=lax`;
          setUser(u);
          toast.success("Account created successfully!");
        } catch (error: any) {
          toast.error(error.message || "Failed to create account.");
          throw error;
        }
      },
      async logout() {
        try {
          await apiLogout();
          document.cookie = "ne.role=; path=/; max-age=0";
          document.cookie = "ne.session=; path=/; max-age=0";
          setUser(null);
          toast.info("You have been signed out.");
        } catch (error) {
          // Even if API logout fails, clear local state
          document.cookie = "ne.role=; path=/; max-age=0";
          document.cookie = "ne.session=; path=/; max-age=0";
          setUser(null);
        }
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
