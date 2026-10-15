/**
 * packages.ts — Packages API stubs
 *
 * Packages are admin-curated bundles of stay + experiences + optional transport.
 * All prices are integers in Ngwee (ZMW × 100). Never float.
 * Packages use Instant Book — no pending approval flow.
 *
 * TODO: Connect to real API
 */

import apiClient from "./client";
import type { Package, PackageStatus } from "@/types/listing";

export interface PackageSearchQuery {
  category?: string;
  guests?: number;
  startDate?: string;
  /** Maximum bundle price in Ngwee (integer) */
  maxPriceNgwee?: number;
  page?: number;
  limit?: number;
}

export interface PackageSearchResult {
  data: Package[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreatePackagePayload {
  title: string;
  slug: string;
  description: string;
  tagline: string;
  category: string;
  images: string[];
  stayListingId: string;
  experienceListingIds: string[];
  transportListingId?: string;
  attractionId?: string;
  /** Bundled total price in Ngwee (integer). Never float. */
  totalPriceNgwee: number;
  highlights: string[];
  status: PackageStatus;
}

/** Search / list packages with optional filters. */
// TODO: Connect to real API
/** Search packages with optional filters. */
export const searchPackages = async (
  query: PackageSearchQuery,
): Promise<PackageSearchResult> => {
  const { data } = await apiClient.get<PackageSearchResult>(
    "/admin/packages",
    { params: query },
  );
  return data;
};

/** Fetch a single package by ID or slug. */
export const getPackage = async (idOrSlug: string): Promise<Package> => {
  const { data } = await apiClient.get<Package>(`/admin/packages/${idOrSlug}`);
  return data;
};

/** Create a new package (admin only). */
export const createPackage = async (payload: CreatePackagePayload): Promise<Package> => {
  const { data } = await apiClient.post<Package>("/admin/packages", payload);
  return data;
};

/** Update an existing package (admin only). */
export const updatePackage = async (
  id: string,
  payload: Partial<CreatePackagePayload>,
): Promise<Package> => {
  const { data } = await apiClient.patch<Package>(`/admin/packages/${id}`, payload);
  return data;
};

/** Delete / archive a package (admin only). */
export const deletePackage = async (id: string): Promise<{ success: boolean }> => {
  const { data } = await apiClient.delete<{ success: boolean }>(`/admin/packages/${id}`);
  return data;
};
