import { apiRequest } from "./client";
import type { User } from "@/lib/auth";

export const getCurrentUser = () =>
  apiRequest<User>("/users/me");

export const updateCurrentUser = (payload: {
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  location?: string;
  bio?: string;
}) => apiRequest<User>("/users/me", { method: "PATCH", body: JSON.stringify(payload) });
