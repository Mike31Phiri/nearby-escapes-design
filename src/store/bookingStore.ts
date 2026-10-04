"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/safeStorage";

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
  customerEmail?: string;
  hostName?: string;
  hostEmail?: string;
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
  isLoading: boolean;
  addBooking: (booking: ConfirmedBooking) => void;
  cancelBooking: (bookingRef: string) => void;
  getBookingByRef: (bookingRef: string) => ConfirmedBooking | undefined;
  getBookingsByListing: (listingId: string) => ConfirmedBooking[];
  getUpcomingBookings: () => ConfirmedBooking[];
  getPastBookings: () => ConfirmedBooking[];
  fetchMyBookings: () => Promise<void>;
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      bookings: [],
      isLoading: false,

      fetchMyBookings: async () => {
        set({ isLoading: true });
        try {
          const { getMyBookings } = await import("@/lib/api/bookings");
          const apiBookings = await getMyBookings();
          if (apiBookings && apiBookings.length > 0) {
            const mapped: ConfirmedBooking[] = apiBookings.map((b) => ({
              id: b.id || b.bookingRef,
              bookingRef: b.bookingRef,
              type: (b.vertical as any) || "stay",
              listingName: b.listingTitle || "Reservation",
              listingId: b.listingId,
              location: "Zambia",
              image:
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
              amount: (b.totalNgwee || 0) / 100,
              currency: "ZMW",
              status: b.status === "cancelled" ? "cancelled" : "confirmed",
              transToken: b.tripId || "",
              customerName: "Guest",
              customerPhone: "",
              details: {
                checkIn: b.checkIn || undefined,
                checkOut: b.checkOut || undefined,
                date: b.date || undefined,
                guests: b.guests || 1,
              },
              createdAt: b.createdAt || new Date().toISOString(),
            }));

            const current = get().bookings;
            const existingRefs = new Set(mapped.map((m) => m.bookingRef));
            const uniqueLocal = current.filter((c) => !existingRefs.has(c.bookingRef));
            set({ bookings: [...mapped, ...uniqueLocal], isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch {
          set({ isLoading: false });
        }
      },

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

      getBookingsByListing: (listingId) => get().bookings.filter((b) => b.listingId === listingId),

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
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({ bookings: state.bookings }),
    },
  ),
);
