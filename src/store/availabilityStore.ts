"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/** A single date entry for a listing */
export interface AvailabilityEntry {
  date: string; // ISO date "YYYY-MM-DD"
  status: "available" | "blocked" | "booked";
}

/** A seasonal pricing override for a date range */
export interface SeasonalPricingEntry {
  id: string;
  listingId: string;
  from: string; // ISO "YYYY-MM-DD"
  to: string; // ISO "YYYY-MM-DD"
  price: number; // nightly/person override price in ZMW
  label?: string; // e.g. "Peak Season", "Christmas Special"
}

interface AvailabilityStore {
  /** Keyed by listingId, array of date entries */
  availability: Record<string, AvailabilityEntry[]>;
  /** Seasonal pricing rules per listing */
  seasonalPricing: SeasonalPricingEntry[];

  // --- Date blocking ---
  /** Set the availability for a single date (toggle) */
  toggleDateBlock: (listingId: string, date: string) => void;
  /** Block a range of dates */
  blockDateRange: (listingId: string, from: string, to: string) => void;
  /** Unblock a range of dates (set to available) */
  unblockDateRange: (listingId: string, from: string, to: string) => void;
  /** Check if a specific date is blocked */
  isDateBlocked: (listingId: string, date: string) => boolean;
  /** Get all availability entries for a listing in a month */
  getAvailabilityForMonth: (listingId: string, year: number, month: number) => AvailabilityEntry[];

