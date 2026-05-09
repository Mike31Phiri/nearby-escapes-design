// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — single source of truth for testing
// When backend is ready: replace each exported array/function with the
// corresponding apiRequest call from src/api/* and delete this file.
// ─────────────────────────────────────────────────────────────────────────────

import type { Stay } from "@/types/stay";
import type { Booking } from "@/types/booking";

// ── Images ────────────────────────────────────────────────────────────────────
const IMG = {
  lodge: "/images/listing-lodge.jpg",
  hotel: "/images/listing-hotel.jpg",
  camp: "/images/listing-camp.jpg",
  guesthouse: "/images/listing-guesthouse.jpg",
  hero: "/images/hero-zambia.jpg",
};

// ── Stays ─────────────────────────────────────────────────────────────────────
// Backend: GET /stays  →  Stay[]
// Backend: GET /stays/:id  →  Stay
export const mockStays: Stay[] = [
  {
    id: "mosi-oa-tunya-lodge",
    name: "Mosi-oa-Tunya Lodge",
    location: "Livingstone",
    price: 220,
    priceZmw: 3960,
    rating: 4.9,
    reviews: 312,
    image: IMG.lodge,
    images: [IMG.lodge, IMG.hotel, IMG.camp, IMG.guesthouse, IMG.hero],
    category: "Lodge",
    description: "Luxury riverside lodge with views of the mighty Victoria Falls.",
    amenities: ["Fast Wi-Fi", "Free parking", "Breakfast included", "Garden & deck", "Plunge pool", "24/7 security"],
    maxGuests: 6,
    host: { id: "host-1", displayName: "Chanda Mwenya", location: "Lusaka, Zambia", verified: true },
  },
  {
    id: "lusaka-skyline-suite",
    name: "Skyline Boutique Suite",
    location: "Lusaka",
    price: 145,
    priceZmw: 2610,
    rating: 4.7,
    reviews: 198,
    image: IMG.hotel,
    images: [IMG.hotel, IMG.lodge, IMG.camp, IMG.guesthouse, IMG.hero],
    category: "Hotel",
    description: "Modern boutique hotel in the heart of Lusaka's business district.",
    amenities: ["Fast Wi-Fi", "Free parking", "Room service", "Gym", "Conference room"],
    maxGuests: 2,
    host: { id: "host-2", displayName: "Bwalya Mutale", location: "Lusaka, Zambia", verified: true },
  },
  {
    id: "luangwa-tented-camp",
    name: "Luangwa Tented Camp",
    location: "South Luangwa",
    price: 310,
    priceZmw: 5580,
    rating: 4.95,
    reviews: 421,
    image: IMG.camp,
    images: [IMG.camp, IMG.lodge, IMG.hotel, IMG.guesthouse, IMG.hero],
    category: "Camp",
    description: "Authentic safari tented camp deep in South Luangwa National Park.",
    amenities: ["Game drives", "Bush dinners", "Walking safaris", "All meals", "Laundry"],
    maxGuests: 4,
    host: { id: "host-3", displayName: "Mwamba Kapata", location: "Chipata, Zambia", verified: true },
  },
  {
    id: "zambezi-riverside",
    name: "Zambezi Riverside House",
    location: "Lower Zambezi",
    price: 175,
    priceZmw: 3150,
    rating: 4.8,
    reviews: 256,
    image: IMG.guesthouse,
    images: [IMG.guesthouse, IMG.lodge, IMG.hotel, IMG.camp, IMG.hero],
    category: "Guesthouse",
    description: "Peaceful wooden guesthouse on the banks of the Zambezi.",
    amenities: ["River views", "Canoe hire", "Breakfast included", "Free parking", "Garden"],
    maxGuests: 8,
    host: { id: "host-4", displayName: "Thandiwe Phiri", location: "Lusaka, Zambia", verified: false },
  },
  {
    id: "kafue-eco-lodge",
    name: "Kafue Eco Lodge",
    location: "Kafue",
    price: 195,
    priceZmw: 3510,
    rating: 4.85,
    reviews: 174,
    image: IMG.lodge,
    images: [IMG.lodge, IMG.camp, IMG.hotel, IMG.guesthouse, IMG.hero],
    category: "Lodge",
    description: "Sustainable eco lodge surrounded by Kafue National Park.",
    amenities: ["Solar power", "Organic meals", "Game drives", "Bird watching", "Pool"],
    maxGuests: 6,
    host: { id: "host-5", displayName: "Kelvin Banda", location: "Kafue, Zambia", verified: true },
  },
  {
    id: "ndola-business-hotel",
    name: "Copperbelt Business Hotel",
    location: "Ndola",
    price: 110,
    priceZmw: 1980,
    rating: 4.5,
    reviews: 142,
    image: IMG.hotel,
    images: [IMG.hotel, IMG.lodge, IMG.guesthouse, IMG.camp, IMG.hero],
    category: "Hotel",
    description: "Comfortable business-class hotel in central Ndola.",
    amenities: ["Fast Wi-Fi", "Conference rooms", "Restaurant", "Gym", "Airport shuttle"],
    maxGuests: 2,
    host: { id: "host-6", displayName: "Nkandu Luo", location: "Ndola, Zambia", verified: true },
  },
  {
    id: "chipata-bush-camp",
    name: "Chipata Bush Camp",
    location: "Chipata",
    price: 130,
    priceZmw: 2340,
    rating: 4.6,
    reviews: 98,
    image: IMG.camp,
    images: [IMG.camp, IMG.lodge, IMG.hotel, IMG.guesthouse, IMG.hero],
    category: "Camp",
    description: "Rustic bush camp gateway to South Luangwa adventures.",
    amenities: ["Bush walks", "Campfire", "Meals included", "Game drives", "Free parking"],
    maxGuests: 4,
    host: { id: "host-7", displayName: "Chisomo Daka", location: "Chipata, Zambia", verified: false },
  },
  {
    id: "kitwe-garden-stay",
    name: "Kitwe Garden Stay",
    location: "Kitwe",
    price: 95,
    priceZmw: 1710,
    rating: 4.4,
    reviews: 87,
    image: IMG.guesthouse,
    images: [IMG.guesthouse, IMG.hotel, IMG.lodge, IMG.camp, IMG.hero],
    category: "Guesthouse",
    description: "Cozy garden guesthouse perfect for family getaways.",
    amenities: ["Garden", "Breakfast included", "Free parking", "Kids play area", "BBQ"],
    maxGuests: 6,
    host: { id: "host-8", displayName: "Mutinta Hichilema", location: "Kitwe, Zambia", verified: true },
  },
];

