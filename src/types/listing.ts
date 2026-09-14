export type ListingVertical = "stay" | "experience" | "transport" | "package";

/** Listing verticals a host can create themselves (package is admin-curated). */
export type ListingType = "stay" | "experience" | "transport";

// Host listing drafts — create → auto-save → publish flow
export type ListingDraftStatus = "draft" | "live";

 /**
 * A host's in-progress listing produced by the create wizard.
 * `form` is a snapshot of the raw react-hook-form values for the listing's
 * type so the wizard can be rehydrated exactly where the host left off.
 */
export interface ListingDraft {
  id: string;
  hostId: string;
  type: ListingType;
  status: ListingDraftStatus;
  /** Wizard form values keyed per listing type. */
  form: Record<string, unknown>;
  /** 0-based index of the step the host last worked on. */
  currentStep: number;
  /** 0–100 completeness estimate across the wizard's steps. */
  progressPercent: number;
  /** Display title — "Untitled draft" when missing. */
  title?: string;
  createdAt: string;
  updatedAt: string;
}

export type ListingStatus = "draft" | "pending_review" | "active" | "paused" | "rejected";

// Shared location shape used across listing types
export interface ListingLocation {
  address: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
}

// BaseListing — fields common to Stay, Experience, and Transport
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

// Stay
export interface Bed {
  type: string; // e.g. 'King', 'Twin', 'Sofa bed'
  count: number;
}

// Room types & inventory — a lodge/guesthouse can have several room types
// (e.g. Standard Room x10, 3-Bedroom Suite x4), each with its own capacity
// and nightly price. `count` is how many identical units exist.
export interface RoomType {
  id: string;
  name: string; // e.g. 'Standard Room', '3-Bedroom Family Suite'
  /** How many identical units of this room type exist (inventory) */
  count: number;
  /** Guests per single unit of this room type */
  maxGuests: number;
  /** Bedrooms per single unit of this room type */
  bedrooms: number;
  beds: Bed[];
  /** Nightly rate per unit in Ngwee (integer). Never float. */
  pricePerNightNgwee: number;
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
  /** Room types + inventory captured by the host. */
  roomTypes?: RoomType[];
  /** Free-text policies the host wants to put across. */
  customPolicies?: string;
  /** Host-written cancellation policy (overrides dropdown when set). */
  customCancellationPolicy?: string;
}

// Experience
export type ExperienceDifficulty = "Easy" | "Moderate" | "Challenging" | "Extreme";

export interface ExperienceItineraryItem {
  time: string;
  title: string;
  description: string;
}

export interface ExperienceOption {
  name: string;
  description?: string;
  /** Price in Ngwee (integer). Never float. */
  priceNgwee: number;
}

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
  // Host-provided fields surfaced on the guest detail page
  /** Keywords travelers can search for. */
  searchTags?: string[];
  /** 3–5 summary bullet points. */
  highlights?: string[];
  /** Fees paid on top of the booking (e.g. park entry). */
  extraFees?: string[];
  /** Dietary options the host can cater to. */
  dietaryRequirements?: string[];
  /** Suitability rules (who this is / isn't for). */
  suitability?: string[];
  /** Step-by-step schedule shown on the detail page. */
  itinerary?: ExperienceItineraryItem[];
  /** Bookable variations (e.g. 4-course vs 6-course meal). */
  options?: ExperienceOption[];
  /** Pickup radius around the meeting point, in km. */
  pickupRadiusKm?: number;
  /** Compliance checks confirmed by the host before publishing. */
  compliance?: string[];
  /** Notes left for the editorial review team. */
  editorialNotes?: string;
}

// Transport
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

// Package — admin-curated; does NOT extend BaseListing (no single hostId)
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

// Attraction (Gem) — non-bookable reference data
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
