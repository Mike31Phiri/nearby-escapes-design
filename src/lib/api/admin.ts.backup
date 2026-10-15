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
export const getAdminDashboard = async (): Promise<AdminDashboardDTO> => {
  void apiClient;
  return {
    stats: {
      totalUsers: 0,
      totalHosts: 0,
      totalGuests: 0,
      totalListings: 0,
      totalBookings: 0,
      totalRevenueNgwee: 0,
      pendingListingReviews: 0,
    },
    recentUsers: [],
    recentBookings: [],
    revenueByMonth: [],
  };
};

/** List all users (paginated). */
// TODO: Connect to real API
export const listUsers = async (
  page = 1,
  limit = 20,
): Promise<{ data: AdminUserDTO[]; total: number }> => {
  void apiClient;
  void page;
  void limit;
  return { data: [], total: 0 };
};

/** Suspend a user account. */
// TODO: Connect to real API
export const suspendUser = async (userId: string): Promise<{ success: boolean }> => {
  void apiClient;
  void userId;
  return { success: true };
};

/** Reinstate a suspended user account. */
// TODO: Connect to real API
export const reinstateUser = async (userId: string): Promise<{ success: boolean }> => {
  void apiClient;
  void userId;
  return { success: true };
};

/** List all listings for admin review (paginated). */
// TODO: Connect to real API
export const listListings = async (
  page = 1,
  limit = 20,
): Promise<{ data: AdminListingDTO[]; total: number }> => {
  void apiClient;
  void page;
  void limit;
  return { data: [], total: 0 };
};

/** Approve a listing — sets status to 'active'. */
// TODO: Connect to real API
export const approveListing = async (listingId: string): Promise<{ success: boolean }> => {
  void apiClient;
  void listingId;
  return { success: true };
};

/** Reject a listing with an optional reason. */
// TODO: Connect to real API
export const rejectListing = async (
  listingId: string,
  reason?: string,
): Promise<{ success: boolean }> => {
  void apiClient;
  void listingId;
  void reason;
  return { success: true };
};

/** List all bookings platform-wide (paginated). */
// TODO: Connect to real API
export const listAllBookings = async (
  page = 1,
  limit = 20,
): Promise<{ data: AdminBookingDTO[]; total: number }> => {
  void apiClient;
  void page;
  void limit;
  return { data: [], total: 0 };
};
