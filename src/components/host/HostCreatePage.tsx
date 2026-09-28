"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Hotel,
  Bus,
  Ticket,
  ShieldAlert,
  Tent,
  Home,
  Building2,
  Coffee,
  Castle,
  Sparkles,
  Mountain,
  Landmark,
  Compass,
  Waves,
  Ship,
  Footprints,
  Palette,
  Plane,
  CarFront,
  Key,
  Navigation,
  Anchor,
  ArrowLeft,
  Wifi,
  Wind,
  Utensils,
  Droplets,
  Laptop,
  Tv,
  Shirt,
  Sun,
  Flame,
  Eye,
  ShieldCheck,
  Lock,
  HeartPulse,
  Bell,
  Zap,
  MapPin,
  FileText,
  Camera,
  Wallet,
  Ban,
  Fuel,
  Luggage,
  Music,
  Plus,
  X,
  UploadCloud,
  ImageIcon,
  Trash2,
  Star,
  CheckCircle2,
  Tag,
  Users,
  Calendar,
  Percent,
  Check,
  LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { BackButton } from "@/components/shared/BackButton";
import { createDraftListing, updateDraftListing } from "@/lib/api/listings";
import { ROUTES } from "@/lib/constants/routes";
import { useHostStore } from "@/store/hostStore";
import type { ListingType } from "@/types/listing";
import { cn } from "@/lib/utils";
import { GoogleMapsLocationPicker } from "./GoogleMapsLocationPicker";

// Local storage key to preserve multi-step creation progress across reloads
const LOCAL_STORAGE_KEY = "nearby_escapes_create_listing_flow";

// ---------------------------------------------------------------------------
// Step 1: Vertical Categories
// ---------------------------------------------------------------------------

const LISTING_TYPES: {
  id: ListingType;
  icon: React.ElementType;
  title: string;
  description: string;
}[] = [
  {
    id: "stay",
    icon: Hotel,
    title: "Stay",
    description: "List a lodge, camp, guesthouse, chalet, or eco retreat.",
  },
  {
    id: "experience",
    icon: Ticket,
    title: "Experience",
    description: "Host tours, game drives, cultural visits, or activities.",
  },
  {
    id: "transport",
    icon: Bus,
    title: "Transport",
    description: "Offer intercity shuttles, transfers, or self-drive vehicles.",
  },
];

// ---------------------------------------------------------------------------
// Step 2: Specific Sub-Types for Zambia
// ---------------------------------------------------------------------------

interface SubtypeOption {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const STAY_SUBTYPES: SubtypeOption[] = [
  {
    id: "safari_lodge",
    title: "Safari Lodge",
    description: "Wilderness lodge near national parks & wildlife reserves",
    icon: Hotel,
  },
  {
    id: "bush_camp",
    title: "Bush Camp / Tented Camp",
    description: "Canvas safari tents & immersive wilderness camps",
    icon: Tent,
  },
  {
    id: "chalet",
    title: "Chalet / Cottage",
    description: "Standalone self-catering or catered chalets",
    icon: Home,
  },
  {
    id: "apartment",
    title: "Apartment / Flat",
    description: "Modern self-contained apartment in urban centers",
    icon: Building2,
  },
  {
    id: "guest_house",
    title: "Guest House / B&B",
    description: "Cozy hosted rooms with morning breakfast",
    icon: Coffee,
  },
  {
    id: "villa",
    title: "Villa / Holiday Home",
    description: "Private spacious property for families and groups",
    icon: Castle,
  },
  {
    id: "boutique_hotel",
    title: "Boutique Hotel",
    description: "Intimate hotel with personalized hospitality",
    icon: Sparkles,
  },
  {
    id: "eco_retreat",
    title: "Eco Retreat / Farm Stay",
    description: "Working farm or off-grid nature sanctuary",
    icon: Mountain,
  },
];

const EXPERIENCE_SUBTYPES: SubtypeOption[] = [
  {
    id: "cultural_heritage",
    title: "Cultural & Heritage Tour",
    description: "Traditional ceremonies, historic trails & village visits",
    icon: Landmark,
  },
  {
    id: "tea_food_tasting",
    title: "Food, Drink & Tea Tasting",
    description: "Kawambwa tea sessions, local brews & culinary tastings",
    icon: Coffee,
  },
  {
    id: "game_drive_safari",
    title: "Wildlife Safari & Game Drive",
    description: "Guided 4x4 game viewing, night drives & walking safaris",
    icon: Compass,
  },
  {
    id: "vic_falls_adventure",
    title: "Victoria Falls & Adventure",
    description: "Devil's Pool, helicopter flights, gorge swing & rafting",
    icon: Waves,
  },
  {
    id: "boat_water_safari",
    title: "Boat Cruise & Water Safari",
    description: "Zambezi sunset cruises, canoe safaris & Kariba boat trips",
    icon: Ship,
  },
  {
    id: "nature_birding",
    title: "Nature Walk & Birding",
    description: "Guided birdwatching & botany walks across habitats",
    icon: Footprints,
  },
  {
    id: "art_craft_workshop",
    title: "Crafts, Art & Workshop",
    description: "Traditional basket weaving, copper art & pottery sessions",
    icon: Palette,
  },
];

const TRANSPORT_SUBTYPES: SubtypeOption[] = [
  {
    id: "airport_transfer",
    title: "Airport Transfer & Shuttle",
    description: "Direct airport pickups (KKIA Lusaka / Livingstone)",
    icon: Plane,
  },
  {
    id: "safari_4x4",
    title: "4x4 Safari Vehicle with Driver",
    description: "Pop-up roof Land Cruiser with professional driver-guide",
    icon: CarFront,
  },
  {
    id: "intercity_shuttle",
    title: "Intercity Private Shuttle",
    description: "City-to-city private transfers (e.g. Lusaka to Livingstone)",
    icon: Bus,
  },
  {
    id: "self_drive_rental",
    title: "Car Rental / Self-Drive",
    description: "Independent SUV, 4x4 or sedan rentals for self-guided trips",
    icon: Key,
  },
  {
    id: "chauffeur_service",
    title: "Chauffeur & City Ride",
    description: "Dedicated private driver for business or city sightseeing",
    icon: Navigation,
  },
  {
    id: "boat_transfer",
    title: "Boat & Water Transfer",
    description: "Lake Kariba speedboats, Zambezi river crossings & charters",
    icon: Anchor,
  },
];

const SUBTYPES_BY_VERTICAL: Record<ListingType, SubtypeOption[]> = {
  stay: STAY_SUBTYPES,
  experience: EXPERIENCE_SUBTYPES,
  transport: TRANSPORT_SUBTYPES,
};

// ---------------------------------------------------------------------------
// Step 3: Amenities & Inclusions Catalogues
// ---------------------------------------------------------------------------

interface AmenityItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const STAY_GUEST_FAVOURITES: AmenityItem[] = [
  { id: "wifi", label: "Fast Wi-Fi (Fiber / Starlink)", icon: Wifi },
  { id: "air_conditioning", label: "Air conditioning", icon: Wind },
  { id: "kitchen", label: "Fully equipped kitchen", icon: Utensils },
  { id: "parking", label: "Free secure on-site parking", icon: CarFront },
  { id: "hot_water", label: "Hot shower & geyser", icon: Droplets },
  { id: "workspace", label: "Dedicated workspace", icon: Laptop },
  { id: "tv", label: "TV with DStv / Streaming", icon: Tv },
  { id: "swimming_pool", label: "Swimming pool", icon: Waves },
  { id: "laundry", label: "Washing machine / Laundry", icon: Shirt },
  { id: "housekeeping", label: "Daily housekeeping service", icon: Sparkles },
];

const STAY_STANDOUTS: AmenityItem[] = [
  { id: "solar_power", label: "Solar & Inverter power backup", icon: Sun },
  { id: "borehole_water", label: "Borehole clean water supply", icon: Droplets },
  { id: "private_pool", label: "Private plunge pool", icon: Waves },
  { id: "fire_pit", label: "Outdoor fire pit / Bush boma", icon: Flame },
  { id: "viewing_deck", label: "Wildlife / Game viewing deck", icon: Eye },
  { id: "braai_area", label: "Braai / BBQ grill area", icon: Flame },
  { id: "river_front", label: "River or lake water frontage", icon: Anchor },
  { id: "private_chef", label: "Private chef available on request", icon: Coffee },
  { id: "patio_balcony", label: "Private patio or balcony", icon: Home },
  { id: "outdoor_shower", label: "Open-air safari shower", icon: Droplets },
];

const STAY_SAFETY: AmenityItem[] = [
  { id: "security_guard", label: "24/7 Security guard on site", icon: ShieldCheck },
  { id: "electric_fence", label: "Gated compound / Electric fence", icon: Lock },
  { id: "first_aid", label: "First aid kit", icon: HeartPulse },
  { id: "fire_extinguisher", label: "Fire extinguisher", icon: Flame },
  { id: "smoke_detector", label: "Smoke / CO detector", icon: Bell },
  { id: "safe_box", label: "In-room safe / Lockbox", icon: Key },
  { id: "backup_lighting", label: "Rechargeable emergency lights", icon: Zap },
];

const EXPERIENCE_WHATS_INCLUDED: AmenityItem[] = [
  { id: "park_fees", label: "National park & conservation entry fees", icon: Ticket },
  { id: "safari_guide", label: "Professional certified safari guide", icon: Compass },
  { id: "game_vehicle", label: "Specially equipped 4x4 safari vehicle", icon: CarFront },
  { id: "water_snacks", label: "Bottled mineral water & light snacks", icon: Coffee },
  { id: "traditional_meal", label: "Traditional Zambian meal / tasting", icon: Utensils },
  { id: "safety_gear", label: "Safety gear & life jackets", icon: ShieldCheck },
  { id: "pickup_dropoff", label: "Hotel or lodge pickup & drop-off", icon: MapPin },
  { id: "binoculars", label: "Shared high-grade safari binoculars", icon: Eye },
];

const EXPERIENCE_WHAT_TO_CARRY: AmenityItem[] = [
  { id: "id_passport", label: "Valid national ID or passport", icon: FileText },
  { id: "walking_shoes", label: "Comfortable walking / trail shoes", icon: Footprints },
  { id: "sun_protection", label: "Sunscreen & wide-brim sun hat", icon: Sun },
  { id: "insect_repellent", label: "Insect repellent (mosquito spray)", icon: ShieldAlert },
  { id: "camera", label: "Camera & spare memory/batteries", icon: Camera },
  { id: "warm_jacket", label: "Warm jacket / fleece for cool mornings", icon: Shirt },
  { id: "cash_zmw", label: "Cash (ZMW) for park tips & souvenirs", icon: Wallet },
  { id: "water_bottle", label: "Reusable personal water bottle", icon: Droplets },
];

const EXPERIENCE_WHAT_NOT_TO_BRING: AmenityItem[] = [
  { id: "drones", label: "Drones (strictly prohibited in parks)", icon: Ban },
  { id: "plastic_bags", label: "Single-use plastic bags & wrappers", icon: Ban },
  { id: "bright_clothing", label: "Bright or neon clothing (safari hazard)", icon: Ban },
  { id: "pets", label: "Pets or companion animals", icon: Ban },
  { id: "firearms", label: "Firearms or hazardous items", icon: Ban },
  { id: "heavy_suitcases", label: "Bulky or rigid hard suitcases", icon: Ban },
];

const TRANSPORT_FEATURES: AmenityItem[] = [
  { id: "ac", label: "Full passenger cabin air conditioning", icon: Wind },
  { id: "pro_driver", label: "Professional licensed commercial driver", icon: Navigation },
  { id: "fuel_included", label: "Fuel included in quoted rate", icon: Fuel },
  { id: "chilled_water", label: "Complimentary chilled bottled water", icon: Droplets },
  { id: "usb_charging", label: "USB device charging ports", icon: Zap },
  { id: "wifi", label: "Onboard mobile Wi-Fi hotspot", icon: Wifi },
  { id: "luggage_capacity", label: "Generous luggage capacity / trailer", icon: Luggage },
  {
    id: "passenger_insurance",
    label: "Comprehensive passenger liability cover",
    icon: ShieldCheck,
  },
  { id: "child_seat", label: "Child safety seat (available on request)", icon: HeartPulse },
];

const TRANSPORT_WHAT_TO_CARRY: AmenityItem[] = [
  { id: "drivers_license", label: "Valid driver's license (for self-drive)", icon: FileText },
  { id: "id_passport", label: "National ID or passport of lead traveler", icon: Key },
  { id: "booking_voucher", label: "Booking confirmation reference", icon: Ticket },
  { id: "flight_details", label: "Flight number & schedule (for pickups)", icon: Plane },
  { id: "personal_cable", label: "Phone charging cable / playlist", icon: Music },
];

const TRANSPORT_GUIDELINES: AmenityItem[] = [
  { id: "no_smoking", label: "No smoking, cigars, or vaping inside vehicle", icon: Ban },
  { id: "no_open_alcohol", label: "No open alcoholic beverages while moving", icon: Ban },
  { id: "no_hazardous", label: "No hazardous, flammable, or toxic goods", icon: Ban },
  { id: "no_overload", label: "No exceeding designated passenger limit", icon: Ban },
  { id: "no_uncaged_pets", label: "No uncaged or unrestrained pets", icon: Ban },
];

// ---------------------------------------------------------------------------
// Step 4: Zambian Provinces and Pre-Mapped Destinations
// ---------------------------------------------------------------------------

export const ZAMBIA_PROVINCES: {
  name: string;
  defaultCoords: { lat: number; lng: number };
  popularCities: string[];
}[] = [
  {
    name: "Lusaka",
    defaultCoords: { lat: -15.3875, lng: 28.3228 },
    popularCities: ["Lusaka City", "Kafue", "Chongwe", "Chilanga", "Luangwa (Feira)"],
  },
  {
    name: "Southern",
    defaultCoords: { lat: -17.8419, lng: 25.8543 },
    popularCities: ["Livingstone", "Siavonga", "Choma", "Mazabuka", "Monze", "Kalomo"],
  },
  {
    name: "Copperbelt",
    defaultCoords: { lat: -12.9906, lng: 28.6366 },
    popularCities: ["Ndola", "Kitwe", "Chingola", "Mufulira", "Luanshya", "Kalulushi"],
  },
  {
    name: "Central",
    defaultCoords: { lat: -14.4426, lng: 28.4485 },
    popularCities: ["Kabwe", "Kapiri Mposhi", "Serenje", "Mkushi", "Mumbwa", "Chibombo"],
  },
  {
    name: "Eastern",
    defaultCoords: { lat: -13.6333, lng: 32.65 },
    popularCities: ["Chipata", "Mfuwe (South Luangwa)", "Petauke", "Katete", "Lundazi"],
  },
  {
    name: "Western",
    defaultCoords: { lat: -15.2667, lng: 23.1333 },
    popularCities: ["Mongu", "Senanga", "Kaoma", "Sesheke", "Liuwa Plain"],
  },
  {
    name: "Luapula",
    defaultCoords: { lat: -11.1994, lng: 28.8944 },
    popularCities: ["Mansa", "Samfya (Lake Bangweulu)", "Kawambwa", "Nchelenge", "Mwense"],
  },
  {
    name: "Northern",
    defaultCoords: { lat: -10.2129, lng: 31.1808 },
    popularCities: ["Kasama", "Mbala", "Mpulungu (Lake Tanganyika)", "Luwingu", "Mporokoso"],
  },
  {
    name: "North-Western",
    defaultCoords: { lat: -12.1833, lng: 26.4 },
    popularCities: ["Solwezi", "Mwinilunga", "Kasempa", "Zambezi", "Kabompo"],
  },
  {
    name: "Muchinga",
    defaultCoords: { lat: -11.8333, lng: 31.45 },
    popularCities: ["Mpika", "Chinsali", "Isoka", "Nakonde", "Shiwa Ng'andu"],
  },
];

// Sample professional Zambian photos presets by vertical
const SAMPLE_PHOTOS_BY_VERTICAL: Record<ListingType, string[]> = {
  stay: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200",
  ],
  experience: [
    "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200",
  ],
  transport: [
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1569263979104-865ab7cd8d17?auto=format&fit=crop&q=80&w=1200",
  ],
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function HostCreatePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const enabledCategories = useHostStore((s) => s.enabledCategories);

