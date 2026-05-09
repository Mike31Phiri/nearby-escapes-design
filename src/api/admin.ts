import { apiRequest } from "./client";
import type { User } from "@/lib/auth";
import type { Booking } from "@/types/booking";

export const getAdminDashboard = () =>
  apiRequest("/admin/dashboard");

export const getBookingAnalytics = () =>
  apiRequest("/admin/analytics/bookings");

export const getPaymentAnalytics = () =>
  apiRequest("/admin/analytics/payments");

export const getCommissions = () =>
  apiRequest("/admin/commissions");

export const getPendingPayouts = () =>
  apiRequest("/admin/payouts?pending=true");

export const markPayoutPaid = (id: string) =>
  apiRequest(`/admin/payouts/${id}/paid`, { method: "PATCH" });

export const getAdminUsers = () =>
  apiRequest<User[]>("/admin/users");

export const getAdminBookings = () =>
  apiRequest<Booking[]>("/admin/bookings");

export const approveHost = (hostId: string) =>
  apiRequest(`/admin/hosts/${hostId}/approve`, { method: "PATCH" });

export const promoteUser = (userId: string) =>
  apiRequest(`/admin/users/${userId}/promote`, { method: "PATCH" });
