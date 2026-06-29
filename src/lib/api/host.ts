/**
 * host.ts — Host dashboard API stubs
 *
 * All revenue figures are integers in Ngwee (ZMW × 100). Never float.
 *
 * TODO: Connect to real API
 */

import apiClient from "./client";
import type { ListingVertical } from "@/types/listing";

export interface HostStatsDTO {
  totalListings: number;
  activeListings: number;
  totalBookings: number;
  /** Total revenue in Ngwee (integer). Never float. */
  totalRevenueNgwee: number;
  averageRating: number;
  reviewCount: number;
}

export interface HostBookingDTO {
  id: string;
  bookingRef: string;
  listingId: string;
  listingTitle: string;
  vertical: ListingVertical;
  status: "confirmed" | "cancelled" | "completed";
  checkIn: string | null;
  checkOut: string | null;
  date: string | null;
  guests: number;
  /** Amount in Ngwee (integer). Never float. */
  totalNgwee: number;
  guestName: string;
  guestPhone: string;
  createdAt: string;
}

export interface EarningsByMonthDTO {
  month: string; // e.g. '2025-03'
  /** Amount in Ngwee (integer). Never float. */
  amountNgwee: number;
  bookingCount: number;
}

export interface HostDashboardDTO {
  stats: HostStatsDTO;
  recentBookings: HostBookingDTO[];
  earningsByMonth: EarningsByMonthDTO[];
}

export interface BlockDatesPayload {
  listingId: string;
  dateFrom: string; // ISO 'YYYY-MM-DD'
  dateTo: string; // ISO 'YYYY-MM-DD'
}

/** Fetch the host's dashboard summary stats, bookings, and earnings. */
// TODO: Connect to real API
export const getHostDashboard = async (): Promise<HostDashboardDTO> => {
  void apiClient;
  return {
    stats: {
      totalListings: 0,
      activeListings: 0,
      totalBookings: 0,
      totalRevenueNgwee: 0,
      averageRating: 0,
      reviewCount: 0,
    },
    recentBookings: [],
    earningsByMonth: [],
  };
};

/** Fetch all bookings for the host's listings. */
// TODO: Connect to real API
export const getHostBookings = async (): Promise<HostBookingDTO[]> => {
  void apiClient;
  return [];
};

/** Block a date range on a listing's calendar (marks as unavailable). */
// TODO: Connect to real API
export const blockDates = async (payload: BlockDatesPayload): Promise<{ success: boolean }> => {
  void apiClient;
  void payload;
  return { success: true };
};

/** Unblock a previously blocked date range on a listing. */
// TODO: Connect to real API
export const unblockDates = async (payload: BlockDatesPayload): Promise<{ success: boolean }> => {
  void apiClient;
  void payload;
  return { success: true };
};

/** Update the nightly / session price for a specific date range on a listing. */
// TODO: Connect to real API
export const updateSeasonalPricing = async (
  listingId: string,
  dateFrom: string,
  dateTo: string,
  /** Price in Ngwee (integer). Never float. */
  priceNgwee: number,
): Promise<{ success: boolean }> => {
  void apiClient;
  void listingId;
  void dateFrom;
  void dateTo;
  void priceNgwee;
  return { success: true };
};
