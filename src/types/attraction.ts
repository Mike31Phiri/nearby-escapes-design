// Attraction — non-bookable reference data (Gems)
// Nearby Escapes does NOT control these places. They are geographic anchors
// used to surface nearby Stays, Experiences, and Transport.

export type AttractionCategory =
  | "waterfall"
  | "game-reserve"
  | "heritage-site"
  | "viewpoint"
  | "natural-landmark"
  | "cultural-site"
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
  /** IDs of active Stay/Experience/Transport listings near this attraction */
  nearbyListingIds: string[];
  /** Estimated drive time from Lusaka in minutes */
  minutesFromLusaka?: number;
  bestTimeToVisit?: string;
  accessNotes?: string;
}
