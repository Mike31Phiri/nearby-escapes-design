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

interface BookingState {
  // Stay booking
  stayDetails: BookingDetails | null;
  guestInfo: BookingGuest | null;
  paymentInfo: BookingPayment | null;

  // Package booking
  packageDetails: PackageBookingDetails | null;

  // UI state
  currentStep: number;
  isProcessing: boolean;
  bookingConfirmed: boolean;
  confirmationId: string | null;

  // Actions
  setStayDetails: (details: BookingDetails) => void;
  setPackageDetails: (details: PackageBookingDetails) => void;
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
      guestInfo: null,
      paymentInfo: null,
      currentStep: 1,
      isProcessing: false,
      bookingConfirmed: false,
      confirmationId: null,

      // Actions
      setStayDetails: (details) => set({ stayDetails: details, currentStep: 2 }),
      setPackageDetails: (details) => set({ packageDetails: details, currentStep: 2 }),
      setGuestInfo: (info) => set({ guestInfo: info }),
      setPaymentInfo: (info) => set({ paymentInfo: info }),
      setCurrentStep: (step) => set({ currentStep: step }),
      setIsProcessing: (processing) => set({ isProcessing: processing }),
      setBookingConfirmed: (confirmed, confirmationId) =>
        set({
          bookingConfirmed: confirmed,
          confirmationId: confirmationId || null,
          currentStep: confirmed ? 4 : 3,
        }),
      resetBooking: () =>
        set({
          stayDetails: null,
          packageDetails: null,
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
        guestInfo: state.guestInfo,
        currentStep: state.currentStep,
      }),
    },
  ),
);
