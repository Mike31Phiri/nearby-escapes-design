"use client";

import { create } from "zustand";

// Shared subset of properties that all listing types have
export interface WishlistItem {
  id: string;
  name: string;
  image: string;
  price: number;
  location: string;
  rating: number;
  reviews?: number;
  type?: string;
}

interface WishlistState {
  items: WishlistItem[];
  isSaved: (id: string) => boolean;
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  isSaved: (id) => get().items.some((i) => i.id === id),
  addItem: (item) => set((s) => ({ items: [...s.items, item] })),
  removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
}));
