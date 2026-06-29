import type { ExperienceDifficulty, TransportServiceType } from "./listing";
import type { ZambiaProvince } from "./search";

// ---------------------------------------------------------------------------
// StayFilterState — UI filter state for the Stay vertical
// ---------------------------------------------------------------------------
export interface StayFilterState {
  /** [minNgwee, maxNgwee] nightly rate range (integers) */
  priceRange: [number, number];
  /** e.g. ['Lodge', 'Chalet', 'Campsite'] */
  propertyTypes: string[];
  /** e.g. ['WiFi', 'Pool', 'Air conditioning'] */
  amenities: string[];
  province?: ZambiaProvince;
  /** Sub-category slugs e.g. ['boutique', 'eco-lodge'] */
  categories: string[];
}

// ---------------------------------------------------------------------------
// ExperienceFilterState — UI filter state for the Experience vertical
// ---------------------------------------------------------------------------
export interface ExperienceFilterState {
  /** [minNgwee, maxNgwee] per-adult price range (integers) */
  priceRange: [number, number];
  /** e.g. ['Safari', 'Kayaking', 'Cultural Tour'] */
  categories: string[];
  difficulty?: ExperienceDifficulty;
  /** Minimum experience duration in hours */
  minDuration?: number;
  /** Maximum experience duration in hours */
  maxDuration?: number;
  province?: ZambiaProvince;
}

// ---------------------------------------------------------------------------
// TransportFilterState — UI filter state for the Transport vertical
// ---------------------------------------------------------------------------
export interface TransportFilterState {
  serviceType?: TransportServiceType;
  /** e.g. ['SUV', 'Minibus', 'Saloon'] */
  vehicleTypes: string[];
  /** [startHour, endHour] in 24-hour format e.g. [6, 20] */
  departureTimeRange?: [number, number];
  /** [minNgwee, maxNgwee] daily/per-km price range (integers) */
  priceRange: [number, number];
}

// ---------------------------------------------------------------------------
// PackageFilterState — UI filter state for the Package vertical
// ---------------------------------------------------------------------------
export interface PackageFilterState {
  /** e.g. ['Adventure', 'Honeymoon', 'Family'] */
  categories: string[];
  /** [minNgwee, maxNgwee] total package price range (integers) */
  priceRange: [number, number];
  guests?: number;
}
