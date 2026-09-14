"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/safeStorage";
import { formatDateObj, getWeekdayIndex } from "@/lib/utils/calendar";

/* Types */

export interface TourListing {
  id: string;
  name: string;
  category: string;
  emoji: string;
  baseCapacity: number;
}

export interface TourSlot {
  id: string;
  /** 24h clock, e.g. "09:00" */
  time: string;
  capacity: number;
}

export type TourScheduleMode = "recurring" | "one-time";

export interface TourSchedule {
  mode: TourScheduleMode;
  /** 0 = Monday ... 6 = Sunday (recurring only) */
  daysOfWeek: number[];
  /** ISO date for one-time schedules */
  date?: string;
  timeSlots: TourSlot[];
  /** "none" | "6h" | "12h" | "24h" */
  cutoff: string;
  updatedAt: string;
}

export interface TourDateOverride {
  listingId: string;
  date: string;
}

export interface TourSlotOverride {
  listingId: string;
  date: string;
  time: string;
}

export interface TourCapacityOverride {
  listingId: string;
  date: string;
  time: string;
  /** Effective max bookable seats for this departure (>= 1). */
  capacity: number;
}

export interface TourCutoffOverride {
  listingId: string;
  date: string;
  time: string;
  /** "none" | "6h" | "12h" | "24h" */
  cutoff: string;
}

export interface MockBooking {
  id: string;
  listingId: string;
  date: string;
  time: string;
  guests: number;
  guestName: string;
}

export type TourDayStatus = "available" | "no-slots" | "blocked";

export interface TourDayState {
  status: TourDayStatus;
  /** Number of non-zeroed slots on the day (for the "2 slots" badge) */
  openSlots: number;
}

/* Mock listings */

export const TOUR_LISTINGS: TourListing[] = [
  {
    id: "t-sunset-kayak",
    name: "Sunset Kayak Tour",
    category: "Water activities",
    emoji: "🛶",
    baseCapacity: 15,
  },
  {
    id: "t-city-food-walk",
    name: "City Food Walk",
    category: "Food & drink",
    emoji: "🍜",
    baseCapacity: 12,
  },
  {
    id: "t-pottery-workshop",
    name: "Pottery Workshop",
    category: "Workshops",
    emoji: "🏺",
    baseCapacity: 8,
  },
];

const GUEST_NAMES = [
  "Chanda M.",
  "Thandiwe K.",
  "Brian T.",
  "Natasha B.",
  "Mwansa L.",
  "Given C.",
  "Sipho N.",
  "Lushomo P.",
  "Chipo D.",
  "Joseph Z.",
  "Ruth S.",
  "Peter M.",
];

function makeSlot(time: string, capacity: number): TourSlot {
  return { id: `slot-${time}`, time, capacity };
}

function defaultSchedule(
  mode: TourScheduleMode,
  daysOfWeek: number[],
  times: Array<[string, number]>,
  cutoff: string,
): TourSchedule {
  return {
    mode,
    daysOfWeek,
    timeSlots: times.map(([t, cap]) => makeSlot(t, cap)),
    cutoff,
    updatedAt: new Date().toISOString(),
  };
}

const DEFAULT_SCHEDULES: Record<string, TourSchedule> = {
  "t-sunset-kayak": defaultSchedule(
    "recurring",
    [0, 2, 4, 5],
    [
      ["09:00", 15],
      ["14:00", 15],
    ],
    "12h",
  ),
  "t-city-food-walk": defaultSchedule(
    "recurring",
    [1, 3, 5],
    [
      ["10:00", 12],
      ["16:00", 12],
    ],
    "6h",
  ),
  "t-pottery-workshop": defaultSchedule("recurring", [2, 4, 6], [["11:00", 8]], "24h"),
};

/* Deterministic mock bookings */

/** FNV-1a style hash → stable pseudo-random number in [0, 1). */
function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

/** Does a schedule produce slots on this date? */
export function scheduleApplies(schedule: TourSchedule | undefined, date: string): boolean {
  if (!schedule) return false;
  if (schedule.mode === "one-time") return schedule.date === date;
  return schedule.daysOfWeek.includes(getWeekdayIndex(date));
}

 /**
 * Deterministic mock bookings for a listing on a date — same input always
 * yields the same bookings, so no state is needed to render them.
 */
export function getMockBookings(
  listingId: string,
  date: string,
  schedule: TourSchedule | undefined,
): MockBooking[] {
  if (!schedule || !scheduleApplies(schedule, date)) return [];

  const bookings: MockBooking[] = [];
  for (const slot of schedule.timeSlots) {
    const r1 = hashSeed(`${listingId}|${date}|${slot.time}|b1`);
    const make = (r: number, suffix: string) => {
      const guests = 1 + Math.floor(hashSeed(`${listingId}|${date}|${slot.time}|${suffix}g`) * 4);
      const name =
        GUEST_NAMES[
          Math.floor(hashSeed(`${listingId}|${date}|${slot.time}|${suffix}n`) * GUEST_NAMES.length)
        ];
      return {
        id: `bk-${listingId}-${date}-${slot.time}-${suffix}`,
        listingId,
        date,
        time: slot.time,
        guests,
        guestName: name,
      };
    };
    if (r1 < 0.5) {
      bookings.push(make(r1, "a"));
      if (r1 < 0.22) bookings.push(make(r1, "b"));
    }
  }
  return bookings.sort((a, b) => a.time.localeCompare(b.time));
}

 /**
 * Slots for a date. Effective capacity = host capacity override if set,
 * otherwise 0 if zeroed out, otherwise the schedule default.
 */
