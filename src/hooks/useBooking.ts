import { useEffect, useMemo, useState } from "react";
import { BOOKING_DRAFT_STORAGE_KEY } from "@/store/bookingStore";

export type BookingDraft = {
  stayId?: string;
  stayName?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  pricePerNight?: number;
};

export function useBooking(input?: { checkIn?: string; checkOut?: string; pricePerNight?: number }) {
  const [draft, setDraft] = useState<BookingDraft>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(BOOKING_DRAFT_STORAGE_KEY);
      if (raw) setDraft(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const checkIn = input?.checkIn ?? draft.checkIn;
  const checkOut = input?.checkOut ?? draft.checkOut;
  const pricePerNight = input?.pricePerNight ?? draft.pricePerNight ?? 0;

  return useMemo(() => {
    const nights =
      checkIn && checkOut
        ? Math.max(
            0,
            Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000),
          )
        : 0;
    const subtotal = nights * pricePerNight;
    const serviceFee = Math.round(subtotal * 0.12);
    const total = subtotal + serviceFee;
    return { nights, subtotal, serviceFee, total, pricePerNight, draft };
  }, [checkIn, checkOut, pricePerNight, draft]);
}
