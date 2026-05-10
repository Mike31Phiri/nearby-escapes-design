import { create } from "zustand";
import { persist } from "zustand/middleware";

export const BOOKING_DRAFT_STORAGE_KEY = "ne.bookingDraft";

export interface BookingGuest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export interface BookingPayment {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  billingAddress: string;
  billingCity: string;
  billingPostalCode: string;
  billingCountry: string;
}

export interface BookingDetails {
  listingId?: string;
  listingName?: string;
  listingImage?: string;
  checkIn?: Date;
  checkOut?: Date;
  guests: number;
  pricePerNight: number;
  nights: number;
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  taxes: number;
  total: number;
}

export interface PackageBookingDetails {
  packageId?: string;
  packageName?: string;
  packageImage?: string;
  travelDate?: Date;
  guests: number;
  pricePerPerson: number;
  duration: string;
  location: string;
  subtotal: number;
  serviceFee: number;
  taxes: number;
  total: number;
}

export interface TransportBookingDetails {
  transportId?: string;
  route?: string;
  operator?: string;
  departureDate?: string;
  departureTime?: string;
  arrivalTime?: string;
  passengers: number;
  pricePerPassenger: number;
  subtotal: number;
  serviceFee: number;
  taxes: number;
  total: number;
}

interface BookingState {
  // Stay booking
  stayDetails: BookingDetails | null;
  guestInfo: BookingGuest | null;
  paymentInfo: BookingPayment | null;

  // Package booking
  packageDetails: PackageBookingDetails | null;

  // Transport booking
  transportDetails: TransportBookingDetails | null;

  // Booking history
  bookingHistory: Array<{
    id: string;
    date: string;
    type: "stay" | "package" | "transport";
    details: any;
    status: "upcoming" | "past" | "cancelled";
  }>;

  // UI state
  currentStep: number;
  isProcessing: boolean;
  bookingConfirmed: boolean;
  confirmationId: string | null;

  // Actions
  setStayDetails: (details: BookingDetails) => void;
  setPackageDetails: (details: PackageBookingDetails) => void;
  setTransportDetails: (details: TransportBookingDetails) => void;
  setGuestInfo: (info: BookingGuest) => void;
  setPaymentInfo: (info: BookingPayment) => void;
  setCurrentStep: (step: number) => void;
  setIsProcessing: (processing: boolean) => void;
  setBookingConfirmed: (confirmed: boolean, confirmationId?: string) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      // Initial state
      stayDetails: null,
      packageDetails: null,
      transportDetails: null,
      guestInfo: null,
      paymentInfo: null,
      bookingHistory: [],
      currentStep: 1,
      isProcessing: false,
      bookingConfirmed: false,
      confirmationId: null,

      // Actions
      setStayDetails: (details) => set({ stayDetails: details, currentStep: 2 }),
      setPackageDetails: (details) => set({ packageDetails: details, currentStep: 2 }),
      setTransportDetails: (details) => set({ transportDetails: details, currentStep: 2 }),
      setGuestInfo: (info) => set({ guestInfo: info }),
      setPaymentInfo: (info) => set({ paymentInfo: info }),
      setCurrentStep: (step) => set({ currentStep: step }),
      setIsProcessing: (processing) => set({ isProcessing: processing }),
      setBookingConfirmed: (confirmed, confirmationId) =>
        set((state) => {
          if (confirmed && confirmationId) {
            const type = state.stayDetails ? "stay" : state.packageDetails ? "package" : state.transportDetails ? "transport" : "stay";
            const details = state.stayDetails || state.packageDetails || state.transportDetails;
            const newBooking = {
              id: confirmationId,
              date: new Date().toISOString(),
              type,
              details,
              status: "upcoming" as const,
            };
            return {
              bookingConfirmed: confirmed,
              confirmationId: confirmationId,
              currentStep: 4,
              bookingHistory: [...state.bookingHistory, newBooking],
            };
          }
          return {
            bookingConfirmed: confirmed,
            confirmationId: confirmationId || null,
            currentStep: confirmed ? 4 : 3,
          };
        }),
      resetBooking: () =>
        set({
          stayDetails: null,
          packageDetails: null,
          transportDetails: null,
          guestInfo: null,
          paymentInfo: null,
          currentStep: 1,
          isProcessing: false,
          bookingConfirmed: false,
          confirmationId: null,
        }),
    }),
    {
      name: BOOKING_DRAFT_STORAGE_KEY,
      partialize: (state) => ({
        stayDetails: state.stayDetails,
        packageDetails: state.packageDetails,
        transportDetails: state.transportDetails,
        guestInfo: state.guestInfo,
        bookingHistory: state.bookingHistory,
        currentStep: state.currentStep,
      }),
    },
  ),
);
