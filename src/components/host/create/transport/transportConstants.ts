import {
  Plane,
  CarFront,
  Bus,
  Key,
  Navigation,
  Anchor,
  Wind,
  Fuel,
  Droplets,
  Zap,
  Wifi,
  Luggage,
  ShieldCheck,
  HeartPulse,
  FileText,
  Ticket,
  Music,
  Ban,
  LucideIcon,
} from "lucide-react";

export const TRANSPORT_STORAGE_KEY = "nearby_escapes_create_transport_draft";

export interface TransportSubtypeOption {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const TRANSPORT_SUBTYPES: TransportSubtypeOption[] = [
  {
    id: "airport_transfer",
    title: "Airport Transfer & Pick-up",
    description: "Reliable airport to hotel and lodge transfers with meet & greet.",
    icon: Plane,
  },
  {
    id: "safari_4x4",
    title: "4x4 Safari Vehicle",
    description: "Rugged, customized off-road 4WD vehicles equipped for national parks.",
    icon: CarFront,
  },
  {
    id: "intercity_shuttle",
    title: "Intercity Shuttle & Coach",
    description: "Scheduled or chartered long-distance passenger travel across provinces.",
    icon: Bus,
  },
  {
    id: "self_drive_rental",
    title: "Self-Drive Car Rental",
    description: "Daily or weekly vehicle rentals for independent drivers and tourists.",
    icon: Key,
  },
  {
    id: "chauffeur_service",
    title: "Private Chauffeur Service",
    description: "Executive, VIP, or daily chauffeured car for business or leisure.",
    icon: Navigation,
  },
  {
    id: "boat_transfer",
    title: "Boat & Water Transfer",
    description: "River crossings, island shuttles, and lake taxi services.",
    icon: Anchor,
  },
];

export interface TransportFeatureOption {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const TRANSPORT_FEATURES: TransportFeatureOption[] = [
  { id: "ac", label: "Dual Cabin Air Conditioning", icon: Wind },
  { id: "pro_driver", label: "Licensed Professional Chauffeur", icon: Navigation },
  { id: "fuel_included", label: "Fuel Included in Rate", icon: Fuel },
  { id: "chilled_water", label: "Complimentary Chilled Water", icon: Droplets },
  { id: "usb_charging", label: "Fast USB & 12V Phone Charging", icon: Zap },
  { id: "wifi", label: "High-Speed Mobile Onboard Wi-Fi", icon: Wifi },
  { id: "luggage_capacity", label: "Luggage Trailer / Roof Rack", icon: Luggage },
  { id: "passenger_insurance", label: "Full Passenger Liability Cover", icon: ShieldCheck },
  { id: "child_seat", label: "Infant / Child Booster Seat", icon: HeartPulse },
];

export interface TransportRuleOption {
  id: string;
  label: string;
}

export const TRANSPORT_WHAT_TO_CARRY: TransportRuleOption[] = [
  { id: "drivers_license", label: "Valid Driver's License (for Self-Drive)" },
  { id: "id_passport", label: "Lead Passenger Passport or National ID" },
  { id: "booking_voucher", label: "Digital Booking Confirmation Voucher" },
  { id: "flight_details", label: "Flight Number & Arrival Timing (if Airport Pickup)" },
  { id: "personal_cable", label: "Personal Audio AUX / Charging Cable" },
];

export const TRANSPORT_GUIDELINES: TransportRuleOption[] = [
  { id: "no_smoking", label: "Strictly No Smoking / Vaping inside vehicle" },
  { id: "no_open_alcohol", label: "No Open Alcoholic Beverages" },
  { id: "no_hazardous", label: "No Flammable or Hazardous Cargo" },
  { id: "no_overload", label: "No Overloading beyond licensed seat capacity" },
  { id: "no_uncaged_pets", label: "No Uncaged Pets or Animals" },
];

export const TRANSPORT_SAMPLE_PHOTOS: string[] = [
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1569263979104-865ab7cd8d17?auto=format&fit=crop&q=80&w=1200",
];
