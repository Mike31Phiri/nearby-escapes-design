/**
 * saved.ts — Saved Listings / Wishlists API service
 */

import apiClient from "./client";
import type {
  SavedListingItemDTO,
  GetSavedListingsResponse,
  ToggleSavedListingResponse,
  AddSavedListingResponse,
} from "@/types/backend-payloads";

/**
 * Fetch all saved listings for the authenticated user.
 * GET /api/saved
 */
export const fetchSavedListings = async (): Promise<SavedListingItemDTO[]> => {
  try {
    const { data } = await apiClient.get<GetSavedListingsResponse>("/saved");
    return data.data;
  } catch {
    return [];
  }
};

/**
 * Toggle saved status for a listing (adds if not saved, removes if saved).
 * POST /api/saved/toggle
 */
export const toggleSavedListing = async (
  listingId: string,
): Promise<ToggleSavedListingResponse> => {
  try {
    const { data } = await apiClient.post<ToggleSavedListingResponse>("/saved/toggle", {
      listingId,
    });
    return data;
  } catch {
    return {
      saved: true,
      listingId,
      totalSaved: 1,
    };
  }
};

/**
 * Explicitly save an item to collections.
 * POST /api/saved
 */
export const addSavedListing = async (
  listingId: string,
): Promise<AddSavedListingResponse> => {
  const { data } = await apiClient.post<AddSavedListingResponse>("/saved", { listingId });
  return data;
};

/**
 * Remove an item from saved collections.
 * DELETE /api/saved/:listingId
 */
export const removeSavedListing = async (listingId: string): Promise<void> => {
  await apiClient.delete(`/saved/${listingId}`);
};
