"use client";

import { create } from "zustand";

interface WishlistState {
  items: string[];
  isSaved: (id: string) => boolean;
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  isSaved: (id) => get().items.includes(id),
  addItem: (id) => set((s) => ({ items: [...s.items, id] })),
  removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i !== id) })),
}));
