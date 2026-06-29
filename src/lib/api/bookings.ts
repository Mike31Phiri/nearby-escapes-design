/**
 * bookings.ts — Bookings API stubs
 *
 * All bookings are Instant Book — confirmed immediately after DPO payment succeeds.
 * There is NO "pending" status. A booking is either confirmed, cancelled, or completed.
 * All prices are integers in Ngwee (ZMW × 100). Never float.
 *
 * TODO: Connect to real API
 */

import apiClient from "./client";
import type { ListingVertical } from "@/types/listing";

export interface CreateBookingPayload {
  listingId: string;
  vertical: ListingVertical;
  checkIn?: string;
  checkOut?: string;
  /** For experiences or transport: single date */
  date?: string;
  guests: number;
  /** Total amount in Ngwee (integer). Never float. */
  totalNgwee: number;
  /** Service fee in Ngwee (integer). Never float. */
  serviceFeeNgwee: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  specialRequests?: string;
}

export interface BookingDTO {
  id: string;
  bookingRef: string;
  tripId: string;
  listingId: string;
  listingTitle: string;
  vertical: ListingVertical;
  /** Confirmed immediately — Instant Book only. */
  status: "confirmed" | "cancelled" | "completed";
  checkIn: string | null;
  checkOut: string | null;
  date: string | null;
  guests: number;
  /** Total charged in Ngwee (integer). Never float. */
  totalNgwee: number;
  /** Service fee in Ngwee (integer). Never float. */
  serviceFeeNgwee: number;
  guestId: string;
  hostId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CancelBookingPayload {
  bookingRef: string;
  reason?: string;
}

/** Create a new booking record (called before DPO payment initiation). */
// TODO: Connect to real API
export const createBooking = async (payload: CreateBookingPayload): Promise<BookingDTO> => {
  void apiClient;
  void payload;
  return {} as BookingDTO;
};

/** Fetch a single booking by reference. */
// TODO: Connect to real API
export const getBooking = async (bookingRef: string): Promise<BookingDTO> => {
  void apiClient;
  void bookingRef;
  return {} as BookingDTO;
};

/** List all bookings for the currently authenticated guest. */
// TODO: Connect to real API
export const getMyBookings = async (): Promise<BookingDTO[]> => {
  void apiClient;
  return [];
};

/** Cancel a confirmed booking. */
// TODO: Connect to real API
export const cancelBooking = async (
  payload: CancelBookingPayload,
): Promise<{ success: boolean }> => {
  void apiClient;
  void payload;
  return { success: true };
};
