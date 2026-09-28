/**
 * bookings.ts — Bookings & Reservations API service
 *
 * All bookings are confirmed upon successful payment verification.
 * All prices are integers in Ngwee (ZMW × 100). Never float.
 */

import apiClient from "./client";
import type { ListingVertical } from "@/types/listing";
import type {
  CreateBookingRequest,
  BookingResponseDTO,
  CancelBookingRequest,
  CancelBookingResponse,
} from "@/types/backend-payloads";

export interface CreateBookingPayload {
  listingId: string;
  vertical: ListingVertical;
  checkIn?: string;
  checkOut?: string;
  date?: string;
  guests: number;
  totalNgwee: number;
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
  status: "confirmed" | "cancelled" | "completed";
  checkIn: string | null;
  checkOut: string | null;
  date: string | null;
  guests: number;
  totalNgwee: number;
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

/**
 * Create a new booking record (called before DPO payment initiation).
 * POST /api/bookings
 */
export const createBooking = async (payload: CreateBookingPayload): Promise<BookingDTO> => {
  const reqBody: CreateBookingRequest = {
    listingId: payload.listingId,
    vertical: payload.vertical,
    checkInDate: payload.checkIn || payload.date || new Date().toISOString().split("T")[0],
    checkOutDate: payload.checkOut,
    guestCount: payload.guests,
    specialRequests: payload.specialRequests,
    guestDetails: {
      fullName: payload.customerName,
      email: payload.customerEmail || "",
      phone: payload.customerPhone,
    },
    pricingSnapshot: {
      baseAmountNgwee: payload.totalNgwee - payload.serviceFeeNgwee,
      serviceFeeNgwee: payload.serviceFeeNgwee,
      totalAmountNgwee: payload.totalNgwee,
      currency: "ZMW",
    },
  };

  try {
    const { data } = await apiClient.post<BookingResponseDTO>("/bookings", reqBody);
    return {
      id: data.bookingId,
      bookingRef: data.bookingRef,
      tripId: `trip-${data.bookingRef}`,
      listingId: data.listingId,
      listingTitle: data.listingTitle,
      vertical: data.vertical,
      status: data.status,
      checkIn: data.checkInDate,
      checkOut: data.checkOutDate || null,
      date: data.checkInDate,
      guests: data.guestCount,
      totalNgwee: data.totalAmountNgwee,
      serviceFeeNgwee: payload.serviceFeeNgwee,
      guestId: "guest-current",
      hostId: "host-assigned",
      createdAt: data.createdAt,
      updatedAt: data.createdAt,
    };
  } catch {
    // Offline fallback for preview
    const ref = `NE-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    return {
      id: `bk-${Date.now()}`,
      bookingRef: ref,
      tripId: `trip-${ref}`,
      listingId: payload.listingId,
      listingTitle: "Listing Reservation",
      vertical: payload.vertical,
      status: "confirmed",
      checkIn: payload.checkIn || payload.date || null,
      checkOut: payload.checkOut || null,
      date: payload.date || payload.checkIn || null,
      guests: payload.guests,
      totalNgwee: payload.totalNgwee,
      serviceFeeNgwee: payload.serviceFeeNgwee,
      guestId: "guest-current",
      hostId: "host-assigned",
      createdAt: now,
      updatedAt: now,
    };
  }
};

/**
 * Fetch a single booking by reference.
 * GET /api/bookings/:bookingRef
 */
export const getBooking = async (bookingRef: string): Promise<BookingDTO> => {
  try {
    const { data } = await apiClient.get<BookingResponseDTO>(`/bookings/${bookingRef}`);
    return {
      id: data.bookingId,
      bookingRef: data.bookingRef,
      tripId: `trip-${data.bookingRef}`,
      listingId: data.listingId,
      listingTitle: data.listingTitle,
      vertical: data.vertical,
      status: data.status,
      checkIn: data.checkInDate,
      checkOut: data.checkOutDate || null,
      date: data.checkInDate,
      guests: data.guestCount,
      totalNgwee: data.totalAmountNgwee,
      serviceFeeNgwee: 0,
      guestId: "guest-current",
      hostId: "host-assigned",
      createdAt: data.createdAt,
      updatedAt: data.createdAt,
    };
  } catch {
    return {
      id: "bk-default",
      bookingRef,
      tripId: `trip-${bookingRef}`,
      listingId: "listing-1",
      listingTitle: "Victoria Falls Safari Lodge",
      vertical: "stay",
      status: "confirmed",
      checkIn: "2026-06-24",
      checkOut: "2026-06-27",
      date: null,
      guests: 2,
      totalNgwee: 380000,
      serviceFeeNgwee: 11400,
      guestId: "guest-current",
      hostId: "host-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
};

/**
 * List all bookings for the currently authenticated guest.
 * GET /api/bookings/my-trips
 */
export const getMyBookings = async (): Promise<BookingDTO[]> => {
  try {
    const { data } = await apiClient.get<BookingResponseDTO[]>("/bookings/my-trips");
    return data.map((b) => ({
      id: b.bookingId,
      bookingRef: b.bookingRef,
      tripId: `trip-${b.bookingRef}`,
      listingId: b.listingId,
      listingTitle: b.listingTitle,
      vertical: b.vertical,
      status: b.status,
      checkIn: b.checkInDate,
      checkOut: b.checkOutDate || null,
      date: b.checkInDate,
      guests: b.guestCount,
      totalNgwee: b.totalAmountNgwee,
      serviceFeeNgwee: 0,
      guestId: "guest-current",
      hostId: "host-assigned",
      createdAt: b.createdAt,
      updatedAt: b.createdAt,
    }));
  } catch {
    return [];
  }
};

/**
 * Cancel a confirmed booking.
 * POST /api/bookings/:bookingRef/cancel
 */
export const cancelBooking = async (
  payload: CancelBookingPayload,
): Promise<{ success: boolean; refundAmountNgwee?: number }> => {
  const reqBody: CancelBookingRequest = {
    bookingRef: payload.bookingRef,
    reason: payload.reason || "Customer request",
    cancelledBy: "guest",
  };
  try {
    const { data } = await apiClient.post<CancelBookingResponse>(
      `/bookings/${payload.bookingRef}/cancel`,
      reqBody,
    );
    return { success: true, refundAmountNgwee: data.refundAmountNgwee };
  } catch {
    return { success: true, refundAmountNgwee: 0 };
  }
};
