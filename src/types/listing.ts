import {
  Wifi,
  Waves,
  Coffee,
  UtensilsCrossed,
  Sparkles,
  Dumbbell,
  Car,
  Wind,
  Tv,
  Shirt,
  PawPrint,
  Bath,
  Smartphone,
  BaggageClaim,
  Accessibility,
} from "lucide-react";

// ── Listing Type ──────────────────────────────────────────────────────────

export type ListingType = "stay" | "experience" | "transport" | "gem";

// ── Nearest Attraction (used by Stays) ────────────────────────────────────

export interface NearestAttraction {
  name: string;
  distance: string; // e.g. "2.5 km"
  category: "landmark" | "nature" | "restaurant" | "activity" | "town" | "other";
}

// ── Transport Route Stop ──────────────────────────────────────────────────

export interface RouteStop {
  name: string;
  arrivalTime?: string;
  departureTime?: string;
  notes?: string;
}

// ── Transport Schedule ────────────────────────────────────────────────────

export interface TransportSchedule {
  frequency: "daily" | "weekly" | "custom";
  daysOfWeek?: string[]; // ["Mon","Tue","Wed",...]
  departureTimes: string[]; // ["07:00","14:00"]
  seasonalNotes?: string;
}

// ── Form Data ─────────────────────────────────────────────────────────────

export interface StayFormData {
  // Step 1 - Basic Info
  name: string;
  description: string;

  // Step 2 - Property Details
  propertyType: string; // Lodge, Hotel, Camp, Resort, Boutique, Guesthouse, Apartment, Villa
  bedrooms: number;
  beds: number;
  baths: number;
  maxGuests: number;
  sqft: number;

  // Step 3 - Location & Attractions
  location: string;
  nearestAttractions: NearestAttraction[];

  // Step 4 - Amenities
  amenities: string[];

  // Step 5 - Photos & Pricing
  images: string[];
  pricePerNight: number;

  // Step 6 - House Rules
  checkInFrom: string;
  checkInUntil: string;
  checkOutBefore: string;
  houseRules: string[];
  cancellationPolicy: "flexible" | "moderate" | "strict";
}

export interface TransportFormData {
  // Step 1 - Basic Info
  name: string;
  description: string;

  // Step 2 - Route
  from: string;
  to: string;
  stops: RouteStop[];

  // Step 3 - Schedule
  schedule: TransportSchedule;
  duration: string;
  bookingLeadTime: string; // e.g. "1 hour before"

  // Step 4 - Vehicle & Pricing
  vehicleType: string; // Bus, Minibus, Shuttle, Private Car, Train, Boat
  capacity: number;
  operatorName: string;
  operatorContact: string;
  vehicleAmenities: string[];
  pricePerSeat: number;
  images: string[];
}

export interface ExperienceFormData {
  // Step 1 - Basic Info
  name: string;
  description: string;

  // Step 2 - Activity Details
  activityType: string; // Tour, Safari, Class, Walk, Cultural, Water Sport, Adventure
  duration: string;
  maxParticipants: number;
  difficultyLevel: "easy" | "moderate" | "challenging";
  language: string;
  ageRestrictions: string;

  // Step 3 - What's Included
  whatsIncluded: string[];
  whatToBring: string[];
  meetingPoint: string;

  // Step 4 - Schedule & Availability
  availableDates: string; // e.g. "Year-round", "Jun-Oct"
  timeSlots: string[]; // ["08:00","13:00","16:00"]
  seasonalNotes: string;
  bookingLeadTime: string; // e.g. "24 hours in advance"

  // Step 5 - Photos & Pricing
  images: string[];
  pricePerPerson: number;
  groupPrice?: number;
  privateOption: boolean;
}

export interface GemFormData {
  // Step 1 - Basic Info
  name: string;
  description: string;

  // Step 2 - Location & Directions
  location: string;
  directions: string;
  accessibility: string; // e.g. "4x4 required", "Boat access only", "Paved road"

  // Step 3 - Discovery Details
  bestTimeToVisit: string;
  entryFee: string;
  whatMakesItSpecial: string;
  difficultyLevel: "easy" | "moderate" | "challenging";
  recommendedDuration: string;

  // Step 4 - Tips & Nearby
  tipsForVisitors: string[];
  nearbyAmenities: string[]; // Food, Accommodation, Fuel, etc.
  safetyNotes: string;

  // Step 5 - Photos
  images: string[];
}

// ── Initial Form Values ────────────────────────────────────────────────────

