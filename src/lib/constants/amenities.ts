/**
 * Amenity constants for Nearby Escapes listings.
 * Uses string-based icon names — no component imports in this constants file.
 * `value` fields form the canonical DB/filter keys; `label` fields are for UI display.
 */

export const STAY_AMENITIES = [
  { value: "wifi", label: "WiFi" },
  { value: "pool", label: "Swimming Pool" },
  { value: "breakfast", label: "Breakfast Included" },
  { value: "meals", label: "All Meals Included" },
  { value: "spa", label: "Spa" },
  { value: "gym", label: "Gym" },
  { value: "parking", label: "Free Parking" },
  { value: "ac", label: "Air Conditioning" },
  { value: "tv", label: "TV / DSTV" },
  { value: "kitchen", label: "Self-Catering Kitchen" },
  { value: "laundry", label: "Laundry" },
  { value: "pet-friendly", label: "Pet Friendly" },
  { value: "generator", label: "Generator Backup" },
  { value: "borehole", label: "Borehole Water" },
  { value: "solar", label: "Solar Power" },
  { value: "security", label: "24hr Security" },
  { value: "game-viewing", label: "Game Viewing Area" },
  { value: "campfire", label: "Campfire Area" },
  { value: "river-access", label: "River Access" },
  { value: "boat", label: "Boat / Canoe" },
] as const;

export const TRANSPORT_AMENITIES = [
  { value: "ac", label: "Air Conditioning" },
  { value: "wifi", label: "WiFi Onboard" },
  { value: "usb-charging", label: "USB Charging" },
  { value: "reclining-seats", label: "Reclining Seats" },
  { value: "luggage-trailer", label: "Luggage Trailer" },
  { value: "child-seat", label: "Child Seat Available" },
  { value: "wheelchair", label: "Wheelchair Accessible" },
] as const;

/** Union of all stay amenity value keys */
export type StayAmenityValue = (typeof STAY_AMENITIES)[number]["value"];

/** Union of all transport amenity value keys */
export type TransportAmenityValue = (typeof TRANSPORT_AMENITIES)[number]["value"];