export function getDaySlots(
  listingId: string,
  date: string,
  schedule: TourSchedule | undefined,
  zeroedSlots: TourSlotOverride[],
  capacityOverrides: TourCapacityOverride[],
): TourSlot[] {
  if (!schedule || !scheduleApplies(schedule, date)) return [];
  return schedule.timeSlots.map((slot) => {
    const override = capacityOverrides.find(
      (c) => c.listingId === listingId && c.date === date && c.time === slot.time,
    );
    const zeroed = zeroedSlots.some(
      (z) => z.listingId === listingId && z.date === date && z.time === slot.time,
    );
    return { ...slot, capacity: override ? override.capacity : zeroed ? 0 : slot.capacity };
  });
}

/** Effective booking cut-off for a specific departure slot. */
export function getSlotCutoff(
  listingId: string,
  date: string,
  time: string,
  schedule: TourSchedule | undefined,
  cutoffOverrides: TourCutoffOverride[],
): { cutoff: string; overridden: boolean } {
  const override = cutoffOverrides.find(
    (c) => c.listingId === listingId && c.date === date && c.time === time,
  );
  return override
    ? { cutoff: override.cutoff, overridden: true }
    : { cutoff: schedule?.cutoff ?? "none", overridden: false };
}

/** Aggregate state for a calendar cell. */
export function getDayState(
  listingId: string,
  date: string,
  schedule: TourSchedule | undefined,
  blockedDates: TourDateOverride[],
  zeroedSlots: TourSlotOverride[],
  capacityOverrides: TourCapacityOverride[],
): TourDayState {
  if (blockedDates.some((b) => b.listingId === listingId && b.date === date)) {
    return { status: "blocked", openSlots: 0 };
  }
  const slots = getDaySlots(listingId, date, schedule, zeroedSlots, capacityOverrides);
  const open = slots.filter((s) => s.capacity > 0).length;
  return { status: open > 0 ? "available" : "no-slots", openSlots: open };
}

/* Store */

interface TourAvailabilityState {
  /** Last applied schedule per listing */
  schedules: Record<string, TourSchedule>;
  /** Dates explicitly blocked by the host */
  blockedDates: TourDateOverride[];
  /** Per-slot capacity zero-outs */
  zeroedSlots: TourSlotOverride[];
  /** Per-slot partial capacity overrides (e.g. 30 -> 15) */
  capacityOverrides: TourCapacityOverride[];
  /** Per-slot booking cut-off overrides */
  cutoffOverrides: TourCutoffOverride[];
  /** Dates that just got a schedule applied (drives the highlight animation) */
  recentlyUpdated: string[];

  applySchedule: (listingId: string, schedule: TourSchedule) => void;
  blockDay: (listingId: string, date: string) => MockBooking[];
  unblockDay: (listingId: string, date: string) => void;
  zeroOutSlot: (listingId: string, date: string, time: string) => MockBooking[];
  restoreSlot: (listingId: string, date: string, time: string) => void;
  setSlotCapacity: (listingId: string, date: string, time: string, capacity: number) => void;
  clearSlotCapacity: (listingId: string, date: string, time: string) => void;
  setSlotCutoff: (listingId: string, date: string, time: string, cutoff: string) => void;
  clearSlotCutoff: (listingId: string, date: string, time: string) => void;
  bulkBlockDays: (listingId: string, dates: string[]) => MockBooking[];
  bulkUnblockDays: (listingId: string, dates: string[]) => void;
  bulkSetCapacity: (listingId: string, dates: string[], capacity: number) => void;
  clearRecentlyUpdated: () => void;
}

/** Highlight the next 28 days the schedule matches. */
function computeHighlightDates(schedule: TourSchedule): string[] {
  const today = new Date();
  const out: string[] = [];
  for (let i = 0; i < 28; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    const ds = formatDateObj(d);
    if (scheduleApplies(schedule, ds)) out.push(ds);
  }
  return out;
}