export const INITIAL_STAY_FORM: StayFormData = {
  name: "",
  description: "",
  propertyType: "",
  bedrooms: 1,
  beds: 1,
  baths: 1,
  maxGuests: 2,
  sqft: 0,
  location: "",
  nearestAttractions: [],
  amenities: [],
  images: [],
  pricePerNight: 0,
  checkInFrom: "14:00",
  checkInUntil: "22:00",
  checkOutBefore: "11:00",
  houseRules: [],
  cancellationPolicy: "moderate",
};

export const INITIAL_TRANSPORT_FORM: TransportFormData = {
  name: "",
  description: "",
  from: "",
  to: "",
  stops: [],
  schedule: {
    frequency: "daily",
    daysOfWeek: [],
    departureTimes: ["07:00"],
    seasonalNotes: "",
  },
  duration: "",
  bookingLeadTime: "1 hour before",
  vehicleType: "",
  capacity: 40,
  operatorName: "",
  operatorContact: "",
  vehicleAmenities: [],
  pricePerSeat: 0,
  images: [],
};

export const INITIAL_EXPERIENCE_FORM: ExperienceFormData = {
  name: "",
  description: "",
  activityType: "",
  duration: "",
  maxParticipants: 10,
  difficultyLevel: "easy",
  language: "English",
  ageRestrictions: "",
  whatsIncluded: [],
  whatToBring: [],
  meetingPoint: "",
  availableDates: "Year-round",
  timeSlots: ["08:00"],
  seasonalNotes: "",
  bookingLeadTime: "24 hours in advance",
  images: [],
  pricePerPerson: 0,
  privateOption: false,
};

export const INITIAL_GEM_FORM: GemFormData = {
  name: "",
  description: "",
  location: "",
  directions: "",
  accessibility: "",
  bestTimeToVisit: "",
  entryFee: "",
  whatMakesItSpecial: "",
  difficultyLevel: "easy",
  recommendedDuration: "",
  tipsForVisitors: [],
  nearbyAmenities: [],
  safetyNotes: "",
  images: [],
};

// ── Constants ──────────────────────────────────────────────────────────────

export const PROPERTY_TYPES = [
  { value: "lodge", label: "Lodge" },
  { value: "hotel", label: "Hotel" },
  { value: "camp", label: "Camp" },
  { value: "resort", label: "Resort" },
  { value: "boutique", label: "Boutique" },
  { value: "guesthouse", label: "Guesthouse" },
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
];

export const VEHICLE_TYPES = [
  { value: "bus", label: "Bus" },
  { value: "minibus", label: "Minibus" },
  { value: "shuttle", label: "Shuttle" },
  { value: "private-car", label: "Private Car" },
  { value: "train", label: "Train" },
  { value: "boat", label: "Boat" },
  { value: "plane", label: "Plane / Charter" },
];

export const EXPERIENCE_TYPES = [
  { value: "tour", label: "Tour" },
  { value: "safari", label: "Safari" },
  { value: "class", label: "Class / Workshop" },
  { value: "walk", label: "Guided Walk / Hike" },
  { value: "cultural", label: "Cultural Experience" },
  { value: "water-sport", label: "Water Sport" },
  { value: "adventure", label: "Adventure Activity" },
  { value: "wellness", label: "Wellness / Spa" },
];

export const STAY_AMENITIES = [
  { value: "wifi", label: "WiFi", icon: Wifi },
  { value: "pool", label: "Pool", icon: Waves },
  { value: "breakfast", label: "Breakfast", icon: Coffee },
  { value: "meals", label: "Meals Included", icon: UtensilsCrossed },
  { value: "spa", label: "Spa", icon: Sparkles },
  { value: "gym", label: "Gym", icon: Dumbbell },
  { value: "parking", label: "Free Parking", icon: Car },
  { value: "ac", label: "Air Conditioning", icon: Wind },
  { value: "tv", label: "TV", icon: Tv },
  { value: "kitchen", label: "Kitchen", icon: UtensilsCrossed },
  { value: "laundry", label: "Laundry", icon: Shirt },
  { value: "pet-friendly", label: "Pet Friendly", icon: PawPrint },
];

export const TRANSPORT_AMENITIES = [
  { value: "ac", label: "Air Conditioning", icon: Wind },
  { value: "wifi", label: "WiFi", icon: Wifi },
  { value: "refreshments", label: "Refreshments", icon: Coffee },
  { value: "entertainment", label: "Entertainment", icon: Tv },
  { value: "toilet", label: "Onboard Toilet", icon: Bath },
  { value: "usb", label: "USB Charging", icon: Smartphone },
  { value: "luggage", label: "Luggage Storage", icon: BaggageClaim },
  { value: "wheelchair", label: "Wheelchair Accessible", icon: Accessibility },
];

