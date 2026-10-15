/**
 * admin.ts — Admin dashboard API stubs
 *
 * All revenue figures are integers in Ngwee (ZMW × 100). Never float.
 *
 * TODO: Connect to real API
 */

import apiClient from "./client";
import type { ListingStatus, ListingVertical } from "@/types/listing";

export interface AdminStatsDTO {
  totalUsers: number;
  totalHosts: number;
  totalGuests: number;
  totalListings: number;
  totalBookings: number;
  /** Platform total revenue in Ngwee (integer). Never float. */
  totalRevenueNgwee: number;
  pendingListingReviews: number;
}

export interface AdminUserDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "guest" | "host" | "admin";
  status: "active" | "suspended";
  joinedAt: string;
  totalBookings: number;
}

export interface AdminListingDTO {
  id: string;
  title: string;
  vertical: ListingVertical;
  status: ListingStatus;
  hostId: string;
  hostName: string;
  /** Price in Ngwee (integer). Never float. */
  priceNgwee: number;
  totalBookings: number;
  rating: number;
  createdAt: string;
}

export interface AdminBookingDTO {
  id: string;
  bookingRef: string;
  listingId: string;
  listingTitle: string;
  vertical: ListingVertical;
  status: "confirmed" | "cancelled" | "completed";
  guestId: string;
  guestName: string;
  hostId: string;
  /** Total in Ngwee (integer). Never float. */
  totalNgwee: number;
  createdAt: string;
}

export interface RevenueByMonthDTO {
  month: string; // e.g. '2025-03'
  /** Platform revenue in Ngwee (integer). Never float. */
  revenueNgwee: number;
  bookingCount: number;
}

export interface AdminDashboardDTO {
  stats: AdminStatsDTO;
  recentUsers: AdminUserDTO[];
  recentBookings: AdminBookingDTO[];
  revenueByMonth: RevenueByMonthDTO[];
}

/** Fetch the admin dashboard overview. */
// TODO: Connect to real API
/** Fetch the admin dashboard overview. */
export const getAdminDashboard = async (): Promise<AdminDashboardDTO> => {
  const { data } = await apiClient.get<AdminDashboardDTO>("/admin/overview");
  return data;
};

/** List all users (paginated). */
export const listUsers = async (
  page = 1,
  limit = 20,
): Promise<{ data: AdminUserDTO[]; total: number }> => {
  const { data } = await apiClient.get<{ data: AdminUserDTO[]; total: number }>(
    "/admin/users",
    { params: { page, limit } },
  );
  return data;
};

/** Suspend a user account. */
export const suspendUser = async (userId: string): Promise<{ success: boolean }> => {
  const { data } = await apiClient.patch<{ success: boolean }>(`/admin/users/${userId}/suspend`);
  return data;
};

/** Reinstate a suspended user account. */
export const reinstateUser = async (userId: string): Promise<{ success: boolean }> => {
  const { data } = await apiClient.patch<{ success: boolean }>(`/admin/users/${userId}/reactivate`);
  return data;
};

/** List all listings for admin review (paginated). */
export const listListings = async (
  page = 1,
  limit = 20,
): Promise<{ data: AdminListingDTO[]; total: number }> => {
  const { data } = await apiClient.get<{ data: AdminListingDTO[]; total: number }>(
    "/admin/listings",
    { params: { page, limit } },
  );
  return data;
};

/** Approve a listing — sets status to 'active'. */
export const approveListing = async (listingId: string): Promise<{ success: boolean }> => {
  const { data } = await apiClient.patch<{ success: boolean }>(`/admin/listings/${listingId}/approve`);
  return data;
};

/** Reject a listing with an optional reason. */
export const rejectListing = async (
  listingId: string,
  reason?: string,
): Promise<{ success: boolean }> => {
  const { data } = await apiClient.patch<{ success: boolean }>(`/admin/listings/${listingId}/reject`, {
    reason,
  });
  return data;
};

/** List all bookings platform-wide (paginated). */
export const listAllBookings = async (
  page = 1,
  limit = 20,
): Promise<{ data: AdminBookingDTO[]; total: number }> => {
  const { data } = await apiClient.get<{ data: AdminBookingDTO[]; total: number }>(
    "/admin/bookings",
    { params: { page, limit } },
  );
  return data;
};
