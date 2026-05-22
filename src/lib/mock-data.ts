export interface Stay {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  amenities: string[];
  type: string;
}

export interface Transport {
  id: string;
  from: string;
  to: string;
  operator: string;
  duration: string;
  departures: string;
  price: number;
  image: string;
}

export interface Experience {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
}

export interface Package {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  image: string;
  duration: string;
}

export interface Destination {
  name: string;
  image: string;
}

export const mockStays: Stay[] = [
  {
    id: "1",
    name: "Luxury Safari Lodge",
    location: "Lower Zambezi",
    rating: 4.9,
    reviews: 128,
    price: 450,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    amenities: ["WiFi", "Pool", "Spa"],
    type: "Lodge",
  },
  {
    id: "2",
    name: "Victoria Falls Hotel",
    location: "Livingstone",
    rating: 4.8,
    reviews: 256,
    price: 320,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    amenities: ["WiFi", "Restaurant", "Bar"],
    type: "Hotel",
  },
  {
    id: "3",
    name: "Bush Camp Adventure",
    location: "South Luangwa",
    rating: 4.7,
    reviews: 89,
    price: 280,
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80",
    amenities: ["Guided Tours", "Meals Included"],
    type: "Camp",
  },
  {
    id: "4",
    name: "Lake Kariba Retreat",
    location: "Kariba",
    rating: 4.6,
    reviews: 145,
    price: 195,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80",
    amenities: ["WiFi", "Water Sports", "Fishing"],
    type: "Resort",
  },
  {
    id: "5",
    name: "Kafue River Lodge",
    location: "Kafue National Park",
    rating: 4.8,
    reviews: 92,
    price: 380,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    amenities: ["Wildlife Viewing", "Boat Safaris"],
    type: "Lodge",
  },
  {
    id: "6",
    name: "Copperbelt City Hotel",
    location: "Ndola",
    rating: 4.5,
    reviews: 178,
    price: 150,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    amenities: ["WiFi", "Gym", "Conference Rooms"],
    type: "Hotel",
  },
  {
    id: "7",
    name: "Bangweulu Wetlands Camp",
    location: "Bangweulu",
    rating: 4.9,
    reviews: 67,
    price: 420,
    image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80",
    amenities: ["Bird Watching", "Guided Walks"],
    type: "Camp",
  },
  {
    id: "8",
    name: "Lusaka Boutique Stay",
    location: "Lusaka",
    rating: 4.6,
    reviews: 203,
    price: 120,
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80",
    amenities: ["WiFi", "Breakfast", "City Views"],
    type: "Boutique",
  },
];

export const mockTransport: Transport[] = [
  {
    id: "t1",
    from: "Lusaka",
    to: "Livingstone",
    operator: "Zambia Bus Lines",
    duration: "6h 30m",
    departures: "Daily",
    price: 250,
    image: "https://images.unsplash.com/photo-1544620347-f4fd8749f24e?w=800&q=80",
  },
  {
    id: "t2",
    from: "Lusaka",
    to: "Ndola",
    operator: "Power Tools",
    duration: "5h 15m",
    departures: "Daily",
    price: 180,
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80",
  },
  {
    id: "t3",
    from: "Kitwe",
    to: "Chipata",
    operator: "Eastern Express",
    duration: "8h 45m",
    departures: "Mon, Wed, Fri",
    price: 320,
    image: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=800&q=80",
  },
];

export const mockExperiences: Experience[] = [
  {
    id: "e1",
    name: "Victoria Falls Helicopter Tour",
    location: "Livingstone",
    rating: 4.9,
    reviews: 342,
    price: 180,
    image: "https://images.unsplash.com/photo-1534234828563-02511c750b53?w=800&q=80",
  },
  {
    id: "e2",
    name: "South Luangwa Walking Safari",
    location: "Mfuwe",
    rating: 4.8,
    reviews: 189,
    price: 150,
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
  },
  {
    id: "e3",
    name: "Lake Tanganyika Snorkeling",
    location: "Nsumbu",
    rating: 4.7,
    reviews: 156,
    price: 95,
    image: "https://images.unsplash.com/photo-1582967788606-a171f1080ca8?w=800&q=80",
  },
  {
    id: "e4",
    name: "Kafue Game Drive",
    location: "Kafue National Park",
    rating: 4.8,
    reviews: 201,
    price: 120,
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
  },
];

export const mockGems: Experience[] = [
  {
    id: "g1",
    name: "Shiwa Ngandu Estate",
    location: "Mpika",
    rating: 4.9,
    reviews: 78,
    price: 200,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
  },
  {
    id: "g2",
    name: "Kundalila Falls Hike",
    location: "Serenje",
    rating: 4.8,
    reviews: 92,
    price: 45,
    image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80",
  },
  {
    id: "g3",
    name: "Liuwa Plain Migration",
    location: "Liuwa Plain",
    rating: 4.9,
    reviews: 64,
    price: 280,
    image: "https://images.unsplash.com/photo-1534759846116-5799c33ce22a?w=800&q=80",
  },
  {
    id: "g4",
    name: "Chapel Island Sunset Cruise",
    location: "Lake Kariba",
    rating: 4.7,
    reviews: 115,
    price: 85,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
  },
];

export const mockPackages: Package[] = [
  {
    id: "p1",
    name: "Victoria Falls Weekend",
    location: "Livingstone",
    rating: 4.8,
    price: 550,
    image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=800&q=80",
    duration: "3 Days / 2 Nights",
  },
  {
    id: "p2",
    name: "South Luangwa Safari",
    location: "South Luangwa",
    rating: 4.9,
    price: 1200,
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
    duration: "5 Days / 4 Nights",
  },
  {
    id: "p3",
    name: "Lake Kariba Relaxation",
    location: "Kariba",
    rating: 4.7,
    price: 380,
    image: "https://images.unsplash.com/photo-1540206395-688085723adb?w=800&q=80",
    duration: "2 Days / 1 Night",
  },
];

export const mockDestinations: Destination[] = [
  { name: "Livingstone", image: "https://images.unsplash.com/photo-1589979481223-deb893043163?w=800&q=80" },
  { name: "Lusaka", image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=800&q=80" },
  { name: "Ndola", image: "https://images.unsplash.com/photo-1512453979798-5ea904ac66de?w=800&q=80" },
  { name: "Mfuwe", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80" },
];