export const EXPERIENCE_INCLUSIONS = [
  { value: "guide", label: "Professional Guide" },
  { value: "equipment", label: "Equipment Provided" },
  { value: "transport", label: "Pickup & Dropoff" },
  { value: "meals", label: "Meals Included" },
  { value: "drinks", label: "Drinks / Refreshments" },
  { value: "photos", label: "Photos Included" },
  { value: "insurance", label: "Insurance Coverage" },
  { value: "entry-fees", label: "Entry Fees Included" },
];

export const WHAT_TO_BRING = [
  { value: "comfortable-shoes", label: "Comfortable Shoes" },
  { value: "sunscreen", label: "Sunscreen" },
  { value: "hat", label: "Hat" },
  { value: "water", label: "Water Bottle" },
  { value: "camera", label: "Camera" },
  { value: "swimwear", label: "Swimwear" },
  { value: "warm-clothing", label: "Warm Clothing" },
  { value: "rain-jacket", label: "Rain Jacket" },
  { value: "binoculars", label: "Binoculars" },
  { value: "insect-repellent", label: "Insect Repellent" },
];

export const NEARBY_CATEGORIES = [
  { value: "landmark", label: "Landmark" },
  { value: "nature", label: "Nature / Park" },
  { value: "restaurant", label: "Restaurant / Cafe" },
  { value: "activity", label: "Activity" },
  { value: "town", label: "Town Centre" },
  { value: "other", label: "Other" },
];

export const HOUSE_RULES_OPTIONS = [
  { value: "no-smoking", label: "No Smoking" },
  { value: "no-pets", label: "No Pets" },
  { value: "no-parties", label: "No Parties / Events" },
  { value: "quiet-hours", label: "Quiet Hours After 22:00" },
  { value: "shoes-off", label: "Remove Shoes Indoors" },
  { value: "no-food-rooms", label: "No Food in Bedrooms" },
  { value: "children-welcome", label: "Children Welcome" },
  { value: "eco-friendly", label: "Eco-Friendly Practices" },
];

export const CANCELLATION_POLICIES = [
  { value: "flexible", label: "Flexible", desc: "Free cancellation up to 24h before check-in" },
  { value: "moderate", label: "Moderate", desc: "Free cancellation up to 5 days before check-in" },
  { value: "strict", label: "Strict", desc: "50% refund up to 7 days before check-in" },
];

export const DIFFICULTY_LEVELS = [
  { value: "easy", label: "Easy", desc: "Suitable for all fitness levels" },
  { value: "moderate", label: "Moderate", desc: "Some physical activity required" },
  { value: "challenging", label: "Challenging", desc: "Requires good fitness" },
];

export const TIME_SLOT_OPTIONS = [
  { value: "06:00", label: "Early Morning (06:00)" },
  { value: "07:00", label: "Morning (07:00)" },
  { value: "08:00", label: "Morning (08:00)" },
  { value: "09:00", label: "Late Morning (09:00)" },
  { value: "10:00", label: "Midday (10:00)" },
  { value: "11:00", label: "Late Morning (11:00)" },
  { value: "12:00", label: "Noon (12:00)" },
  { value: "13:00", label: "Early Afternoon (13:00)" },
  { value: "14:00", label: "Afternoon (14:00)" },
  { value: "15:00", label: "Late Afternoon (15:00)" },
  { value: "16:00", label: "Late Afternoon (16:00)" },
  { value: "17:00", label: "Evening (17:00)" },
  { value: "18:00", label: "Sunset (18:00)" },
];

export const WEEK_DAYS = [
  "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
];

export const NEARBY_OPTIONS = [
  { value: "food", label: "Food & Restaurants" },
  { value: "accommodation", label: "Accommodation" },
  { value: "fuel", label: "Fuel Station" },
  { value: "shops", label: "Shops / Market" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "hospital", label: "Hospital / Clinic" },
  { value: "atm", label: "ATM / Bank" },
  { value: "transport-hub", label: "Bus Station / Airport" },
  { value: "police", label: "Police Station" },
];

// ── User Profile Extras (for JIT collection) ──────────────────────────────

export interface UserPreferences {
  homeCity: string;
  phone: string;
  travelInterests: string[];
  budgetRange: "budget" | "mid" | "luxury";
  travelGroup: "solo" | "couple" | "family" | "friends";
}
