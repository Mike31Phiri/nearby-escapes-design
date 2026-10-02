"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/safeStorage";

/** A single date entry for a listing */
export interface AvailabilityEntry {
  date: string; // ISO date "YYYY-MM-DD"
  status: "available" | "blocked" | "booked";
  /** How many units are blocked on this date (defaults to 1 or full count) */
  blockedUnits?: number;
  /** Date after which this block elapses and inventory is added back automatically */
  autoRestoreDate?: string;
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

/** Pricing and stay duration rules configured for a listing */
export interface PricingRules {
  basePrice: number;
  weekendPrice: number;
  minStayWeekends: number;
  minStayWeekdays: number;
  weeklyDiscount: number; // percentage, e.g. 10
  monthlyDiscount: number; // percentage, e.g. 20
}

interface AvailabilityStore {
  /** Keyed by listingId, array of date entries */
  availability: Record<string, AvailabilityEntry[]>;
  /** Seasonal pricing rules per listing */
  seasonalPricing: SeasonalPricingEntry[];
  /** Custom pricing & stay rules per listing */
  pricingRules: Record<string, PricingRules>;

  // --- Date blocking & Inventory Elapse ---
  /** Set the availability for a single date (toggle) with optional unit count */
  toggleDateBlock: (listingId: string, date: string, blockedUnits?: number) => void;
  /** Block a range of dates with optional unit count */
  blockDateRange: (listingId: string, from: string, to: string, blockedUnits?: number) => void;
  /** Unblock a range of dates (set to available) */
  unblockDateRange: (listingId: string, from: string, to: string) => void;
  /** Check if a specific date is blocked */
  isDateBlocked: (listingId: string, date: string) => boolean;
  /** Get all availability entries for a listing in a month */
  getAvailabilityForMonth: (listingId: string, year: number, month: number) => AvailabilityEntry[];
  /** Auto-restores any blocked dates that have elapsed (past today) */
  autoRestoreElapsedBlocks: (listingId?: string) => number;
  /** Get calculated inventory counts for a date taking blocks & time elapse into account */
  getDateInventory: (
    listingId: string,
    date: string,
    baseTotalUnits?: number,
  ) => {
    total: number;
    available: number;
    blocked: number;
    booked: number;
    isElapsed: boolean;
  };
  /** Get active vs elapsed summary for a listing */
  getActiveBlockedSummary: (
    listingId: string,
    baseTotalUnits?: number,
  ) => {
    totalUnits: number;
    activeBlockedDatesCount: number;
    activeBlockedUnits: number;
    elapsedRestoredUnits: number;
    nextRestoreDate?: string;
    activeBlockedList: AvailabilityEntry[];
    elapsedList: AvailabilityEntry[];
  };

  // --- Seasonal pricing ---
  addSeasonalPricing: (entry: Omit<SeasonalPricingEntry, "id">) => void;
  removeSeasonalPricing: (id: string) => void;
  getSeasonalPricingForListing: (listingId: string) => SeasonalPricingEntry[];
  getEffectivePrice: (listingId: string, date: string, basePrice: number) => number;
  getSeasonalPricingForDate: (listingId: string, date: string) => SeasonalPricingEntry | undefined;

  // --- Listing pricing rules ---
  getPricingRulesForListing: (listingId: string, defaultBasePrice?: number) => PricingRules;
  updatePricingRulesForListing: (listingId: string, rules: Partial<PricingRules>) => void;
}

// Helpers

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
  // Seasonal pricing removed — platform relies strictly on property base rate editing
  return [];
}

