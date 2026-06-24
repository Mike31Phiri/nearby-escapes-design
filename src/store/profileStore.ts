import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/safeStorage";

export interface TravelPreferences {
  travelInterests: string[];
  budgetRange: "budget" | "mid" | "luxury";
  travelGroup: "solo" | "couple" | "family" | "friends";
}

export interface ProfileState {
  phone: string;
  homeCity: string;
  travelPreferences: TravelPreferences;
  hasCompletedCheckout: boolean;
  hasSeenTravelPrompt: boolean;
  showTravelPreferences: boolean;

  // Actions
  setPhone: (phone: string) => void;
  setHomeCity: (city: string) => void;
  setTravelPreferences: (prefs: Partial<TravelPreferences>) => void;
  setSeenTravelPrompt: () => void;
  triggerTravelPreferences: () => void;
  dismissTravelPreferences: () => void;
  saveCheckoutInfo: (data: { phone: string; homeCity: string }) => void;
  reset: () => void;
}

const DEFAULT_TRAVEL_PREFERENCES: TravelPreferences = {
  travelInterests: [],
  budgetRange: "mid",
  travelGroup: "solo",
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      phone: "",
      homeCity: "",
      travelPreferences: { ...DEFAULT_TRAVEL_PREFERENCES },
      hasCompletedCheckout: false,
      hasSeenTravelPrompt: false,
      showTravelPreferences: false,

      setPhone: (phone) => set({ phone }),
      setHomeCity: (city) => set({ homeCity: city }),
      setTravelPreferences: (prefs) =>
        set((state) => ({
          travelPreferences: { ...state.travelPreferences, ...prefs },
        })),
      setSeenTravelPrompt: () => set({ hasSeenTravelPrompt: true }),
      triggerTravelPreferences: () => set({ showTravelPreferences: true }),
      dismissTravelPreferences: () => set({ showTravelPreferences: false }),

      saveCheckoutInfo: (data) =>
        set({
          phone: data.phone,
          homeCity: data.homeCity,
          hasCompletedCheckout: true,
        }),

      reset: () =>
        set({
          phone: "",
          homeCity: "",
          travelPreferences: { ...DEFAULT_TRAVEL_PREFERENCES },
          hasCompletedCheckout: false,
          hasSeenTravelPrompt: false,
          showTravelPreferences: false,
        }),
    }),
    {
      name: "dream-stay-profile",
      storage: createJSONStorage(() => safeLocalStorage),
    },
  ),
);
