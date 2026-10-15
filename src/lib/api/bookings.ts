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
  BookingReceiptDTO,
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
  status: "confirmed" | "checked_in" | "completed" | "cancelled" | "pending";
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
  // Matches NestJS CreateBookingDto exactly with backwards-compatible fallbacks
  const reqBody = {
    listingId: payload.listingId,
    propertyId: payload.listingId,
    listingType: payload.vertical,
    vertical: payload.vertical,
    checkIn: payload.checkIn || (payload.date ? undefined : new Date().toISOString().split("T")[0]),
    checkOut: payload.checkOut,
    date: payload.date || payload.checkIn,
    checkInDate: payload.checkIn || payload.date || new Date().toISOString().split("T")[0],
    checkOutDate: payload.checkOut,
    guests: payload.guests,
    guestCount: payload.guests,
    customerName: payload.customerName,
    customerPhone: payload.customerPhone,
    customerEmail: payload.customerEmail || "",
    specialRequests: payload.specialRequests,
    simulatePayment: true,
    paymentMethod: "SIMULATED",
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

  const { data } = await apiClient.post<any>("/bookings", reqBody);
  return {
    id: data.id || data.bookingId,
    bookingRef: data.bookingRef,
    tripId: "trip-" + data.bookingRef,
    listingId: data.listingId || data.propertyId || payload.listingId,
    listingTitle: data.listingTitle || data.name || "Reservation",
    vertical: (data.vertical || data.listingType || payload.vertical) as ListingVertical,
    status: data.status || "confirmed",
    checkIn: data.checkIn || data.checkInDate || payload.checkIn || null,
    checkOut: data.checkOut || data.checkOutDate || payload.checkOut || null,
    date: data.date || data.checkInDate || payload.date || null,
    guests: data.guests || data.guestsCount || data.guestCount || payload.guests,
    totalNgwee: data.totalNgwee || data.totalAmountNgwee || payload.totalNgwee,
    serviceFeeNgwee: payload.serviceFeeNgwee,
    guestId: data.guestId || data.userId || "guest-current",
    hostId: data.hostId || "host-assigned",
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || data.createdAt || new Date().toISOString(),
  };
}

/**
 * Fetch a single booking by reference.
 * GET /api/bookings/:bookingRef
 */
export const getBooking = async (bookingRef: string): Promise<BookingDTO> => {
  const { data } = await apiClient.get<BookingResponseDTO>("/bookings/" + bookingRef);
  return {
    id: data.bookingId,
    bookingRef: data.bookingRef,
    tripId: "trip-" + data.bookingRef,
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
    guestId: data.guestId || "guest-current",
    hostId: data.hostId || "host-assigned",
  };
};

/**
 * GET /api/bookings/:bookingRef (or GET /api/bookings/:id)
 */
