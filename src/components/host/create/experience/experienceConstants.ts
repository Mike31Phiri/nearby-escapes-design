import {
  Landmark,
  Coffee,
  Compass,
  Waves,
  Ship,
  Footprints,
  Palette,
  LucideIcon,
} from "lucide-react";

export const EXPERIENCE_STORAGE_KEY = "nearby_escapes_create_experience_draft";

export interface ExperienceSubtypeOption {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const EXPERIENCE_SUBTYPES: ExperienceSubtypeOption[] = [
  {
    id: "cultural_heritage",
    title: "Cultural & Heritage Tour",
    description: "Guided village tours, historic landmarks, artisan markets, and traditions.",
    icon: Landmark,
  },
  {
    id: "game_drive_safari",
    title: "Wildlife Safari & Game Drive",
    description: "4x4 morning or sunset game drives with certified safari guides.",
    icon: Compass,
  },
  {
    id: "vic_falls_adventure",
    title: "Victoria Falls Adventure",
    description: "Gorge hikes, helicopter flights, devil's pool, and adrenaline sports.",
    icon: Waves,
  },
  {
    id: "boat_water_safari",
    title: "Boat & River Cruise Safari",
    description: "Zambezi or Kafue river safaris with hippo, crocodile, and bird watching.",
    icon: Ship,
  },
  {
    id: "nature_birding",
    title: "Nature & Birding Walk",
    description: "Bushwalking safaris, botanical walks, and guided birding expeditions.",
    icon: Footprints,
  },
  {
    id: "tea_food_tasting",
    title: "Food & Tasting Experience",
    description: "Traditional Zambian culinary tastings, farm visits, and dining sessions.",
    icon: Coffee,
  },
  {
    id: "art_craft_workshop",
    title: "Art & Craft Workshop",
    description: "Traditional basket weaving, pottery, and local art demonstrations.",
    icon: Palette,
  },
];

export interface ExperienceItemOption {
  id: string;
  label: string;
}

export const EXPERIENCE_WHATS_INCLUDED: ExperienceItemOption[] = [
  { id: "park_fees", label: "National Park Entry & Conservation Fees" },
  { id: "safari_guide", label: "Professional Certified Safari Guide" },
  { id: "game_vehicle", label: "Open 4x4 Safari Vehicle Transport" },
  { id: "water_snacks", label: "Complimentary Chilled Water & Snacks" },
  { id: "traditional_meal", label: "Authentic Zambian Buffet / Bush Lunch" },
  { id: "safety_gear", label: "Safety Equipment & First Aid Coverage" },
  { id: "pickup_dropoff", label: "Complimentary Hotel Pick-up & Drop-off" },
  { id: "binoculars", label: "Field Binoculars & Wildlife Spotting Guides" },
];

export const EXPERIENCE_WHAT_TO_BRING: ExperienceItemOption[] = [
  { id: "id_passport", label: "Valid ID or Passport for Gate Clearance" },
  { id: "walking_shoes", label: "Comfortable Closed Walking or Hiking Shoes" },
  { id: "sun_protection", label: "Sunscreen, UV Sunglasses, and Safari Hat" },
  { id: "insect_repellent", label: "Insect Repellent Spray or Cream" },
  { id: "camera", label: "Camera or Smartphone with Extra Battery" },
  { id: "warm_jacket", label: "Warm Fleece or Light Jacket for Early Mornings" },
  { id: "cash_zmw", label: "Local Cash (ZMW) for Souvenirs & Tips" },
  { id: "water_bottle", label: "Reusable Eco-Friendly Water Bottle" },
];

export const EXPERIENCE_WHAT_NOT_TO_BRING: ExperienceItemOption[] = [
  { id: "drones", label: "Drones (Prohibited in National Parks)" },
  { id: "plastic_bags", label: "Single-Use Plastic Bags" },
  { id: "bright_clothing", label: "Bright Red / Neon Colored Clothes (Spooks Wildlife)" },
  { id: "pets", label: "Domestic Pets" },
  { id: "firearms", label: "Firearms or Hunting Weapons" },
  { id: "heavy_suitcases", label: "Hard-shell or Oversized Luggage" },
];

export const EXPERIENCE_SAMPLE_PHOTOS: string[] = [
  "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200",
];
