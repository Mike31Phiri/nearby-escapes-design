 /**
 * explore.ts — Explore API client
 */

import apiClient from "./client";
import type { Stay, Experience, Transport } from "@/lib/mock-data";

// Types

export interface ExploreProvince {
  id: string;
  name: string;
  desc: string;
  image: string;
  /** Lucide icon key rendered by the UI. */
  icon: string;
  stays: number;
  experiences: number;
}

export interface ExploreCity {
  id: string;
  name: string;
  region: string;
  image: string;
  stays: number;
}

export interface ExploreAttraction {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
}

export interface ExploreListings {
  stays: Stay[];
  experiences: Experience[];
  transport: Transport[];
}

 /**
 * Location-scoped payload from GET /api/explore/:provinceId.
 * Resolved server-side — the client never holds the full hierarchy.
 */
export interface ExploreLocation {
  province: ExploreProvince;
  /** All cities belonging to the province. */
  cities: ExploreCity[];
  /** Present when the request is scoped to a specific city (?city=). */
  city?: ExploreCity;
  /** Attractions — across the whole province, or within `city` when scoped. */
  attractions: ExploreAttraction[];
}

// UI card types (shared by ExplorePage / ExploreHub)

/** Listing types re-exported so UI files never import from mock data directly. */
export type { Stay, Experience, Transport } from "@/lib/mock-data";

/** A place card in the "Places to Visit" carousel (derived from ExploreCity). */
export interface PlaceToVisit {
  id: string;
  name: string;
  region: string;
  image: string;
  stays: number;
}

/** Alias used by attraction card components in the UI. */
export type AttractionItem = ExploreAttraction;

// API calls

/** Fetch all provinces for the top-level Explore grid. */
export const getExploreProvinces = async (): Promise<ExploreProvince[]> => {
  const { data } = await apiClient.get<{ provinces: ExploreProvince[] }>("/explore");
  return data.provinces;
};

 /**
 * Fetch a province with its cities and attractions.
 * Pass `cityId` to scope the payload to that city (attractions included).
 */
export const getExploreLocation = async (
  provinceId: string,
  cityId?: string,
): Promise<ExploreLocation> => {
  const { data } = await apiClient.get<ExploreLocation>(`/explore/${provinceId}`, {
    params: { city: cityId },
  });
  return data;
};

/** Fetch location-scoped stays, experiences and transport for the hub. */
export const getExploreListings = async (
  provinceId?: string,
  cityId?: string,
): Promise<ExploreListings> => {
  const { data } = await apiClient.get<ExploreListings>("/explore/listings", {
    params: { province: provinceId, city: cityId },
  });
  return data;
};