  // Flow step state: 1 = vertical, 2 = sub-type, 3 = amenities, 4 = location, 5 = media uploads, 6 = name & description, 7 = pricing & conditional discounts
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
  const [selectedType, setSelectedType] = useState<ListingType>("stay");
  const [selectedSubtype, setSelectedSubtype] = useState<string>("safari_lodge");

  // Track draft ID once created after Step 3
  const [createdDraftId, setCreatedDraftId] = useState<string | null>(null);

  // Step 3 State: Categorized amenities for each vertical
  const [stayAmenities, setStayAmenities] = useState<{
    guestFavourites: string[];
    standouts: string[];
    safety: string[];
  }>({
    guestFavourites: ["wifi", "air_conditioning", "parking", "hot_water"],
    standouts: ["solar_power", "borehole_water"],
    safety: ["security_guard", "first_aid"],
  });

  const [experienceItems, setExperienceItems] = useState<{
    whatsIncluded: string[];
    whatToCarry: string[];
    whatNotToBring: string[];
  }>({
    whatsIncluded: ["safari_guide", "game_vehicle", "water_snacks"],
    whatToCarry: ["id_passport", "walking_shoes", "sun_protection", "water_bottle"],
    whatNotToBring: ["drones", "plastic_bags", "bright_clothing"],
  });

  const [transportItems, setTransportItems] = useState<{
    vehicleFeatures: string[];
    whatToCarry: string[];
    guidelines: string[];
  }>({
    vehicleFeatures: ["ac", "pro_driver", "fuel_included", "chilled_water"],
    whatToCarry: ["id_passport", "booking_voucher"],
    guidelines: ["no_smoking", "no_hazardous", "no_overload"],
  });

