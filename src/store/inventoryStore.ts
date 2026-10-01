"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/safeStorage";
import {
  type InventoryUnit,
  type InventoryUnitStatus,
  type ListingInventory,
  mockInventories,
  inventoryCounts,
  generateFallbackInventory,
} from "@/lib/mock-inventory";

interface InventoryState {
  /** Listing inventory keyed by listingId */
  inventories: Record<string, ListingInventory>;

  /** Retrieve current inventory for a listing (with fallback generation if new) */
  getInventory: (listingId: string) => ListingInventory;

  /** Toggle a unit between available and blocked (cannot toggle occupied) */
  toggleUnit: (listingId: string, unitId: string) => InventoryUnitStatus | null;

  /** Update an individual unit's status and optional note */
  setUnitStatus: (
    listingId: string,
    unitId: string,
    status: InventoryUnitStatus,
    note?: string,
  ) => void;

  /** Add a new inventory unit to an existing listing (e.g. host gets another vehicle or opens another slot) */
  addUnit: (listingId: string, unit: Omit<InventoryUnit, "id">) => void;

  /** Remove an inventory unit from a listing */
  removeUnit: (listingId: string, unitId: string) => void;

  /** Check how many available units remain for a listing */
  getAvailableCount: (listingId: string) => number;

  /** Check if a listing has at least 1 available unit (keeps appearing while not 0) */
  isListingAvailable: (listingId: string) => boolean;

  /** Set or overwrite the full inventory definition for a listing (e.g. from create wizard) */
  setListingInventory: (listingId: string, inventory: ListingInventory) => void;

  /** Adjust active inventory count (deactivates / activates units without deleting records) */
  adjustInventoryCount: (
    listingId: string,
    dto: { inventoryCount?: number; operation?: "increase" | "decrease" | "set"; amount?: number },
  ) => { id: string; propertyName: string; inventoryCount: number; activeUnitsCount: number; updatedAt: string };

  /** Reset back to mock defaults */
  resetToDefaults: () => void;
}

