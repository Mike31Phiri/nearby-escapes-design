import { create } from "zustand";

interface UIState {
  isFilterDrawerOpen: boolean;
  isSearchDrawerOpen: boolean;
  isConfirmModalOpen: boolean;
  confirmModalMessage: string;
  confirmModalAction: (() => void) | null;
  isOffline: boolean;
  openFilterDrawer: () => void;
  closeFilterDrawer: () => void;
  openSearchDrawer: () => void;
  closeSearchDrawer: () => void;
  openConfirmModal: (message: string, action: () => void) => void;
  closeConfirmModal: () => void;
  setOffline: (offline: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isFilterDrawerOpen: false,
  isSearchDrawerOpen: false,
  isConfirmModalOpen: false,
  confirmModalMessage: "",
  confirmModalAction: null,
  isOffline: false,
  openFilterDrawer: () => set({ isFilterDrawerOpen: true }),
  closeFilterDrawer: () => set({ isFilterDrawerOpen: false }),
  openSearchDrawer: () => set({ isSearchDrawerOpen: true }),
  closeSearchDrawer: () => set({ isSearchDrawerOpen: false }),
  openConfirmModal: (message, action) =>
    set({ isConfirmModalOpen: true, confirmModalMessage: message, confirmModalAction: action }),
  closeConfirmModal: () =>
    set({ isConfirmModalOpen: false, confirmModalMessage: "", confirmModalAction: null }),
  setOffline: (offline) => set({ isOffline: offline }),
}));
