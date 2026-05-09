export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type CreateBookingDto = {
  stayId: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  guestInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialRequests?: string;
  };
  isGroupBooking?: boolean;
  groupSize?: number;
  items?: { stayId: string; quantity: number }[];
};

export type BookingFees = {
  pricePerNight: number;
  nights: number;
  subtotal: number;
  cleaningFee: number;
  serviceFee: number;
  taxes: number;
  total: number;
};

export type Booking = {
  id: string;
  stayId: string;
  stayName: string;
  stayImage: string;
  stayLocation: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: BookingStatus;
  confirmationId: string;
  fees: BookingFees;
  host: {
    id: string;
    displayName: string;
    avatarUrl?: string;
  };
  createdAt: string;
};