function initializeMap(): Record<string, ListingInventory> {
  const map: Record<string, ListingInventory> = {};
  for (const inv of mockInventories) {
    map[inv.listingId] = inv;
  }
  return map;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      inventories: initializeMap(),

      getInventory: (listingId: string): ListingInventory => {
        const existing = get().inventories[listingId];
        if (existing) return existing;

        // Check static list or generate sensible fallback
        const staticFound = mockInventories.find((inv) => inv.listingId === listingId);
        const fallback = staticFound || generateFallbackInventory(listingId);

        // Store into state
        set((state) => ({
          inventories: {
            ...state.inventories,
            [listingId]: fallback,
          },
        }));

        return fallback;
      },

      toggleUnit: (listingId: string, unitId: string): InventoryUnitStatus | null => {
        const inv = get().getInventory(listingId);
        const target = inv.units.find((u) => u.id === unitId);
        if (!target || target.status === "occupied") return null;

        const nextStatus: InventoryUnitStatus =
          target.status === "available" ? "blocked" : "available";

        set((state) => {
          const currentInv = state.inventories[listingId] || inv;
          const updatedUnits = currentInv.units.map((u) => {
            if (u.id !== unitId) return u;
            return {
              ...u,
              status: nextStatus,
              note: nextStatus === "blocked" ? "Closed manually by host" : undefined,
            };
          });

          return {
            inventories: {
              ...state.inventories,
              [listingId]: {
                ...currentInv,
                units: updatedUnits,
              },
            },
          };
        });

        return nextStatus;
      },

      setUnitStatus: (
        listingId: string,
        unitId: string,
        status: InventoryUnitStatus,
        note?: string,
      ) => {
        set((state) => {
          const currentInv = state.inventories[listingId] || get().getInventory(listingId);
          const updatedUnits = currentInv.units.map((u) => {
            if (u.id !== unitId) return u;
            return {
              ...u,
              status,
              ...(note !== undefined ? { note } : {}),
            };
          });

          return {
            inventories: {
              ...state.inventories,
              [listingId]: {
                ...currentInv,
                units: updatedUnits,
              },
            },
          };
        });
      },

      addUnit: (listingId: string, unit: Omit<InventoryUnit, "id">) => {
        set((state) => {
          const currentInv = state.inventories[listingId] || get().getInventory(listingId);
          const newId = `unit-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
          const newUnits = [...currentInv.units, { ...unit, id: newId }];

          return {
            inventories: {
              ...state.inventories,
              [listingId]: {
                ...currentInv,
                total: newUnits.length,
                units: newUnits,
              },
            },
          };
        });
      },

      removeUnit: (listingId: string, unitId: string) => {
        set((state) => {
          const currentInv = state.inventories[listingId];
          if (!currentInv) return state;
          const newUnits = currentInv.units.filter((u) => u.id !== unitId);

          return {
            inventories: {
              ...state.inventories,
              [listingId]: {
                ...currentInv,
                total: newUnits.length,
                units: newUnits,
              },
            },
          };
        });
      },

      getAvailableCount: (listingId: string): number => {
        const inv = get().getInventory(listingId);
        return inv.units.filter((u) => u.status === "available").length;
      },

      isListingAvailable: (listingId: string): boolean => {
        return get().getAvailableCount(listingId) > 0;
      },

      setListingInventory: (listingId: string, inventory: ListingInventory) => {
        set((state) => ({
          inventories: {
            ...state.inventories,
            [listingId]: inventory,
          },
        }));
      },

      adjustInventoryCount: (listingId: string, dto) => {
        const inv = get().getInventory(listingId);
        const activeUnits = inv.units.filter((u) => u.status === "available" || u.status === "occupied");
        const currentActive = activeUnits.length;

        let targetCount = currentActive;
        const amt = dto.amount ?? 1;

        if (dto.operation === "increase") {
          targetCount = currentActive + amt;
        } else if (dto.operation === "decrease") {
          targetCount = Math.max(0, currentActive - amt);
        } else if (dto.operation === "set" || dto.inventoryCount !== undefined) {
          targetCount = Math.max(0, dto.inventoryCount ?? currentActive);
        }

        let newUnits = [...inv.units];

        if (targetCount < currentActive) {
          // Deactivate excess units (from available units, never occupied)
          const toDeactivate = currentActive - targetCount;
          let countDeactivated = 0;
          newUnits = newUnits.map((u) => {
            if (countDeactivated < toDeactivate && u.status === "available") {
              countDeactivated++;
              return {
                ...u,
                status: "blocked" as InventoryUnitStatus,
                note: "Deactivated / offline",
              };
            }
            return u;
          });
        } else if (targetCount > currentActive) {
          // Reactivate inactive units first, then create new units if needed
          const toActivate = targetCount - currentActive;
          let countActivated = 0;
          newUnits = newUnits.map((u) => {
            if (countActivated < toActivate && u.status === "blocked") {
              countActivated++;
              return {
                ...u,
                status: "available" as InventoryUnitStatus,
                note: "Active & ready for booking",
              };
            }
            return u;
          });

          // If still need more units, create them
          while (countActivated < toActivate) {
            countActivated++;
            const nextIdx = newUnits.length + 1;
            newUnits.push({
              id: `unit-${Date.now().toString(36)}-${countActivated}`,
              label: `${inv.unitLabel} ${nextIdx}`,
              status: "available",
              note: "Active & ready for booking",
            });
          }
        }

        const finalActive = newUnits.filter((u) => u.status === "available" || u.status === "occupied").length;

        set((state) => ({
          inventories: {
            ...state.inventories,
            [listingId]: {
              ...inv,
              total: newUnits.length,
              units: newUnits,
            },
          },
        }));

        return {
          id: listingId,
          propertyName: inv.unitLabelPlural,
          inventoryCount: finalActive,
          activeUnitsCount: finalActive,
          updatedAt: new Date().toISOString(),
        };
      },

      resetToDefaults: () => {
        set({ inventories: initializeMap() });
      },
    }),
    {
      name: "nearby-escapes-inventory",
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({
        inventories: state.inventories,
      }),
    },
  ),
);
