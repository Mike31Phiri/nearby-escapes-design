import { create } from "zustand";

type BookingStep = "review" | "payment" | "confirmation";
type PaymentStatus = "idle" | "processing" | "succeeded" | "failed";

interface BookingState {
  listingId: string | null;
  listingVertical: "stay" | "experience" | "transport" | null;
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  /** Total amount in Ngwee (integer). Never float. */
  totalNgwee: number;
  /** Service fee in Ngwee (integer). Never float. */
  serviceFeeNgwee: number;
  currentStep: BookingStep;
  paymentStatus: PaymentStatus;
  dpoIframeUrl: string | null;
  bookingRef: string | null;
  tripId: string | null;
  setListing: (id: string, vertical: "stay" | "experience" | "transport") => void;
  setDates: (checkIn: string, checkOut: string) => void;
  setGuests: (guests: number) => void;
  setPricing: (totalNgwee: number, serviceFeeNgwee: number) => void;
  setStep: (step: BookingStep) => void;
  setPaymentStatus: (status: PaymentStatus) => void;
  setDPOIframeUrl: (url: string) => void;
  /** Called on successful DPO confirmation — advances to confirmation step immediately (Instant Book). */
  setConfirmed: (bookingRef: string, tripId: string) => void;
  reset: () => void;
}

const initialState = {
  listingId: null,
  listingVertical: null,
  checkIn: null,
  checkOut: null,
  guests: 1,
  totalNgwee: 0,
  serviceFeeNgwee: 0,
  currentStep: "review" as BookingStep,
  paymentStatus: "idle" as PaymentStatus,
  dpoIframeUrl: null,
  bookingRef: null,
  tripId: null,
};

export const useBookingStore = create<BookingState>((set) => ({
  ...initialState,
  setListing: (id, vertical) => set({ listingId: id, listingVertical: vertical }),
  setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
  setGuests: (guests) => set({ guests }),
  setPricing: (totalNgwee, serviceFeeNgwee) => set({ totalNgwee, serviceFeeNgwee }),
  setStep: (step) => set({ currentStep: step }),
  setPaymentStatus: (status) => set({ paymentStatus: status }),
  setDPOIframeUrl: (url) => set({ dpoIframeUrl: url }),
  setConfirmed: (bookingRef, tripId) =>
    set({ bookingRef, tripId, currentStep: "confirmation", paymentStatus: "succeeded" }),
  reset: () => set(initialState),
}));