export const getListing = (id: string) => mockStays.find((s) => s.id === id);

// ── Transport / Bus Routes ────────────────────────────────────────────────────
// Backend: GET /transport  →  Transport[]
export type MockTransport = {
  id: string;
  from: string;
  to: string;
  duration: string;
  price: number;
  operator: string;
  departures: string;
  image: string;
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
  busType: string;
  amenities: string[];
};

export const mockTransport: MockTransport[] = [
  {
    id: "lusaka-livingstone",
    from: "Lusaka",
    to: "Livingstone",
    duration: "6h 30m",
    price: 180,
    operator: "Mazhandu Family Bus",
    departures: "4 daily",
    image: "https://images.pexels.com/photos/2166936/pexels-photo-2166936?auto=compress&fit=crop&w=400&h=250",
    departureTime: "06:00",
    arrivalTime: "12:30",
    availableSeats: 23,
    busType: "Luxury Coach",
    amenities: ["AC", "USB Charging", "Reclining Seats"],
  },
  {
    id: "lusaka-kitwe",
    from: "Lusaka",
    to: "Kitwe",
    duration: "7h",
    price: 200,
    operator: "Power Tools Bus",
    departures: "3 daily",
    image: "https://images.pexels.com/photos/2199357/pexels-photo-2199357?auto=compress&fit=crop&w=400&h=250",
    departureTime: "07:00",
    arrivalTime: "14:00",
    availableSeats: 15,
    busType: "Standard",
    amenities: ["AC", "Storage"],
  },
  {
    id: "lusaka-chipata",
    from: "Lusaka",
    to: "Chipata",
    duration: "5h 45m",
    price: 160,
    operator: "Jonda Bus Services",
    departures: "2 daily",
    image: "https://images.pexels.com/photos/2422533/pexels-photo-2422533?auto=compress&fit=crop&w=400&h=250",
    departureTime: "08:00",
    arrivalTime: "13:45",
    availableSeats: 8,
    busType: "Premium",
    amenities: ["WiFi", "AC", "USB Charging", "Snacks"],
  },
];

// ── Attractions / Experiences ─────────────────────────────────────────────────
// Backend: GET /experiences  →  Experience[]
export type MockExperience = {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  description: string;
  duration: string;
  includes: string[];
};