function generateInitialPricingRules(): Record<string, PricingRules> {
  return {
    h1: { basePrice: 450, weekendPrice: 550, minStayWeekends: 2, minStayWeekdays: 1, weeklyDiscount: 10, monthlyDiscount: 20 },
    h2: { basePrice: 380, weekendPrice: 480, minStayWeekends: 2, minStayWeekdays: 1, weeklyDiscount: 10, monthlyDiscount: 15 },
    h3: { basePrice: 420, weekendPrice: 520, minStayWeekends: 2, minStayWeekdays: 1, weeklyDiscount: 10, monthlyDiscount: 20 },
    h4: { basePrice: 180, weekendPrice: 220, minStayWeekends: 1, minStayWeekdays: 1, weeklyDiscount: 5, monthlyDiscount: 10 },
    h5: { basePrice: 95, weekendPrice: 120, minStayWeekends: 1, minStayWeekdays: 1, weeklyDiscount: 5, monthlyDiscount: 10 },
    h6: { basePrice: 250, weekendPrice: 320, minStayWeekends: 2, minStayWeekdays: 1, weeklyDiscount: 10, monthlyDiscount: 20 },
  };
}

// Store

export const useAvailabilityStore = create<AvailabilityStore>()(
  persist(
    (set, get) => ({
      availability: generateInitialAvailability(),
      seasonalPricing: generateInitialSeasonalPricing(),
      pricingRules: generateInitialPricingRules(),

      // Date Blocking & Inventory Elapse

      toggleDateBlock: (listingId, date, blockedUnits) =>
        set((state) => {
          const entries = state.availability[listingId] ?? [];
          const existingIdx = entries.findIndex((e) => e.date === date);
          if (existingIdx >= 0) {
            const current = entries[existingIdx];
            if (current.status === "booked") return state; // Can't toggle booked dates
            const updated = [...entries];
            const nextStatus = current.status === "available" ? "blocked" : "available";
            updated[existingIdx] = {
              ...current,
              status: nextStatus,
              blockedUnits: nextStatus === "blocked" ? (blockedUnits ?? current.blockedUnits ?? 1) : 0,
              autoRestoreDate: nextStatus === "blocked" ? date : undefined,
            };
            return {
              availability: { ...state.availability, [listingId]: updated },
            };
          }
          // New entry
          return {
            availability: {
              ...state.availability,
              [listingId]: [
                ...entries,
                {
                  date,
                  status: "blocked",
                  blockedUnits: blockedUnits ?? 1,
                  autoRestoreDate: date,
                },
              ],
            },
          };
        }),

      blockDateRange: (listingId, from, to, blockedUnits) =>
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
                entries[existingIdx] = {
                  ...entries[existingIdx],
                  status: "blocked",
                  blockedUnits: blockedUnits ?? entries[existingIdx].blockedUnits ?? 1,
                  autoRestoreDate: to,
                };
              }
            } else {
              newEntries.push({
                date: dateStr,
                status: "blocked",
                blockedUnits: blockedUnits ?? 1,
                autoRestoreDate: to,
              });
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
              entries[existingIdx] = {
                ...entries[existingIdx],
                status: "available",
                blockedUnits: 0,
              };
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

      autoRestoreElapsedBlocks: (listingId) => {
        const today = new Date().toISOString().split("T")[0];
        let restoredCount = 0;
        set((state) => {
          const nextAvail = { ...state.availability };
          const targetIds = listingId ? [listingId] : Object.keys(nextAvail);

          for (const id of targetIds) {
            const entries = nextAvail[id] ?? [];
            let modified = false;
            const updated = entries.map((entry) => {
              if (entry.status === "blocked" && entry.date < today) {
                restoredCount += entry.blockedUnits || 1;
                modified = true;
                return { ...entry, status: "available" as const, blockedUnits: 0 };
              }
              return entry;
            });
            if (modified) {
              nextAvail[id] = updated;
            }
          }

          return { availability: nextAvail };
        });
        return restoredCount;
      },

      getDateInventory: (listingId, date, baseTotalUnits = 1) => {
        const today = new Date().toISOString().split("T")[0];
        const entries = get().availability[listingId] ?? [];
        const entry = entries.find((e) => e.date === date);
        const isElapsed = date < today;

        if (!entry || isElapsed) {
          return {
            total: baseTotalUnits,
            available: baseTotalUnits,
            blocked: 0,
            booked: 0,
            isElapsed,
          };
        }

        if (entry.status === "booked") {
          return {
            total: baseTotalUnits,
            available: Math.max(0, baseTotalUnits - 1),
            blocked: 0,
            booked: 1,
            isElapsed: false,
          };
        }

        if (entry.status === "blocked") {
          const blockedCount = entry.blockedUnits && entry.blockedUnits > 0 ? entry.blockedUnits : baseTotalUnits;
          return {
            total: baseTotalUnits,
            available: Math.max(0, baseTotalUnits - blockedCount),
            blocked: blockedCount,
            booked: 0,
            isElapsed: false,
          };
        }

        return {
          total: baseTotalUnits,
          available: baseTotalUnits,
          blocked: 0,
          booked: 0,
          isElapsed: false,
        };
      },

      getActiveBlockedSummary: (listingId, baseTotalUnits = 1) => {
        const today = new Date().toISOString().split("T")[0];
        const entries = get().availability[listingId] ?? [];
        const activeBlocked = entries.filter((e) => e.status === "blocked" && e.date >= today);
        const elapsed = entries.filter((e) => e.date < today && (e.blockedUnits || 0) > 0);

        const activeBlockedUnits = activeBlocked.reduce((acc, cur) => acc + (cur.blockedUnits ?? 1), 0);
        const elapsedRestoredUnits = elapsed.reduce((acc, cur) => acc + (cur.blockedUnits ?? 1), 0);

        const sortedDates = activeBlocked.map((e) => e.date).sort();
        const nextRestoreDate = sortedDates[sortedDates.length - 1];

        return {
          totalUnits: baseTotalUnits,
          activeBlockedDatesCount: activeBlocked.length,
          activeBlockedUnits,
          elapsedRestoredUnits,
          nextRestoreDate,
          activeBlockedList: activeBlocked,
          elapsedList: elapsed,
        };
      },

      getAvailabilityForMonth: (listingId, year, month) => {
        const entries = get().availability[listingId] ?? [];
        const prefix = `${year}-${String(month).padStart(2, "0")}`;
        return entries.filter((e) => e.date.startsWith(prefix));
      },

      // Seasonal Pricing

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
        // Seasonal pricing removed — rely strictly on property rate and weekend rules
        const rules = get().pricingRules?.[listingId];
        const dayOfWeek = new Date(date).getDay();
        const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // Friday or Saturday
        if (isWeekend && rules?.weekendPrice && rules.weekendPrice > 0) {
          return rules.weekendPrice;
        }
        return rules?.basePrice || basePrice;
      },

      // Listing Pricing Rules

      getPricingRulesForListing: (listingId, defaultBasePrice = 850) => {
        const rules = get().pricingRules?.[listingId];
        if (rules) return rules;
        return {
          basePrice: defaultBasePrice,
          weekendPrice: Math.round(defaultBasePrice * 1.25),
          minStayWeekends: 2,
          minStayWeekdays: 1,
          weeklyDiscount: 10,
          monthlyDiscount: 20,
        };
      },

      updatePricingRulesForListing: (listingId, rules) =>
        set((state) => {
          const current = state.pricingRules?.[listingId] || {
            basePrice: 850,
            weekendPrice: 1050,
            minStayWeekends: 2,
            minStayWeekdays: 1,
            weeklyDiscount: 10,
            monthlyDiscount: 20,
          };
          return {
            pricingRules: {
              ...(state.pricingRules || {}),
              [listingId]: { ...current, ...rules },
            },
          };
        }),
    }),
    {
      name: "nearby-escapes-availability",
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({
        availability: state.availability,
        seasonalPricing: state.seasonalPricing,
        pricingRules: state.pricingRules,
      }),
    },
  ),
);
