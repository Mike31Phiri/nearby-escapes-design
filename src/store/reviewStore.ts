"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Review {
  id: string;
  listingId: string;
  listingName: string;
  listingType: "stay" | "experience" | "transport";
  bookingRef: string;
  rating: number;
  text: string;
  date: string;
  guestName: string;
}

interface ReviewStore {
  reviews: Review[];
  addReview: (review: Omit<Review, "id" | "date">) => void;
  getReviewsByListing: (listingId: string) => Review[];
  getReviewsByGuest: (guestName: string) => Review[];
  hasReviewedBooking: (bookingRef: string) => boolean;
  hasReviewedListing: (listingId: string, guestName: string) => boolean;
}

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set, get) => ({
      reviews: [],

      addReview: (reviewData) =>
        set((state) => ({
          reviews: [
            {
              ...reviewData,
              id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              date: new Date().toISOString().split("T")[0],
            },
            ...state.reviews,
          ],
        })),

      getReviewsByListing: (listingId) => get().reviews.filter((r) => r.listingId === listingId),

      getReviewsByGuest: (guestName) => get().reviews.filter((r) => r.guestName === guestName),

      hasReviewedBooking: (bookingRef) => get().reviews.some((r) => r.bookingRef === bookingRef),

      hasReviewedListing: (listingId, guestName) =>
        get().reviews.some((r) => r.listingId === listingId && r.guestName === guestName),
    }),
    {
      name: "nearby-escapes-reviews",
      partialize: (state) => ({ reviews: state.reviews }),
    },
  ),
);