export const mockExperiences: MockExperience[] = [
  {
    id: "vic-falls",
    name: "Victoria Falls",
    location: "Livingstone",
    rating: 4.9,
    reviews: 1240,
    price: 35,
    image: "https://images.pexels.com/photos/2166936/pexels-photo-2166936?auto=compress&fit=crop&w=400&h=300",
    description: "Witness one of the Seven Natural Wonders of the World.",
    duration: "Half day",
    includes: ["Guide", "Entry fee", "Transport"],
  },
  {
    id: "south-luangwa-safari",
    name: "South Luangwa Safari",
    location: "Chipata",
    rating: 4.8,
    reviews: 876,
    price: 120,
    image: "https://images.pexels.com/photos/2199357/pexels-photo-2199357?auto=compress&fit=crop&w=400&h=300",
    description: "Game drives through one of Africa's finest wildlife sanctuaries.",
    duration: "Full day",
    includes: ["Guide", "Game drive vehicle", "Lunch", "Entry fee"],
  },
  {
    id: "kafue-park",
    name: "Kafue National Park",
    location: "Kafue",
    rating: 4.7,
    reviews: 543,
    price: 80,
    image: "https://images.pexels.com/photos/2422533/pexels-photo-2422533?auto=compress&fit=crop&w=400&h=300",
    description: "Explore Zambia's largest national park.",
    duration: "Full day",
    includes: ["Guide", "Entry fee", "Boat safari"],
  },
  {
    id: "lower-zambezi-canoe",
    name: "Lower Zambezi Canoe",
    location: "Lower Zambezi",
    rating: 4.9,
    reviews: 312,
    price: 95,
    image: "https://images.pexels.com/photos/2166936/pexels-photo-2166936?auto=compress&fit=crop&w=400&h=300",
    description: "Paddle through hippo and croc territory on the mighty Zambezi.",
    duration: "Full day",
    includes: ["Guide", "Canoe", "Lunch", "Safety gear"],
  },
];

// ── Gems ──────────────────────────────────────────────────────────────────────
// Backend: GET /gems  →  Gem[]
export type MockGem = {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  description: string;
  duration: string;
  maxGroupSize: number;
};

export const mockGems: MockGem[] = [
  {
    id: "mutinondo",
    name: "Mutinondo Wilderness",
    location: "Mpika",
    rating: 5.0,
    reviews: 89,
    price: 45,
    image: "https://images.pexels.com/photos/2199357/pexels-photo-2199357?auto=compress&fit=crop&w=400&h=300",
    description: "Remote miombo wilderness with stunning rock formations and waterfalls.",
    duration: "Full day",
    maxGroupSize: 8,
  },
  {
    id: "shiwa-ngandu",
    name: "Shiwa Ng'andu Estate",
    location: "Chinsali",
    rating: 4.9,
    reviews: 134,
    price: 60,
    image: "https://images.pexels.com/photos/2422533/pexels-photo-2422533?auto=compress&fit=crop&w=400&h=300",
    description: "Historic English manor house deep in the Zambian bush.",
    duration: "Half day",
    maxGroupSize: 12,
  },
  {
    id: "bangweulu",
    name: "Bangweulu Wetlands",
    location: "Samfya",
    rating: 4.8,
    reviews: 67,
    price: 55,
    image: "https://images.pexels.com/photos/2166936/pexels-photo-2166936?auto=compress&fit=crop&w=400&h=300",
    description: "Vast wetlands home to the rare black lechwe and shoebill stork.",
    duration: "Full day",
    maxGroupSize: 6,
  },
  {
    id: "blue-lagoon",
    name: "Blue Lagoon National Park",
    location: "Kafue Flats",
    rating: 4.7,
    reviews: 45,
    price: 40,
    image: "https://images.pexels.com/photos/2199357/pexels-photo-2199357?auto=compress&fit=crop&w=400&h=300",
    description: "Seasonal floodplains teeming with birds and Kafue lechwe.",
    duration: "Half day",
    maxGroupSize: 10,
  },
];

// ── Packages ──────────────────────────────────────────────────────────────────
// Backend: GET /packages  →  Package[]
// Backend: GET /packages/:id  →  Package
export type MockPackage = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  duration: string;
  location: string;
  description: string;
  highlights: string[];
  included: string[];
  category: string;
  itinerary: { day: number; title: string; desc: string }[];
};

