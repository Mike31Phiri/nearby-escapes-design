import { apiRequest } from "./client";
import type { Booking, CreateBookingDto } from "@/types/booking";

export const createBooking = (payload: CreateBookingDto) =>
  apiRequest<Booking>("/bookings", { method: "POST", body: JSON.stringify(payload) });

export const getBookings = (params?: { status?: string; page?: number; limit?: number }) => {
  const qs = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : "";
  return apiRequest<Booking[]>(`/bookings${qs}`);
};

export const getBooking = (id: string) =>
  apiRequest<Booking>(`/bookings/${id}`);

export const cancelBooking = (id: string) =>
  apiRequest<Booking>(`/bookings/${id}/cancel`, { method: "PATCH" });

export const approveBookingByToken = (token: string) =>
  apiRequest<Booking>(`/bookings/approve-by-token/${token}`, { method: "POST" });

export const rejectBookingByToken = (token: string) =>
  apiRequest<Booking>(`/bookings/reject-by-token/${token}`, { method: "POST" });
