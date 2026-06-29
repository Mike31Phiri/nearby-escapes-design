import { create } from "zustand";

export interface TripItem {
  bookingId: string;
  listingId: string;
  listingTitle: string;
  vertical: "stay" | "experience" | "transport";
  /** Price in Ngwee (integer). Never float. */
  priceNgwee: number;
}

interface TripState {
  tripId: string | null;
  stay: TripItem | null;
  experiences: TripItem[];
  transport: TripItem | null;
  setTripId: (id: string) => void;
  setStay: (item: TripItem) => void;
  addExperience: (item: TripItem) => void;
  setTransport: (item: TripItem) => void;
  removeExperience: (bookingId: string) => void;
  /** Computed total across all attached items, in Ngwee (integer). */
  totalNgwee: () => number;
  reset: () => void;
}

export const useTripStore = create<TripState>((set, get) => ({
  tripId: null,
  stay: null,
  experiences: [],
  transport: null,
  setTripId: (id) => set({ tripId: id }),
  setStay: (item) => set({ stay: item }),
  addExperience: (item) => set((s) => ({ experiences: [...s.experiences, item] })),
  setTransport: (item) => set({ transport: item }),
  removeExperience: (bookingId) =>
    set((s) => ({ experiences: s.experiences.filter((e) => e.bookingId !== bookingId) })),
  totalNgwee: () => {
    const s = get();
    const stayTotal = s.stay?.priceNgwee ?? 0;
    const expTotal = s.experiences.reduce((sum, e) => sum + e.priceNgwee, 0);
    const transportTotal = s.transport?.priceNgwee ?? 0;
    return stayTotal + expTotal + transportTotal;
  },
  reset: () => set({ tripId: null, stay: null, experiences: [], transport: null }),
}));
