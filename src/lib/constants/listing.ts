import type { LucideIcon } from "lucide-react";
import { Wifi, Waves, AirVent, Utensils, Car, Shield, Tv, Coffee } from "lucide-react";

// ---------------------------------------------------------------------------
// Shared item shapes
// ---------------------------------------------------------------------------

export interface OptionItem {
  value: string;
  label: string;
}

export interface AmenityItem {
  value: string;
  label: string;
  icon: LucideIcon;
}

// ---------------------------------------------------------------------------
// Stay wizard constants
// ---------------------------------------------------------------------------

export const PROPERTY_TYPES: OptionItem[] = [
  { value: "chalet", label: "Chalet" },
  { value: "lodge", label: "Lodge" },
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "guesthouse", label: "Guesthouse" },
  { value: "campsite", label: "Campsite" },
  { value: "eco-lodge", label: "Eco-Lodge" },
  { value: "boutique-hotel", label: "Boutique Hotel" },
];

export const STAY_AMENITIES: AmenityItem[] = [
  { value: "wifi", label: "WiFi", icon: Wifi },
  { value: "pool", label: "Swimming Pool", icon: Waves },
  { value: "air-con", label: "Air Conditioning", icon: AirVent },
  { value: "kitchen", label: "Full Kitchen", icon: Utensils },
  { value: "parking", label: "Free Parking", icon: Car },
  { value: "security", label: "Security", icon: Shield },
  { value: "tv", label: "Smart TV", icon: Tv },
  { value: "breakfast", label: "Breakfast", icon: Coffee },
];

export const HOUSE_RULES_OPTIONS: OptionItem[] = [
  { value: "no-smoking", label: "No Smoking" },
  { value: "no-pets", label: "No Pets" },
  { value: "no-parties", label: "No Parties or Events" },
  { value: "quiet-hours", label: "Quiet Hours (10pm–7am)" },
  { value: "no-shoes", label: "No Shoes Indoors" },
];

export const CANCELLATION_POLICIES: OptionItem[] = [
  { value: "flexible", label: "Flexible – Full refund 1 day prior" },
  { value: "moderate", label: "Moderate – Full refund 5 days prior" },
  { value: "strict", label: "Strict – 50% refund up to 7 days prior" },
  { value: "non-refund", label: "Non-refundable" },
];
