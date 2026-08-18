import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/safeStorage";
import type { ListingType } from "@/types/listing";

export const ALL_LISTING_TYPES: ListingType[] = ["stay", "experience", "transport"];

interface HostState {
  /**
   * Listing verticals this host is allowed to create — set during host signup
   * (see /become-host ListingTypeStep). Never show a type the host can't list.
   */
  enabledCategories: ListingType[];
  setEnabledCategories: (categories: ListingType[]) => void;
  toggleCategory: (category: ListingType) => void;
  reset: () => void;
}

export const useHostStore = create<HostState>()(
  persist(
    (set) => ({
      // Default: every type enabled (host signup wiring can narrow this).
      enabledCategories: [...ALL_LISTING_TYPES],

      setEnabledCategories: (categories) => set({ enabledCategories: categories }),

      toggleCategory: (category) =>
        set((state) => ({
          enabledCategories: state.enabledCategories.includes(category)
            ? state.enabledCategories.filter((c) => c !== category)
            : [...state.enabledCategories, category],
        })),

      reset: () => set({ enabledCategories: [...ALL_LISTING_TYPES] }),
    }),
    {
      name: "nearby-escapes-host",
      storage: createJSONStorage(() => safeLocalStorage),
    },
  ),
);
