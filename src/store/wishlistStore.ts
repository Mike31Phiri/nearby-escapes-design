"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/safeStorage";
import { fetchSavedListings, toggleSavedListing, removeSavedListing } from "@/lib/api/saved";
import type { SavedListingItemDTO } from "@/types/backend-payloads";
import { useAuthStore } from "@/lib/store/authStore";

// Shared subset of properties that all listing types have
export interface WishlistItem {
  id: string; // listingId / propertyId
  name: string;
  image: string;
  price: number;
  location: string;
  rating: number;
  reviews?: number;
  type?: string; // "stay" | "experience" | "transport" | "package"
  savedAt?: string;
}

function dtoToWishlistItem(dto: SavedListingItemDTO): WishlistItem {
  return {
    id: dto.listingId || dto.id,
    name: dto.title,
    image: dto.featuredImage || "",
    price: dto.pricePerUnitNgwee ? dto.pricePerUnitNgwee / 100 : 0,
    location: [dto.city, dto.province].filter(Boolean).join(", ") || "Zambia",
    rating: dto.rating || 0,
    reviews: dto.reviewCount || 0,
    type: (dto.vertical || "stay").toLowerCase(),
    savedAt: dto.savedAt,
  };
}

export function getListingHref(item: WishlistItem): string {
  const type = (item.type || "").toLowerCase();
  if (type === "experience") return `/listings/experiences/${item.id}`;
  if (type === "transport") return `/listings/transport/${item.id}`;
  if (type === "package") return `/packages/${item.id}`;
  return `/listings/stays/${item.id}`;
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  isInitialized: boolean;
  isSaved: (id: string) => boolean;
  addItem: (item: WishlistItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  toggleItem: (item: WishlistItem) => Promise<boolean>;
  fetchFromBackend: () => Promise<void>;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isInitialized: false,

      isSaved: (id: string) => {
        if (!id) return false;
        return get().items.some(
          (i) => i.id === id || (i as any).listingId === id,
        );
      },

      addItem: async (item: WishlistItem) => {
        if (!item || !item.id) return;

        const currentItems = get().items;
        if (currentItems.some((i) => i.id === item.id || (i as any).listingId === item.id)) {
          return;
        }

        const previousItems = currentItems;
        // Optimistic UI update for instantaneous responsiveness
        set({ items: [item, ...previousItems] });

        const isAuth = useAuthStore.getState().isAuthenticated;
        if (isAuth) {
          try {
            const res = await toggleSavedListing(item.id);
            // If backend desynced and toggled off, re-toggle to ensure it stays saved in PostgreSQL
            if (res && res.saved === false) {
              await toggleSavedListing(item.id);
            }
          } catch (err) {
            console.error("[Wishlist] Failed to save listing to backend PostgreSQL:", err);
            // Rollback optimistic update
            set({ items: previousItems });
            throw err;
          }
        }
      },

      removeItem: async (id: string) => {
        if (!id) return;

        const currentItems = get().items;
        const previousItems = currentItems;
        // Optimistic UI update
        set({
          items: currentItems.filter(
            (i) => i.id !== id && (i as any).listingId !== id,
          ),
        });

        const isAuth = useAuthStore.getState().isAuthenticated;
        if (isAuth) {
          try {
            await removeSavedListing(id);
          } catch (err) {
            console.error("[Wishlist] Failed to remove listing from backend PostgreSQL:", err);
            // Rollback optimistic update
            set({ items: previousItems });
            throw err;
          }
        }
      },

      toggleItem: async (item: WishlistItem) => {
        const isCurrentlySaved = get().isSaved(item.id);
        if (isCurrentlySaved) {
          await get().removeItem(item.id);
          return false;
        } else {
          await get().addItem(item);
          return true;
        }
      },

      fetchFromBackend: async () => {
        const isAuth = useAuthStore.getState().isAuthenticated;
        if (!isAuth) {
          return;
        }

        set({ isLoading: true });
        try {
          const dtoList = await fetchSavedListings(1, 100);
          const backendItems = dtoList.map(dtoToWishlistItem);

          // Find any items saved locally before login
          const localItems = get().items;
          const unsyncedLocalItems = localItems.filter(
            (local) => !backendItems.some((b) => b.id === local.id),
          );

          // Asynchronously persist any guest saved items into the user's PostgreSQL account
          if (unsyncedLocalItems.length > 0) {
            for (const guestItem of unsyncedLocalItems) {
              toggleSavedListing(guestItem.id).catch((err) =>
                console.warn("[Wishlist] Syncing guest item to PostgreSQL failed:", guestItem.id, err),
              );
            }
          }

          set({
            items: [...unsyncedLocalItems, ...backendItems],
            isLoading: false,
            isInitialized: true,
          });
        } catch (err) {
          console.error("[Wishlist] Error fetching saved listings from PostgreSQL:", err);
          set({ isLoading: false });
        }
      },

      clearWishlist: () => set({ items: [], isInitialized: false }),
    }),
    {
      name: "nearby_wishlist",
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({
        items: state.items,
      }),
    },
  ),
);
