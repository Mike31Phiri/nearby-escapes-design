import { apiRequest } from "./client";

export const getSession = () => apiRequest("/auth/session");
