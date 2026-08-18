"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/safeStorage";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface ManifestGuest {
  id: string;
  name: string;
  partySize: number;
  paymentStatus: "paid" | "pending";
}

export interface ManifestGuestRow extends ManifestGuest {
  checkedIn: boolean;
}

export interface ManifestSlot {
  listingId: string;
  listingName: string;
  emoji: string;
  date: string;
  time: string;
  guests: ManifestGuestRow[];
  /** Total people (sum of party sizes) */
  totalPeople: number;
  checkedInPeople: number;
}

export interface BookingPartyBreakdown {
  adults: number;
  children: number;
  seniors: number;
}

export type BookingStatus = "confirmed" | "cancelled";

export interface BookingRecord {
  ref: string;
  listingId: string;
  listingName: string;
  emoji: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  date: string;
  time: string;
  party: BookingPartyBreakdown;
  total: number;
  paymentStatus: "paid" | "pending";
  status: BookingStatus;
  refundAmount?: number;
  cancelledAt?: string;
}

/* ------------------------------------------------------------------ */
/* Deterministic manifest generation                                   */
/* ------------------------------------------------------------------ */

const GUEST_POOL = [
  "Amina Zulu",
  "Brian Tembo",
  "Chanda Mwansa",
  "Natasha Banda",
  "Given Chisala",
  "Sipho Ngoma",
  "Lushomo Phiri",
  "Mwila Lungu",
  "Thandiwe Kunda",
  "Peter Mwale",
  "Grace Banda",
  "James Mulenga",
  "Emily Phiri",
  "Daniel Sakala",
  "Ruth Musonda",
  "Chipo Daka",
];

function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

/** Stable guest list for a tour slot — same input always yields the same guests. */
export function getManifestGuests(listingId: string, date: string, time: string): ManifestGuest[] {
  const count = 3 + Math.floor(hashSeed(`${listingId}|${date}|${time}|n`) * 4); // 3–6 groups
  const guests: ManifestGuest[] = [];
  for (let i = 0; i < count; i++) {
    const name =
      GUEST_POOL[Math.floor(hashSeed(`${listingId}|${date}|${time}|${i}g`) * GUEST_POOL.length)];
    const partySize = 1 + Math.floor(hashSeed(`${listingId}|${date}|${time}|${i}p`) * 4);
    const paymentStatus =
      hashSeed(`${listingId}|${date}|${time}|${i}pay`) < 0.85 ? "paid" : "pending";
    guests.push({ id: `g-${i}`, name, partySize, paymentStatus });
  }
  return guests;
}

export function getSlotKey(listingId: string, date: string, time: string): string {
  return `${listingId}|${date}|${time}`;
}

/**
 * Build the full manifest slot for a listing/date/time, applying the
 * persisted check-in overrides on top of the deterministic guest list.
 */
export function getManifestSlot(
  listingId: string,
  listingName: string,
  emoji: string,
  date: string,
  time: string,
  checkIns: Record<string, Record<string, boolean>>,
): ManifestSlot {
  const slotKey = getSlotKey(listingId, date, time);
  const overrides = checkIns[slotKey] ?? {};
  const guests: ManifestGuestRow[] = getManifestGuests(listingId, date, time).map((g) => ({
    ...g,
    checkedIn: Boolean(overrides[g.id]),
  }));
  const totalPeople = guests.reduce((sum, g) => sum + g.partySize, 0);
  const checkedInPeople = guests
    .filter((g) => g.checkedIn)
    .reduce((sum, g) => sum + g.partySize, 0);
  return { listingId, listingName, emoji, date, time, guests, totalPeople, checkedInPeople };
}

/* ------------------------------------------------------------------ */
/* Refund logic                                                        */
/* ------------------------------------------------------------------ */

export interface RefundInfo {
  /** "Outside 48 hours" → 100%, otherwise 50% */
  percent: number;
  amount: number;
  fullRefund: boolean;
}