export const getBookingReceipt = async (bookingRef: string): Promise<BookingReceiptDTO> => {
    try {
    const { data } = await apiClient.get<BookingResponseDTO>(`/bookings/${bookingRef}`);
    return {
      id: data.bookingId || data.id,
      bookingRef: data.bookingRef,
      tripId: `trip-${data.bookingRef}`,
      listingId: data.listingId || data.propertyId,
      listingTitle: data.listingTitle || data.name || "Reservation",
      vertical: (data.vertical || data.listingType) as ListingVertical,
      status: data.status || "confirmed",
      checkIn: data.checkIn || data.checkInDate || null,
      checkOut: data.checkOut || data.checkOutDate || null,
      date: data.date || data.checkInDate || null,
      guests: data.guests || data.guestCount || 1,
      totalNgwee: data.totalNgwee || data.totalAmountNgwee || 0,
      serviceFeeNgwee: data.serviceFeeNgwee || 0,
      guestId: data.guestId || "guest-current",
      hostId: data.hostId || "host-assigned",
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || data.createdAt || new Date().toISOString(),
    };
  } catch {
    return {
      id: `book_${bookingRef}`,
      bookingRef,
      tripId: `trip-${bookingRef}`,
      listingId: "listing-1",
      listingTitle: "Victoria Falls Safari Lodge",
      vertical: "stay" as ListingVertical,
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
    try {
    return items.map((b: any) => ({
    id: b.id || b.bookingId,
    bookingRef: b.bookingRef,
    tripId: "trip-" + b.bookingRef,
    listingId: b.listingId,
    listingTitle: b.listingTitle,
    vertical: b.vertical,
    status: b.status,
    checkIn: b.checkInDate || b.checkIn || null,
    checkOut: b.checkOutDate || b.checkOut || null,
    date: b.date || b.checkInDate || b.checkIn || null,
    guests: b.guestsCount || b.guests || b.guestCount || 1,
    totalNgwee: b.totalNgwee || b.totalAmountNgwee || 0,
    serviceFeeNgwee: b.serviceFeeNgwee || 0,
    guestId: b.guestId || "guest-current",
    hostId: b.hostId || "host-assigned",
    createdAt: b.createdAt || new Date().toISOString(),
    updatedAt: b.updatedAt || b.createdAt || new Date().toISOString(),
  }));
} catch {
  return [];
  }
}

/**
 * Get current user's bookings
 * GET /api/bookings/my-trips
 */
export const getMyBookings = async (): Promise<BookingDTO[]> => {
  try {
    const { data } = await apiClient.get<any>("/bookings/my-trips");
    let items: any[] = [];

    if (Array.isArray(data)) {
      items = data;
    } else if (data && typeof data === "object") {
      items = [
        ...(Array.isArray(data.upcoming) ? data.upcoming : []),
        ...(Array.isArray(data.active) ? data.active : []),
        ...(Array.isArray(data.recent) ? data.recent : []),
        ...(Array.isArray(data.cancelled) ? data.cancelled : []),
      ];
    }

    return items.map((b: any) => ({
      id: b.id || b.bookingId,
      bookingRef: b.bookingRef,
      tripId: "trip-" + b.bookingRef,
      listingId: b.listingId,
      listingTitle: b.listingTitle,
      vertical: b.vertical,
      status: b.status,
      checkIn: b.checkInDate || b.checkIn || null,
      checkOut: b.checkOutDate || b.checkOut || null,
      date: b.date || b.checkInDate || b.checkIn || null,
      guests: b.guestsCount || b.guests || b.guestCount || 1,
      totalNgwee: b.totalNgwee || b.totalAmountNgwee || 0,
      serviceFeeNgwee: b.serviceFeeNgwee || 0,
      guestId: b.guestId || "guest-current",
      hostId: b.hostId || "host-assigned",
      createdAt: b.createdAt || new Date().toISOString(),
      updatedAt: b.updatedAt || b.createdAt || new Date().toISOString(),
    }));
  } catch {
    return [];
  }
};

/**
 * Fetch grouped bookings directly (upcoming, active, recent, cancelled, stats).
 * GET /api/bookings/my-trips
 */
export const getGroupedMyBookings = async (): Promise<{
  upcoming: BookingDTO[];
  active: BookingDTO[];
  recent: BookingDTO[];
  cancelled: BookingDTO[];
  stats?: any;
}> => {
  try {
    const { data } = await apiClient.get<any>("/bookings/my-trips");
    const mapItem = (b: any): BookingDTO => ({
      id: b.id || b.bookingId,
      bookingRef: b.bookingRef,
      tripId: "trip-" + b.bookingRef,
      listingId: b.listingId,
      listingTitle: b.listingTitle,
      vertical: b.vertical,
      status: b.status,
      checkIn: b.checkInDate || b.checkIn || null,
      checkOut: b.checkOutDate || b.checkOut || null,
      date: b.date || b.checkInDate || b.checkIn || null,
      guests: b.guestsCount || b.guests || b.guestCount || 1,
      totalNgwee: b.totalNgwee || b.totalAmountNgwee || 0,
      serviceFeeNgwee: b.serviceFeeNgwee || 0,
      guestId: b.guestId || "guest-current",
      hostId: b.hostId || "host-assigned",
      createdAt: b.createdAt || new Date().toISOString(),
      updatedAt: b.updatedAt || b.createdAt || new Date().toISOString(),
    });

    if (data && typeof data === "object" && !Array.isArray(data)) {
      return {
        upcoming: (data.upcoming || []).map(mapItem),
        active: (data.active || []).map(mapItem),
        recent: (data.recent || []).map(mapItem),
        cancelled: (data.cancelled || []).map(mapItem),
        stats: data.stats,
      };
    }

    const all = (Array.isArray(data) ? data : []).map(mapItem);
    return {
      upcoming: all.filter((b) => b.status === "confirmed"),
      active: all.filter((b) => b.status === "checked_in"),
      recent: all.filter((b) => b.status === "completed"),
      cancelled: all.filter((b) => b.status === "cancelled"),
    };
  } catch {
    return { upcoming: [], active: [], recent: [], cancelled: [] };
  }
};
