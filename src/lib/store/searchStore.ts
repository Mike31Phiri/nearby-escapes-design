import { create } from "zustand";

type Vertical = "stays" | "experiences" | "transport" | "packages";

interface StaySearchParams {
  province?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  category?: string;
  minRateNgwee?: number;
  maxRateNgwee?: number;
}

interface ExperienceSearchParams {
  province?: string;
  date?: string;
  category?: string;
  groupSize?: number;
  minPriceNgwee?: number;
  maxPriceNgwee?: number;
  difficulty?: string;
}

interface TransportSearchParams {
  from?: string;
  to?: string;
  date?: string;
  seats?: number;
  serviceType?: string;
}

interface PackageSearchParams {
  category?: string;
  guests?: number;
  startDate?: string;
  maxPriceNgwee?: number;
}

interface SearchState {
  activeVertical: Vertical;
  stayParams: StaySearchParams;
  experienceParams: ExperienceSearchParams;
  transportParams: TransportSearchParams;
  packageParams: PackageSearchParams;
  setActiveVertical: (vertical: Vertical) => void;
  setStayParams: (params: Partial<StaySearchParams>) => void;
  setExperienceParams: (params: Partial<ExperienceSearchParams>) => void;
  setTransportParams: (params: Partial<TransportSearchParams>) => void;
  setPackageParams: (params: Partial<PackageSearchParams>) => void;
  resetStayParams: () => void;
  resetExperienceParams: () => void;
  resetTransportParams: () => void;
  resetPackageParams: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  activeVertical: "stays",
  stayParams: {},
  experienceParams: {},
  transportParams: {},
  packageParams: {},
  setActiveVertical: (vertical) => set({ activeVertical: vertical }),
  setStayParams: (params) => set((s) => ({ stayParams: { ...s.stayParams, ...params } })),
  setExperienceParams: (params) =>
    set((s) => ({ experienceParams: { ...s.experienceParams, ...params } })),
  setTransportParams: (params) =>
    set((s) => ({ transportParams: { ...s.transportParams, ...params } })),
  setPackageParams: (params) => set((s) => ({ packageParams: { ...s.packageParams, ...params } })),
  resetStayParams: () => set({ stayParams: {} }),
  resetExperienceParams: () => set({ experienceParams: {} }),
  resetTransportParams: () => set({ transportParams: {} }),
  resetPackageParams: () => set({ packageParams: {} }),
}));
