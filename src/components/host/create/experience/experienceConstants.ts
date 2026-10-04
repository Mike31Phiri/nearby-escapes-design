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

export const EXPERIENCE_WHATS_NOT_INCLUDED: ExperienceItemOption[] = [
  { id: "tips_gratuities", label: "Gratuities & tips for guides and drivers (discretionary)" },
  { id: "alcoholic_drinks", label: "Alcoholic beverages & premium wine selections" },
  { id: "travel_insurance", label: "Personal travel, medical, or evacuation insurance" },
  { id: "souvenirs", label: "Souvenirs, artisan crafts, and personal shopping expenses" },
  { id: "camera_rentals", label: "Specialized camera gear and lens rental fees" },
  { id: "visa_fees", label: "Border clearance or visa entry fees" },
];

export const EXPERIENCE_IMPORTANT_INFO: ExperienceItemOption[] = [
  { id: "arrive_early", label: "Please arrive 15 minutes before scheduled start time at meeting point" },
  { id: "id_required", label: "A valid physical government ID or passport is required for clearance" },
  { id: "neutral_clothing", label: "Wear neutral-colored, comfortable clothing and sturdy walking shoes" },
  { id: "first_aid", label: "Certified Wilderness First Responder and first aid emergency kit on site" },
  { id: "cancellation_24h", label: "Free cancellation up to 24 hours before the experience start time" },
  { id: "weather_notice", label: "Activity runs subject to safe weather conditions" },
];

export const EXPERIENCE_NOT_SUITABLE_FOR: ExperienceItemOption[] = [
  { id: "wheelchair", label: "Wheelchair users (due to unpaved natural tracks & step-up vehicle chassis)" },
  { id: "mobility", label: "People with severe mobility impairments or back problems" },
  { id: "pregnancy", label: "Pregnant women past second trimester" },
  { id: "young_children", label: "Children under 6 years of age" },
  { id: "heart_condition", label: "Guests with serious cardiovascular conditions" },
];

export interface DefaultItineraryStop {
  time: string;
  title: string;
  description: string;
}

export const DEFAULT_EXPERIENCE_ITINERARY: DefaultItineraryStop[] = [
  {
    time: "06:00 AM",
    title: "Sunrise Bush Departure & Gate Entry",
    description: "Meet your licensed safari ranger in a custom open 4x4 vehicle. Enter the park as the morning light activates wildlife.",
  },
  {
    time: "07:00 AM",
    title: "Predator & Big Game Tracking",
    description: "Navigate river loops and waterholes tracking lions, leopards, and large elephant herds during peak activity hours.",
  },
  {
    time: "09:30 AM",
    title: "Bush Coffee & Traditional Snacks Break",
    description: "Scenic stop along the riverbank for fresh Zambian coffee, tea, homemade rusks, and bird identification.",
  },
  {
    time: "10:30 AM",
    title: "Late Morning Wildlife Circuit & Return",
    description: "Secondary wildlife circuit focusing on plains game and raptors before returning to the safari base camp.",
  },
];

export const EXPERIENCE_SAMPLE_PHOTOS: string[] = [
  "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200",
];
