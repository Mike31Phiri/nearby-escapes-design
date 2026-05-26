"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ConfirmedBooking {
  id: string;
  bookingRef: string;
  type: "stay" | "experience" | "transport";
  listingName: string;
  listingId: string;
  location: string;
  image: string;
  amount: number;
  currency: string;
  status: "confirmed" | "cancelled";
  transToken: string;
  customerName: string;
  customerPhone: string;
  details: {
    checkIn?: string;
    checkOut?: string;
    date?: string;
    guests: number;
    extras?: Record<string, string | number>;
  };
  createdAt: string;
}

interface BookingStore {
  bookings: ConfirmedBooking[];
  addBooking: (booking: ConfirmedBooking) => void;
  cancelBooking: (bookingRef: string) => void;
  getBookingByRef: (bookingRef: string) => ConfirmedBooking | undefined;
  getBookingsByListing: (listingId: string) => ConfirmedBooking[];
  getUpcomingBookings: () => ConfirmedBooking[];
  getPastBookings: () => ConfirmedBooking[];
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      bookings: [],

      addBooking: (booking) =>
        set((state) => ({
          bookings: [booking, ...state.bookings],
        })),

      cancelBooking: (bookingRef) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.bookingRef === bookingRef ? { ...b, status: "cancelled" as const } : b,
          ),
        })),

      getBookingByRef: (bookingRef) => get().bookings.find((b) => b.bookingRef === bookingRef),

      getBookingsByListing: (listingId) =>
        get().bookings.filter((b) => b.listingId === listingId),

      getUpcomingBookings: () => {
        const now = new Date();
        return get().bookings.filter((b) => {
          if (b.status !== "confirmed") return false;
          const bookingDate = b.details.checkIn || b.details.date || "";
          return bookingDate ? new Date(bookingDate) >= now : true;
        });
      },

      getPastBookings: () => {
        const now = new Date();
        return get().bookings.filter((b) => {
          if (b.status !== "confirmed") return false;
          const bookingDate = b.details.checkIn || b.details.date || "";
          return bookingDate ? new Date(bookingDate) < now : false;
        });
      },
    }),
    {
      name: "nearby-escapes-bookings",
      partialize: (state) => ({ bookings: state.bookings }),
    },
  ),
);
