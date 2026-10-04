import apiClient from "./client";
import type { Stay, Transport, Experience, Package, ExperienceCategory } from "@/lib/mock-data";

export interface BackendListing {
  id: string;
  type: "stay" | "experience" | "transport" | "package";
  status: string;
  name: string;
  title?: string;
  description: string;
  location: string;
  city?: string;
  province?: string;
  price: number;
  priceFormatted?: string;
  rating: number;
  reviewCount?: number;
  reviews?: number;
  thumbnailUrl?: string;
  featuredImage?: string;
  image?: string;
  images?: Array<{ url: string; sortOrder?: number } | string>;
  amenities?: Array<{ name: string; icon?: string | null } | string>;
  rules?: string[];
  hostId?: string;
  hostName?: string;
  hostAvatar?: string | null;
  host?: {
    id: string;
    name: string;
    avatarUrl?: string | null;
    superhost?: boolean;
  };
  meetingPoint?: string | null;
  meetingPointAddress?: string | null;
  itinerary?: Array<{ time: string; title: string; description: string }>;
  slots?: Array<{ id: string; label: string; capacity?: number; timeSlot?: string }>;
  timeSlots?: string[];
  inclusions?: string[];
  whatsIncluded?: string[];
  whatsNotIncluded?: string[];
  exclusions?: string[];
  whatToBring?: string[];
  whatNotToBring?: string[];
  importantInformation?: string[];
  guidelines?: string[];
  notSuitableFor?: string[];
  stays?: Array<{
    id: string;
    name: string;
    description?: string;
    price: number;
    roomType?: string;
    bedrooms?: number;
    beds?: number;
    baths?: number;
    maxGuests?: number;
    checkInFrom?: string;
    checkInUntil?: string;
    checkOutBefore?: string;
    cancellationPolicy?: string;
    isActive?: boolean;
  }>;
  experiences?: Array<{
    id: string;
    name: string;
    description?: string;
    price: number;
    activityType?: string;
    duration?: string;
    maxParticipants?: number;
    difficultyLevel?: string;
    meetingPoint?: string;
    meetingPointAddress?: string;
    isActive?: boolean;
    slots?: Array<any>;
    itinerary?: Array<any>;
    inclusions?: string[];
    whatsIncluded?: string[];
    whatsNotIncluded?: string[];
    whatToBring?: string[];
  }>;
  transports?: Array<{
    id: string;
    name: string;
    description?: string;
    from?: string;
    to?: string;
    vehicleType?: string;
    capacity?: number;
    pricePerSeat?: number;
    priceFormatted?: string;
    schedule?: {
      duration?: string;
      rateUnit?: "trip" | "day";
      departures?: string;
      departureTime?: string;
      arrivalTime?: string;
    };
    isActive?: boolean;
  }>;
}

export function mapListingToStay(item: BackendListing): Stay {
  const staySub = item.stays?.[0];
  const images = (item.images || [])
    .map((img) => (typeof img === "string" ? img : img.url))
    .filter(Boolean);
  const primaryImg =
    item.featuredImage ||
    item.thumbnailUrl ||
    item.image ||
    images[0] ||
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80";

  const amenities = (item.amenities || [])
    .map((a) => (typeof a === "string" ? a : a.name))
    .filter(Boolean);

  return {
    id: item.id,
    name: item.name || item.title || "Stay in Zambia",
    location:
      item.location ||
      (item.city && item.province ? `${item.city}, ${item.province}` : item.city || "Zambia"),
    rating: Number(item.rating) || 0,
    reviews: Number(item.reviewCount ?? item.reviews) || 0,
    price:
      item.price || (item.priceFormatted ? Number(item.priceFormatted.replace(/[^0-9.]/g, "")) : 0),
    image: primaryImg,
    images: images.length > 0 ? images : [primaryImg],
    amenities: amenities.length > 0 ? amenities : ["WiFi", "Breakfast", "En-suite Bath"],
    type: staySub?.roomType || "Lodge",
    description: item.description || staySub?.description || "",
    beds: staySub?.beds ?? 1,
    baths: staySub?.baths ?? 1,
    guests: staySub?.maxGuests ?? 2,
    checkInRules: item.rules || ["Check-in from 14:00", "Check-out by 11:00"],
    checkOutRules: ["Please leave keys with reception"],
    roomTypes: item.stays as any,
  };
}

export function mapListingToExperience(item: BackendListing): Experience {
  const expSub = item.experiences?.[0];
  const images = (item.images || [])
    .map((img) => (typeof img === "string" ? img : img.url))
    .filter(Boolean);
  const primaryImg =
    item.featuredImage ||
    item.thumbnailUrl ||
    item.image ||
    images[0] ||
    "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80";

  const category = (expSub?.activityType?.toLowerCase() ||
    "adventure") as ExperienceCategory;

  return {
    id: item.id,
    name: item.name || item.title || "Zambian Experience",
    location:
      item.location ||
      (item.city && item.province ? `${item.city}, ${item.province}` : item.city || "Zambia"),
    rating: Number(item.rating) || 0,
    reviews: Number(item.reviewCount ?? item.reviews) || 0,
    price:
      item.price || (item.priceFormatted ? Number(item.priceFormatted.replace(/[^0-9.]/g, "")) : 0),
    image: primaryImg,
    category:
      category === "water" ||
      category === "wildlife" ||
      category === "cultural" ||
      category === "farm" ||
      category === "industrial"
        ? category
        : "adventure",
    duration: expSub?.duration || "2–3 hours",
    groupSize: expSub?.maxParticipants ? `Up to ${expSub.maxParticipants} guests` : "Up to 8 guests",
    description: item.description || expSub?.description || "",
    meetingPoint:
      expSub?.meetingPoint || item.meetingPoint || item.meetingPointAddress || item.location,
    meetingPointAddress: expSub?.meetingPointAddress || item.meetingPointAddress || item.location,
    whatsIncluded: expSub?.whatsIncluded || item.whatsIncluded || item.inclusions || [],
    whatsNotIncluded: expSub?.whatsNotIncluded || item.whatsNotIncluded || item.exclusions || [],
    whatToBring: expSub?.whatToBring || item.whatToBring || [
      "Comfortable Walking Shoes",
      "Camera or Smartphone",
      "Sun Protection & Hat",
    ],
    whatNotToBring: item.whatNotToBring || ["Unauthorized Drones", "Pets"],
    itinerary: (expSub?.itinerary || item.itinerary || []) as any,
  };
}