export const mockPackages: MockPackage[] = [
  {
    id: "luxury-zambezi-escape",
    name: "Luxury Zambezi Escape",
    tagline: "4 Days of pure riverside bliss",
    price: 850,
    rating: 4.9,
    reviews: 84,
    image: IMG.hero,
    duration: "4 Days / 3 Nights",
    location: "Livingstone",
    description: "Experience the ultimate luxury on the banks of the Zambezi. All-inclusive with private sunset cruises and a guided tour of Victoria Falls.",
    highlights: ["Luxury Riverside Suite", "Private Sunset Cruise", "Victoria Falls Guided Tour", "All-inclusive Dining"],
    included: ["3 nights accommodation", "All meals", "Airport transfers", "Guided tours", "Entrance fees"],
    category: "Luxury",
    itinerary: [
      { day: 1, title: "Arrival & Sunset Cruise", desc: "Arrive in Livingstone and check into your luxury lodge. Enjoy a private sunset cruise on the Zambezi." },
      { day: 2, title: "Victoria Falls Exploration", desc: "Guided tour of the Victoria Falls followed by a scenic helicopter flight." },
      { day: 3, title: "Leisure & Spa", desc: "A relaxing day with spa treatments and high tea overlooking the river." },
      { day: 4, title: "Departure", desc: "Enjoy a final breakfast before your transfer to the airport." },
    ],
  },
  {
    id: "safari-adventure-luangwa",
    name: "Safari Adventure Luangwa",
    tagline: "Into the heart of the wild",
    price: 1200,
    rating: 4.95,
    reviews: 126,
    image: IMG.camp,
    duration: "5 Days / 4 Nights",
    location: "South Luangwa",
    description: "Immerse yourself in one of Africa's greatest wildlife sanctuaries. Daily game drives, walking safaris, and luxury tented accommodation.",
    highlights: ["Big Five Game Drives", "Walking Safaris", "Luxury Tented Camp", "Bush Dinners"],
    included: ["4 nights tented accommodation", "All meals", "Game drives", "Walking safaris", "Park fees"],
    category: "Adventure",
    itinerary: [
      { day: 1, title: "Bush Welcome", desc: "Arrival at the camp and an evening game drive." },
      { day: 2, title: "The Walking Safari", desc: "Experience the wild on foot with expert guides." },
      { day: 3, title: "Game Drives", desc: "Morning and afternoon game drives to spot leopards and lions." },
      { day: 4, title: "Cultural Experience", desc: "Visit a local village and enjoy a traditional bush dinner." },
      { day: 5, title: "Farewell Drive", desc: "Early morning drive before departure." },
    ],
  },
  {
    id: "kafue-wilderness-trek",
    name: "Kafue Wilderness Trek",
    tagline: "Remote, wild, and untouched",
    price: 950,
    rating: 4.8,
    reviews: 42,
    image: IMG.lodge,
    duration: "6 Days / 5 Nights",
    location: "Kafue",
    description: "Explore the vast and diverse landscapes of Kafue National Park. Perfect for nature lovers seeking solitude.",
    highlights: ["Remote Wilderness", "Boat Safaris", "Bird Watching", "Eco-friendly Lodging"],
    included: ["5 nights eco-lodge", "All meals", "Boat safaris", "Bird watching guide", "Park fees"],
    category: "Nature",
    itinerary: [
      { day: 1, title: "Journey to Kafue", desc: "Travel to the remote heart of the park." },
      { day: 2, title: "River Exploration", desc: "Boat safari on the Kafue River." },
      { day: 3, title: "Savannah Drive", desc: "Full day drive to the Busanga Plains." },
      { day: 4, title: "Birding Safari", desc: "Expert-led bird watching session." },
      { day: 5, title: "Nature Walk", desc: "Guided walk focused on smaller flora and fauna." },
      { day: 6, title: "Departure", desc: "Scenic flight back to Lusaka." },
    ],
  },
];

export const getPackage = (id: string) => mockPackages.find((p) => p.id === id);

// ── Popular Destinations ──────────────────────────────────────────────────────
// Backend: GET /destinations/popular  →  Destination[]
export const mockDestinations = [
  { name: "Livingstone", image: "https://images.pexels.com/photos/2166936/pexels-photo-2166936?auto=compress&fit=crop&w=400&h=400" },
  { name: "Lusaka", image: "https://images.pexels.com/photos/2422533/pexels-photo-2422533?auto=compress&fit=crop&w=400&h=400" },
  { name: "South Luangwa", image: "https://images.pexels.com/photos/2199357/pexels-photo-2199357?auto=compress&fit=crop&w=400&h=400" },
  { name: "Lower Zambezi", image: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&fit=crop&w=400&h=400" },
];

// ── Mock Booking (for confirmation page testing) ──────────────────────────────
// Backend: POST /bookings  →  Booking
export const mockBookingResponse: Booking = {
  id: "booking-001",
  stayId: "mosi-oa-tunya-lodge",
  stayName: "Mosi-oa-Tunya Lodge",
  stayImage: IMG.lodge,
  stayLocation: "Livingstone, Zambia",
  checkIn: "2025-08-01",
  checkOut: "2025-08-04",
  guests: 2,
  status: "confirmed",
  confirmationId: "NE-100001",
  fees: {
    pricePerNight: 220,
    nights: 3,
    subtotal: 660,
    cleaningFee: 50,
    serviceFee: 79,
    taxes: 66,
    total: 855,
  },
  host: {
    id: "host-1",
    displayName: "Chanda Mwenya",
  },
  createdAt: new Date().toISOString(),
};

// ── Legacy alias (keeps old imports working during transition) ────────────────
export const listings = mockStays;
export type Listing = Stay;