export const useTourAvailabilityStore = create<TourAvailabilityState>()(
  persist(
    (set, get) => ({
      schedules: DEFAULT_SCHEDULES,
      blockedDates: [],
      zeroedSlots: [],
      capacityOverrides: [],
      cutoffOverrides: [],
      recentlyUpdated: [],

      applySchedule: (listingId, schedule) =>
        set((state) => {
          const next: TourSchedule = { ...schedule, updatedAt: new Date().toISOString() };
          return {
            schedules: { ...state.schedules, [listingId]: next },
            recentlyUpdated: computeHighlightDates(next),
          };
        }),

      blockDay: (listingId, date) => {
        set((state) => {
          if (state.blockedDates.some((b) => b.listingId === listingId && b.date === date)) {
            return state;
          }
          return { blockedDates: [...state.blockedDates, { listingId, date }] };
        });
        return getMockBookings(listingId, date, get().schedules[listingId]);
      },

      unblockDay: (listingId, date) =>
        set((state) => ({
          blockedDates: state.blockedDates.filter(
            (b) => !(b.listingId === listingId && b.date === date),
          ),
        })),

      zeroOutSlot: (listingId, date, time) => {
        set((state) => {
          if (
            state.zeroedSlots.some(
              (z) => z.listingId === listingId && z.date === date && z.time === time,
            )
          ) {
            return state;
          }
          return { zeroedSlots: [...state.zeroedSlots, { listingId, date, time }] };
        });
        return getMockBookings(listingId, date, get().schedules[listingId]).filter(
          (b) => b.time === time,
        );
      },

      restoreSlot: (listingId, date, time) =>
        set((state) => ({
          zeroedSlots: state.zeroedSlots.filter(
            (z) => !(z.listingId === listingId && z.date === date && z.time === time),
          ),
        })),

      // Partial seat-limit override (capacity >= 1) or full zero-out (capacity <= 0).
      setSlotCapacity: (listingId, date, time, capacity) =>
        set((state) => {
          const withoutCap = state.capacityOverrides.filter(
            (c) => !(c.listingId === listingId && c.date === date && c.time === time),
          );
          const withoutZero = state.zeroedSlots.filter(
            (z) => !(z.listingId === listingId && z.date === date && z.time === time),
          );
          if (capacity <= 0) {
            return {
              capacityOverrides: withoutCap,
              zeroedSlots: [...withoutZero, { listingId, date, time }],
            };
          }
          return {
            capacityOverrides: [...withoutCap, { listingId, date, time, capacity }],
            zeroedSlots: withoutZero,
          };
        }),

      // Back to the schedule default for this slot (removes both override and zero-out).
      clearSlotCapacity: (listingId, date, time) =>
        set((state) => ({
          capacityOverrides: state.capacityOverrides.filter(
            (c) => !(c.listingId === listingId && c.date === date && c.time === time),
          ),
          zeroedSlots: state.zeroedSlots.filter(
            (z) => !(z.listingId === listingId && z.date === date && z.time === time),
          ),
        })),

      setSlotCutoff: (listingId, date, time, cutoff) =>
        set((state) => ({
          cutoffOverrides: [
            ...state.cutoffOverrides.filter(
              (c) => !(c.listingId === listingId && c.date === date && c.time === time),
            ),
            { listingId, date, time, cutoff },
          ],
        })),

      clearSlotCutoff: (listingId, date, time) =>
        set((state) => ({
          cutoffOverrides: state.cutoffOverrides.filter(
            (c) => !(c.listingId === listingId && c.date === date && c.time === time),
          ),
        })),

      // Block many dates at once (public holidays, off-season, maintenance days).
      bulkBlockDays: (listingId, dates) => {
        const affected = dates.flatMap((date) =>
          getMockBookings(listingId, date, get().schedules[listingId]),
        );
        set((state) => {
          const existing = new Set(
            state.blockedDates.filter((b) => b.listingId === listingId).map((b) => b.date),
          );
          const fresh = dates.filter((d) => !existing.has(d)).map((date) => ({ listingId, date }));
          if (fresh.length === 0) return state;
          return { blockedDates: [...state.blockedDates, ...fresh] };
        });
        return affected;
      },

      bulkUnblockDays: (listingId, dates) =>
        set((state) => ({
          blockedDates: state.blockedDates.filter(
            (b) => !(b.listingId === listingId && dates.includes(b.date)),
          ),
        })),

      // Apply the same seat limit to every slot on the given dates (whole weeks/months).
      bulkSetCapacity: (listingId, dates, capacity) =>
        set((state) => {
          const schedule = state.schedules[listingId];
          if (!schedule) return state;
          const cap = Math.max(1, Math.floor(capacity));
          let capacityOverrides = [...state.capacityOverrides];
          let zeroedSlots = [...state.zeroedSlots];
          for (const date of dates) {
            if (!scheduleApplies(schedule, date)) continue;
            for (const slot of schedule.timeSlots) {
              capacityOverrides = capacityOverrides.filter(
                (c) => !(c.listingId === listingId && c.date === date && c.time === slot.time),
              );
              zeroedSlots = zeroedSlots.filter(
                (z) => !(z.listingId === listingId && z.date === date && z.time === slot.time),
              );
              capacityOverrides.push({ listingId, date, time: slot.time, capacity: cap });
            }
          }
          return { capacityOverrides, zeroedSlots };
        }),

      clearRecentlyUpdated: () => set({ recentlyUpdated: [] }),
    }),
    {
      name: "nearby-escapes-tour-availability",
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({
        schedules: state.schedules,
        blockedDates: state.blockedDates,
        zeroedSlots: state.zeroedSlots,
        capacityOverrides: state.capacityOverrides,
        cutoffOverrides: state.cutoffOverrides,
      }),
    },
  ),
);
