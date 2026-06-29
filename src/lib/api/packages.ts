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
export const searchPackages = async (query: PackageSearchQuery): Promise<PackageSearchResult> => {
  void apiClient;
  void query;
  return {
    data: [],
    meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
  };
};

/** Fetch a single package by ID or slug. */
// TODO: Connect to real API
export const getPackage = async (idOrSlug: string): Promise<Package> => {
  void apiClient;
  void idOrSlug;
  return {} as Package;
};

/** Create a new package (admin only). */
// TODO: Connect to real API
export const createPackage = async (payload: CreatePackagePayload): Promise<Package> => {
  void apiClient;
  void payload;
  return {} as Package;
};

/** Update an existing package (admin only). */
// TODO: Connect to real API
export const updatePackage = async (
  id: string,
  payload: Partial<CreatePackagePayload>,
): Promise<Package> => {
  void apiClient;
  void id;
  void payload;
  return {} as Package;
};

/** Delete / archive a package (admin only). */
// TODO: Connect to real API
export const deletePackage = async (id: string): Promise<{ success: boolean }> => {
  void apiClient;
  void id;
  return { success: true };
};
