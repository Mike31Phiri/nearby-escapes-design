import type {
  CreateBookingRequest,
  BookingResponseDTO,
  CancelBookingRequest,
  CancelBookingResponse,
  Currency,
  BookingStatus,
} from "@/types/backend-payloads";
import type { ListingVertical } from "@/types/listing";

export type {
  CreateBookingRequest,
  BookingResponseDTO,
  CancelBookingRequest,
  CancelBookingResponse,
};

export interface CreateBookingDto {
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

export interface BookingDetailsDto {
  id: string;
  bookingRef: string;
  tripId: string;
  listingId: string;
  listingTitle: string;
  vertical: ListingVertical;
  status: BookingStatus;
  checkIn: string | null;
  checkOut: string | null;
  date: string | null;
  guests: number;
  totalNgwee: number;
  serviceFeeNgwee: number;
  currency: Currency;
  guestId: string;
  hostId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CancelBookingDto {
  bookingRef: string;
  reason?: string;
}
