import type { ElementType } from "react";
import {
  Bed,
  Ticket,
  Bus,
  Home,
  Building2,
  Tractor,
  Hotel,
  House,
  Building,
  Tent,
  Leaf,
  Star,
  Map,
  Route,
  CalendarClock,
  CarFront,
  Plane,
  Binoculars,
  Factory,
  Landmark,
  Utensils,
  Mountain,
  GraduationCap,
} from "lucide-react";

// Listing verticals
export type ListingType = "stays" | "experiences" | "transport";

export const LISTING_TYPE_OPTIONS: {
  value: ListingType;
  label: string;
  description: string;
  icon: ElementType;
}[] = [
  {
    value: "stays",
    label: "Stays",
    description: "Lodges, apartments, farms & guesthouses",
    icon: Bed,
  },
  {
    value: "experiences",
    label: "Experiences",
    description: "Tours, safaris & cultural activities",
    icon: Ticket,
  },
  {
    value: "transport",
    label: "Transport",
    description: "Local, intercity & scheduled routes",
    icon: Bus,
  },
];

export interface SubTypeOption {
  value: string;
  label: string;
  description: string;
  icon: ElementType;
}

// Stays sub-types
export const STAY_SUBTYPES: SubTypeOption[] = [
  { value: "lodge", label: "Lodge", description: "Bush, river & safari lodges", icon: Home },
  {
    value: "apartment",
    label: "Apartment",
    description: "Self-catering apartments & flats",
    icon: Building2,
  },
  {
    value: "farm-stay",
    label: "Farm Stay",
    description: "Working farms & agri-tourism",
    icon: Tractor,
  },
  {
    value: "guesthouse",
    label: "Guesthouse",
    description: "Family-run guest accommodation",
    icon: Hotel,
  },
  { value: "chalet", label: "Chalet", description: "Private chalets & cottages", icon: House },
  { value: "villa", label: "Villa", description: "Standalone holiday villas", icon: Building },
  { value: "campsite", label: "Campsite", description: "Camping & caravan sites", icon: Tent },
  {
    value: "eco-lodge",
    label: "Eco-Lodge",
    description: "Sustainable, eco-friendly stays",
    icon: Leaf,
  },
  {
    value: "boutique-hotel",
    label: "Boutique Hotel",
    description: "Small design-led hotels",
    icon: Star,
  },
];

// Transport sub-types
export const TRANSPORT_SUBTYPES: SubTypeOption[] = [
  {
    value: "local",
    label: "Local Routes",
    description: "Within a city, town or district",
    icon: Map,
  },
  {
    value: "intercity",
    label: "Intercity Routes",
    description: "Between major towns & cities",
    icon: Route,
  },
  {
    value: "scheduled",
    label: "Scheduled Route",
    description: "Fixed timetable public routes",
    icon: CalendarClock,
  },
  {
    value: "private-transfers",
    label: "Private Transfers",
    description: "Door-to-door private hire",
    icon: CarFront,
  },
  {
    value: "airport-pickups",
    label: "Airport Pickups",
    description: "Airport shuttle & meet-and-greet",
    icon: Plane,
  },
];

// Experiences sub-types
export const EXPERIENCE_SUBTYPES: SubTypeOption[] = [
  {
    value: "farm-visits",
    label: "Farm Visits",
    description: "Farm tours & agri-tourism",
    icon: Tractor,
  },
  {
    value: "wildlife-game-drives",
    label: "Wildlife & Game Drives",
    description: "Safaris and game viewing",
    icon: Binoculars,
  },
  {
    value: "industrial-heritage",
    label: "Industrial & Heritage",
    description: "History, mines & heritage tours",
    icon: Factory,
  },
  {
    value: "cultural-community",
    label: "Cultural & Community",
    description: "Local culture & village visits",
    icon: Landmark,
  },
  {
    value: "culinary-food",
    label: "Culinary & Food",
    description: "Food tours & cooking classes",
    icon: Utensils,
  },
  {
    value: "adventure-outdoor",
    label: "Adventure & Outdoor",
    description: "Hiking, rafting & adrenaline",
    icon: Mountain,
  },
  {
    value: "school-educational",
    label: "School & Educational",
    description: "School trips & study tours",
    icon: GraduationCap,
  },
];

export const SUB_TYPE_OPTIONS: Record<ListingType, SubTypeOption[]> = {
  stays: STAY_SUBTYPES,
  experiences: EXPERIENCE_SUBTYPES,
  transport: TRANSPORT_SUBTYPES,
};

// Wizard steps
export const WIZARD_STEPS = [
  { id: "business", label: "Business", short: "Business" },
  { id: "type", label: "Listing Type", short: "Type" },
  { id: "details", label: "Listing Details", short: "Details" },
  { id: "proof", label: "Documents", short: "Docs" },
] as const;

export const WIZARD_STEP_COUNT = WIZARD_STEPS.length;

// Years in operation
export function buildYearsInOperation(): string[] {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let year = currentYear; year >= 1970; year -= 1) {
    years.push(String(year));
  }
  return years;
}

// Uploaded document shape
export interface UploadedDoc {
  id: string;
  name: string;
  size: number;
}

// Wizard form data
export interface OnboardingData {
  // Page 1 — Business basics
  businessName: string;
  operatingSince: string;
  province: string;
  town: string;
  businessEmail: string;
  businessPhone: string;
  // Page 2 — Listing type
  listingType: ListingType | "";
  // Page 3 — Sub-type
  subType: string;
  // Page 4 — Proof of ownership & operation
  ownershipDocs: UploadedDoc[];
  operationDocs: UploadedDoc[];
}

export const INITIAL_ONBOARDING_DATA: OnboardingData = {
  businessName: "",
  operatingSince: "",
  province: "",
  town: "",
  businessEmail: "",
  businessPhone: "",
  listingType: "",
  subType: "",
  ownershipDocs: [],
  operationDocs: [],
};

export type ValidationErrors = Partial<Record<keyof OnboardingData, string>>;