export function getRefundInfo(booking: Pick<BookingRecord, "date" | "time" | "total">): RefundInfo {
  const tourAt = new Date(`${booking.date}T${booking.time}:00`).getTime();
  const hoursUntil = (tourAt - Date.now()) / 36e5;
  const fullRefund = hoursUntil > 48;
  const percent = fullRefund ? 100 : 50;
  return { percent, amount: Math.round((booking.total * percent) / 100), fullRefund };
}

export const formatKw = (amount: number) =>
  `K${amount.toLocaleString("en-ZM", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ------------------------------------------------------------------ */
/* Seeded booking records                                              */
/* ------------------------------------------------------------------ */

function iso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function seedBookings(): BookingRecord[] {
  const today = new Date();
  const at = (offsetDays: number) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offsetDays);
    return iso(d);
  };

  return [
    {
      ref: "NE-4821",
      listingId: "t-sunset-kayak",
      listingName: "Sunset Kayak Tour",
      emoji: "🛶",
      guestName: "Amina Zulu",
      guestEmail: "amina.zulu@email.com",
      guestPhone: "+260 97 555 0192",
      date: at(0),
      time: "14:00",
      party: { adults: 2, children: 1, seniors: 0 },
      total: 840,
      paymentStatus: "paid",
      status: "confirmed",
    },
    {
      ref: "NE-4817",
      listingId: "t-city-food-walk",
      listingName: "City Food Walk",
      emoji: "🍜",
      guestName: "Brian Tembo",
      guestEmail: "brian.tembo@work.com",
      guestPhone: "+260 96 555 2211",
      date: at(0),
      time: "10:00",
      party: { adults: 2, children: 0, seniors: 0 },
      total: 480,
      paymentStatus: "paid",
      status: "confirmed",
    },
    {
      ref: "NE-4805",
      listingId: "t-pottery-workshop",
      listingName: "Pottery Workshop",
      emoji: "🏺",
      guestName: "Chanda Mwansa",
      guestEmail: "chanda.mwansa@example.com",
      guestPhone: "+260 97 555 8834",
      date: at(0),
      time: "11:00",
      party: { adults: 1, children: 0, seniors: 0 },
      total: 240,
      paymentStatus: "pending",
      status: "confirmed",
    },
    {
      ref: "NE-4798",
      listingId: "t-sunset-kayak",
      listingName: "Sunset Kayak Tour",
      emoji: "🛶",
      guestName: "Natasha Banda",
      guestEmail: "natasha.banda@travelzambia.com",
      guestPhone: "+260 95 555 7719",
      date: at(2),
      time: "09:00",
      party: { adults: 3, children: 0, seniors: 0 },
      total: 1260,
      paymentStatus: "paid",
      status: "confirmed",
    },
    {
      ref: "NE-4786",
      listingId: "t-city-food-walk",
      listingName: "City Food Walk",
      emoji: "🍜",
      guestName: "Given Chisala",
      guestEmail: "given.chisala@email.com",
      guestPhone: "+260 96 555 4420",
      date: at(1),
      time: "16:00",
      party: { adults: 2, children: 0, seniors: 1 },
      total: 540,
      paymentStatus: "paid",
      status: "confirmed",
    },
    {
      ref: "NE-4772",
      listingId: "t-pottery-workshop",
      listingName: "Pottery Workshop",
      emoji: "🏺",
      guestName: "Sipho Ngoma",
      guestEmail: "sipho.ngoma@example.com",
      guestPhone: "+260 97 555 3358",
      date: at(4),
      time: "11:00",
      party: { adults: 2, children: 0, seniors: 0 },
      total: 480,
      paymentStatus: "paid",
      status: "confirmed",
    },
    {
      ref: "NE-4760",
      listingId: "t-sunset-kayak",
      listingName: "Sunset Kayak Tour",
      emoji: "🛶",
      guestName: "Lushomo Phiri",
      guestEmail: "lushomo.phiri@safari.co.zm",
      guestPhone: "+260 95 555 6074",
      date: at(6),
      time: "09:00",
      party: { adults: 4, children: 0, seniors: 0 },
      total: 1680,
      paymentStatus: "paid",
      status: "confirmed",
    },
    {
      ref: "NE-4751",
      listingId: "t-city-food-walk",
      listingName: "City Food Walk",
      emoji: "🍜",
      guestName: "Mwila Lungu",
      guestEmail: "mwila.lungu@email.com",
      guestPhone: "+260 96 555 1093",
      date: at(-1),
      time: "10:00",
      party: { adults: 2, children: 0, seniors: 0 },
      total: 480,
      paymentStatus: "paid",
      status: "confirmed",
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Store                                                               */
/* ------------------------------------------------------------------ */

interface HostBookingsState {
  /** slotKey → guestId → checkedIn */
  checkIns: Record<string, Record<string, boolean>>;
  bookings: BookingRecord[];
  /** Day the booking seeds were generated for — refreshed daily so refund calcs stay correct */
  seededOn: string;

  toggleGuestCheckIn: (slotKey: string, guestId: string) => void;
  /** Check in the first unchecked guest (used by the simulated QR scan). Returns that guest. */
  checkInFirstUnchecked: (slotKey: string, date: string, time: string) => ManifestGuestRow | null;
  cancelBooking: (ref: string) => BookingRecord | undefined;
  getBookingByRef: (ref: string) => BookingRecord | undefined;
}

export const useHostBookingsStore = create<HostBookingsState>()(
  persist(
    (set, get) => ({
      checkIns: {},
      bookings: seedBookings(),
      seededOn: iso(new Date()),

      toggleGuestCheckIn: (slotKey, guestId) =>
        set((state) => {
          const overrides = { ...(state.checkIns[slotKey] ?? {}) };
          overrides[guestId] = !overrides[guestId];
          return { checkIns: { ...state.checkIns, [slotKey]: overrides } };
        }),

      checkInFirstUnchecked: (slotKey, date, time) => {
        const [listingId] = slotKey.split("|");
        const store = get();
        // Derive the current manifest to find the first unchecked guest.
        const guests = getManifestGuests(listingId, date, time);
        const overrides = store.checkIns[slotKey] ?? {};
        const target = guests.find((g) => !overrides[g.id]);
        if (!target) return null;
        set((state) => ({
          checkIns: {
            ...state.checkIns,
            [slotKey]: { ...(state.checkIns[slotKey] ?? {}), [target.id]: true },
          },
        }));
        return { ...target, checkedIn: true };
      },

      cancelBooking: (ref) => {
        const booking = get().bookings.find((b) => b.ref === ref);
        if (!booking || booking.status === "cancelled") return booking;
        const refund = getRefundInfo(booking);
        const updated: BookingRecord = {
          ...booking,
          status: "cancelled",
          refundAmount: refund.amount,
          cancelledAt: new Date().toISOString(),
        };
        set((state) => ({
          bookings: state.bookings.map((b) => (b.ref === ref ? updated : b)),
        }));
        return updated;
      },

      getBookingByRef: (ref) => get().bookings.find((b) => b.ref === ref),
    }),
    {
      name: "nearby-escapes-host-bookings",
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({
        checkIns: state.checkIns,
        bookings: state.bookings,
        seededOn: state.seededOn,
      }),
      // Booking dates are relative to "today" — re-seed on a new day so the
      // 48-hour refund calculation stays honest (cancellations reset overnight).
      merge: (persisted, current) => {
        const p = persisted as Partial<HostBookingsState> | null | undefined;
        const today = iso(new Date());
        const stale = !p || p.seededOn !== today;
        return {
          ...current,
          ...(p ?? {}),
          bookings: stale ? seedBookings() : (p.bookings ?? current.bookings),
          seededOn: today,
        };
      },
    },
  ),
);
