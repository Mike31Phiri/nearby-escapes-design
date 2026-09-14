import type { ListingVertical } from "./listing";

export type BookingStatus = "confirmed" | "completed" | "cancelled";
// NOTE: No 'pending' — the platform is Instant Book only.

// Booking — one line-item booking for a single listing
export interface Booking {
  id: string;
  /** The parent Trip this booking belongs to */
  tripId: string;
  listingId: string;
  listingVertical: ListingVertical;
  guestId: string;
  hostId: string;
  /** ISO 8601 date string e.g. '2025-08-15' */
  checkIn: string;
  /** ISO 8601 date string e.g. '2025-08-18' */
  checkOut: string;
  guests: number;
  /** Total charge to guest in Ngwee (integer). Never float. */
  totalNgwee: number;
  /** Platform service fee portion in Ngwee (integer). Never float. */
  serviceFeeNgwee: number;
  status: BookingStatus;
  /** Human-readable reference e.g. 'NE-2025-00341' */
  bookingRef: string;
  createdAt: string;
}

// Trip — groups related bookings for a single guest itinerary
export interface Trip {
  id: string;
  guestId: string;
  /** Primary stay booking, or null if the trip has no stay */
  stay: Booking | null;
  /** Zero or more experience bookings on this trip */
  experiences: Booking[];
  /** Transport booking, or null if none */
  transport: Booking | null;
  /** Sum of all bookings in Ngwee (integer). Never float. */
  totalNgwee: number;
  createdAt: string;
}

// AddOn — an extra item attached to a trip after initial booking
export interface AddOn {
  id: string;
  tripId: string;
  listingId: string;
  vertical: ListingVertical;
  /** Price of this add-on in Ngwee (integer). Never float. */
  priceNgwee: number;
  addedAt: string;
}
