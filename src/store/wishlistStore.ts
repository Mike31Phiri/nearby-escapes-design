import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Stay } from "@/types/stay";

interface WishlistState {
  items: Stay[];
  addItem: (item: Stay) => void;
  removeItem: (id: string) => void;
  clearWishlist: () => void;
  isSaved: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      clearWishlist: () => set({ items: [] }),
      isSaved: (id) => get().items.some((i) => i.id === id),
    }),
    {
      name: "ne.wishlist",
    }
  )
);
