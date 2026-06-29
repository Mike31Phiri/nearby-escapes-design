export type ListingVertical = "stay" | "experience" | "transport" | "package";

export type ListingStatus = "draft" | "pending_review" | "active" | "paused" | "rejected";

// ---------------------------------------------------------------------------
// Shared location shape used across listing types
// ---------------------------------------------------------------------------
export interface ListingLocation {
  address: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
}

// ---------------------------------------------------------------------------
// BaseListing — fields common to Stay, Experience, and Transport
// ---------------------------------------------------------------------------
export interface BaseListing {
  id: string;
  hostId: string;
  title: string;
  slug: string;
  description: string;
  status: ListingStatus;
  vertical: ListingVertical;
  images: string[];
  location: ListingLocation;
  rating: number;
  totalReviews: number;
  isInstantBook: true; // always true — platform is Instant Book only
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Stay
// ---------------------------------------------------------------------------
export interface Bed {
  type: string; // e.g. 'King', 'Twin', 'Sofa bed'
  count: number;
}

export interface StayListing extends BaseListing {
  vertical: "stay";
  propertyType: string; // e.g. 'Chalet', 'Apartment', 'Lodge', 'Campsite'
  maxGuests: number;
  bedrooms: number;
  beds: Bed[];
  bathrooms: number;
  amenities: string[];
  cancellationPolicy: string;
  /** Nightly base rate in Ngwee (integer). Never float. */
  baseRateNgwee: number;
}

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------
export type ExperienceDifficulty = "Easy" | "Moderate" | "Challenging" | "Extreme";

export interface ExperienceListing extends BaseListing {
  vertical: "experience";
  category: string; // e.g. 'Safari', 'Kayaking', 'Cultural Tour'
  durationHours: number;
  meetingPointAddress: string;
  meetingLatitude: number;
  meetingLongitude: number;
  difficulty: ExperienceDifficulty;
  minAge: number;
  maxGroupSize: number;
  minGroupSize: number;
  inclusions: string[];
  exclusions: string[];
  /** Per-adult price in Ngwee (integer). Never float. */
  pricePerAdultNgwee: number;
  /** Per-child price in Ngwee (integer). Never float. */
  pricePerChildNgwee: number;
}

// ---------------------------------------------------------------------------
// Transport
// ---------------------------------------------------------------------------
export type TransportServiceType = "self-drive" | "chauffeured" | "both";
export type TransportPricingType = "daily" | "per-km";
export type FuelType = "petrol" | "diesel" | "electric" | "hybrid";
export type Transmission = "manual" | "automatic";

export interface TransportListing extends BaseListing {
  vertical: "transport";
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  transmission: Transmission;
  fuelType: FuelType;
  passengerCapacity: number;
  serviceType: TransportServiceType;
  pricingType: TransportPricingType;
  /** Daily rate in Ngwee (integer). Never float. */
  dailyRateNgwee: number;
  /** Per-km rate in Ngwee (integer). Never float. */
  perKmRateNgwee: number;
}

// ---------------------------------------------------------------------------
// Package — admin-curated; does NOT extend BaseListing (no single hostId)
// ---------------------------------------------------------------------------
export type PackageStatus = "draft" | "active" | "archived";

export interface Package {
  id: string;
  title: string;
  slug: string;
  description: string;
  tagline: string;
  category: string; // e.g. 'Adventure', 'Honeymoon', 'Family'
  images: string[];
  stayListingId: string;
  experienceListingIds: string[];
  transportListingId?: string;
  attractionId?: string;
  /** Bundled total price in Ngwee (integer). Never float. */
  totalPriceNgwee: number;
  highlights: string[];
  status: PackageStatus;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Attraction (Gem) — non-bookable reference data
// ---------------------------------------------------------------------------
export type AttractionCategory =
  | "waterfall"
  | "game-reserve"
  | "heritage-site"
  | "viewpoint"
  | "natural-landmark"
  | "other";

export interface Attraction {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: AttractionCategory;
  province: string;
  latitude: number;
  longitude: number;
  images: string[];
  /** IDs of Stay / Experience / Transport listings near this attraction */
  nearbyListingIds: string[];
}
