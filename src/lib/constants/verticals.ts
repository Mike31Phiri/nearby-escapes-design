/**
 * Marketplace vertical and sub-category constants for Nearby Escapes.
 * All arrays are typed `as const` to enable exhaustive inference.
 */

export const VERTICALS = [
  { id: "stays", label: "Stays", href: "/stays", icon: "bed" },
  { id: "experiences", label: "Experiences", href: "/experiences", icon: "compass" },
  { id: "transport", label: "Transport", href: "/transport", icon: "car" },
  { id: "packages", label: "Packages", href: "/packages", icon: "package" },
] as const;

export const STAY_CATEGORIES = [
  { id: "farm-stays", label: "Farm Stays" },
  { id: "bush-lodges", label: "Bush Lodges" },
  { id: "river-lodges", label: "River Lodges" },
  { id: "chalets-cottages", label: "Chalets & Cottages" },
  { id: "urban-guesthouses", label: "Urban Guesthouses" },
  { id: "eco-camps", label: "Eco Camps" },
] as const;

export const EXPERIENCE_CATEGORIES = [
  { id: "farm-visits", label: "Farm Visits & Agri-Tourism" },
  { id: "industrial-heritage", label: "Industrial & Heritage Tours" },
  { id: "wildlife-game-drives", label: "Wildlife & Game Drives" },
  { id: "cultural-community", label: "Cultural & Community" },
  { id: "culinary-food", label: "Culinary & Food Tours" },
  { id: "adventure-outdoor", label: "Adventure & Outdoor" },
  { id: "school-educational", label: "School & Educational Trips" },
] as const;

export const TRANSPORT_CATEGORIES = [
  { id: "intercity-shuttles", label: "Intercity Shuttles" },
  { id: "private-transfers", label: "Private Transfers" },
  { id: "group-charters", label: "Group Charters" },
  { id: "road-trip-packages", label: "Road Trip Packages" },
  { id: "airport-pickups", label: "Airport Pickups" },
] as const;

export const PACKAGE_CATEGORIES = [
  { id: "weekend-escapes", label: "Weekend Escapes" },
  { id: "school-holiday", label: "School Holiday Packages" },
  { id: "corporate-retreats", label: "Corporate Retreats" },
  { id: "honeymoon", label: "Honeymoon Packages" },
  { id: "family-adventure", label: "Family Adventure" },
] as const;

/** Union of all Stay category IDs */
export type StayCategoryId = (typeof STAY_CATEGORIES)[number]["id"];

/** Union of all Experience category IDs */
export type ExperienceCategoryId = (typeof EXPERIENCE_CATEGORIES)[number]["id"];

/** Union of all Transport category IDs */
export type TransportCategoryId = (typeof TRANSPORT_CATEGORIES)[number]["id"];

/** Union of all Package category IDs */
export type PackageCategoryId = (typeof PACKAGE_CATEGORIES)[number]["id"];

/**
 * Convenience map from vertical ID to its sub-category array.
 * Useful for dynamic category listings.
 */
export const VERTICAL_SUB_CATEGORIES = {
  stays: STAY_CATEGORIES,
  experiences: EXPERIENCE_CATEGORIES,
  transport: TRANSPORT_CATEGORIES,
  packages: PACKAGE_CATEGORIES,
} as const;
