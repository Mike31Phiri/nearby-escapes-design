import type { ExperienceDifficulty, TransportServiceType } from "./listing";

// Zambia's 10 provinces
export type ZambiaProvince =
  | "Central"
  | "Copperbelt"
  | "Eastern"
  | "Luapula"
  | "Lusaka"
  | "Muchinga"
  | "Northern"
  | "North-Western"
  | "Southern"
  | "Western";

// Per-vertical search parameter shapes

export interface StaySearchParams {
  province?: ZambiaProvince;
  /** ISO 8601 date string e.g. '2025-08-15' */
  checkIn?: string;
  /** ISO 8601 date string e.g. '2025-08-18' */
  checkOut?: string;
  guests?: number;
  /** Sub-category slug e.g. 'lodge', 'chalet', 'campsite' */
  category?: string;
  /** Minimum nightly rate filter in Ngwee (integer) */
  minRateNgwee?: number;
  /** Maximum nightly rate filter in Ngwee (integer) */
  maxRateNgwee?: number;
  /** Comma-separated or array of required amenity slugs */
  amenities?: string[];
  page?: number;
}

export interface ExperienceSearchParams {
  province?: ZambiaProvince;
  /** ISO 8601 date string */
  date?: string;
  category?: string;
  groupSize?: number;
  /** Minimum price per adult in Ngwee (integer) */
  minPriceNgwee?: number;
  /** Maximum price per adult in Ngwee (integer) */
  maxPriceNgwee?: number;
  difficulty?: ExperienceDifficulty;
  page?: number;
}

export interface TransportSearchParams {
  /** Pickup location / city name or slug */
  from?: string;
  /** Drop-off location / city name or slug */
  to?: string;
  /** ISO 8601 date string */
  date?: string;
  seats?: number;
  serviceType?: TransportServiceType;
  page?: number;
}

export interface PackageSearchParams {
  category?: string;
  guests?: number;
  /** ISO 8601 date string */
  startDate?: string;
  /** Maximum bundled package price in Ngwee (integer) */
  maxPriceNgwee?: number;
  page?: number;
}

// Generic paginated search result wrapper
export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}
