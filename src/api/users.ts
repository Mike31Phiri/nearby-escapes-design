import { apiRequest } from "./client";

export const getCurrentUser = () => apiRequest("/users/me");
