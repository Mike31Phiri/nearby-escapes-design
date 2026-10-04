/**
 * stays.ts — Stays API stubs
 *
 * All prices are integers in Ngwee (ZMW × 100). Never float.
 * All listings are Instant Book — no pending approval flow.
 *
 * TODO: Connect to real API
 */

import apiClient from "./client";
import type { StayListing } from "@/types/listing";

export interface StaySearchQuery {
  province?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  category?: string;
  /** Minimum nightly rate in Ngwee (integer) */
  minRateNgwee?: number;
  /** Maximum nightly rate in Ngwee (integer) */
  maxRateNgwee?: number;
  page?: number;
  limit?: number;
}

export interface StaySearchResult {
  data: StayListing[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateStayRoomType {
  id: string;
  name: string;
  /** How many identical units of this room type exist */
  count: number;
  maxGuests: number;
  bedrooms: number;
  beds: { type: string; count: number }[];
  /** Nightly rate per unit in Ngwee (integer). Never float. */
  pricePerNightNgwee: number;
}

export interface CreateStayPayload {
  title: string;
  description: string;
  propertyType: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  location: {
    address: string;
    city: string;
    province: string;
    latitude: number;
    longitude: number;
  };
  /** Base nightly rate in Ngwee (integer). Never float. */
  baseRateNgwee: number;
  cancellationPolicy: string;
  /** Room types + inventory captured by the host. */
  roomTypes: CreateStayRoomType[];
  /** Free-text policies the host wants to put across. */
  customPolicies?: string;
  /** Host-written cancellation policy (overrides dropdown when set). */
  customCancellationPolicy?: string;
}

/** Search / list stays with optional filters. */
export const searchStays = async (query: StaySearchQuery): Promise<StaySearchResult> => {
  const { data } = await apiClient.get<StaySearchResult>("/listings", {
    params: { type: "STAY", ...query },
  });
  return data;
};

/** Fetch a single stay listing by ID or slug. */
export const getStay = async (idOrSlug: string): Promise<StayListing> => {
  const { data } = await apiClient.get<StayListing>(`/listings/${idOrSlug}`);
  return data;
};

/** Create a new stay listing (host only). */
export const createStay = async (payload: CreateStayPayload): Promise<StayListing> => {
  // Map frontend CreateStayPayload to backend CreateStayDto
  const dto = {
    name: payload.title,
    description: payload.description,
    propertyType: payload.propertyType,
    maxGuests: payload.maxGuests,
    bedrooms: payload.bedrooms,
    beds: payload.bedrooms, // Approximation if beds array is missing
    baths: payload.bathrooms,
    location: `${payload.location.address}, ${payload.location.city}`,
    amenities: payload.amenities,
    images: payload.images,
    pricePerNight: payload.baseRateNgwee,
    cancellationPolicy: payload.cancellationPolicy.toUpperCase(),
    roomTypes: payload.roomTypes,
    customPolicies: payload.customPolicies,
    customCancellationPolicy: payload.customCancellationPolicy,
  };

  const { data } = await apiClient.post<StayListing>("/listings/stays", dto);
  return data;
};

/** Update an existing stay listing (host only). */
export const updateStay = async (
  id: string,
  payload: Partial<CreateStayPayload>,
): Promise<StayListing> => {
  const { data } = await apiClient.put<StayListing>(`/listings/stays/${id}`, payload);
  return data;
};

/** Delete / deactivate a stay listing (host only). */
export const deleteStay = async (id: string): Promise<{ success: boolean }> => {
  await apiClient.delete(`/listings/${id}`);
  return { success: true };
};
