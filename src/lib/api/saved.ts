/**
 * saved.ts — Saved Listings / Wishlists API service
 * Directly connects to the NestJS PostgreSQL backend for user wishlist management.
 */

import apiClient from "./client";
import type {
  SavedListingItemDTO,
  GetSavedListingsResponse,
  ToggleSavedListingResponse,
} from "@/types/backend-payloads";

/**
 * Fetch all saved listings for the authenticated user from backend PostgreSQL.
 * GET /api/saved
 */
export const fetchSavedListings = async (
  page: number = 1,
  limit: number = 50,
): Promise<SavedListingItemDTO[]> => {
  try {
    const { data } = await apiClient.get<GetSavedListingsResponse>("/saved", {
      params: { page, limit },
    });
    return data.data || [];
  } catch (err) {
    console.warn("[api/saved] Failed to fetch saved listings from PostgreSQL:", err);
    return [];
  }
};

/**
 * Toggle saved status for a listing in PostgreSQL (adds if not saved, removes if saved).
 * POST /api/saved/toggle
 */
export const toggleSavedListing = async (
  listingId: string,
): Promise<ToggleSavedListingResponse> => {
  const { data } = await apiClient.post<ToggleSavedListingResponse>("/saved/toggle", {
    listingId,
  });
  return data;
};

/**
 * Explicitly save an item to collections in PostgreSQL.
 * POST /api/saved/toggle
 */
export const addSavedListing = async (
  listingId: string,
): Promise<ToggleSavedListingResponse> => {
  return toggleSavedListing(listingId);
};

/**
 * Remove an item from saved collections in PostgreSQL.
 * DELETE /api/saved/:listingId
 */
export const removeSavedListing = async (listingId: string): Promise<void> => {
  await apiClient.delete(`/saved/${listingId}`);
};
