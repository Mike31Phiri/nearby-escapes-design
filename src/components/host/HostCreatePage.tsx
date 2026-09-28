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
  description?: string;
  icon: React.ElementType;
}

const STAY_SUBTYPES: SubtypeOption[] = [
  { id: "safari_lodge", title: "Safari Lodge", icon: Hotel },
  { id: "bush_camp", title: "Bush Camp", icon: Tent },
  { id: "chalet", title: "Chalet / Cottage", icon: Home },
  { id: "apartment", title: "Apartment", icon: Building2 },
  { id: "guest_house", title: "Guest House", icon: Coffee },
  { id: "villa", title: "Villa", icon: Castle },
  { id: "boutique_hotel", title: "Boutique Hotel", icon: Sparkles },
  { id: "eco_retreat", title: "Eco Retreat", icon: Mountain },
];

const EXPERIENCE_SUBTYPES: SubtypeOption[] = [
  { id: "cultural_heritage", title: "Cultural Tour", icon: Landmark },
  { id: "tea_food_tasting", title: "Food & Tasting", icon: Coffee },
  { id: "game_drive_safari", title: "Wildlife Safari", icon: Compass },
  { id: "vic_falls_adventure", title: "Victoria Falls", icon: Waves },
  { id: "boat_water_safari", title: "Boat Safari", icon: Ship },
  { id: "nature_birding", title: "Nature Walk", icon: Footprints },
  { id: "art_craft_workshop", title: "Art & Crafts", icon: Palette },
];

const TRANSPORT_SUBTYPES: SubtypeOption[] = [
  { id: "airport_transfer", title: "Airport Transfer", icon: Plane },
  { id: "safari_4x4", title: "4x4 Safari Vehicle", icon: CarFront },
  { id: "intercity_shuttle", title: "Intercity Shuttle", icon: Bus },
  { id: "self_drive_rental", title: "Car Rental", icon: Key },
  { id: "chauffeur_service", title: "Chauffeur Ride", icon: Navigation },
  { id: "boat_transfer", title: "Boat Transfer", icon: Anchor },
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
  { id: "wifi", label: "Fast Wi-Fi", icon: Wifi },
  { id: "air_conditioning", label: "Air Conditioning", icon: Wind },
  { id: "kitchen", label: "Kitchen", icon: Utensils },
  { id: "parking", label: "Free Parking", icon: CarFront },
  { id: "hot_water", label: "Hot Water", icon: Droplets },
  { id: "workspace", label: "Workspace", icon: Laptop },
  { id: "tv", label: "TV / DStv", icon: Tv },
  { id: "swimming_pool", label: "Swimming Pool", icon: Waves },
  { id: "laundry", label: "Laundry", icon: Shirt },
  { id: "housekeeping", label: "Housekeeping", icon: Sparkles },
];

const STAY_STANDOUTS: AmenityItem[] = [
  { id: "solar_power", label: "Solar Power", icon: Sun },
  { id: "borehole_water", label: "Borehole Water", icon: Droplets },
  { id: "private_pool", label: "Private Pool", icon: Waves },
  { id: "fire_pit", label: "Fire Pit / Boma", icon: Flame },
  { id: "viewing_deck", label: "Viewing Deck", icon: Eye },
  { id: "braai_area", label: "Braai / BBQ", icon: Flame },
  { id: "river_front", label: "Water Frontage", icon: Anchor },
  { id: "private_chef", label: "Private Chef", icon: Coffee },
  { id: "patio_balcony", label: "Patio / Balcony", icon: Home },
  { id: "outdoor_shower", label: "Safari Shower", icon: Droplets },
];

const STAY_SAFETY: AmenityItem[] = [
  { id: "security_guard", label: "24/7 Security", icon: ShieldCheck },
  { id: "electric_fence", label: "Electric Fence", icon: Lock },
  { id: "first_aid", label: "First Aid Kit", icon: HeartPulse },
  { id: "fire_extinguisher", label: "Fire Extinguisher", icon: Flame },
  { id: "smoke_detector", label: "Smoke Detector", icon: Bell },
  { id: "safe_box", label: "In-room Safe", icon: Key },
  { id: "backup_lighting", label: "Emergency Lights", icon: Zap },
];

const EXPERIENCE_WHATS_INCLUDED: AmenityItem[] = [
  { id: "park_fees", label: "Park Entry Fees", icon: Ticket },
  { id: "safari_guide", label: "Safari Guide", icon: Compass },
  { id: "game_vehicle", label: "4x4 Safari Vehicle", icon: CarFront },
  { id: "water_snacks", label: "Water & Snacks", icon: Coffee },
  { id: "traditional_meal", label: "Traditional Meal", icon: Utensils },
  { id: "safety_gear", label: "Safety Gear", icon: ShieldCheck },
  { id: "pickup_dropoff", label: "Hotel Transfer", icon: MapPin },
  { id: "binoculars", label: "Binoculars", icon: Eye },
];

const EXPERIENCE_WHAT_TO_CARRY: AmenityItem[] = [
  { id: "id_passport", label: "ID / Passport", icon: FileText },
  { id: "walking_shoes", label: "Walking Shoes", icon: Footprints },
  { id: "sun_protection", label: "Sunscreen & Hat", icon: Sun },
  { id: "insect_repellent", label: "Insect Repellent", icon: ShieldAlert },
  { id: "camera", label: "Camera", icon: Camera },
  { id: "warm_jacket", label: "Warm Jacket", icon: Shirt },
  { id: "cash_zmw", label: "Cash (ZMW)", icon: Wallet },
  { id: "water_bottle", label: "Water Bottle", icon: Droplets },
];

const EXPERIENCE_WHAT_NOT_TO_BRING: AmenityItem[] = [
  { id: "drones", label: "No Drones", icon: Ban },
  { id: "plastic_bags", label: "No Plastic Bags", icon: Ban },
  { id: "bright_clothing", label: "No Bright Clothes", icon: Ban },
  { id: "pets", label: "No Pets", icon: Ban },
  { id: "firearms", label: "No Firearms", icon: Ban },
  { id: "heavy_suitcases", label: "No Hard Luggage", icon: Ban },
];