  // --- Seasonal pricing ---
  addSeasonalPricing: (entry: Omit<SeasonalPricingEntry, "id">) => void;
  removeSeasonalPricing: (id: string) => void;
  getSeasonalPricingForListing: (listingId: string) => SeasonalPricingEntry[];
  getEffectivePrice: (listingId: string, date: string, basePrice: number) => number;
  getSeasonalPricingForDate: (listingId: string, date: string) => SeasonalPricingEntry | undefined;
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function generateMockAvailability(
  listingId: string,
  year: number = 2025,
  monthsToGenerate: number = 12,
): AvailabilityEntry[] {
  const results: AvailabilityEntry[] = [];
  for (let m = 0; m < monthsToGenerate; m++) {
    const month = (m % 12) + 1;
    const y = year + Math.floor(m / 12);
    const daysInMonth = new Date(y, month, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${y}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      // Randomly block ~10% of dates for variety
      const isBlocked = Math.random() < 0.1;
      // Book a few dates from the booking store (we won't know these, so random)
      const isBooked = !isBlocked && Math.random() < 0.08;
      results.push({
        date: dateStr,
        status: isBlocked ? "blocked" : isBooked ? "booked" : "available",
      });
    }
  }
  return results;
}

function generateMockSeasonalPricing(listingId: string): SeasonalPricingEntry[] {
  const entries: SeasonalPricingEntry[] = [];
  // Peak season: June-August (high season in Zambia = dry season)
  entries.push({
    id: `sp-${listingId}-peak`,
    listingId,
    from: "2025-06-01",
    to: "2025-08-31",
    price: 0, // Will use multiplier logic in getEffectivePrice
    label: "Peak Season",
  });
  // Green season: December-February
  entries.push({
    id: `sp-${listingId}-green`,
    listingId,
    from: "2025-12-01",
    to: "2026-02-28",
    price: 0,
    label: "Green Season",
  });
  return entries;
}

const MOCK_LISTING_IDS = ["h1", "h2", "h3", "h4", "h5", "h6"];

function generateInitialAvailability(): Record<string, AvailabilityEntry[]> {
  const map: Record<string, AvailabilityEntry[]> = {};
  for (const id of MOCK_LISTING_IDS) {
    map[id] = generateMockAvailability(id);
  }
  return map;
}

function generateInitialSeasonalPricing(): SeasonalPricingEntry[] {
  return MOCK_LISTING_IDS.flatMap((id) => generateMockSeasonalPricing(id));
}

// ─── Store ────────────────────────────────────────────────────────────────

export const useAvailabilityStore = create<AvailabilityStore>()(
  persist(
    (set, get) => ({
      availability: generateInitialAvailability(),
      seasonalPricing: generateInitialSeasonalPricing(),

      // ─── Date Blocking ─────────────────────────────────────────────

      toggleDateBlock: (listingId, date) =>
        set((state) => {
          const entries = state.availability[listingId] ?? [];
          const existingIdx = entries.findIndex((e) => e.date === date);
          if (existingIdx >= 0) {
            const current = entries[existingIdx];
            if (current.status === "booked") return state; // Can't toggle booked dates
            const updated = [...entries];
            updated[existingIdx] = {
              ...current,
              status: current.status === "available" ? "blocked" : "available",
            };
            return {
              availability: { ...state.availability, [listingId]: updated },
            };
          }
          // New entry
          return {
            availability: {
              ...state.availability,
              [listingId]: [...entries, { date, status: "blocked" }],
            },
          };
        }),

      blockDateRange: (listingId, from, to) =>
        set((state) => {
          const entries = [...(state.availability[listingId] ?? [])];
          const start = new Date(from);
          const end = new Date(to);
          const newEntries: AvailabilityEntry[] = [];
          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split("T")[0];
            const existingIdx = entries.findIndex((e) => e.date === dateStr);
            if (existingIdx >= 0) {
              if (entries[existingIdx].status !== "booked") {
                entries[existingIdx] = { ...entries[existingIdx], status: "blocked" };
              }
            } else {
              newEntries.push({ date: dateStr, status: "blocked" });
            }
          }
          return {
            availability: {
              ...state.availability,
              [listingId]: [...entries, ...newEntries],
            },
          };
        }),

      unblockDateRange: (listingId, from, to) =>
        set((state) => {
          const entries = [...(state.availability[listingId] ?? [])];
          const start = new Date(from);
          const end = new Date(to);
          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split("T")[0];
            const existingIdx = entries.findIndex((e) => e.date === dateStr);
            if (existingIdx >= 0 && entries[existingIdx].status !== "booked") {
              entries[existingIdx] = { ...entries[existingIdx], status: "available" };
            }
          }
          return {
            availability: {
              ...state.availability,
              [listingId]: entries,
            },
          };
        }),

      isDateBlocked: (listingId, date) => {
        const entries = get().availability[listingId] ?? [];
        const entry = entries.find((e) => e.date === date);
        return entry?.status === "blocked";
      },

      getAvailabilityForMonth: (listingId, year, month) => {
        const entries = get().availability[listingId] ?? [];
        const prefix = `${year}-${String(month).padStart(2, "0")}`;
        return entries.filter((e) => e.date.startsWith(prefix));
      },

      // ─── Seasonal Pricing ─────────────────────────────────────────

      addSeasonalPricing: (entry) =>
        set((state) => ({
          seasonalPricing: [
            ...state.seasonalPricing,
            { ...entry, id: `sp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
          ],
        })),

      removeSeasonalPricing: (id) =>
        set((state) => ({
          seasonalPricing: state.seasonalPricing.filter((s) => s.id !== id),
        })),

      getSeasonalPricingForListing: (listingId) =>
        get().seasonalPricing.filter((s) => s.listingId === listingId),

      getSeasonalPricingForDate: (listingId, date) => {
        const dateObj = new Date(date);
        return get().seasonalPricing.find((s) => {
          if (s.listingId !== listingId) return false;
          const from = new Date(s.from);
          const to = new Date(s.to);
          return dateObj >= from && dateObj <= to;
        });
      },

      getEffectivePrice: (listingId, date, basePrice) => {
        const seasonal = get().getSeasonalPricingForDate(listingId, date);
        if (!seasonal) return basePrice;
        // If a specific price is set, use it. Otherwise apply a multiplier.
        if (seasonal.price > 0) return seasonal.price;
        // Peak season: +30%, Green season: -20%
        if (seasonal.label?.toLowerCase().includes("peak")) {
          return Math.round(basePrice * 1.3);
        }
        if (seasonal.label?.toLowerCase().includes("green") || seasonal.label?.toLowerCase().includes("off")) {
          return Math.round(basePrice * 0.8);
        }
        return basePrice;
      },
    }),
    {
      name: "nearby-escapes-availability",
      partialize: (state) => ({
        availability: state.availability,
        seasonalPricing: state.seasonalPricing,
      }),
    },
  ),
);