export function mapListingToTransport(item: BackendListing): Transport {
  const transSub = item.transports?.[0];
  const primaryImg =
    item.featuredImage ||
    item.thumbnailUrl ||
    item.image ||
    (typeof item.images?.[0] === "string" ? item.images[0] : item.images?.[0]?.url) ||
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80";

  return {
    id: item.id,
    from: transSub?.from || item.city || "Lusaka",
    to: transSub?.to || item.location || "Livingstone",
    operator: transSub?.vehicleType || item.name || "Nearby Escapes Transport",
    duration: transSub?.schedule?.duration || "Daily / On-demand",
    departures: transSub?.schedule?.departures || "Daily",
    price:
      item.price || (item.priceFormatted ? Number(item.priceFormatted.replace(/[^0-9.]/g, "")) : 0),
    image: primaryImg,
    departureTime: transSub?.schedule?.departureTime || "08:00 AM",
    arrivalTime: transSub?.schedule?.arrivalTime || "02:00 PM",
    rateUnit: transSub?.schedule?.rateUnit || "trip",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// API Fetchers
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchStays(query?: {
  q?: string;
  city?: string;
  province?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
}): Promise<Stay[]> {
  try {
    const params: Record<string, any> = { type: "stay", limit: query?.limit || 50 };
    if (query?.q) params.q = query.q;
    if (query?.city) params.city = query.city;
    if (query?.province) params.province = query.province;

    const res = await apiClient.get<{ data: BackendListing[] }>("/listings", { params });
    const items = res.data?.data || (Array.isArray(res.data) ? res.data : []);
    return items.map(mapListingToStay);
  } catch (err) {
    console.error("fetchStays API error:", err);
    return [];
  }
}

export async function fetchStayById(id: string): Promise<Stay | null> {
  try {
    const res = await apiClient.get<BackendListing>(`/listings/${id}`);
    if (!res.data) return null;
    return mapListingToStay(res.data);
  } catch (err) {
    console.error(`fetchStayById(${id}) API error:`, err);
    return null;
  }
}

export async function fetchExperiences(query?: {
  q?: string;
  category?: string;
  province?: string;
  limit?: number;
}): Promise<Experience[]> {
  try {
    const params: Record<string, any> = { type: "experience", limit: query?.limit || 50 };
    if (query?.q) params.q = query.q;
    if (query?.category && query.category !== "all") params.category = query.category;

    const res = await apiClient.get<{ data: BackendListing[] }>("/listings", { params });
    const items = res.data?.data || (Array.isArray(res.data) ? res.data : []);
    return items.map(mapListingToExperience);
  } catch (err) {
    console.error("fetchExperiences API error:", err);
    return [];
  }
}

export async function fetchExperienceById(id: string): Promise<Experience | null> {
  try {
    const res = await apiClient.get<BackendListing>(`/listings/${id}`);
    if (!res.data) return null;
    return mapListingToExperience(res.data);
  } catch (err) {
    console.error(`fetchExperienceById(${id}) API error:`, err);
    return null;
  }
}

export async function fetchTransports(query?: {
  q?: string;
  from?: string;
  to?: string;
  limit?: number;
}): Promise<Transport[]> {
  try {
    const params: Record<string, any> = { type: "transport", limit: query?.limit || 50 };
    if (query?.q) params.q = query.q;

    const res = await apiClient.get<{ data: BackendListing[] }>("/listings", { params });
    const items = res.data?.data || (Array.isArray(res.data) ? res.data : []);
    return items.map(mapListingToTransport);
  } catch (err) {
    console.error("fetchTransports API error:", err);
    return [];
  }
}

export async function fetchTransportById(id: string): Promise<Transport | null> {
  try {
    const res = await apiClient.get<BackendListing>(`/listings/${id}`);
    if (!res.data) return null;
    return mapListingToTransport(res.data);
  } catch (err) {
    console.error(`fetchTransportById(${id}) API error:`, err);
    return null;
  }
}

export async function fetchAllListings(): Promise<{
  stays: Stay[];
  experiences: Experience[];
  transports: Transport[];
}> {
  try {
    const [stays, experiences, transports] = await Promise.all([
      fetchStays({ limit: 50 }),
      fetchExperiences({ limit: 50 }),
      fetchTransports({ limit: 50 }),
    ]);
    return { stays, experiences, transports };
  } catch (err) {
    console.error("fetchAllListings error:", err);
    return { stays: [], experiences: [], transports: [] };
  }
}
