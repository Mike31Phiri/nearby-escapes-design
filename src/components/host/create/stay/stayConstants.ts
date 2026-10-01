import {
  Hotel,
  Tent,
  Home,
  Building2,
  Coffee,
  Castle,
  Sparkles,
  Mountain,
  Wifi,
  Wind,
  Utensils,
  CarFront,
  Droplets,
  Laptop,
  Tv,
  Shirt,
  Waves,
  Sun,
  Flame,
  Eye,
  Anchor,
  ShieldCheck,
  Lock,
  HeartPulse,
  Bell,
  Key,
  Zap,
  LucideIcon,
} from "lucide-react";

export const STAY_STORAGE_KEY = "nearby_escapes_create_stay_draft";

export interface StaySubtypeOption {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const STAY_SUBTYPES: StaySubtypeOption[] = [
  {
    id: "safari_lodge",
    title: "Safari Lodge",
    description: "Immersive wilderness lodge with full hospitality and safari access.",
    icon: Hotel,
  },
  {
    id: "bush_camp",
    title: "Bush Camp",
    description: "Tented camp or secluded bush retreat set in natural terrain.",
    icon: Tent,
  },
  {
    id: "chalet",
    title: "Chalet / Cottage",
    description: "Charming standalone chalet, rustic cabin, or private river cottage.",
    icon: Home,
  },
  {
    id: "apartment",
    title: "Apartment",
    description: "Modern serviced city or town apartment with self-catering amenities.",
    icon: Building2,
  },
  {
    id: "guest_house",
    title: "Guest House / B&B",
    description: "Warm, hosted residential stay with breakfast and local hospitality.",
    icon: Coffee,
  },
  {
    id: "villa",
    title: "Private Villa",
    description: "Spacious private property ideal for families and exclusive groups.",
    icon: Castle,
  },
  {
    id: "boutique_hotel",
    title: "Boutique Hotel",
    description: "Design-led hospitality with premium finishes and dining.",
    icon: Sparkles,
  },
  {
    id: "eco_retreat",
    title: "Eco Retreat",
    description: "Sustainable, off-grid sanctuary emphasizing low environmental impact.",
    icon: Mountain,
  },
];

export interface StayAmenityItem {
  id: string;
  label: string;
  icon?: LucideIcon;
}

export const STAY_GUEST_FAVOURITES: StayAmenityItem[] = [
  { id: "wifi", label: "Fast Wi-Fi", icon: Wifi },
  { id: "air_conditioning", label: "Air Conditioning", icon: Wind },
  { id: "kitchen", label: "Kitchen", icon: Utensils },
  { id: "parking", label: "Free Parking", icon: CarFront },
  { id: "hot_water", label: "Hot Water", icon: Droplets },
  { id: "workspace", label: "Dedicated Workspace", icon: Laptop },
  { id: "tv", label: "TV / DStv", icon: Tv },
  { id: "swimming_pool", label: "Swimming Pool", icon: Waves },
  { id: "laundry", label: "Laundry Service", icon: Shirt },
  { id: "housekeeping", label: "Daily Housekeeping", icon: Sparkles },
];

export const STAY_STANDOUTS: StayAmenityItem[] = [
  { id: "solar_power", label: "Solar Backup Power", icon: Sun },
  { id: "borehole_water", label: "Borehole Water", icon: Droplets },
  { id: "private_pool", label: "Private Pool", icon: Waves },
  { id: "fire_pit", label: "Fire Pit / Boma", icon: Flame },
  { id: "viewing_deck", label: "Wildlife Viewing Deck", icon: Eye },
  { id: "braai_area", label: "Braai / BBQ Grill", icon: Flame },
  { id: "river_front", label: "River / Lake Frontage", icon: Anchor },
  { id: "private_chef", label: "Private Chef Service", icon: Coffee },
  { id: "patio_balcony", label: "Patio / Balcony", icon: Home },
  { id: "outdoor_shower", label: "Outdoor Safari Shower", icon: Droplets },
];

export const STAY_SAFETY: StayAmenityItem[] = [
  { id: "security_guard", label: "24/7 Security Guard", icon: ShieldCheck },
  { id: "electric_fence", label: "Electric Perimeter Fence", icon: Lock },
  { id: "first_aid", label: "First Aid Kit", icon: HeartPulse },
  { id: "fire_extinguisher", label: "Fire Extinguisher", icon: Flame },
  { id: "smoke_detector", label: "Smoke Detector", icon: Bell },
  { id: "safe_box", label: "In-room Digital Safe", icon: Key },
  { id: "backup_lighting", label: "Emergency LED Lights", icon: Zap },
];

export const STAY_SAMPLE_PHOTOS: string[] = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200",
];
