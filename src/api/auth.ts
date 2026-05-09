import { apiRequest } from "./client";
import type { User } from "@/lib/auth";

export const getSession = () =>
  apiRequest<User>("/auth/session");

export const login = (payload: { email: string; password: string }) =>
  apiRequest<User>("/auth/login", { method: "POST", body: JSON.stringify(payload) });

export const register = (payload: { fullName: string; email: string; password: string; phone?: string; location?: string }) =>
  apiRequest<User>("/auth/register", { method: "POST", body: JSON.stringify(payload) });

export const logout = () =>
  apiRequest<void>("/auth/logout", { method: "POST" });

export const forgotPassword = (payload: { email: string }) =>
  apiRequest<{ message: string }>("/auth/forgot-password", { method: "POST", body: JSON.stringify(payload) });

export const resetPassword = (payload: { token: string; newPassword: string }) =>
  apiRequest<{ message: string }>("/auth/reset-password", { method: "POST", body: JSON.stringify(payload) });
