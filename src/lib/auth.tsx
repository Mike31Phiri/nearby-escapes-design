"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

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

type StoredUser = User & { password: string };

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: { email: string; password: string; fullName: string }) => Promise<void>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<string>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (patch: Partial<Omit<User, "id" | "createdAt" | "role">>) => void;
  becomeHost: () => void;
  setRole: (role: Role) => void;
};

const USERS_KEY = "ne.users";
const SESSION_KEY = "ne.session";
const RESET_KEY = "ne.reset";

const AuthContext = createContext<AuthContextValue | null>(null);

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function publicUser(u: StoredUser): User {
  const { password: _pw, ...rest } = u;
  return rest;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const sid = localStorage.getItem(SESSION_KEY);
      if (!sid) return;
      const found = readUsers().find((u) => u.id === sid);
      if (found) setUser(publicUser(found));
    } catch {
      /* no-op */
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      async login(email, password) {
        await new Promise((r) => setTimeout(r, 300));
        const found = readUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (!found || found.password !== password) throw new Error("Invalid email or password.");
        localStorage.setItem(SESSION_KEY, found.id);
        document.cookie = `ne.session=${found.id}; path=/; max-age=86400`;
        document.cookie = `ne.role=${found.role}; path=/; max-age=86400`;
        setUser(publicUser(found));
      },
      async register({ email, password, fullName }) {
        await new Promise((r) => setTimeout(r, 300));
        const users = readUsers();
        if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
          throw new Error("An account with that email already exists.");
        }
        const newUser: StoredUser = {
          id: crypto.randomUUID(),
          email,
          password,
          fullName,
          role: "guest",
          createdAt: new Date().toISOString(),
        };
        writeUsers([...users, newUser]);
        localStorage.setItem(SESSION_KEY, newUser.id);
        document.cookie = `ne.session=${newUser.id}; path=/; max-age=86400`;
        document.cookie = `ne.role=${newUser.role}; path=/; max-age=86400`;
        setUser(publicUser(newUser));
      },
      logout() {
        localStorage.removeItem(SESSION_KEY);
        document.cookie = "ne.session=; path=/; max-age=0";
        document.cookie = "ne.role=; path=/; max-age=0";
        setUser(null);
      },
      async requestPasswordReset(email) {
        await new Promise((r) => setTimeout(r, 300));
        const found = readUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (!found) throw new Error("No account found with that email.");
        const token = crypto.randomUUID();
        const map = JSON.parse(localStorage.getItem(RESET_KEY) || "{}");
        map[token] = found.id;
        localStorage.setItem(RESET_KEY, JSON.stringify(map));
        return token;
      },
      async resetPassword(token, newPassword) {
        await new Promise((r) => setTimeout(r, 300));
        const map = JSON.parse(localStorage.getItem(RESET_KEY) || "{}");
        const userId = map[token];
        if (!userId) throw new Error("Reset link is invalid or has expired.");
        const users = readUsers();
        const idx = users.findIndex((u) => u.id === userId);
        if (idx === -1) throw new Error("Account not found.");
        users[idx].password = newPassword;
        writeUsers(users);
        delete map[token];
        localStorage.setItem(RESET_KEY, JSON.stringify(map));
      },
      updateProfile(patch) {
        if (!user) return;
        const users = readUsers();
        const idx = users.findIndex((u) => u.id === user.id);
        if (idx === -1) return;
        users[idx] = { ...users[idx], ...patch };
        writeUsers(users);
        setUser(publicUser(users[idx]));
      },
      becomeHost() {
        if (!user) return;
        const users = readUsers();
        const idx = users.findIndex((u) => u.id === user.id);
        if (idx === -1) return;
        users[idx].role = "host";
        writeUsers(users);
        document.cookie = `ne.role=host; path=/; max-age=86400`;
        setUser(publicUser(users[idx]));
      },
      setRole(role) {
        if (!user) return;
        const users = readUsers();
        const idx = users.findIndex((u) => u.id === user.id);
        if (idx === -1) return;
        users[idx].role = role;
        writeUsers(users);
        document.cookie = `ne.role=${role}; path=/; max-age=86400`;
        setUser(publicUser(users[idx]));
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
