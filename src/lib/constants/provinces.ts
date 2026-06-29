/**
 * Zambia province constants for Nearby Escapes.
 * `id` values are URL-safe slugs used throughout routing and filtering.
 */

export const ZAMBIA_PROVINCES = [
  { id: "central", label: "Central", capital: "Kabwe" },
  { id: "copperbelt", label: "Copperbelt", capital: "Ndola" },
  { id: "eastern", label: "Eastern", capital: "Chipata" },
  { id: "luapula", label: "Luapula", capital: "Mansa" },
  { id: "lusaka", label: "Lusaka", capital: "Lusaka" },
  { id: "muchinga", label: "Muchinga", capital: "Chinsali" },
  { id: "northern", label: "Northern", capital: "Kasama" },
  { id: "north-western", label: "North-Western", capital: "Solwezi" },
  { id: "southern", label: "Southern", capital: "Livingstone" },
  { id: "western", label: "Western", capital: "Mongu" },
] as const;

/** Union of all province slug IDs */
export type ProvinceId = (typeof ZAMBIA_PROVINCES)[number]["id"];