  // Step 4 State: Location (Country is fixed to Zambia)
  const [province, setProvince] = useState<string>("Lusaka");
  const [city, setCity] = useState<string>("Lusaka City");
  const [district, setDistrict] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: -15.3875,
    lng: 28.3228,
  });

  // Step 5 State: Uploads and Media (up to 5 images max)
  const [images, setImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Step 6 State: Name & Description (Description max 300 words)
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const descriptionWordCount = useMemo(() => {
    const trimmed = description.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(Boolean).length;
  }, [description]);

  const isDescriptionOverLimit = descriptionWordCount > 300;

  // Step 7 State: Pricing & Checkable Conditional Discounts (10+ people & 7+ days)
  const [currency, setCurrency] = useState<"ZMW" | "USD">("ZMW");
  const [basePrice, setBasePrice] = useState<number>(1500);

  // Conditional Discount for 10 or more people
  const [groupDiscountEnabled, setGroupDiscountEnabled] = useState<boolean>(false);
  const [groupDiscountType, setGroupDiscountType] = useState<"percent" | "fixed">("percent");
  const [groupDiscountPercent, setGroupDiscountPercent] = useState<number>(15);
  const [groupDiscountCustomPrice, setGroupDiscountCustomPrice] = useState<number>(1275);

  // Conditional Discount for staying more than 7 days
  const [extendedStayDiscountEnabled, setExtendedStayDiscountEnabled] = useState<boolean>(false);
  const [extendedStayDiscountType, setExtendedStayDiscountType] = useState<"percent" | "fixed">(
    "percent",
  );
  const [extendedStayDiscountPercent, setExtendedStayDiscountPercent] = useState<number>(10);
  const [extendedStayCustomPrice, setExtendedStayCustomPrice] = useState<number>(1350);

  // Effective calculated promo price for 10+ people
  const effectiveGroupPromoPrice = useMemo(() => {
    if (groupDiscountType === "fixed") {
      return groupDiscountCustomPrice > 0 ? groupDiscountCustomPrice : basePrice;
    }
    const discount = (basePrice * groupDiscountPercent) / 100;
    return Math.max(0, Math.round(basePrice - discount));
  }, [basePrice, groupDiscountPercent, groupDiscountType, groupDiscountCustomPrice]);

  // Effective calculated promo price for 7+ days
  const effectiveExtendedStayPromoPrice = useMemo(() => {
    if (extendedStayDiscountType === "fixed") {
      return extendedStayCustomPrice > 0 ? extendedStayCustomPrice : basePrice;
    }
    const discount = (basePrice * extendedStayDiscountPercent) / 100;
    return Math.max(0, Math.round(basePrice - discount));
  }, [basePrice, extendedStayDiscountPercent, extendedStayDiscountType, extendedStayCustomPrice]);

  // Custom added items map (allows host to append custom items per category)
  const [customItems, setCustomItems] = useState<Record<string, string[]>>({});
  const [customInputValues, setCustomInputValues] = useState<Record<string, string>>({});
  const [activeInputCategory, setActiveInputCategory] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);

  // Rehydrate state from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        if (parsed.selectedType) setSelectedType(parsed.selectedType);
        if (parsed.selectedSubtype) setSelectedSubtype(parsed.selectedSubtype);
        if (parsed.createdDraftId) setCreatedDraftId(parsed.createdDraftId);
        if (parsed.stayAmenities) setStayAmenities(parsed.stayAmenities);
        if (parsed.experienceItems) setExperienceItems(parsed.experienceItems);
        if (parsed.transportItems) setTransportItems(parsed.transportItems);
        if (parsed.customItems) setCustomItems(parsed.customItems);
        if (parsed.province) setProvince(parsed.province);
        if (parsed.city) setCity(parsed.city);
        if (parsed.district) setDistrict(parsed.district);
        if (parsed.address) setAddress(parsed.address);
        if (parsed.coordinates) setCoordinates(parsed.coordinates);
        if (Array.isArray(parsed.images)) setImages(parsed.images);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.description) setDescription(parsed.description);
        if (parsed.currency) setCurrency(parsed.currency);
        if (parsed.basePrice !== undefined) setBasePrice(parsed.basePrice);
        if (parsed.groupDiscountEnabled !== undefined)
          setGroupDiscountEnabled(parsed.groupDiscountEnabled);
        if (parsed.groupDiscountType) setGroupDiscountType(parsed.groupDiscountType);
        if (parsed.groupDiscountPercent !== undefined)
          setGroupDiscountPercent(parsed.groupDiscountPercent);
        if (parsed.groupDiscountCustomPrice !== undefined)
          setGroupDiscountCustomPrice(parsed.groupDiscountCustomPrice);
        if (parsed.extendedStayDiscountEnabled !== undefined)
          setExtendedStayDiscountEnabled(parsed.extendedStayDiscountEnabled);
        if (parsed.extendedStayDiscountType)
          setExtendedStayDiscountType(parsed.extendedStayDiscountType);
        if (parsed.extendedStayDiscountPercent !== undefined)
          setExtendedStayDiscountPercent(parsed.extendedStayDiscountPercent);
        if (parsed.extendedStayCustomPrice !== undefined)
          setExtendedStayCustomPrice(parsed.extendedStayCustomPrice);
      }
    } catch (e) {
      console.error("Failed to restore create listing draft state from localStorage", e);
    }
  }, []);

  // Sync state to localStorage whenever relevant fields change
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const payload = {
        currentStep,
        selectedType,
        selectedSubtype,
        createdDraftId,
        stayAmenities,
        experienceItems,
        transportItems,
        customItems,
        province,
        city,
        district,
        address,
        coordinates,
        images,
        title,
        description,
        currency,
        basePrice,
        groupDiscountEnabled,
        groupDiscountType,
        groupDiscountPercent,
        groupDiscountCustomPrice,
        extendedStayDiscountEnabled,
        extendedStayDiscountType,
        extendedStayDiscountPercent,
        extendedStayCustomPrice,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error("Failed to sync create listing draft state to localStorage", e);
    }
  }, [
    currentStep,
    selectedType,
    selectedSubtype,
    createdDraftId,
    stayAmenities,
    experienceItems,
    transportItems,
    customItems,
    province,
    city,
    district,
    address,
    coordinates,
    images,
    title,
    description,
    currency,
    basePrice,
    groupDiscountEnabled,
    groupDiscountType,
    groupDiscountPercent,
    groupDiscountCustomPrice,
    extendedStayDiscountEnabled,
    extendedStayDiscountType,
    extendedStayDiscountPercent,
    extendedStayCustomPrice,
  ]);

  const availableTypes = LISTING_TYPES.filter((t) => enabledCategories.includes(t.id));
  const currentSubtypes = SUBTYPES_BY_VERTICAL[selectedType] ?? [];
  const currentProvinceData =
    ZAMBIA_PROVINCES.find((p) => p.name === province) || ZAMBIA_PROVINCES[0];

  // When vertical changes, default sub-type to first option
  const handleSelectVertical = (typeId: ListingType) => {
    setSelectedType(typeId);
    const firstSubtype = SUBTYPES_BY_VERTICAL[typeId]?.[0]?.id ?? "";
    setSelectedSubtype(firstSubtype);
  };

  const handleNextFromStep1 = () => setCurrentStep(2);
  const handleBackToStep1 = () => setCurrentStep(1);
  const handleNextFromStep2 = () => setCurrentStep(3);
  const handleBackToStep2 = () => setCurrentStep(2);
  const handleBackToStep3 = () => setCurrentStep(3);
  const handleBackToStep4 = () => setCurrentStep(4);
  const handleBackToStep5 = () => setCurrentStep(5);
  const handleBackToStep6 = () => setCurrentStep(6);

  // Toggle helper for Stay amenities
  const toggleStayAmenity = (category: "guestFavourites" | "standouts" | "safety", id: string) => {
    setStayAmenities((prev) => {
      const list = prev[category];
      const exists = list.includes(id);
      return {
        ...prev,
        [category]: exists ? list.filter((item) => item !== id) : [...list, id],
      };
    });
  };

  // Toggle helper for Experience items
  const toggleExperienceItem = (
    category: "whatsIncluded" | "whatToCarry" | "whatNotToBring",
    id: string,
  ) => {
    setExperienceItems((prev) => {
      const list = prev[category];
      const exists = list.includes(id);
      return {
        ...prev,
        [category]: exists ? list.filter((item) => item !== id) : [...list, id],
      };
    });
  };

  // Toggle helper for Transport items
  const toggleTransportItem = (
    category: "vehicleFeatures" | "whatToCarry" | "guidelines",
    id: string,
  ) => {
    setTransportItems((prev) => {
      const list = prev[category];
      const exists = list.includes(id);
      return {
        ...prev,
        [category]: exists ? list.filter((item) => item !== id) : [...list, id],
      };
    });
  };

  // Custom item addition
  const handleAddCustomItem = (categoryKey: string) => {
    const text = customInputValues[categoryKey]?.trim();
    if (!text) return;

    setCustomItems((prev) => ({
      ...prev,
      [categoryKey]: [...(prev[categoryKey] || []), text],
    }));

    if (selectedType === "stay") {
      if (
        categoryKey === "guestFavourites" ||
        categoryKey === "standouts" ||
        categoryKey === "safety"
      ) {
        toggleStayAmenity(categoryKey, text);
      }
    } else if (selectedType === "experience") {
      if (
        categoryKey === "whatsIncluded" ||
        categoryKey === "whatToCarry" ||
        categoryKey === "whatNotToBring"
      ) {
        toggleExperienceItem(categoryKey, text);
      }
    } else if (selectedType === "transport") {
      if (
        categoryKey === "vehicleFeatures" ||
        categoryKey === "whatToCarry" ||
        categoryKey === "guidelines"
      ) {
        toggleTransportItem(categoryKey, text);
      }
    }

    setCustomInputValues((prev) => ({ ...prev, [categoryKey]: "" }));
    setActiveInputCategory(null);
  };

  // When province changes, center coordinates and suggest first popular city
  const handleProvinceChange = (newProvinceName: string) => {
    setProvince(newProvinceName);
    const pData = ZAMBIA_PROVINCES.find((p) => p.name === newProvinceName);
    if (pData) {
      if (pData.popularCities[0]) {
        setCity(pData.popularCities[0]);
      }
      setCoordinates(pData.defaultCoords);
    }
  };

  // Step 3 Next Click: Sends accumulated payload of Steps 1, 2, 3 to backend and advances to Step 4 (Location)
  const handleNextFromStep3 = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const initialForm: Record<string, unknown> = {
        type: selectedType,
        vertical: selectedType,
        subtype: selectedSubtype,
        createdAt: new Date().toISOString(),
      };

      if (selectedType === "stay") {
        initialForm.propertyType = selectedSubtype;
        initialForm.guestFavourites = stayAmenities.guestFavourites;
        initialForm.standoutAmenities = stayAmenities.standouts;
        initialForm.safetyAmenities = stayAmenities.safety;
        initialForm.amenities = [
          ...stayAmenities.guestFavourites,
          ...stayAmenities.standouts,
          ...stayAmenities.safety,
        ];
        initialForm.stayDetails = {
          propertyType: selectedSubtype,
          guestFavourites: stayAmenities.guestFavourites,
          standoutAmenities: stayAmenities.standouts,
          safetyAmenities: stayAmenities.safety,
        };
      } else if (selectedType === "experience") {
        initialForm.category = selectedSubtype;
        initialForm.activityType = selectedSubtype;
        initialForm.whatsIncluded = experienceItems.whatsIncluded;
        initialForm.whatToBring = experienceItems.whatToCarry;
        initialForm.whatNotToBring = experienceItems.whatNotToBring;
        initialForm.inclusions = experienceItems.whatsIncluded;
        initialForm.experienceDetails = {
          activityType: selectedSubtype,
          whatsIncluded: experienceItems.whatsIncluded,
          whatToBring: experienceItems.whatToCarry,
          whatNotToBring: experienceItems.whatNotToBring,
        };
      } else if (selectedType === "transport") {
        initialForm.vehicleType = selectedSubtype;
        initialForm.serviceType = selectedSubtype;
        initialForm.features = transportItems.vehicleFeatures;
        initialForm.whatToBring = transportItems.whatToCarry;
        initialForm.guidelines = transportItems.guidelines;
        initialForm.transportDetails = {
          vehicleType: selectedSubtype,
          features: transportItems.vehicleFeatures,
          whatToBring: transportItems.whatToCarry,
          guidelines: transportItems.guidelines,
        };
      }

      // Send payload to backend / create draft listing
      let draftId = createdDraftId;
      if (!draftId) {
        const draft = await createDraftListing(selectedType, initialForm);
        draftId = draft.id;
        setCreatedDraftId(draft.id);
      } else {
        await updateDraftListing(draftId, { form: initialForm });
      }

      toast.success("Initial details saved! Now let's set the location.");
      setCurrentStep(4);
    } catch (err) {
      console.error("Failed to send first 3 steps to backend:", err);
      toast.error("Couldn't save listing details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Step 4 Next Click: PATCHES location data to the backend draft row and advances to Step 5 (Uploads & Media)
  const handleNextFromStep4 = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const locationPayload = {
        country: "Zambia",
        province,
        city,
        district: district.trim() || city,
        address: address.trim() || `${district ? `${district}, ` : ""}${city}, ${province}, Zambia`,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      };

      if (createdDraftId) {
        // PATCH location to backend draft row
        await updateDraftListing(createdDraftId, {
          form: locationPayload,
          currentStep: 1,
        });
      } else {
        // Fallback: create draft if not yet established and record draft ID
        const draft = await createDraftListing(selectedType, {
          type: selectedType,
          vertical: selectedType,
          subtype: selectedSubtype,
          ...locationPayload,
        });
        setCreatedDraftId(draft.id);
      }

      toast.success("Location saved! Next, upload photos of your offering.");
      setCurrentStep(5);
    } catch (err) {
      console.error("Failed to patch location to backend draft:", err);
      toast.error("Could not save location. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Step 5 Media Handlers (Up to 5 images max)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const availableSlots = 5 - images.length;
    if (availableSlots <= 0) {
      toast.info("Maximum 5 photos allowed. Remove a photo to add a new one.");
      return;
    }

    const filesToProcess = Array.from(files).slice(0, availableSlots);
    const newImageUrls: string[] = [];

    filesToProcess.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image file`);
        return;
      }
      const localUrl = URL.createObjectURL(file);
      newImageUrls.push(localUrl);
    });

    if (newImageUrls.length > 0) {
      setImages((prev) => [...prev, ...newImageUrls].slice(0, 5));
      toast.success(`Added ${newImageUrls.length} photo${newImageUrls.length > 1 ? "s" : ""}`);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const availableSlots = 5 - images.length;
    if (availableSlots <= 0) {
      toast.info("Maximum 5 photos allowed.");
      return;
    }

    const filesToProcess = Array.from(files).slice(0, availableSlots);
    const newImageUrls: string[] = [];

    filesToProcess.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const localUrl = URL.createObjectURL(file);
        newImageUrls.push(localUrl);
      }
    });

    if (newImageUrls.length > 0) {
      setImages((prev) => [...prev, ...newImageUrls].slice(0, 5));
      toast.success(`Added ${newImageUrls.length} photo${newImageUrls.length > 1 ? "s" : ""}`);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetCoverPhoto = (indexToCover: number) => {
    setImages((prev) => {
      const item = prev[indexToCover];
      const rest = prev.filter((_, idx) => idx !== indexToCover);
      return [item, ...rest];
    });
    toast.success("Cover photo updated");
  };

  const handleLoadSamplePhotos = () => {
    const samples = SAMPLE_PHOTOS_BY_VERTICAL[selectedType] || SAMPLE_PHOTOS_BY_VERTICAL.stay;
    setImages(samples.slice(0, 5));
    toast.success("Loaded 5 sample professional photos");
  };

  // Step 5 Next Click: PATCHES images to backend draft row and advances to Step 6 (Name & Description)
  const handleNextFromStep5 = async () => {
    if (submitting) return;
    if (images.length === 0) {
      toast.error("Please upload at least 1 photo to continue.");
      return;
    }

    setSubmitting(true);
    try {
      const mediaPayload = {
        images,
        featuredImage: images[0] || "",
      };

      if (createdDraftId) {
        // PATCH photos to backend draft row
        await updateDraftListing(createdDraftId, {
          form: mediaPayload,
          currentStep: 2,
        });
      }

      toast.success("Photos saved! Next, add your listing name and description.");
      setCurrentStep(6);
    } catch (err) {
      console.error("Failed to patch media to backend draft:", err);
      toast.error("Could not save photos. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Step 6 Next Click: PATCHES title & description (max 300 words) to backend draft and navigates to editor
  const handleFinishStep6 = async () => {
    if (submitting) return;
    if (!title.trim()) {
      toast.error("Please provide a name/title for your listing.");
      return;
    }
    if (!description.trim()) {
      toast.error("Please provide a description for your listing.");
      return;
    }
    if (isDescriptionOverLimit) {
      toast.error("Description exceeds the 300-word limit. Please trim before proceeding.");
      return;
    }

    setSubmitting(true);
    try {
      const detailsPayload = {
        title: title.trim(),
        name: title.trim(),
        description: description.trim(),
      };

      if (createdDraftId) {
        // PATCH title and description to backend draft row
        await updateDraftListing(createdDraftId, {
          form: detailsPayload,
          currentStep: 3,
        });
      }

      toast.success("Details saved! Next, set your pricing and conditional discounts.");
      setCurrentStep(7);
    } catch (err) {
      console.error("Failed to patch title and description to backend draft:", err);
      toast.error("Could not save listing details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Step 7 Next Click: PATCHES pricing and conditional discounts to backend draft and navigates to editor
  const handleFinishStep7 = async () => {
    if (submitting) return;
    if (basePrice <= 0 || isNaN(basePrice)) {
      toast.error("Please enter a valid base price greater than 0.");
      return;
    }
    if (groupDiscountEnabled && effectiveGroupPromoPrice >= basePrice) {
      toast.error("Group promo price must be less than the regular base price.");
      return;
    }
    if (extendedStayDiscountEnabled && effectiveExtendedStayPromoPrice >= basePrice) {
      toast.error("Extended stay promo price must be less than the regular base price.");
      return;
    }

    setSubmitting(true);
    try {
      const pricingPayload = {
        pricePerUnitNgwee: Math.round(basePrice * 100),
        currency,
        basePrice,
        pricingRules: {
          basePrice,
          currency,
          groupDiscount: {
            enabled: groupDiscountEnabled,
            minGuests: 10,
            discountPercent:
              groupDiscountType === "percent"
                ? groupDiscountPercent
                : Math.round(((basePrice - effectiveGroupPromoPrice) / basePrice) * 100),
            promoPrice: effectiveGroupPromoPrice,
          },
          extendedStayDiscount: {
            enabled: extendedStayDiscountEnabled,
            minDays: 7,
            discountPercent:
              extendedStayDiscountType === "percent"
                ? extendedStayDiscountPercent
                : Math.round(((basePrice - effectiveExtendedStayPromoPrice) / basePrice) * 100),
            promoPrice: effectiveExtendedStayPromoPrice,
          },
        },
        conditionalDiscounts: {
          groupDiscount10Plus: groupDiscountEnabled
            ? {
                minPeople: 10,
                discountPercent:
                  groupDiscountType === "percent"
                    ? groupDiscountPercent
                    : Math.round(((basePrice - effectiveGroupPromoPrice) / basePrice) * 100),
                promoPrice: effectiveGroupPromoPrice,
              }
            : null,
          extendedStay7DaysPlus: extendedStayDiscountEnabled
            ? {
                minDays: 7,
                discountPercent:
                  extendedStayDiscountType === "percent"
                    ? extendedStayDiscountPercent
                    : Math.round(((basePrice - effectiveExtendedStayPromoPrice) / basePrice) * 100),
                promoPrice: effectiveExtendedStayPromoPrice,
              }
            : null,
        },
      };

      if (createdDraftId) {
        // PATCH pricing and conditional discounts to backend draft row
        await updateDraftListing(createdDraftId, {
          form: pricingPayload,
          currentStep: 4,
        });
      }

      // Clean temporary localStorage cache once completed
      if (typeof window !== "undefined") {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }

      toast.success("Listing created and pricing configured successfully!");
      router.push(ROUTES.listingDrafts.editor(createdDraftId || "new", 1));
    } catch (err) {
      console.error("Failed to patch pricing and discounts to backend draft:", err);
      toast.error("Could not save pricing. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 pt-8 pb-20">
          {/* Header navigation bar */}
          <div className="flex items-center justify-between mb-6">
            {currentStep === 1 ? (
              <BackButton ariaLabel="Back to home" />
            ) : (
              <button
                type="button"
                onClick={
                  currentStep === 2
                    ? handleBackToStep1
                    : currentStep === 3
                      ? handleBackToStep2
                      : currentStep === 4
                        ? handleBackToStep3
                        : currentStep === 5
                          ? handleBackToStep4
                          : currentStep === 6
                            ? handleBackToStep5
                            : handleBackToStep6
                }
                className="inline-flex items-center gap-2 text-xs font-semibold text-black-subtle hover:text-black transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            )}

            {/* Clean 7-step indicator pill */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                Step {currentStep} of 7
              </span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7].map((stepNum) => (
                  <div
                    key={stepNum}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      stepNum === currentStep
                        ? "w-6 bg-purple"
                        : stepNum < currentStep
                          ? "w-3 bg-purple/40"
                          : "w-3 bg-neutral-200",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200/80 rounded-2xl shadow-2xs p-6 sm:p-10">
            {availableTypes.length === 0 ? (
              <div className="text-center py-12">
                <div className="h-16 w-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-5 border border-amber-200/60">
                  <ShieldAlert className="h-8 w-8 text-amber-500" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-black leading-snug">
                  No listing types enabled
                </h2>
                <p className="text-xs sm:text-sm text-black-subtle mt-2 max-w-md mx-auto leading-relaxed">
                  You haven&apos;t enabled any listing categories yet. Complete host onboarding to
                  choose the types you&apos;d like to offer.
                </p>
              </div>
            ) : currentStep === 1 ? (
              /* ========================================================================= */
              /* STEP 1: VERTICAL CATEGORY (STAY, EXPERIENCE, TRANSPORT)                    */
              /* ========================================================================= */
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="text-center mb-8">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-black leading-snug">
                    What are you listing?
                  </h1>
                  <p className="text-xs sm:text-sm text-black-subtle mt-2 max-w-lg mx-auto leading-relaxed">
                    Choose a category to begin. Stays, Experiences, and Transport can all be managed
                    seamlessly from your host portal.
                  </p>
                </div>

                {/* Cards horizontally in a single line on larger screens */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                  {availableTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selectedType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleSelectVertical(type.id)}
                        onDoubleClick={handleNextFromStep1}
                        className={cn(
                          "relative text-left rounded-2xl p-5 sm:p-6 transition-colors duration-150 cursor-pointer outline-none flex flex-col justify-between bg-white border",
                          isSelected
                            ? "border-purple"
                            : "border-neutral-200/80 hover:border-neutral-300",
                        )}
                      >
                        <div className="mb-4">
                          <div
                            className={cn(
                              "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors border",
                              isSelected
                                ? "bg-purple/10 text-purple border-purple/20"
                                : "bg-neutral-100 text-neutral-600 border-neutral-200/60",
                            )}
                          >
                            <Icon className="h-6 w-6" />
                          </div>
                        </div>

                        <div className="space-y-1.5 flex-1">
                          <h3
                            className={cn(
                              "text-base sm:text-lg font-semibold transition-colors leading-snug",
                              isSelected ? "text-purple" : "text-black",
                            )}
                          >
                            {type.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-black-subtle leading-relaxed">
                            {type.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-100">
                  <p className="text-xs text-neutral-400 text-center sm:text-left">
                    Packages are curated by the Nearby Escapes team and cannot be self-listed.
                  </p>

                  <button
                    type="button"
                    disabled={!selectedType}
                    onClick={handleNextFromStep1}
                    className={cn(
                      "w-full sm:w-auto h-11 px-8 rounded-xl font-semibold text-xs sm:text-sm inline-flex items-center justify-center transition-all cursor-pointer shadow-xs",
                      selectedType
                        ? "bg-purple text-white hover:bg-purple-hover active:scale-98"
                        : "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200",
                    )}
                  >
                    <span>Next</span>
                  </button>
                </div>
              </div>
            ) : currentStep === 2 ? (
              /* ========================================================================= */
              /* STEP 2: SUB-TYPE SELECTION (ZAMBIAN OFFERINGS)                             */
              /* ========================================================================= */
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="text-center mb-8">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-black leading-snug">
                    {selectedType === "stay"
                      ? "Which of these best describes your stay?"
                      : selectedType === "experience"
                        ? "Which of these best describes your experience?"
                        : "Which of these best describes your transport service?"}
                  </h1>
                  <p className="text-xs sm:text-sm text-black-subtle mt-2 max-w-xl mx-auto leading-relaxed">
                    Select the option that most accurately represents your offering to help guests
                    find exactly what they are looking for in Zambia.
                  </p>
                </div>

                {/* Grid of Subtype Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                  {currentSubtypes.map((sub) => {
                    const Icon = sub.icon;
                    const isSelected = selectedSubtype === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setSelectedSubtype(sub.id)}
                        onDoubleClick={handleNextFromStep2}
                        className={cn(
                          "relative text-left rounded-2xl p-4 sm:p-5 transition-colors duration-150 cursor-pointer outline-none flex flex-col justify-between bg-white border",
                          isSelected
                            ? "border-purple"
                            : "border-neutral-200/80 hover:border-neutral-300",
                        )}
                      >
                        <div className="mb-3">
                          <div
                            className={cn(
                              "h-10 w-10 rounded-xl flex items-center justify-center transition-colors border",
                              isSelected
                                ? "bg-purple/10 text-purple border-purple/20"
                                : "bg-neutral-100 text-neutral-600 border-neutral-200/60",
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                        </div>

                        <div className="space-y-1 flex-1">
                          <h3
                            className={cn(
                              "text-sm sm:text-base font-semibold transition-colors leading-snug",
                              isSelected ? "text-purple" : "text-black",
                            )}
                          >
                            {sub.title}
                          </h3>
                          <p className="text-xs text-black-subtle leading-relaxed">
                            {sub.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={handleBackToStep1}
                    className="w-full sm:w-auto h-11 px-6 rounded-xl border border-neutral-200/80 bg-white hover:bg-neutral-50 text-neutral-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    disabled={!selectedSubtype}
                    onClick={handleNextFromStep2}
                    className={cn(
                      "w-full sm:w-auto h-11 px-8 rounded-xl font-semibold text-xs sm:text-sm inline-flex items-center justify-center transition-all cursor-pointer shadow-xs",
                      selectedSubtype
                        ? "bg-purple text-white hover:bg-purple-hover active:scale-98"
                        : "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200",
                    )}
                  >
                    <span>Next</span>
                  </button>
                </div>
              </div>
            ) : currentStep === 3 ? (
              /* ========================================================================= */
              /* STEP 3: AMENITIES & INCLUSIONS (SENT TO BACKEND ON NEXT)                   */
              /* ========================================================================= */
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="text-center mb-8">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-black leading-snug">
                    {selectedType === "stay"
                      ? "Select amenities for your stay"
                      : selectedType === "experience"
                        ? "What's included and guest guidelines"
                        : "Vehicle features and travel guidelines"}
                  </h1>
                  <p className="text-xs sm:text-sm text-black-subtle mt-2 max-w-xl mx-auto leading-relaxed">
                    {selectedType === "stay"
                      ? "Highlight what makes your place special, from guest favourites to standout safari features and safety."
                      : selectedType === "experience"
                        ? "Set clear expectations for guests by specifying inclusions, what they should carry, and what to leave behind."
                        : "Specify onboard comfort amenities, required travel items, and vehicle guidelines."}
                  </p>
                </div>

                {/* Stays Amenities */}
                {selectedType === "stay" && (
                  <div className="space-y-8">
                    {/* Guest Favourites */}
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                        <div>
                          <h2 className="text-sm sm:text-base font-semibold text-black tracking-tight flex items-center gap-2">
                            <span>Guest Favourites</span>
                            <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-purple/10 text-purple border border-purple/20">
                              {stayAmenities.guestFavourites.length} selected
                            </span>
                          </h2>
                          <p className="text-xs text-black-subtle mt-0.5">
                            Essential comfort amenities most travellers look for first.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {STAY_GUEST_FAVOURITES.map((item) => {
                          const Icon = item.icon;
                          const isSelected = stayAmenities.guestFavourites.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleStayAmenity("guestFavourites", item.id)}
                              className={cn(
                                "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors duration-150 cursor-pointer outline-none bg-white",
                                isSelected
                                  ? "border-purple"
                                  : "border-neutral-200/80 hover:border-neutral-300",
                              )}
                            >
                              <div
                                className={cn(
                                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors border",
                                  isSelected
                                    ? "bg-purple/10 text-purple border-purple/20"
                                    : "bg-neutral-100 text-neutral-500 border-neutral-200/60",
                                )}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <span
                                className={cn(
                                  "text-xs sm:text-sm font-medium leading-snug transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-800",
                                )}
                              >
                                {item.label}
                              </span>
                            </button>
                          );
                        })}

                        {customItems["guestFavourites"]?.map((custom) => {
                          const isSelected = stayAmenities.guestFavourites.includes(custom);
                          return (
                            <button
                              key={custom}
                              type="button"
                              onClick={() => toggleStayAmenity("guestFavourites", custom)}
                              className={cn(
                                "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors duration-150 cursor-pointer outline-none bg-white",
                                isSelected
                                  ? "border-purple"
                                  : "border-neutral-200/80 hover:border-neutral-300",
                              )}
                            >
                              <div
                                className={cn(
                                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors border",
                                  isSelected
                                    ? "bg-purple/10 text-purple border-purple/20"
                                    : "bg-neutral-100 text-neutral-500 border-neutral-200/60",
                                )}
                              >
                                <Sparkles className="h-4 w-4" />
                              </div>
                              <span
                                className={cn(
                                  "text-xs sm:text-sm font-medium leading-snug transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-800",
                                )}
                              >
                                {custom}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-1">
                        {activeInputCategory === "guestFavourites" ? (
                          <div className="flex items-center gap-2 max-w-sm">
                            <input
                              type="text"
                              value={customInputValues["guestFavourites"] || ""}
                              onChange={(e) =>
                                setCustomInputValues((p) => ({
                                  ...p,
                                  guestFavourites: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddCustomItem("guestFavourites");
                                }
                              }}
                              placeholder="e.g. Nespresso coffee bar"
                              className="flex-1 h-9 px-3 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-purple"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleAddCustomItem("guestFavourites")}
                              className="h-9 px-3 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-hover cursor-pointer"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveInputCategory(null)}
                              className="h-9 px-2 rounded-lg text-neutral-400 hover:text-neutral-600 text-xs cursor-pointer"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setActiveInputCategory("guestFavourites")}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple hover:underline cursor-pointer py-1"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add custom amenity</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Standouts */}
                    <div className="space-y-3.5 pt-4">
                      <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                        <div>
                          <h2 className="text-sm sm:text-base font-semibold text-black tracking-tight flex items-center gap-2">
                            <span>Standout Amenities</span>
                            <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-purple/10 text-purple border border-purple/20">
                              {stayAmenities.standouts.length} selected
                            </span>
                          </h2>
                          <p className="text-xs text-black-subtle mt-0.5">
                            Unique features that set your property apart in Zambia (Solar power
                            backup, riverfront).
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {STAY_STANDOUTS.map((item) => {
                          const Icon = item.icon;
                          const isSelected = stayAmenities.standouts.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleStayAmenity("standouts", item.id)}
                              className={cn(
                                "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors duration-150 cursor-pointer outline-none bg-white",
                                isSelected
                                  ? "border-purple"
                                  : "border-neutral-200/80 hover:border-neutral-300",
                              )}
                            >
                              <div
                                className={cn(
                                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors border",
                                  isSelected
                                    ? "bg-purple/10 text-purple border-purple/20"
                                    : "bg-neutral-100 text-neutral-500 border-neutral-200/60",
                                )}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <span
                                className={cn(
                                  "text-xs sm:text-sm font-medium leading-snug transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-800",
                                )}
                              >
                                {item.label}
                              </span>
                            </button>
                          );
                        })}

                        {customItems["standouts"]?.map((custom) => {
                          const isSelected = stayAmenities.standouts.includes(custom);
                          return (
                            <button
                              key={custom}
                              type="button"
                              onClick={() => toggleStayAmenity("standouts", custom)}
                              className={cn(
                                "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors duration-150 cursor-pointer outline-none bg-white",
                                isSelected
                                  ? "border-purple"
                                  : "border-neutral-200/80 hover:border-neutral-300",
                              )}
                            >
                              <div
                                className={cn(
                                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors border",
                                  isSelected
                                    ? "bg-purple/10 text-purple border-purple/20"
                                    : "bg-neutral-100 text-neutral-500 border-neutral-200/60",
                                )}
                              >
                                <Sparkles className="h-4 w-4" />
                              </div>
                              <span
                                className={cn(
                                  "text-xs sm:text-sm font-medium leading-snug transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-800",
                                )}
                              >
                                {custom}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-1">
                        {activeInputCategory === "standouts" ? (
                          <div className="flex items-center gap-2 max-w-sm">
                            <input
                              type="text"
                              value={customInputValues["standouts"] || ""}
                              onChange={(e) =>
                                setCustomInputValues((p) => ({
                                  ...p,
                                  standouts: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddCustomItem("standouts");
                                }
                              }}
                              placeholder="e.g. Private river pontoon"
                              className="flex-1 h-9 px-3 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-purple"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleAddCustomItem("standouts")}
                              className="h-9 px-3 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-hover cursor-pointer"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveInputCategory(null)}
                              className="h-9 px-2 rounded-lg text-neutral-400 hover:text-neutral-600 text-xs cursor-pointer"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setActiveInputCategory("standouts")}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple hover:underline cursor-pointer py-1"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add custom standout</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Safety & Essentials */}
                    <div className="space-y-3.5 pt-4">
                      <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                        <div>
                          <h2 className="text-sm sm:text-base font-semibold text-black tracking-tight flex items-center gap-2">
                            <span>Safety &amp; Essentials</span>
                            <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-purple/10 text-purple border border-purple/20">
                              {stayAmenities.safety.length} selected
                            </span>
                          </h2>
                          <p className="text-xs text-black-subtle mt-0.5">
                            Security personnel, emergency equipment, and guest peace of mind.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {STAY_SAFETY.map((item) => {
                          const Icon = item.icon;
                          const isSelected = stayAmenities.safety.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleStayAmenity("safety", item.id)}
                              className={cn(
                                "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors duration-150 cursor-pointer outline-none bg-white",
                                isSelected
                                  ? "border-purple"
                                  : "border-neutral-200/80 hover:border-neutral-300",
                              )}
                            >
                              <div
                                className={cn(
                                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors border",
                                  isSelected
                                    ? "bg-purple/10 text-purple border-purple/20"
                                    : "bg-neutral-100 text-neutral-500 border-neutral-200/60",
                                )}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <span
                                className={cn(
                                  "text-xs sm:text-sm font-medium leading-snug transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-800",
                                )}
                              >
                                {item.label}
                              </span>
                            </button>
                          );
                        })}

                        {customItems["safety"]?.map((custom) => {
                          const isSelected = stayAmenities.safety.includes(custom);
                          return (
                            <button
                              key={custom}
                              type="button"
                              onClick={() => toggleStayAmenity("safety", custom)}
                              className={cn(
                                "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors duration-150 cursor-pointer outline-none bg-white",
                                isSelected
                                  ? "border-purple"
                                  : "border-neutral-200/80 hover:border-neutral-300",
                              )}
                            >
                              <div
                                className={cn(
                                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors border",
                                  isSelected
                                    ? "bg-purple/10 text-purple border-purple/20"
                                    : "bg-neutral-100 text-neutral-500 border-neutral-200/60",
                                )}
                              >
                                <ShieldCheck className="h-4 w-4" />
                              </div>
                              <span
                                className={cn(
                                  "text-xs sm:text-sm font-medium leading-snug transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-800",
                                )}
                              >
                                {custom}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-1">
                        {activeInputCategory === "safety" ? (
                          <div className="flex items-center gap-2 max-w-sm">
                            <input
                              type="text"
                              value={customInputValues["safety"] || ""}
                              onChange={(e) =>
                                setCustomInputValues((p) => ({
                                  ...p,
                                  safety: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddCustomItem("safety");
                                }
                              }}
                              placeholder="e.g. Rapid security response team"
                              className="flex-1 h-9 px-3 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-purple"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleAddCustomItem("safety")}
                              className="h-9 px-3 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-hover cursor-pointer"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveInputCategory(null)}
                              className="h-9 px-2 rounded-lg text-neutral-400 hover:text-neutral-600 text-xs cursor-pointer"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setActiveInputCategory("safety")}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple hover:underline cursor-pointer py-1"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add safety feature</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Experiences Inclusions */}
                {selectedType === "experience" && (
                  <div className="space-y-8">
                    {/* What's Included */}
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                        <div>
                          <h2 className="text-sm sm:text-base font-semibold text-black tracking-tight flex items-center gap-2">
                            <span>What&apos;s Included</span>
                            <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-purple/10 text-purple border border-purple/20">
                              {experienceItems.whatsIncluded.length} selected
                            </span>
                          </h2>
                          <p className="text-xs text-black-subtle mt-0.5">
                            Items, services, and permits provided within the experience fee.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {EXPERIENCE_WHATS_INCLUDED.map((item) => {
                          const Icon = item.icon;
                          const isSelected = experienceItems.whatsIncluded.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleExperienceItem("whatsIncluded", item.id)}
                              className={cn(
                                "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors duration-150 cursor-pointer outline-none bg-white",
                                isSelected
                                  ? "border-purple"
                                  : "border-neutral-200/80 hover:border-neutral-300",
                              )}
                            >
                              <div
                                className={cn(
                                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors border",
                                  isSelected
                                    ? "bg-purple/10 text-purple border-purple/20"
                                    : "bg-neutral-100 text-neutral-500 border-neutral-200/60",
                                )}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <span
                                className={cn(
                                  "text-xs sm:text-sm font-medium leading-snug transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-800",
                                )}
                              >
                                {item.label}
                              </span>
                            </button>
                          );
                        })}

                        {customItems["whatsIncluded"]?.map((custom) => {
                          const isSelected = experienceItems.whatsIncluded.includes(custom);
                          return (
                            <button
                              key={custom}
                              type="button"
                              onClick={() => toggleExperienceItem("whatsIncluded", custom)}
                              className={cn(
                                "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors duration-150 cursor-pointer outline-none bg-white",
                                isSelected
                                  ? "border-purple"
                                  : "border-neutral-200/80 hover:border-neutral-300",
                              )}
                            >
                              <div
                                className={cn(
                                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors border",
                                  isSelected
                                    ? "bg-purple/10 text-purple border-purple/20"
                                    : "bg-neutral-100 text-neutral-500 border-neutral-200/60",
                                )}
                              >
                                <Sparkles className="h-4 w-4" />
                              </div>
                              <span
                                className={cn(
                                  "text-xs sm:text-sm font-medium leading-snug transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-800",
                                )}
                              >
                                {custom}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-1">
                        {activeInputCategory === "whatsIncluded" ? (
                          <div className="flex items-center gap-2 max-w-sm">
                            <input
                              type="text"
                              value={customInputValues["whatsIncluded"] || ""}
                              onChange={(e) =>
                                setCustomInputValues((p) => ({
                                  ...p,
                                  whatsIncluded: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddCustomItem("whatsIncluded");
                                }
                              }}
                              placeholder="e.g. Sunset cocktail tasting"
                              className="flex-1 h-9 px-3 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-purple"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleAddCustomItem("whatsIncluded")}
                              className="h-9 px-3 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-hover cursor-pointer"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveInputCategory(null)}
                              className="h-9 px-2 rounded-lg text-neutral-400 hover:text-neutral-600 text-xs cursor-pointer"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setActiveInputCategory("whatsIncluded")}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple hover:underline cursor-pointer py-1"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add custom inclusion</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* What to Bring / Carry */}
                    <div className="space-y-3.5 pt-4">
                      <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                        <div>
                          <h2 className="text-sm sm:text-base font-semibold text-black tracking-tight flex items-center gap-2">
                            <span>What to Bring / Carry</span>
                            <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-purple/10 text-purple border border-purple/20">
                              {experienceItems.whatToCarry.length} selected
                            </span>
                          </h2>
                          <p className="text-xs text-black-subtle mt-0.5">
                            Items, clothing, and documents guests are recommended or required to
                            carry.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {EXPERIENCE_WHAT_TO_CARRY.map((item) => {
                          const Icon = item.icon;
                          const isSelected = experienceItems.whatToCarry.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleExperienceItem("whatToCarry", item.id)}
                              className={cn(
                                "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors duration-150 cursor-pointer outline-none bg-white",
                                isSelected
                                  ? "border-purple"
                                  : "border-neutral-200/80 hover:border-neutral-300",
                              )}
                            >
                              <div
                                className={cn(
                                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors border",
                                  isSelected
                                    ? "bg-purple/10 text-purple border-purple/20"
                                    : "bg-neutral-100 text-neutral-500 border-neutral-200/60",
                                )}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <span
                                className={cn(
                                  "text-xs sm:text-sm font-medium leading-snug transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-800",
                                )}
                              >
                                {item.label}
                              </span>
                            </button>
                          );
                        })}

                        {customItems["whatToCarry"]?.map((custom) => {
                          const isSelected = experienceItems.whatToCarry.includes(custom);
                          return (
                            <button
                              key={custom}
                              type="button"
                              onClick={() => toggleExperienceItem("whatToCarry", custom)}
                              className={cn(
                                "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors duration-150 cursor-pointer outline-none bg-white",
                                isSelected
                                  ? "border-purple"
                                  : "border-neutral-200/80 hover:border-neutral-300",
                              )}
                            >
                              <div
                                className={cn(
                                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors border",
                                  isSelected
                                    ? "bg-purple/10 text-purple border-purple/20"
                                    : "bg-neutral-100 text-neutral-500 border-neutral-200/60",
                                )}
                              >
                                <Sparkles className="h-4 w-4" />
                              </div>
                              <span
                                className={cn(
                                  "text-xs sm:text-sm font-medium leading-snug transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-800",
                                )}
                              >
                                {custom}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-1">
                        {activeInputCategory === "whatToCarry" ? (
                          <div className="flex items-center gap-2 max-w-sm">
                            <input
                              type="text"
                              value={customInputValues["whatToCarry"] || ""}
                              onChange={(e) =>
                                setCustomInputValues((p) => ({
                                  ...p,
                                  whatToCarry: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddCustomItem("whatToCarry");
                                }
                              }}
                              placeholder="e.g. Waterproof dry bag"
                              className="flex-1 h-9 px-3 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-purple"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleAddCustomItem("whatToCarry")}
                              className="h-9 px-3 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-hover cursor-pointer"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveInputCategory(null)}
                              className="h-9 px-2 rounded-lg text-neutral-400 hover:text-neutral-600 text-xs cursor-pointer"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setActiveInputCategory("whatToCarry")}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple hover:underline cursor-pointer py-1"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add recommended item</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* What NOT to Bring */}
                    <div className="space-y-3.5 pt-4">
                      <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                        <div>
                          <h2 className="text-sm sm:text-base font-semibold text-black tracking-tight flex items-center gap-2">
                            <span>What NOT to Bring</span>
                            <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/60">
                              {experienceItems.whatNotToBring.length} rules
                            </span>
                          </h2>
                          <p className="text-xs text-black-subtle mt-0.5">
                            Prohibited items, park restrictions, or items that compromise safety.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {EXPERIENCE_WHAT_NOT_TO_BRING.map((item) => {
                          const Icon = item.icon;
                          const isSelected = experienceItems.whatNotToBring.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleExperienceItem("whatNotToBring", item.id)}
                              className={cn(
                                "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors duration-150 cursor-pointer outline-none bg-white",
                                isSelected
                                  ? "border-purple"
                                  : "border-neutral-200/80 hover:border-neutral-300",
                              )}
                            >
                              <div
                                className={cn(
                                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors border",
                                  isSelected
                                    ? "bg-purple/10 text-purple border-purple/20"
                                    : "bg-neutral-100 text-neutral-500 border-neutral-200/60",
                                )}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <span
                                className={cn(
                                  "text-xs sm:text-sm font-medium leading-snug transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-800",
                                )}
                              >
                                {item.label}
                              </span>
                            </button>
                          );
                        })}

                        {customItems["whatNotToBring"]?.map((custom) => {
                          const isSelected = experienceItems.whatNotToBring.includes(custom);
                          return (
                            <button
                              key={custom}
                              type="button"
                              onClick={() => toggleExperienceItem("whatNotToBring", custom)}
                              className={cn(
                                "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors duration-150 cursor-pointer outline-none bg-white",
                                isSelected
                                  ? "border-purple"
                                  : "border-neutral-200/80 hover:border-neutral-300",
                              )}
                            >
                              <div
                                className={cn(
                                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors border",
                                  isSelected
                                    ? "bg-purple/10 text-purple border-purple/20"
                                    : "bg-neutral-100 text-neutral-500 border-neutral-200/60",
                                )}
                              >
                                <Ban className="h-4 w-4" />
                              </div>
                              <span
                                className={cn(
                                  "text-xs sm:text-sm font-medium leading-snug transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-800",
                                )}
                              >
                                {custom}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-1">
                        {activeInputCategory === "whatNotToBring" ? (
                          <div className="flex items-center gap-2 max-w-sm">
                            <input
                              type="text"
                              value={customInputValues["whatNotToBring"] || ""}
                              onChange={(e) =>
                                setCustomInputValues((p) => ({
                                  ...p,
                                  whatNotToBring: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddCustomItem("whatNotToBring");
                                }
                              }}
                              placeholder="e.g. High heels or flip flops"
                              className="flex-1 h-9 px-3 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-purple"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleAddCustomItem("whatNotToBring")}
                              className="h-9 px-3 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-hover cursor-pointer"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveInputCategory(null)}
                              className="h-9 px-2 rounded-lg text-neutral-400 hover:text-neutral-600 text-xs cursor-pointer"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setActiveInputCategory("whatNotToBring")}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple hover:underline cursor-pointer py-1"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add prohibited item</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Transport Inclusions */}
                {selectedType === "transport" && (
                  <div className="space-y-8">
                    {/* Vehicle Features */}
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                        <div>
                          <h2 className="text-sm sm:text-base font-semibold text-black tracking-tight flex items-center gap-2">
                            <span>Vehicle Features &amp; Inclusions</span>
                            <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-purple/10 text-purple border border-purple/20">
                              {transportItems.vehicleFeatures.length} selected
                            </span>
                          </h2>
                          <p className="text-xs text-black-subtle mt-0.5">
                            Comfort features, chauffeur details, and amenities included in the ride.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {TRANSPORT_FEATURES.map((item) => {
                          const Icon = item.icon;
                          const isSelected = transportItems.vehicleFeatures.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleTransportItem("vehicleFeatures", item.id)}
                              className={cn(
                                "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors duration-150 cursor-pointer outline-none bg-white",
                                isSelected
                                  ? "border-purple"
                                  : "border-neutral-200/80 hover:border-neutral-300",
                              )}
                            >
                              <div
                                className={cn(
                                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors border",
                                  isSelected
                                    ? "bg-purple/10 text-purple border-purple/20"
                                    : "bg-neutral-100 text-neutral-500 border-neutral-200/60",
                                )}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <span
                                className={cn(
                                  "text-xs sm:text-sm font-medium leading-snug transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-800",
                                )}
                              >
                                {item.label}
                              </span>
                            </button>
                          );
                        })}

                        {customItems["vehicleFeatures"]?.map((custom) => {
                          const isSelected = transportItems.vehicleFeatures.includes(custom);
                          return (
                            <button
                              key={custom}
                              type="button"
                              onClick={() => toggleTransportItem("vehicleFeatures", custom)}
                              className={cn(
                                "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors duration-150 cursor-pointer outline-none bg-white",
                                isSelected
                                  ? "border-purple"
                                  : "border-neutral-200/80 hover:border-neutral-300",
                              )}
                            >
                              <div
                                className={cn(
                                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors border",
                                  isSelected
                                    ? "bg-purple/10 text-purple border-purple/20"
                                    : "bg-neutral-100 text-neutral-500 border-neutral-200/60",
                                )}
                              >
                                <Sparkles className="h-4 w-4" />
                              </div>
                              <span
                                className={cn(
                                  "text-xs sm:text-sm font-medium leading-snug transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-800",
                                )}
                              >
                                {custom}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-1">
                        {activeInputCategory === "vehicleFeatures" ? (
                          <div className="flex items-center gap-2 max-w-sm">
                            <input
                              type="text"
                              value={customInputValues["vehicleFeatures"] || ""}
                              onChange={(e) =>
                                setCustomInputValues((p) => ({
                                  ...p,
                                  vehicleFeatures: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddCustomItem("vehicleFeatures");
                                }
                              }}
                              placeholder="e.g. Electric vehicle / Hybrid"
                              className="flex-1 h-9 px-3 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-purple"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleAddCustomItem("vehicleFeatures")}
                              className="h-9 px-3 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-hover cursor-pointer"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveInputCategory(null)}
                              className="h-9 px-2 rounded-lg text-neutral-400 hover:text-neutral-600 text-xs cursor-pointer"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setActiveInputCategory("vehicleFeatures")}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple hover:underline cursor-pointer py-1"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add vehicle feature</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* What to Bring */}
                    <div className="space-y-3.5 pt-4">
                      <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                        <div>
                          <h2 className="text-sm sm:text-base font-semibold text-black tracking-tight flex items-center gap-2">
                            <span>What to Bring / Carry</span>
                            <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-purple/10 text-purple border border-purple/20">
                              {transportItems.whatToCarry.length} selected
                            </span>
                          </h2>
                          <p className="text-xs text-black-subtle mt-0.5">
                            Documents, vouchers, and traveler credentials required at pickup.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {TRANSPORT_WHAT_TO_CARRY.map((item) => {
                          const Icon = item.icon;
                          const isSelected = transportItems.whatToCarry.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleTransportItem("whatToCarry", item.id)}
                              className={cn(
                                "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors duration-150 cursor-pointer outline-none bg-white",
                                isSelected
                                  ? "border-purple"
                                  : "border-neutral-200/80 hover:border-neutral-300",
                              )}
                            >
                              <div
                                className={cn(
                                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors border",
                                  isSelected
                                    ? "bg-purple/10 text-purple border-purple/20"
                                    : "bg-neutral-100 text-neutral-500 border-neutral-200/60",
                                )}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <span
                                className={cn(
                                  "text-xs sm:text-sm font-medium leading-snug transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-800",
                                )}
                              >
                                {item.label}
                              </span>
                            </button>
                          );
                        })}

                        {customItems["whatToCarryTransport"]?.map((custom) => {
                          const isSelected = transportItems.whatToCarry.includes(custom);
                          return (
                            <button
                              key={custom}
                              type="button"
                              onClick={() => toggleTransportItem("whatToCarry", custom)}
                              className={cn(
                                "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors duration-150 cursor-pointer outline-none bg-white",
                                isSelected
                                  ? "border-purple"
                                  : "border-neutral-200/80 hover:border-neutral-300",
                              )}
                            >
                              <div
                                className={cn(
                                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors border",
                                  isSelected
                                    ? "bg-purple/10 text-purple border-purple/20"
                                    : "bg-neutral-100 text-neutral-500 border-neutral-200/60",
                                )}
                              >
                                <Sparkles className="h-4 w-4" />
                              </div>
                              <span
                                className={cn(
                                  "text-xs sm:text-sm font-medium leading-snug transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-800",
                                )}
                              >
                                {custom}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-1">
                        {activeInputCategory === "whatToCarryTransport" ? (
                          <div className="flex items-center gap-2 max-w-sm">
                            <input
                              type="text"
                              value={customInputValues["whatToCarryTransport"] || ""}
                              onChange={(e) =>
                                setCustomInputValues((p) => ({
                                  ...p,
                                  whatToCarryTransport: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddCustomItem("whatToCarryTransport");
                                }
                              }}
                              placeholder="e.g. Visa card for deposit"
                              className="flex-1 h-9 px-3 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-purple"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleAddCustomItem("whatToCarryTransport")}
                              className="h-9 px-3 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-hover cursor-pointer"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveInputCategory(null)}
                              className="h-9 px-2 rounded-lg text-neutral-400 hover:text-neutral-600 text-xs cursor-pointer"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setActiveInputCategory("whatToCarryTransport")}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple hover:underline cursor-pointer py-1"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add required document</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Guidelines */}
                    <div className="space-y-3.5 pt-4">
                      <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                        <div>
                          <h2 className="text-sm sm:text-base font-semibold text-black tracking-tight flex items-center gap-2">
                            <span>Vehicle Guidelines &amp; Policies</span>
                            <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/60">
                              {transportItems.guidelines.length} rules
                            </span>
                          </h2>
                          <p className="text-xs text-black-subtle mt-0.5">
                            Policies regarding smoking, luggage restrictions, and onboard conduct.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {TRANSPORT_GUIDELINES.map((item) => {
                          const Icon = item.icon;
                          const isSelected = transportItems.guidelines.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleTransportItem("guidelines", item.id)}
                              className={cn(
                                "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors duration-150 cursor-pointer outline-none bg-white",
                                isSelected
                                  ? "border-purple"
                                  : "border-neutral-200/80 hover:border-neutral-300",
                              )}
                            >
                              <div
                                className={cn(
                                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors border",
                                  isSelected
                                    ? "bg-purple/10 text-purple border-purple/20"
                                    : "bg-neutral-100 text-neutral-500 border-neutral-200/60",
                                )}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <span
                                className={cn(
                                  "text-xs sm:text-sm font-medium leading-snug transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-800",
                                )}
                              >
                                {item.label}
                              </span>
                            </button>
                          );
                        })}

                        {customItems["guidelines"]?.map((custom) => {
                          const isSelected = transportItems.guidelines.includes(custom);
                          return (
                            <button
                              key={custom}
                              type="button"
                              onClick={() => toggleTransportItem("guidelines", custom)}
                              className={cn(
                                "flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors duration-150 cursor-pointer outline-none bg-white",
                                isSelected
                                  ? "border-purple"
                                  : "border-neutral-200/80 hover:border-neutral-300",
                              )}
                            >
                              <div
                                className={cn(
                                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors border",
                                  isSelected
                                    ? "bg-purple/10 text-purple border-purple/20"
                                    : "bg-neutral-100 text-neutral-500 border-neutral-200/60",
                                )}
                              >
                                <Ban className="h-4 w-4" />
                              </div>
                              <span
                                className={cn(
                                  "text-xs sm:text-sm font-medium leading-snug transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-800",
                                )}
                              >
                                {custom}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-1">
                        {activeInputCategory === "guidelines" ? (
                          <div className="flex items-center gap-2 max-w-sm">
                            <input
                              type="text"
                              value={customInputValues["guidelines"] || ""}
                              onChange={(e) =>
                                setCustomInputValues((p) => ({
                                  ...p,
                                  guidelines: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddCustomItem("guidelines");
                                }
                              }}
                              placeholder="e.g. No food with strong odors"
                              className="flex-1 h-9 px-3 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-purple"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleAddCustomItem("guidelines")}
                              className="h-9 px-3 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-hover cursor-pointer"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveInputCategory(null)}
                              className="h-9 px-2 rounded-lg text-neutral-400 hover:text-neutral-600 text-xs cursor-pointer"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setActiveInputCategory("guidelines")}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple hover:underline cursor-pointer py-1"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add custom guideline</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Controls for Step 3: Sends to Backend and advances to Step 4 */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={handleBackToStep2}
                    className="w-full sm:w-auto h-11 px-6 rounded-xl border border-neutral-200/80 bg-white hover:bg-neutral-50 text-neutral-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleNextFromStep3}
                    className={cn(
                      "w-full sm:w-auto h-11 px-8 rounded-xl font-semibold text-xs sm:text-sm inline-flex items-center justify-center transition-all cursor-pointer shadow-xs",
                      !submitting
                        ? "bg-purple text-white hover:bg-purple-hover active:scale-98"
                        : "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200",
                    )}
                  >
                    <span>{submitting ? "Saving details..." : "Next"}</span>
                  </button>
                </div>
              </div>
            ) : currentStep === 4 ? (
              /* ========================================================================= */
              /* STEP 4: LOCATION (PATCHES TO BACKEND ON NEXT AND DRIVES TO MEDIA)          */
              /* ========================================================================= */
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="text-center mb-8">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-black leading-snug">
                    Where is your{" "}
                    {selectedType === "stay"
                      ? "stay"
                      : selectedType === "experience"
                        ? "experience"
                        : "transport service"}{" "}
                    located?
                  </h1>
                  <p className="text-xs sm:text-sm text-black-subtle mt-2 max-w-xl mx-auto leading-relaxed">
                    Set your Zambian province, town or district, and pinpoint exact coordinates
                    using Google Maps.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Country (Pre-known & Fixed to Zambia) */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/70">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-purple/10 text-purple border border-purple/20 flex items-center justify-center font-bold text-sm">
                        🇿🇲
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-black">Zambia</span>
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            Fixed Country
                          </span>
                        </div>
                        <p className="text-[11px] text-black-subtle mt-0.5">
                          Nearby Escapes operates exclusively across Zambia.
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-neutral-400 hidden sm:inline-block">
                      Southern Africa
                    </span>
                  </div>

                  {/* Province & City Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Province */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-800">
                        Province <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={province}
                        onChange={(e) => handleProvinceChange(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 bg-white text-xs sm:text-sm font-medium text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 transition-all cursor-pointer"
                      >
                        {ZAMBIA_PROVINCES.map((p) => (
                          <option key={p.name} value={p.name}>
                            {p.name} Province
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* City / Town */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-800">
                        City / Town <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder={`e.g. ${currentProvinceData.popularCities[0] || "Lusaka"}`}
                        list="popular-cities-list"
                        className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 bg-white text-xs sm:text-sm font-medium text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 transition-all"
                      />
                      <datalist id="popular-cities-list">
                        {currentProvinceData.popularCities.map((c) => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  {/* District / Town / Area & Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* District or Exact Town */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-800">
                        Town / District / Area <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="e.g. Woodlands, Mukuni, Riverside, Mfuwe Gate"
                        className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 bg-white text-xs sm:text-sm font-medium text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 transition-all"
                      />
                    </div>

                    {/* Street Address / Directions */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-800">
                        Street Address / Landmark{" "}
                        <span className="text-neutral-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. Plot 4921, Lake Road, or Off Airport Rd"
                        className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 bg-white text-xs sm:text-sm font-medium text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Google Maps Coordinates Picker */}
                  <div className="pt-2">
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-purple" />
                        <span>Google Maps Pin &amp; Coordinates</span>
                      </label>
                      <span className="text-[11px] text-neutral-400">
                        Drag pin or search location to set coordinates
                      </span>
                    </div>

                    <GoogleMapsLocationPicker
                      latitude={coordinates.lat}
                      longitude={coordinates.lng}
                      province={province}
                      city={city}
                      address={address}
                      onChange={({ latitude, longitude, address: newAddr }) => {
                        setCoordinates({ lat: latitude, lng: longitude });
                        if (newAddr && !address) {
                          setAddress(newAddr);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Footer Controls for Step 4: PATCHES to backend and drives to Step 5 (Media) */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={handleBackToStep3}
                    className="w-full sm:w-auto h-11 px-6 rounded-xl border border-neutral-200/80 bg-white hover:bg-neutral-50 text-neutral-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleNextFromStep4}
                    className={cn(
                      "w-full sm:w-auto h-11 px-8 rounded-xl font-semibold text-xs sm:text-sm inline-flex items-center justify-center transition-all cursor-pointer shadow-xs",
                      !submitting
                        ? "bg-purple text-white hover:bg-purple-hover active:scale-98"
                        : "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200",
                    )}
                  >
                    <span>{submitting ? "Saving location..." : "Next"}</span>
                  </button>
                </div>
              </div>
            ) : currentStep === 5 ? (
              /* ========================================================================= */
              /* STEP 5: UPLOADS & MEDIA (CLEAR/PRO PHOTOS GUIDE, UP TO 5 MAX)              */
              /* ========================================================================= */
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="text-center mb-6">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-black leading-snug">
                    Add photos of your{" "}
                    {selectedType === "stay"
                      ? "stay"
                      : selectedType === "experience"
                        ? "experience"
                        : "vehicle"}
                  </h1>
                  <p className="text-xs sm:text-sm text-black-subtle mt-2 max-w-xl mx-auto leading-relaxed">
                    High quality photos help guests visualize your offering. Upload up to 5 clear,
                    professionally taken photos to get started.
                  </p>
                </div>

                {/* Clear / Professional Photography Guide Banner */}
                <div className="rounded-2xl border border-purple/20 bg-purple/[0.03] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-purple/10 text-purple border border-purple/20 flex items-center justify-center shrink-0">
                      <Camera className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-black">
                        Upload clear quality or professionally taken images
                      </h3>
                      <p className="text-xs text-neutral-600 mt-0.5">
                        Please upload clear quality or professionally taken images of whatever you
                        are offering.
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className="text-xs font-semibold text-purple bg-purple/10 px-3 py-1.5 rounded-full border border-purple/20">
                      Up to 5 images max
                    </span>
                  </div>
                </div>

                {/* Upload Dropzone */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (images.length < 5) setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => {
                    if (images.length < 5 && fileInputRef.current) {
                      fileInputRef.current.click();
                    }
                  }}
                  className={cn(
                    "border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center",
                    images.length >= 5
                      ? "border-neutral-200 bg-neutral-50/70 cursor-not-allowed opacity-75"
                      : isDragging
                        ? "border-purple bg-purple/5 scale-[0.99]"
                        : "border-neutral-300 hover:border-purple/50 hover:bg-neutral-50/60",
                  )}
                >
                  <div className="h-12 w-12 rounded-2xl bg-purple/10 text-purple border border-purple/20 flex items-center justify-center mb-3">
                    <UploadCloud className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm sm:text-base font-semibold text-black">
                    {images.length >= 5
                      ? "Maximum 5 photos reached"
                      : "Drag & drop photos here, or browse"}
                  </h4>
                  <p className="text-xs text-black-subtle mt-1 max-w-sm">
                    {images.length >= 5
                      ? "You have uploaded the maximum allowed 5 photos. Remove one if you wish to swap."
                      : "Supports high-resolution JPG, PNG or WebP (max 5 photos)"}
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      disabled={images.length >= 5}
                      className={cn(
                        "h-9 px-4 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs",
                        images.length >= 5
                          ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                          : "bg-purple text-white hover:bg-purple-hover cursor-pointer",
                      )}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Select Photos</span>
                    </button>

                    {images.length === 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLoadSamplePhotos();
                        }}
                        className="h-9 px-3.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-700 transition-colors cursor-pointer"
                      >
                        Load sample photos
                      </button>
                    )}
                  </div>
                </div>

                {/* Uploaded Photos Grid (Up to 5) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-semibold text-black flex items-center gap-2">
                      <span>Uploaded Photos</span>
                      <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-purple/10 text-purple border border-purple/20">
                        {images.length} of 5 photos
                      </span>
                    </h3>

                    {images.length > 0 && images.length < 5 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-semibold text-purple hover:underline cursor-pointer inline-flex items-center gap-1"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add more</span>
                      </button>
                    )}
                  </div>

                  {images.length === 0 ? (
                    <div className="border border-neutral-200/80 rounded-xl p-8 text-center bg-neutral-50/50">
                      <ImageIcon className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                      <p className="text-xs text-neutral-500 font-medium">No photos uploaded yet</p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Please upload at least 1 photo to proceed to the editor.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {images.map((imgUrl, index) => {
                        const isCover = index === 0;
                        return (
                          <div
                            key={index}
                            className={cn(
                              "group relative aspect-4/3 rounded-xl overflow-hidden border bg-neutral-100 shadow-2xs transition-all",
                              isCover
                                ? "border-purple ring-2 ring-purple/20"
                                : "border-neutral-200",
                            )}
                          >
                            {/* Image Preview */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imgUrl}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-full object-cover"
                            />

                            {/* Cover Badge */}
                            {isCover && (
                              <div className="absolute top-2 left-2 bg-purple text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                                <Star className="h-2.5 w-2.5 fill-white" />
                                <span>Cover</span>
                              </div>
                            )}

                            {/* Photo index indicator */}
                            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                              #{index + 1}
                            </div>

                            {/* Action overlays on hover */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              {!isCover && (
                                <button
                                  type="button"
                                  title="Make Cover Photo"
                                  onClick={() => handleSetCoverPhoto(index)}
                                  className="h-8 w-8 rounded-lg bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                                >
                                  <Star className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                type="button"
                                title="Remove photo"
                                onClick={() => handleRemoveImage(index)}
                                className="h-8 w-8 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {/* Empty slots placeholders up to 5 */}
                      {Array.from({ length: 5 - images.length }).map((_, i) => (
                        <button
                          key={`empty-${i}`}
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-4/3 rounded-xl border border-dashed border-neutral-200/80 hover:border-purple/40 hover:bg-neutral-50/50 flex flex-col items-center justify-center text-neutral-400 hover:text-purple transition-all cursor-pointer"
                        >
                          <Plus className="h-5 w-5 mb-1" />
                          <span className="text-[10px] font-medium">
                            Slot #{images.length + i + 1}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Controls for Step 5: Patches media to backend and drives to editor */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={handleBackToStep4}
                    className="w-full sm:w-auto h-11 px-6 rounded-xl border border-neutral-200/80 bg-white hover:bg-neutral-50 text-neutral-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    disabled={images.length === 0 || submitting}
                    onClick={handleNextFromStep5}
                    className={cn(
                      "w-full sm:w-auto h-11 px-8 rounded-xl font-semibold text-xs sm:text-sm inline-flex items-center justify-center transition-all cursor-pointer shadow-xs",
                      images.length > 0 && !submitting
                        ? "bg-purple text-white hover:bg-purple-hover active:scale-98"
                        : "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200",
                    )}
                  >
                    <span>{submitting ? "Saving photos..." : "Next"}</span>
                  </button>
                </div>
              </div>
            ) : currentStep === 6 ? (
              /* ========================================================================= */
              /* STEP 6: NAME & DESCRIPTION (MAXIMUM OF 300 WORDS)                         */
              /* ========================================================================= */
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="text-center mb-6">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-black leading-snug">
                    Name and description
                  </h1>
                  <p className="text-xs sm:text-sm text-black-subtle mt-2 max-w-xl mx-auto leading-relaxed">
                    Give your offering a catchy title and tell guests what makes it special.
                    Descriptions are limited to a maximum of 300 words.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Listing Name / Title */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-purple" />
                        <span>
                          Listing Name / Title <span className="text-rose-500">*</span>
                        </span>
                      </label>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        {title.length}/80
                      </span>
                    </div>

                    <input
                      type="text"
                      maxLength={80}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={
                        selectedType === "stay"
                          ? "e.g. Mukuni Riverfront Safari Lodge"
                          : selectedType === "experience"
                            ? "e.g. South Luangwa Walking Safari & Sunset Bush Dinner"
                            : "e.g. VIP Airport Transfer & City Chauffeur (Prado TX)"
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-neutral-200 bg-white text-xs sm:text-sm font-medium text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 transition-all"
                    />
                    <p className="text-[11px] text-neutral-500 mt-1">
                      A clear, distinctive name helps guests find and remember your listing.
                    </p>
                  </div>

                  {/* Description with 300 Words Maximum Limit */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-purple" />
                        <span>
                          Description <span className="text-rose-500">*</span>
                        </span>
                      </label>

                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-[11px] px-2.5 py-0.5 rounded-full border transition-all font-medium",
                            isDescriptionOverLimit
                              ? "bg-rose-50 text-rose-600 border-rose-200/80 font-bold"
                              : descriptionWordCount > 250
                                ? "bg-amber-50 text-amber-700 border-amber-200/80"
                                : "bg-purple/10 text-purple border-purple/20",
                          )}
                        >
                          {isDescriptionOverLimit
                            ? `Exceeded by ${descriptionWordCount - 300} words (max 300)`
                            : `${descriptionWordCount} / 300 words`}
                        </span>
                      </div>
                    </div>

                    <textarea
                      rows={8}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={
                        selectedType === "stay"
                          ? "Describe your lodge or stay, the room layout, scenic views, safari surroundings, and the Zambian warmth guests can expect..."
                          : selectedType === "experience"
                            ? "Describe what makes this experience memorable, the guided itinerary, cultural or wildlife highlights, and equipment provided..."
                            : "Describe vehicle features, comfort, luggage capacity, pickup reliability, and your professional chauffeur service..."
                      }
                      className={cn(
                        "w-full p-3.5 rounded-xl border bg-white text-xs sm:text-sm font-normal text-neutral-900 focus:outline-none transition-all leading-relaxed resize-y",
                        isDescriptionOverLimit
                          ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-200"
                          : "border-neutral-200 focus:border-purple focus:ring-1 focus:ring-purple/20",
                      )}
                    />

                    <div className="flex items-center justify-between pt-0.5">
                      {isDescriptionOverLimit ? (
                        <p className="text-[11px] text-rose-500 font-semibold">
                          Your description is too long. Please trim {descriptionWordCount - 300}{" "}
                          word
                          {descriptionWordCount - 300 > 1 ? "s" : ""} to reach the 300-word limit.
                        </p>
                      ) : (
                        <p className="text-[11px] text-neutral-500">
                          Maximum of 300 words. Keep it informative, clear, and authentic.
                        </p>
                      )}

                      {!isDescriptionOverLimit && descriptionWordCount > 0 && (
                        <span className="text-[11px] text-neutral-400">
                          {300 - descriptionWordCount} words remaining
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tips Card */}
                  <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/60 p-4 sm:p-5">
                    <div className="flex items-center gap-2 mb-2.5">
                      <Sparkles className="h-4 w-4 text-purple" />
                      <h4 className="text-xs sm:text-sm font-semibold text-black">
                        Writing a standout description
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-neutral-600">
                      <div className="bg-white p-3 rounded-xl border border-neutral-200/70 shadow-2xs">
                        <span className="font-semibold text-neutral-900 block mb-1">
                          Setting &amp; Vibe
                        </span>
                        Highlight the peaceful surroundings, wildlife proximity, or central
                        location.
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-neutral-200/70 shadow-2xs">
                        <span className="font-semibold text-neutral-900 block mb-1">
                          Key Inclusions
                        </span>
                        Mention backup solar power, borehole water, guides, or complimentary
                        breakfast.
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-neutral-200/70 shadow-2xs">
                        <span className="font-semibold text-neutral-900 block mb-1">
                          Guest Expectations
                        </span>
                        Provide clear notes about check-in convenience, vehicle comfort, or safari
                        gear.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Controls for Step 6: Advances to Step 7 */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={handleBackToStep5}
                    className="w-full sm:w-auto h-11 px-6 rounded-xl border border-neutral-200/80 bg-white hover:bg-neutral-50 text-neutral-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    disabled={
                      !title.trim() || !description.trim() || isDescriptionOverLimit || submitting
                    }
                    onClick={handleFinishStep6}
                    className={cn(
                      "w-full sm:w-auto h-11 px-8 rounded-xl font-semibold text-xs sm:text-sm inline-flex items-center justify-center transition-all cursor-pointer shadow-xs",
                      title.trim() && description.trim() && !isDescriptionOverLimit && !submitting
                        ? "bg-purple text-white hover:bg-purple-hover active:scale-98"
                        : "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200",
                    )}
                  >
                    <span>{submitting ? "Saving..." : "Next"}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* ========================================================================= */
              /* STEP 7: PRICING & CONDITIONAL DISCOUNTS (10+ PEOPLE & 7+ DAYS)            */
              /* ========================================================================= */
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="text-center mb-6">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-black leading-snug">
                    Price &amp; conditional discounts
                  </h1>
                  <p className="text-xs sm:text-sm text-black-subtle mt-2 max-w-xl mx-auto leading-relaxed">
                    Set your standard price and choose checkable promotional discounts for large
                    groups (10+ people) or extended stays (7+ days).
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Standard Base Price */}
                  <div className="p-5 sm:p-6 rounded-2xl border border-neutral-200/80 bg-white space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 flex items-center gap-2">
                          <Tag className="h-4 w-4 text-purple" />
                          <span>Standard Rate</span>
                        </h3>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          The regular price per{" "}
                          {selectedType === "stay"
                            ? "night"
                            : selectedType === "experience"
                              ? "person"
                              : "day / trip"}{" "}
                          before any discounts.
                        </p>
                      </div>

                      {/* Currency Selector */}
                      <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl border border-neutral-200/70 shrink-0 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setCurrency("ZMW")}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                            currency === "ZMW"
                              ? "bg-white text-purple shadow-2xs"
                              : "text-neutral-600 hover:text-black",
                          )}
                        >
                          🇿🇲 ZMW (Kwacha)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrency("USD")}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                            currency === "USD"
                              ? "bg-white text-purple shadow-2xs"
                              : "text-neutral-600 hover:text-black",
                          )}
                        >
                          💵 USD ($)
                        </button>
                      </div>
                    </div>

                    <div className="max-w-xs space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-800">
                        Price {currency === "ZMW" ? "(ZMW)" : "(USD)"}{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                          {currency === "ZMW" ? "K" : "$"}
                        </span>
                        <input
                          type="number"
                          min={1}
                          step={currency === "ZMW" ? 50 : 5}
                          value={basePrice || ""}
                          onChange={(e) => setBasePrice(Math.max(0, Number(e.target.value)))}
                          placeholder="e.g. 1500"
                          className="w-full h-11 pl-9 pr-20 rounded-xl border border-neutral-200 bg-white text-sm font-semibold text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 transition-all"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-medium">
                          /{" "}
                          {selectedType === "stay"
                            ? "night"
                            : selectedType === "experience"
                              ? "guest"
                              : "trip"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Checkable Conditional Discounts */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-100 mb-4">
                      <div>
                        <h2 className="text-sm sm:text-base font-semibold text-black tracking-tight flex items-center gap-2">
                          <Percent className="h-4 w-4 text-purple" />
                          <span>Conditional Discounts &amp; Promos</span>
                        </h2>
                        <p className="text-xs text-black-subtle mt-0.5">
                          Enable conditional discount rules and configure custom promo rates for
                          qualifying bookings.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {/* DISCOUNT 1: 10 or more people */}
                      <div
                        className={cn(
                          "rounded-2xl border p-5 sm:p-6 transition-all duration-150 bg-white",
                          groupDiscountEnabled
                            ? "border-purple shadow-2xs ring-1 ring-purple/10"
                            : "border-neutral-200/80 hover:border-neutral-300",
                        )}
                      >
                        {/* Checkbox Header */}
                        <div className="flex items-start justify-between gap-4">
                          <label className="flex items-start gap-3.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={groupDiscountEnabled}
                              onChange={(e) => setGroupDiscountEnabled(e.target.checked)}
                              className="mt-0.5 h-5 w-5 rounded-md border-neutral-300 text-purple focus:ring-purple/20 cursor-pointer accent-purple"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "text-sm font-semibold transition-colors",
                                    groupDiscountEnabled ? "text-purple" : "text-black",
                                  )}
                                >
                                  Conditional discount for 10 or more people
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple/10 text-purple border border-purple/20">
                                  10+ Guests
                                </span>
                              </div>
                              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                                Automatically offer a promotional rate when an expedition, group
                                booking, or family reservation reaches 10 or more people.
                              </p>
                            </div>
                          </label>
                        </div>

                        {/* Promo Price Settings (Revealed when checked) */}
                        {groupDiscountEnabled && (
                          <div className="mt-5 pt-4 border-t border-neutral-100 space-y-4 animate-in fade-in slide-in-from-top-1 duration-150">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {/* Discount Mode / Setting */}
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-neutral-800">
                                  Discount Type
                                </label>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setGroupDiscountType("percent")}
                                    className={cn(
                                      "flex-1 h-9 rounded-xl text-xs font-semibold border transition-all cursor-pointer",
                                      groupDiscountType === "percent"
                                        ? "bg-purple text-white border-purple shadow-2xs"
                                        : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50",
                                    )}
                                  >
                                    Percentage Off
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setGroupDiscountType("fixed");
                                      if (
                                        !groupDiscountCustomPrice ||
                                        groupDiscountCustomPrice >= basePrice
                                      ) {
                                        setGroupDiscountCustomPrice(Math.round(basePrice * 0.85));
                                      }
                                    }}
                                    className={cn(
                                      "flex-1 h-9 rounded-xl text-xs font-semibold border transition-all cursor-pointer",
                                      groupDiscountType === "fixed"
                                        ? "bg-purple text-white border-purple shadow-2xs"
                                        : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50",
                                    )}
                                  >
                                    Custom Promo Price
                                  </button>
                                </div>
                              </div>

                              {/* Value Input */}
                              <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-neutral-800">
                                  {groupDiscountType === "percent"
                                    ? "Percentage Discount (%)"
                                    : `Promo Price (${currency})`}
                                </label>
                                {groupDiscountType === "percent" ? (
                                  <div className="space-y-2">
                                    <div className="relative">
                                      <input
                                        type="number"
                                        min={1}
                                        max={90}
                                        value={groupDiscountPercent}
                                        onChange={(e) =>
                                          setGroupDiscountPercent(
                                            Math.min(90, Math.max(1, Number(e.target.value))),
                                          )
                                        }
                                        className="w-full h-10 px-3.5 pr-8 rounded-xl border border-neutral-200 bg-white text-xs sm:text-sm font-semibold text-neutral-900 focus:outline-none focus:border-purple"
                                      />
                                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                                        %
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      {[10, 15, 20, 25].map((pct) => (
                                        <button
                                          key={pct}
                                          type="button"
                                          onClick={() => setGroupDiscountPercent(pct)}
                                          className={cn(
                                            "px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer border",
                                            groupDiscountPercent === pct
                                              ? "bg-purple/10 text-purple border-purple/30"
                                              : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100",
                                          )}
                                        >
                                          {pct}%
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                                      {currency === "ZMW" ? "K" : "$"}
                                    </span>
                                    <input
                                      type="number"
                                      min={1}
                                      max={basePrice > 1 ? basePrice - 1 : 1}
                                      value={groupDiscountCustomPrice || ""}
                                      onChange={(e) =>
                                        setGroupDiscountCustomPrice(Number(e.target.value))
                                      }
                                      placeholder="e.g. 1200"
                                      className="w-full h-10 pl-8 pr-3.5 rounded-xl border border-neutral-200 bg-white text-xs sm:text-sm font-semibold text-neutral-900 focus:outline-none focus:border-purple"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Live calculation banner */}
                            <div className="p-3 rounded-xl bg-purple/[0.04] border border-purple/15 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-purple shrink-0" />
                                <span className="text-neutral-700">10+ Guests Promo Rate:</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="line-through text-neutral-400 font-medium">
                                  {currency === "ZMW" ? "K" : "$"}
                                  {basePrice.toLocaleString()}
                                </span>
                                <span className="font-bold text-purple text-sm">
                                  {currency === "ZMW" ? "K" : "$"}
                                  {effectiveGroupPromoPrice.toLocaleString()}
                                </span>
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                                  Save {currency === "ZMW" ? "K" : "$"}
                                  {(basePrice - effectiveGroupPromoPrice).toLocaleString()} / person
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* DISCOUNT 2: stays more than 7 days */}
                      <div
                        className={cn(
                          "rounded-2xl border p-5 sm:p-6 transition-all duration-150 bg-white",
                          extendedStayDiscountEnabled
                            ? "border-purple shadow-2xs ring-1 ring-purple/10"
                            : "border-neutral-200/80 hover:border-neutral-300",
                        )}
                      >
                        {/* Checkbox Header */}
                        <div className="flex items-start justify-between gap-4">
                          <label className="flex items-start gap-3.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={extendedStayDiscountEnabled}
                              onChange={(e) => setExtendedStayDiscountEnabled(e.target.checked)}
                              className="mt-0.5 h-5 w-5 rounded-md border-neutral-300 text-purple focus:ring-purple/20 cursor-pointer accent-purple"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "text-sm font-semibold transition-colors",
                                    extendedStayDiscountEnabled ? "text-purple" : "text-black",
                                  )}
                                >
                                  Conditional discount for stays more than 7 days
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple/10 text-purple border border-purple/20">
                                  7+ Days
                                </span>
                              </div>
                              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                                Offer an incentive for long stays, safari packages, or week-long
                                bookings over 7 days.
                              </p>
                            </div>
                          </label>
                        </div>

                        {/* Promo Price Settings (Revealed when checked) */}
                        {extendedStayDiscountEnabled && (
                          <div className="mt-5 pt-4 border-t border-neutral-100 space-y-4 animate-in fade-in slide-in-from-top-1 duration-150">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {/* Discount Mode / Setting */}
                              <div className="space-y-2">
                                <label className="text-xs font-semibold text-neutral-800">
                                  Discount Type
                                </label>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setExtendedStayDiscountType("percent")}
                                    className={cn(
                                      "flex-1 h-9 rounded-xl text-xs font-semibold border transition-all cursor-pointer",
                                      extendedStayDiscountType === "percent"
                                        ? "bg-purple text-white border-purple shadow-2xs"
                                        : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50",
                                    )}
                                  >
                                    Percentage Off
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setExtendedStayDiscountType("fixed");
                                      if (
                                        !extendedStayCustomPrice ||
                                        extendedStayCustomPrice >= basePrice
                                      ) {
                                        setExtendedStayCustomPrice(Math.round(basePrice * 0.9));
                                      }
                                    }}
                                    className={cn(
                                      "flex-1 h-9 rounded-xl text-xs font-semibold border transition-all cursor-pointer",
                                      extendedStayDiscountType === "fixed"
                                        ? "bg-purple text-white border-purple shadow-2xs"
                                        : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50",
                                    )}
                                  >
                                    Custom Promo Price
                                  </button>
                                </div>
                              </div>

                              {/* Value Input */}
                              <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-neutral-800">
                                  {extendedStayDiscountType === "percent"
                                    ? "Percentage Discount (%)"
                                    : `Promo Rate (${currency})`}
                                </label>
                                {extendedStayDiscountType === "percent" ? (
                                  <div className="space-y-2">
                                    <div className="relative">
                                      <input
                                        type="number"
                                        min={1}
                                        max={90}
                                        value={extendedStayDiscountPercent}
                                        onChange={(e) =>
                                          setExtendedStayDiscountPercent(
                                            Math.min(90, Math.max(1, Number(e.target.value))),
                                          )
                                        }
                                        className="w-full h-10 px-3.5 pr-8 rounded-xl border border-neutral-200 bg-white text-xs sm:text-sm font-semibold text-neutral-900 focus:outline-none focus:border-purple"
                                      />
                                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                                        %
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      {[5, 10, 15, 20].map((pct) => (
                                        <button
                                          key={pct}
                                          type="button"
                                          onClick={() => setExtendedStayDiscountPercent(pct)}
                                          className={cn(
                                            "px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer border",
                                            extendedStayDiscountPercent === pct
                                              ? "bg-purple/10 text-purple border-purple/30"
                                              : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100",
                                          )}
                                        >
                                          {pct}%
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                                      {currency === "ZMW" ? "K" : "$"}
                                    </span>
                                    <input
                                      type="number"
                                      min={1}
                                      max={basePrice > 1 ? basePrice - 1 : 1}
                                      value={extendedStayCustomPrice || ""}
                                      onChange={(e) =>
                                        setExtendedStayCustomPrice(Number(e.target.value))
                                      }
                                      placeholder="e.g. 1350"
                                      className="w-full h-10 pl-8 pr-3.5 rounded-xl border border-neutral-200 bg-white text-xs sm:text-sm font-semibold text-neutral-900 focus:outline-none focus:border-purple"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Live calculation banner */}
                            <div className="p-3 rounded-xl bg-purple/[0.04] border border-purple/15 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-purple shrink-0" />
                                <span className="text-neutral-700">7+ Days Promo Rate:</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="line-through text-neutral-400 font-medium">
                                  {currency === "ZMW" ? "K" : "$"}
                                  {basePrice.toLocaleString()}
                                </span>
                                <span className="font-bold text-purple text-sm">
                                  {currency === "ZMW" ? "K" : "$"}
                                  {effectiveExtendedStayPromoPrice.toLocaleString()}
                                </span>
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                                  Guest saves {currency === "ZMW" ? "K" : "$"}
                                  {(
                                    (basePrice - effectiveExtendedStayPromoPrice) *
                                    7
                                  ).toLocaleString()}{" "}
                                  over 7 nights
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Controls for Step 7: PATCHES to backend and completes onboarding into editor */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={handleBackToStep6}
                    className="w-full sm:w-auto h-11 px-6 rounded-xl border border-neutral-200/80 bg-white hover:bg-neutral-50 text-neutral-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    disabled={basePrice <= 0 || submitting}
                    onClick={handleFinishStep7}
                    className={cn(
                      "w-full sm:w-auto h-11 px-8 rounded-xl font-semibold text-xs sm:text-sm inline-flex items-center justify-center transition-all cursor-pointer shadow-xs",
                      basePrice > 0 && !submitting
                        ? "bg-purple text-white hover:bg-purple-hover active:scale-98"
                        : "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200",
                    )}
                  >
                    <span>{submitting ? "Saving pricing..." : "Next"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
