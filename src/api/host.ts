import { apiRequest } from "./client";

export const getHostDashboard = () => apiRequest("/host/dashboard");