const TRANSPORT_FEATURES: AmenityItem[] = [
  { id: "ac", label: "Cabin AC", icon: Wind },
  { id: "pro_driver", label: "Licensed Driver", icon: Navigation },
  { id: "fuel_included", label: "Fuel Included", icon: Fuel },
  { id: "chilled_water", label: "Chilled Water", icon: Droplets },
  { id: "usb_charging", label: "USB Charging", icon: Zap },
  { id: "wifi", label: "Mobile Wi-Fi", icon: Wifi },
  { id: "luggage_capacity", label: "Luggage Trailer", icon: Luggage },
  {
    id: "passenger_insurance",
    label: "Passenger Cover",
    icon: ShieldCheck,
  },
  { id: "child_seat", label: "Child Seat", icon: HeartPulse },
];

const TRANSPORT_WHAT_TO_CARRY: AmenityItem[] = [
  { id: "drivers_license", label: "Driver's License", icon: FileText },
  { id: "id_passport", label: "Lead ID / Passport", icon: Key },
  { id: "booking_voucher", label: "Booking Voucher", icon: Ticket },
  { id: "flight_details", label: "Flight Details", icon: Plane },
  { id: "personal_cable", label: "Audio / Cable", icon: Music },
];

const TRANSPORT_GUIDELINES: AmenityItem[] = [
  { id: "no_smoking", label: "No Smoking", icon: Ban },
  { id: "no_open_alcohol", label: "No Open Alcohol", icon: Ban },
  { id: "no_hazardous", label: "No Hazard Cargo", icon: Ban },
  { id: "no_overload", label: "No Overloading", icon: Ban },
  { id: "no_uncaged_pets", label: "No Uncaged Pets", icon: Ban },
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
  const [selectedSubtype, setSelectedSubtype] = useState<string>("");

  // Track draft ID once created after Step 3
  const [createdDraftId, setCreatedDraftId] = useState<string | null>(null);

  // Step 3 State: Categorized amenities for each vertical
  const [stayAmenities, setStayAmenities] = useState<{
    guestFavourites: string[];
    standouts: string[];
    safety: string[];
  }>({
    guestFavourites: [],
    standouts: [],
    safety: [],
  });

  const [experienceItems, setExperienceItems] = useState<{
    whatsIncluded: string[];
    whatToCarry: string[];
    whatNotToBring: string[];
  }>({
    whatsIncluded: [],
    whatToCarry: [],
    whatNotToBring: [],
  });

  const [transportItems, setTransportItems] = useState<{
    vehicleFeatures: string[];
    whatToCarry: string[];
    guidelines: string[];
  }>({
    vehicleFeatures: [],
    whatToCarry: [],
    guidelines: [],
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
      router.push(ROUTES.host.listings);
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
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="text-center mb-6">
                  <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-black leading-snug">
                    What are you listing?
                  </h1>
                  <p className="text-xs text-black-subtle mt-1 max-w-lg mx-auto leading-relaxed">
                    Choose a category to begin creating your listing.
                  </p>
                </div>

                {/* Vertical Category Cards - Compact: Icons with names below */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto">
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
                          "flex flex-col items-center justify-center text-center p-4 sm:p-5 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[96px] sm:min-h-[104px]",
                          isSelected
                            ? "border-2 border-purple bg-purple/[0.02]"
                            : "border-neutral-300 hover:border-neutral-900",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-8 w-8 mb-2 transition-colors shrink-0",
                            isSelected ? "text-purple" : "text-neutral-800",
                          )}
                          strokeWidth={1.5}
                        />

                        <span
                          className={cn(
                            "text-xs sm:text-sm font-semibold transition-colors leading-tight",
                            isSelected ? "text-purple font-semibold" : "text-neutral-900",
                          )}
                        >
                          {type.title}
                        </span>
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
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="text-center mb-6">
                  <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-black leading-snug">
                    {selectedType === "stay"
                      ? "Which of these best describes your stay?"
                      : selectedType === "experience"
                        ? "Which of these best describes your experience?"
                        : "Which of these best describes your transport service?"}
                  </h1>
                  <p className="text-xs text-black-subtle mt-1.5 max-w-xl mx-auto leading-relaxed">
                    Select the category that most accurately represents your offering.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
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
                          "flex flex-col items-center justify-center text-center p-3.5 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[88px] sm:min-h-[96px]",
                          isSelected
                            ? "border-2 border-purple bg-purple/[0.02]"
                            : "border-neutral-300 hover:border-neutral-900",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-7 w-7 mb-2 transition-colors shrink-0",
                            isSelected ? "text-purple" : "text-neutral-800",
                          )}
                          strokeWidth={1.5}
                        />
                        <span
                          className={cn(
                            "text-xs sm:text-sm font-semibold leading-tight line-clamp-2 text-center transition-colors",
                            isSelected ? "text-purple font-semibold" : "text-neutral-900",
                          )}
                        >
                          {sub.title}
                        </span>
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
              /* STEP 3: AMENITIES & INCLUSIONS (SPACE-OPTIMIZED: ICONS WITH NAMES BELOW)   */
              /* ========================================================================= */
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="text-center mb-4">
                  <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-black leading-snug">
                    {selectedType === "stay"
                      ? "Select amenities for your stay"
                      : selectedType === "experience"
                        ? "Inclusions & guest guidelines"
                        : "Vehicle features & guidelines"}
                  </h1>
                  <p className="text-xs text-black-subtle mt-1 max-w-xl mx-auto leading-relaxed">
                    Select the amenities and guidelines that apply to your offering.
                  </p>
                </div>

                {/* Stays Amenities - Compact Icons with Names Below */}
                {selectedType === "stay" && (
                  <div className="space-y-5">
                    {/* Guest Favourites */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                        <h2 className="text-xs sm:text-sm font-semibold text-black tracking-tight">
                          Guest Favourites
                        </h2>
                        {activeInputCategory !== "guestFavourites" && (
                          <button
                            type="button"
                            onClick={() => setActiveInputCategory("guestFavourites")}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple hover:underline cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Add custom</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-2.5">
                        {STAY_GUEST_FAVOURITES.map((item) => {
                          const Icon = item.icon;
                          const isSelected = stayAmenities.guestFavourites.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleStayAmenity("guestFavourites", item.id)}
                              className={cn(
                                "flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[84px] sm:min-h-[92px]",
                                isSelected
                                  ? "border-2 border-purple bg-purple/[0.02]"
                                  : "border-neutral-300 hover:border-neutral-900",
                              )}
                            >
                              <Icon
                                className={cn(
                                  "h-7 w-7 mb-2 transition-colors shrink-0",
                                  isSelected ? "text-purple" : "text-neutral-800",
                                )}
                                strokeWidth={1.5}
                              />
                              <span
                                className={cn(
                                  "text-xs font-semibold leading-tight line-clamp-2 text-center transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-900",
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
                                "flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[84px] sm:min-h-[92px]",
                                isSelected
                                  ? "border-2 border-purple bg-purple/[0.02]"
                                  : "border-neutral-300 hover:border-neutral-900",
                              )}
                            >
                              <Sparkles
                                className={cn(
                                  "h-7 w-7 mb-2 transition-colors shrink-0",
                                  isSelected ? "text-purple" : "text-neutral-800",
                                )}
                                strokeWidth={1.5}
                              />
                              <span
                                className={cn(
                                  "text-xs font-semibold leading-tight line-clamp-2 text-center transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-900",
                                )}
                              >
                                {custom}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {activeInputCategory === "guestFavourites" && (
                        <div className="flex items-center gap-2 max-w-xs mt-1.5 animate-in fade-in duration-100">
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
                            className="flex-1 h-8 px-2.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-purple"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleAddCustomItem("guestFavourites")}
                            className="h-8 px-3 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-hover cursor-pointer"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveInputCategory(null)}
                            className="h-8 px-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Standouts */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                        <h2 className="text-xs sm:text-sm font-semibold text-black tracking-tight">
                          Standout Amenities
                        </h2>
                        {activeInputCategory !== "standouts" && (
                          <button
                            type="button"
                            onClick={() => setActiveInputCategory("standouts")}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple hover:underline cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Add custom</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-2.5">
                        {STAY_STANDOUTS.map((item) => {
                          const Icon = item.icon;
                          const isSelected = stayAmenities.standouts.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleStayAmenity("standouts", item.id)}
                              className={cn(
                                "flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[84px] sm:min-h-[92px]",
                                isSelected
                                  ? "border-2 border-purple bg-purple/[0.02]"
                                  : "border-neutral-300 hover:border-neutral-900",
                              )}
                            >
                              <Icon
                                className={cn(
                                  "h-7 w-7 mb-2 transition-colors shrink-0",
                                  isSelected ? "text-purple" : "text-neutral-800",
                                )}
                                strokeWidth={1.5}
                              />
                              <span
                                className={cn(
                                  "text-xs font-semibold leading-tight line-clamp-2 text-center transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-900",
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
                                "flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[84px] sm:min-h-[92px]",
                                isSelected
                                  ? "border-2 border-purple bg-purple/[0.02]"
                                  : "border-neutral-300 hover:border-neutral-900",
                              )}
                            >
                              <Sparkles
                                className={cn(
                                  "h-7 w-7 mb-2 transition-colors shrink-0",
                                  isSelected ? "text-purple" : "text-neutral-800",
                                )}
                                strokeWidth={1.5}
                              />
                              <span
                                className={cn(
                                  "text-xs font-semibold leading-tight line-clamp-2 text-center transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-900",
                                )}
                              >
                                {custom}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {activeInputCategory === "standouts" && (
                        <div className="flex items-center gap-2 max-w-xs mt-1.5 animate-in fade-in duration-100">
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
                            className="flex-1 h-8 px-2.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-purple"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleAddCustomItem("standouts")}
                            className="h-8 px-3 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-hover cursor-pointer"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveInputCategory(null)}
                            className="h-8 px-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Safety & Essentials */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                        <h2 className="text-xs sm:text-sm font-semibold text-black tracking-tight flex items-center gap-2">
                          <span>Safety &amp; Essentials</span>
                          <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-purple/10 text-purple border border-purple/20">
                            {stayAmenities.safety.length} selected
                          </span>
                        </h2>
                        {activeInputCategory !== "safety" && (
                          <button
                            type="button"
                            onClick={() => setActiveInputCategory("safety")}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple hover:underline cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Add custom</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-2.5">
                        {STAY_SAFETY.map((item) => {
                          const Icon = item.icon;
                          const isSelected = stayAmenities.safety.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleStayAmenity("safety", item.id)}
                              className={cn(
                                "flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[84px] sm:min-h-[92px]",
                                isSelected
                                  ? "border-2 border-purple bg-purple/[0.02]"
                                  : "border-neutral-300 hover:border-neutral-900",
                              )}
                            >
                              <Icon
                                className={cn(
                                  "h-7 w-7 mb-2 transition-colors shrink-0",
                                  isSelected ? "text-purple" : "text-neutral-800",
                                )}
                                strokeWidth={1.5}
                              />
                              <span
                                className={cn(
                                  "text-xs font-semibold leading-tight line-clamp-2 text-center transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-900",
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
                                "flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[84px] sm:min-h-[92px]",
                                isSelected
                                  ? "border-2 border-purple bg-purple/[0.02]"
                                  : "border-neutral-300 hover:border-neutral-900",
                              )}
                            >
                              <Sparkles
                                className={cn(
                                  "h-7 w-7 mb-2 transition-colors shrink-0",
                                  isSelected ? "text-purple" : "text-neutral-800",
                                )}
                                strokeWidth={1.5}
                              />
                              <span
                                className={cn(
                                  "text-xs font-semibold leading-tight line-clamp-2 text-center transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-900",
                                )}
                              >
                                {custom}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {activeInputCategory === "safety" && (
                        <div className="flex items-center gap-2 max-w-xs mt-1.5 animate-in fade-in duration-100">
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
                            placeholder="e.g. 24h Guard patrol"
                            className="flex-1 h-8 px-2.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-purple"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleAddCustomItem("safety")}
                            className="h-8 px-3 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-hover cursor-pointer"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveInputCategory(null)}
                            className="h-8 px-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Experiences Inclusions - Compact Icons with Names Below */}
                {selectedType === "experience" && (
                  <div className="space-y-5">
                    {/* What's Included */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                        <h2 className="text-xs sm:text-sm font-semibold text-black tracking-tight flex items-center gap-2">
                          <span>What&apos;s Included</span>
                          <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-purple/10 text-purple border border-purple/20">
                            {experienceItems.whatsIncluded.length} selected
                          </span>
                        </h2>
                        {activeInputCategory !== "whatsIncluded" && (
                          <button
                            type="button"
                            onClick={() => setActiveInputCategory("whatsIncluded")}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple hover:underline cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Add custom</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-2.5">
                        {EXPERIENCE_WHATS_INCLUDED.map((item) => {
                          const Icon = item.icon;
                          const isSelected = experienceItems.whatsIncluded.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleExperienceItem("whatsIncluded", item.id)}
                              className={cn(
                                "flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[84px] sm:min-h-[92px]",
                                isSelected
                                  ? "border-2 border-purple bg-purple/[0.02]"
                                  : "border-neutral-300 hover:border-neutral-900",
                              )}
                            >
                              <Icon
                                className={cn(
                                  "h-7 w-7 mb-2 transition-colors shrink-0",
                                  isSelected ? "text-purple" : "text-neutral-800",
                                )}
                                strokeWidth={1.5}
                              />
                              <span
                                className={cn(
                                  "text-xs font-semibold leading-tight line-clamp-2 text-center transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-900",
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
                                "flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[84px] sm:min-h-[92px]",
                                isSelected
                                  ? "border-2 border-purple bg-purple/[0.02]"
                                  : "border-neutral-300 hover:border-neutral-900",
                              )}
                            >
                              <Sparkles
                                className={cn(
                                  "h-7 w-7 mb-2 transition-colors shrink-0",
                                  isSelected ? "text-purple" : "text-neutral-800",
                                )}
                                strokeWidth={1.5}
                              />
                              <span
                                className={cn(
                                  "text-xs font-semibold leading-tight line-clamp-2 text-center transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-900",
                                )}
                              >
                                {custom}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {activeInputCategory === "whatsIncluded" && (
                        <div className="flex items-center gap-2 max-w-xs mt-1.5 animate-in fade-in duration-100">
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
                            placeholder="e.g. Bush breakfast"
                            className="flex-1 h-8 px-2.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-purple"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleAddCustomItem("whatsIncluded")}
                            className="h-8 px-3 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-hover cursor-pointer"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveInputCategory(null)}
                            className="h-8 px-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* What to Bring / Carry */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                        <h2 className="text-xs sm:text-sm font-semibold text-black tracking-tight flex items-center gap-2">
                          <span>What to Bring / Carry</span>
                          <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-purple/10 text-purple border border-purple/20">
                            {experienceItems.whatToCarry.length} selected
                          </span>
                        </h2>
                        {activeInputCategory !== "whatToCarry" && (
                          <button
                            type="button"
                            onClick={() => setActiveInputCategory("whatToCarry")}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple hover:underline cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Add custom</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-2.5">
                        {EXPERIENCE_WHAT_TO_CARRY.map((item) => {
                          const Icon = item.icon;
                          const isSelected = experienceItems.whatToCarry.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleExperienceItem("whatToCarry", item.id)}
                              className={cn(
                                "flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[84px] sm:min-h-[92px]",
                                isSelected
                                  ? "border-2 border-purple bg-purple/[0.02]"
                                  : "border-neutral-300 hover:border-neutral-900",
                              )}
                            >
                              <Icon
                                className={cn(
                                  "h-7 w-7 mb-2 transition-colors shrink-0",
                                  isSelected ? "text-purple" : "text-neutral-800",
                                )}
                                strokeWidth={1.5}
                              />
                              <span
                                className={cn(
                                  "text-xs font-semibold leading-tight line-clamp-2 text-center transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-900",
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
                                "flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[84px] sm:min-h-[92px]",
                                isSelected
                                  ? "border-2 border-purple bg-purple/[0.02]"
                                  : "border-neutral-300 hover:border-neutral-900",
                              )}
                            >
                              <Sparkles
                                className={cn(
                                  "h-7 w-7 mb-2 transition-colors shrink-0",
                                  isSelected ? "text-purple" : "text-neutral-800",
                                )}
                                strokeWidth={1.5}
                              />
                              <span
                                className={cn(
                                  "text-xs font-semibold leading-tight line-clamp-2 text-center transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-900",
                                )}
                              >
                                {custom}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {activeInputCategory === "whatToCarry" && (
                        <div className="flex items-center gap-2 max-w-xs mt-1.5 animate-in fade-in duration-100">
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
                            placeholder="e.g. Binoculars"
                            className="flex-1 h-8 px-2.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-purple"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleAddCustomItem("whatToCarry")}
                            className="h-8 px-3 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-hover cursor-pointer"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveInputCategory(null)}
                            className="h-8 px-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* What NOT to Bring */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                        <h2 className="text-xs sm:text-sm font-semibold text-black tracking-tight">
                          What NOT to Bring
                        </h2>
                        {activeInputCategory !== "whatNotToBring" && (
                          <button
                            type="button"
                            onClick={() => setActiveInputCategory("whatNotToBring")}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple hover:underline cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Add rule</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-2.5">
                        {EXPERIENCE_WHAT_NOT_TO_BRING.map((item) => {
                          const Icon = item.icon;
                          const isSelected = experienceItems.whatNotToBring.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleExperienceItem("whatNotToBring", item.id)}
                              className={cn(
                                "flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[84px] sm:min-h-[92px]",
                                isSelected
                                  ? "border-2 border-rose-500 bg-rose-50/30"
                                  : "border-neutral-300 hover:border-neutral-900",
                              )}
                            >
                              <Icon
                                className={cn(
                                  "h-7 w-7 mb-2 transition-colors shrink-0",
                                  isSelected ? "text-rose-600" : "text-neutral-800",
                                )}
                                strokeWidth={1.5}
                              />
                              <span
                                className={cn(
                                  "text-xs font-semibold leading-tight line-clamp-2 text-center transition-colors",
                                  isSelected ? "text-rose-600 font-semibold" : "text-neutral-900",
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
                                "flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[84px] sm:min-h-[92px]",
                                isSelected
                                  ? "border-2 border-rose-500 bg-rose-50/30"
                                  : "border-neutral-300 hover:border-neutral-900",
                              )}
                            >
                              <Sparkles
                                className={cn(
                                  "h-7 w-7 mb-2 transition-colors shrink-0",
                                  isSelected ? "text-rose-600" : "text-neutral-800",
                                )}
                                strokeWidth={1.5}
                              />
                              <span
                                className={cn(
                                  "text-xs font-semibold leading-tight line-clamp-2 text-center transition-colors",
                                  isSelected ? "text-rose-600 font-semibold" : "text-neutral-900",
                                )}
                              >
                                {custom}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {activeInputCategory === "whatNotToBring" && (
                        <div className="flex items-center gap-2 max-w-xs mt-1.5 animate-in fade-in duration-100">
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
                            placeholder="e.g. Drones"
                            className="flex-1 h-8 px-2.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-purple"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleAddCustomItem("whatNotToBring")}
                            className="h-8 px-3 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 cursor-pointer"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveInputCategory(null)}
                            className="h-8 px-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Transport Inclusions - Compact Icons with Names Below */}
                {selectedType === "transport" && (
                  <div className="space-y-5">
                    {/* Vehicle Features */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                        <h2 className="text-xs sm:text-sm font-semibold text-black tracking-tight flex items-center gap-2">
                          <span>Vehicle Features &amp; Inclusions</span>
                          <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-purple/10 text-purple border border-purple/20">
                            {transportItems.vehicleFeatures.length} selected
                          </span>
                        </h2>
                        {activeInputCategory !== "vehicleFeatures" && (
                          <button
                            type="button"
                            onClick={() => setActiveInputCategory("vehicleFeatures")}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple hover:underline cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Add custom</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-2.5">
                        {TRANSPORT_FEATURES.map((item) => {
                          const Icon = item.icon;
                          const isSelected = transportItems.vehicleFeatures.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleTransportItem("vehicleFeatures", item.id)}
                              className={cn(
                                "flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[84px] sm:min-h-[92px]",
                                isSelected
                                  ? "border-2 border-purple bg-purple/[0.02]"
                                  : "border-neutral-300 hover:border-neutral-900",
                              )}
                            >
                              <Icon
                                className={cn(
                                  "h-7 w-7 mb-2 transition-colors shrink-0",
                                  isSelected ? "text-purple" : "text-neutral-800",
                                )}
                                strokeWidth={1.5}
                              />
                              <span
                                className={cn(
                                  "text-xs font-semibold leading-tight line-clamp-2 text-center transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-900",
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
                                "flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[84px] sm:min-h-[92px]",
                                isSelected
                                  ? "border-2 border-purple bg-purple/[0.02]"
                                  : "border-neutral-300 hover:border-neutral-900",
                              )}
                            >
                              <Sparkles
                                className={cn(
                                  "h-7 w-7 mb-2 transition-colors shrink-0",
                                  isSelected ? "text-purple" : "text-neutral-800",
                                )}
                                strokeWidth={1.5}
                              />
                              <span
                                className={cn(
                                  "text-xs font-semibold leading-tight line-clamp-2 text-center transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-900",
                                )}
                              >
                                {custom}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {activeInputCategory === "vehicleFeatures" && (
                        <div className="flex items-center gap-2 max-w-xs mt-1.5 animate-in fade-in duration-100">
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
                            placeholder="e.g. Electric Vehicle"
                            className="flex-1 h-8 px-2.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-purple"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleAddCustomItem("vehicleFeatures")}
                            className="h-8 px-3 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-hover cursor-pointer"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveInputCategory(null)}
                            className="h-8 px-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* What to Bring */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                        <h2 className="text-xs sm:text-sm font-semibold text-black tracking-tight flex items-center gap-2">
                          <span>What to Bring</span>
                          <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-purple/10 text-purple border border-purple/20">
                            {transportItems.whatToCarry.length} selected
                          </span>
                        </h2>
                        {activeInputCategory !== "whatToCarryTransport" && (
                          <button
                            type="button"
                            onClick={() => setActiveInputCategory("whatToCarryTransport")}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple hover:underline cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Add custom</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-2.5">
                        {TRANSPORT_WHAT_TO_CARRY.map((item) => {
                          const Icon = item.icon;
                          const isSelected = transportItems.whatToCarry.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleTransportItem("whatToCarry", item.id)}
                              className={cn(
                                "flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[84px] sm:min-h-[92px]",
                                isSelected
                                  ? "border-2 border-purple bg-purple/[0.02]"
                                  : "border-neutral-300 hover:border-neutral-900",
                              )}
                            >
                              <Icon
                                className={cn(
                                  "h-7 w-7 mb-2 transition-colors shrink-0",
                                  isSelected ? "text-purple" : "text-neutral-800",
                                )}
                                strokeWidth={1.5}
                              />
                              <span
                                className={cn(
                                  "text-xs font-semibold leading-tight line-clamp-2 text-center transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-900",
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
                                "flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[84px] sm:min-h-[92px]",
                                isSelected
                                  ? "border-2 border-purple bg-purple/[0.02]"
                                  : "border-neutral-300 hover:border-neutral-900",
                              )}
                            >
                              <Sparkles
                                className={cn(
                                  "h-7 w-7 mb-2 transition-colors shrink-0",
                                  isSelected ? "text-purple" : "text-neutral-800",
                                )}
                                strokeWidth={1.5}
                              />
                              <span
                                className={cn(
                                  "text-xs font-semibold leading-tight line-clamp-2 text-center transition-colors",
                                  isSelected ? "text-purple font-semibold" : "text-neutral-900",
                                )}
                              >
                                {custom}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {activeInputCategory === "whatToCarryTransport" && (
                        <div className="flex items-center gap-2 max-w-xs mt-1.5 animate-in fade-in duration-100">
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
                            placeholder="e.g. Deposit card"
                            className="flex-1 h-8 px-2.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-purple"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleAddCustomItem("whatToCarryTransport")}
                            className="h-8 px-3 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-hover cursor-pointer"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveInputCategory(null)}
                            className="h-8 px-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Guidelines */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                        <h2 className="text-xs sm:text-sm font-semibold text-black tracking-tight flex items-center gap-2">
                          <span>Vehicle Guidelines</span>
                          <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/60">
                            {transportItems.guidelines.length} rules
                          </span>
                        </h2>
                        {activeInputCategory !== "guidelines" && (
                          <button
                            type="button"
                            onClick={() => setActiveInputCategory("guidelines")}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple hover:underline cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Add rule</span>
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-2.5">
                        {TRANSPORT_GUIDELINES.map((item) => {
                          const Icon = item.icon;
                          const isSelected = transportItems.guidelines.includes(item.id);
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => toggleTransportItem("guidelines", item.id)}
                              className={cn(
                                "flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[84px] sm:min-h-[92px]",
                                isSelected
                                  ? "border-2 border-rose-500 bg-rose-50/30"
                                  : "border-neutral-300 hover:border-neutral-900",
                              )}
                            >
                              <Icon
                                className={cn(
                                  "h-7 w-7 mb-2 transition-colors shrink-0",
                                  isSelected ? "text-rose-600" : "text-neutral-800",
                                )}
                                strokeWidth={1.5}
                              />
                              <span
                                className={cn(
                                  "text-xs font-semibold leading-tight line-clamp-2 text-center transition-colors",
                                  isSelected ? "text-rose-600 font-semibold" : "text-neutral-900",
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
                                "flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[84px] sm:min-h-[92px]",
                                isSelected
                                  ? "border-2 border-rose-500 bg-rose-50/30"
                                  : "border-neutral-300 hover:border-neutral-900",
                              )}
                            >
                              <Sparkles
                                className={cn(
                                  "h-7 w-7 mb-2 transition-colors shrink-0",
                                  isSelected ? "text-rose-600" : "text-neutral-800",
                                )}
                                strokeWidth={1.5}
                              />
                              <span
                                className={cn(
                                  "text-xs font-semibold leading-tight line-clamp-2 text-center transition-colors",
                                  isSelected ? "text-rose-600 font-semibold" : "text-neutral-900",
                                )}
                              >
                                {custom}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {activeInputCategory === "guidelines" && (
                        <div className="flex items-center gap-2 max-w-xs mt-1.5 animate-in fade-in duration-100">
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
                            placeholder="e.g. No strong food odors"
                            className="flex-1 h-8 px-2.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-purple"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleAddCustomItem("guidelines")}
                            className="h-8 px-3 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 cursor-pointer"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveInputCategory(null)}
                            className="h-8 px-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer Controls for Step 3: Sends to Backend and advances to Step 4 */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-100">
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
              /* STEP 4: LOCATION (CLEAN, COMPACT, NO SATELLITE / USELESS CLUTTER)          */
              /* ========================================================================= */
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-black leading-snug">
                      Location details
                    </h1>
                    <p className="text-xs text-black-subtle mt-0.5">
                      Specify the town and pinpoint the map coordinates.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-800">
                    <span>🇿🇲</span> Zambia
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Province, City, Town/District, Address in a compact responsive row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Province */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-800">
                        Province <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={province}
                        onChange={(e) => handleProvinceChange(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 transition-all cursor-pointer"
                      >
                        {ZAMBIA_PROVINCES.map((p) => (
                          <option key={p.name} value={p.name}>
                            {p.name} Province
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* City / Town */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-800">
                        City / Town <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder={`e.g. ${currentProvinceData.popularCities[0] || "Lusaka"}`}
                        list="popular-cities-list"
                        className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 transition-all"
                      />
                      <datalist id="popular-cities-list">
                        {currentProvinceData.popularCities.map((c) => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                    </div>

                    {/* District or Exact Town */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-800">
                        Town / District <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="e.g. Woodlands, Riverside"
                        className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 transition-all"
                      />
                    </div>

                    {/* Street Address / Directions */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-800">
                        Street / Landmark{" "}
                        <span className="text-neutral-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. Plot 4921, Lake Road"
                        className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Google Maps Coordinates Picker */}
                  <div className="pt-1">
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

                {/* Footer Controls for Step 4 */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-100">
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
              /* STEP 5: UPLOADS & MEDIA (SPACE-OPTIMIZED, 1-ROW 5-SLOT GRID)               */
              /* ========================================================================= */
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-black leading-snug">
                      Photos &amp; media
                    </h1>
                    <p className="text-xs text-black-subtle mt-0.5">
                      Upload clear quality or professionally taken images (up to 5 max).
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-purple bg-purple/10 px-2.5 py-1 rounded-full border border-purple/20">
                    {images.length}/5 photos
                  </span>
                </div>

                {/* Upload Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* 5-Slot Grid: Displaying all 5 photo slots cleanly */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
                  {images.map((imgUrl, index) => {
                    const isCover = index === 0;
                    return (
                      <div
                        key={index}
                        className={cn(
                          "group relative aspect-4/3 rounded-xl overflow-hidden border bg-neutral-100 shadow-2xs transition-all",
                          isCover ? "border-purple ring-2 ring-purple/20" : "border-neutral-200",
                        )}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgUrl}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {isCover && (
                          <div className="absolute top-1.5 left-1.5 bg-purple text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-1">
                            <Star className="h-2.5 w-2.5 fill-white" />
                            <span>Cover</span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                          {!isCover && (
                            <button
                              type="button"
                              title="Make Cover Photo"
                              onClick={() => handleSetCoverPhoto(index)}
                              className="h-7 w-7 rounded-lg bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                            >
                              <Star className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            title="Remove photo"
                            onClick={() => handleRemoveImage(index)}
                            className="h-7 w-7 rounded-lg bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Empty slots up to 5 */}
                  {Array.from({ length: 5 - images.length }).map((_, i) => (
                    <button
                      key={`empty-${i}`}
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-4/3 rounded-xl border border-dashed border-neutral-300 hover:border-purple/50 hover:bg-neutral-50/70 flex flex-col items-center justify-center text-neutral-400 hover:text-purple transition-all cursor-pointer"
                    >
                      <Plus className="h-4 w-4 mb-0.5" />
                      <span className="text-[10px] font-medium">Slot #{images.length + i + 1}</span>
                    </button>
                  ))}
                </div>

                {/* Compact Drag-and-drop / select bar */}
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
                    "border border-dashed rounded-xl py-4 px-4 text-center transition-all cursor-pointer flex items-center justify-between gap-3",
                    images.length >= 5
                      ? "border-neutral-200 bg-neutral-50/50 opacity-60 cursor-not-allowed"
                      : isDragging
                        ? "border-purple bg-purple/5"
                        : "border-neutral-300 hover:border-purple/40 hover:bg-neutral-50/50",
                  )}
                >
                  <div className="flex items-center gap-2.5 text-left">
                    <div className="h-8 w-8 rounded-lg bg-purple/10 text-purple flex items-center justify-center shrink-0">
                      <UploadCloud className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-800">
                        {images.length >= 5
                          ? "Maximum 5 photos uploaded"
                          : "Drag photos here or click to browse"}
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        Supports high-resolution JPG, PNG or WebP
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {images.length === 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLoadSamplePhotos();
                        }}
                        className="h-8 px-3 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-[11px] font-semibold text-neutral-700 transition-colors cursor-pointer"
                      >
                        Sample photos
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={images.length >= 5}
                      className={cn(
                        "h-8 px-3.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer",
                        images.length >= 5
                          ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                          : "bg-purple text-white hover:bg-purple-hover",
                      )}
                    >
                      <Plus className="h-3 w-3" />
                      <span>Browse</span>
                    </button>
                  </div>
                </div>

                {/* Footer Controls for Step 5 */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-100">
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
              /* STEP 6: NAME & DESCRIPTION (MAXIMUM OF 300 WORDS, NO CLUTTER)             */
              /* ========================================================================= */
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="mb-2">
                  <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-black leading-snug">
                    Name and description
                  </h1>
                  <p className="text-xs text-black-subtle mt-0.5">
                    Provide a clear title and description (maximum 300 words).
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Listing Name / Title */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-neutral-800">
                        Listing Name / Title <span className="text-rose-500">*</span>
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
                            ? "e.g. South Luangwa Walking Safari"
                            : "e.g. VIP Airport Transfer & Chauffeur"
                      }
                      className="w-full h-10 px-3.5 rounded-xl border border-neutral-200 bg-white text-xs sm:text-sm font-medium text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 transition-all"
                    />
                  </div>

                  {/* Description with 300 Words Maximum Limit */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-neutral-800">
                        Description <span className="text-rose-500">*</span>
                      </label>

                      <span
                        className={cn(
                          "text-[11px] px-2 py-0.5 rounded-full border transition-all font-medium",
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

                    <textarea
                      rows={6}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={
                        selectedType === "stay"
                          ? "Describe your lodge or stay, room layout, scenic views, safari surroundings, and amenities..."
                          : selectedType === "experience"
                            ? "Describe what makes this experience memorable, guided itinerary, and equipment provided..."
                            : "Describe vehicle features, comfort, luggage capacity, and professional chauffeur service..."
                      }
                      className={cn(
                        "w-full p-3 rounded-xl border bg-white text-xs sm:text-sm font-normal text-neutral-900 focus:outline-none transition-all leading-relaxed resize-y",
                        isDescriptionOverLimit
                          ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-200"
                          : "border-neutral-200 focus:border-purple focus:ring-1 focus:ring-purple/20",
                      )}
                    />

                    <div className="flex items-center justify-between pt-0.5 text-[11px]">
                      {isDescriptionOverLimit ? (
                        <p className="text-rose-500 font-semibold">
                          Description exceeds 300 words. Please trim to proceed.
                        </p>
                      ) : (
                        <p className="text-neutral-400">Maximum 300 words.</p>
                      )}
                      {!isDescriptionOverLimit && descriptionWordCount > 0 && (
                        <span className="text-neutral-400">
                          {300 - descriptionWordCount} words remaining
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Controls for Step 6 */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-100">
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
              /* STEP 7: PRICING & CONDITIONAL DISCOUNTS (COMPACT & CLEAN)                 */
              /* ========================================================================= */
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="mb-2">
                  <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-black leading-snug">
                    Price &amp; conditional discounts
                  </h1>
                  <p className="text-xs text-black-subtle mt-0.5">
                    Set your standard price and configure optional conditional discounts.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Standard Base Price Card */}
                  <div className="p-4 sm:p-5 rounded-xl border border-neutral-200/80 bg-white">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 flex items-center gap-1.5">
                          <Tag className="h-3.5 w-3.5 text-purple" />
                          <span>Standard Rate</span>
                        </h3>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Regular price per{" "}
                          {selectedType === "stay"
                            ? "night"
                            : selectedType === "experience"
                              ? "person"
                              : "trip"}{" "}
                          before discounts.
                        </p>
                      </div>

                      {/* Currency Selector */}
                      <div className="flex items-center gap-1 p-0.5 bg-neutral-100 rounded-lg border border-neutral-200 shrink-0 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setCurrency("ZMW")}
                          className={cn(
                            "px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer",
                            currency === "ZMW"
                              ? "bg-white text-purple shadow-2xs"
                              : "text-neutral-600 hover:text-black",
                          )}
                        >
                          🇿🇲 ZMW
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrency("USD")}
                          className={cn(
                            "px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer",
                            currency === "USD"
                              ? "bg-white text-purple shadow-2xs"
                              : "text-neutral-600 hover:text-black",
                          )}
                        >
                          💵 USD
                        </button>
                      </div>
                    </div>

                    <div className="max-w-xs mt-3">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                          {currency === "ZMW" ? "K" : "$"}
                        </span>
                        <input
                          type="number"
                          min={1}
                          step={currency === "ZMW" ? 50 : 5}
                          value={basePrice || ""}
                          onChange={(e) => setBasePrice(Math.max(0, Number(e.target.value)))}
                          placeholder="e.g. 1500"
                          className="w-full h-10 pl-8 pr-16 rounded-xl border border-neutral-200 bg-white text-sm font-semibold text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 transition-all"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-neutral-400 font-medium">
                          /
                          {selectedType === "stay"
                            ? "night"
                            : selectedType === "experience"
                              ? "guest"
                              : "trip"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Conditional Discounts */}
                  <div className="space-y-3">
                    {/* DISCOUNT 1: 10 or more people */}
                    <div
                      className={cn(
                        "rounded-xl border p-4 transition-all duration-150 bg-white",
                        groupDiscountEnabled
                          ? "border-purple ring-1 ring-purple/10"
                          : "border-neutral-200/80 hover:border-neutral-300",
                      )}
                    >
                      <label className="flex items-center justify-between cursor-pointer select-none">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={groupDiscountEnabled}
                            onChange={(e) => setGroupDiscountEnabled(e.target.checked)}
                            className="h-4 w-4 rounded border-neutral-300 text-purple focus:ring-purple/20 cursor-pointer accent-purple"
                          />
                          <div>
                            <span
                              className={cn(
                                "text-xs sm:text-sm font-semibold transition-colors",
                                groupDiscountEnabled ? "text-purple" : "text-black",
                              )}
                            >
                              Conditional discount for 10 or more people
                            </span>
                            <p className="text-[11px] text-neutral-500">
                              Applies automatically when booking reaches 10+ people.
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple/10 text-purple border border-purple/20 shrink-0">
                          10+ Guests
                        </span>
                      </label>

                      {groupDiscountEnabled && (
                        <div className="mt-3 pt-3 border-t border-neutral-100 space-y-3 animate-in fade-in duration-100">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-semibold text-neutral-800">
                                Discount Mode
                              </label>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setGroupDiscountType("percent")}
                                  className={cn(
                                    "flex-1 h-8 rounded-lg text-xs font-semibold border transition-all cursor-pointer",
                                    groupDiscountType === "percent"
                                      ? "bg-purple text-white border-purple"
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
                                    "flex-1 h-8 rounded-lg text-xs font-semibold border transition-all cursor-pointer",
                                    groupDiscountType === "fixed"
                                      ? "bg-purple text-white border-purple"
                                      : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50",
                                  )}
                                >
                                  Custom Price
                                </button>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[11px] font-semibold text-neutral-800">
                                {groupDiscountType === "percent"
                                  ? "Discount Percentage"
                                  : `Promo Price (${currency})`}
                              </label>
                              {groupDiscountType === "percent" ? (
                                <div className="flex items-center gap-2">
                                  <div className="relative flex-1">
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
                                      className="w-full h-8 px-3 pr-7 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-900 focus:outline-none focus:border-purple"
                                    />
                                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                                      %
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {[10, 15, 20].map((pct) => (
                                      <button
                                        key={pct}
                                        type="button"
                                        onClick={() => setGroupDiscountPercent(pct)}
                                        className={cn(
                                          "px-2 py-1 rounded text-[10px] font-semibold border cursor-pointer",
                                          groupDiscountPercent === pct
                                            ? "bg-purple text-white border-purple"
                                            : "bg-neutral-50 text-neutral-600 border-neutral-200",
                                        )}
                                      >
                                        {pct}%
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="relative">
                                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
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
                                    className="w-full h-8 pl-6 pr-3 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-900 focus:outline-none focus:border-purple"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="p-2.5 rounded-lg bg-purple/[0.04] border border-purple/15 flex items-center justify-between text-xs">
                            <span className="text-neutral-600">Promo Rate for 10+ Guests:</span>
                            <div className="flex items-center gap-2">
                              <span className="line-through text-neutral-400">
                                {currency === "ZMW" ? "K" : "$"}
                                {basePrice.toLocaleString()}
                              </span>
                              <span className="font-bold text-purple">
                                {currency === "ZMW" ? "K" : "$"}
                                {effectiveGroupPromoPrice.toLocaleString()}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                                Save {currency === "ZMW" ? "K" : "$"}
                                {(basePrice - effectiveGroupPromoPrice).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* DISCOUNT 2: stays more than 7 days */}
                    <div
                      className={cn(
                        "rounded-xl border p-4 transition-all duration-150 bg-white",
                        extendedStayDiscountEnabled
                          ? "border-purple ring-1 ring-purple/10"
                          : "border-neutral-200/80 hover:border-neutral-300",
                      )}
                    >
                      <label className="flex items-center justify-between cursor-pointer select-none">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={extendedStayDiscountEnabled}
                            onChange={(e) => setExtendedStayDiscountEnabled(e.target.checked)}
                            className="h-4 w-4 rounded border-neutral-300 text-purple focus:ring-purple/20 cursor-pointer accent-purple"
                          />
                          <div>
                            <span
                              className={cn(
                                "text-xs sm:text-sm font-semibold transition-colors",
                                extendedStayDiscountEnabled ? "text-purple" : "text-black",
                              )}
                            >
                              Conditional discount for stays more than 7 days
                            </span>
                            <p className="text-[11px] text-neutral-500">
                              Applies automatically when booking reaches 7 or more days.
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple/10 text-purple border border-purple/20 shrink-0">
                          7+ Days
                        </span>
                      </label>

                      {extendedStayDiscountEnabled && (
                        <div className="mt-3 pt-3 border-t border-neutral-100 space-y-3 animate-in fade-in duration-100">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-[11px] font-semibold text-neutral-800">
                                Discount Mode
                              </label>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setExtendedStayDiscountType("percent")}
                                  className={cn(
                                    "flex-1 h-8 rounded-lg text-xs font-semibold border transition-all cursor-pointer",
                                    extendedStayDiscountType === "percent"
                                      ? "bg-purple text-white border-purple"
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
                                    "flex-1 h-8 rounded-lg text-xs font-semibold border transition-all cursor-pointer",
                                    extendedStayDiscountType === "fixed"
                                      ? "bg-purple text-white border-purple"
                                      : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50",
                                  )}
                                >
                                  Custom Price
                                </button>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[11px] font-semibold text-neutral-800">
                                {extendedStayDiscountType === "percent"
                                  ? "Discount Percentage"
                                  : `Promo Price (${currency})`}
                              </label>
                              {extendedStayDiscountType === "percent" ? (
                                <div className="flex items-center gap-2">
                                  <div className="relative flex-1">
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
                                      className="w-full h-8 px-3 pr-7 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-900 focus:outline-none focus:border-purple"
                                    />
                                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                                      %
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {[5, 10, 15].map((pct) => (
                                      <button
                                        key={pct}
                                        type="button"
                                        onClick={() => setExtendedStayDiscountPercent(pct)}
                                        className={cn(
                                          "px-2 py-1 rounded text-[10px] font-semibold border cursor-pointer",
                                          extendedStayDiscountPercent === pct
                                            ? "bg-purple text-white border-purple"
                                            : "bg-neutral-50 text-neutral-600 border-neutral-200",
                                        )}
                                      >
                                        {pct}%
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="relative">
                                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
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
                                    className="w-full h-8 pl-6 pr-3 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-900 focus:outline-none focus:border-purple"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="p-2.5 rounded-lg bg-purple/[0.04] border border-purple/15 flex items-center justify-between text-xs">
                            <span className="text-neutral-600">Promo Rate for 7+ Days:</span>
                            <div className="flex items-center gap-2">
                              <span className="line-through text-neutral-400">
                                {currency === "ZMW" ? "K" : "$"}
                                {basePrice.toLocaleString()}
                              </span>
                              <span className="font-bold text-purple">
                                {currency === "ZMW" ? "K" : "$"}
                                {effectiveExtendedStayPromoPrice.toLocaleString()}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                                Save {currency === "ZMW" ? "K" : "$"}
                                {(basePrice - effectiveExtendedStayPromoPrice).toLocaleString()} /
                                unit
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Controls for Step 7: Completes creation */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-100">
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
