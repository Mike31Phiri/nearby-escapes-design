"use client";

import { create } from "zustand";
import type { Stay } from "@/lib/mock-data";

interface WishlistState {
  items: Stay[];
  isSaved: (id: string) => boolean;
  addItem: (item: Stay) => void;
  removeItem: (id: string) => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  isSaved: (id) => get().items.some((i) => i.id === id),
  addItem: (item) => set((s) => ({ items: [...s.items, item] })),
  removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
}));
