export interface Stay {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  images?: string[];
  amenities: string[];
  type: string;
  description?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  guests?: number;
  checkInRules?: string[];
  checkOutRules?: string[];
  lat?: number;
  lng?: number;
  closestAttraction?: string;
  distance?: string;
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

export type ExperienceCategory =
  | "cultural"
  | "wildlife"
  | "farm"
  | "industrial"
  | "adventure"
  | "water"
  | "general";

export const categoryLabels: Record<ExperienceCategory, string> = {
  cultural: "Cultural & Community",
  wildlife: "Wildlife & Nature",
  farm: "Farm Visits & Agri-Tourism",
  industrial: "Industrial Heritage",
  adventure: "Adventure & Tours",
  water: "Water Sports & Lakes",
  general: "General Attractions",
};

export const categoryIcons: Record<ExperienceCategory, string> = {
  cultural: "🎭",
  wildlife: "🦁",
  farm: "🌾",
  industrial: "⚙️",
  adventure: "🧗",
  water: "🌊",
  general: "📍",
};

export interface Experience {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  category: ExperienceCategory;
  duration?: string;
  groupSize?: string;
  description?: string;
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
    location: "Lower Zambezi, Southern Province",
    rating: 4.9,
    reviews: 128,
    price: 450,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&q=80",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
    ],
    amenities: ["WiFi", "Pool", "Spa", "Guided Tours", "Meals Included"],
    type: "Lodge",
    description:
      "Nestled along the banks of the Zambezi River, this exclusive lodge offers an unmatched safari experience. Wake up to elephants grazing at dawn, enjoy sundowner cocktails as hippos bask in the shallows, and retire to your private plunge pool under a canopy of stars. Each suite is crafted from natural materials to blend seamlessly with the wilderness.",
    beds: 1,
    baths: 1,
    sqft: 420,
    guests: 2,
    checkInRules: [
      "Check-in from 14:00 onwards",
      "Photo ID required at reception",
      "No late check-ins after 22:00",
    ],
    checkOutRules: [
      "Check-out by 11:00",
      "Early check-out fee may apply",
      "Luggage storage available on request",
    ],
    lat: -15.5,
    lng: 29.1,
    closestAttraction: "Lower Zambezi National Park",
    distance: "Inside Park",
  },
  {
    id: "2",
    name: "Victoria Falls Hotel",
    location: "Livingstone, Southern Province",
    rating: 4.8,
    reviews: 256,
    price: 320,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&q=80",
    ],
    amenities: ["WiFi", "Restaurant", "Bar", "Pool", "Spa"],
    type: "Hotel",
    description:
      "An iconic colonial-era hotel perched at the edge of the mist-laden Victoria Falls. With sweeping views of the gorge and a heritage spanning over a century, it's one of Africa's most celebrated stays. Dine al fresco, hear the distant roar of the falls, and explore the world's largest waterfall just minutes away.",
    beds: 1,
    baths: 1,
    sqft: 380,
    guests: 2,
    checkInRules: ["Check-in from 15:00", "Valid passport or ID required", "No smoking in rooms"],
    checkOutRules: [
      "Check-out by 12:00",
      "Late check-out subject to availability",
      "Valuables safe in each room",
    ],
    lat: -17.9243,
    lng: 25.8572,
    closestAttraction: "Victoria Falls",
    distance: "0.5km",
  },
  {
    id: "3",
    name: "Bush Camp Adventure",
    location: "South Luangwa, Eastern Province",
    rating: 4.7,
    reviews: 89,
    price: 280,
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&q=80",
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1200&q=80",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=80",
    ],
    amenities: ["Guided Tours", "Meals Included", "Breakfast"],
    type: "Camp",
    description:
      "An intimate tented camp set deep inside South Luangwa National Park — one of Africa's finest wildlife sanctuaries. All meals are prepared by a dedicated camp chef, and guided walking safaris at dawn offer an intimate encounter with lions, leopards, and the famous Thornicroft's giraffe.",
    beds: 1,
    baths: 1,
    sqft: 280,
    guests: 2,
    checkInRules: [
      "Arrive before sunset for safety",
      "Confirm arrival time 24h in advance",
      "Children under 12 by arrangement",
    ],
    checkOutRules: ["Depart by 10:00", "Bush transfer arrangements required"],
    lat: -13.1,
    lng: 31.8,
    closestAttraction: "South Luangwa National Park",
    distance: "Inside Park",
  },
  {
    id: "4",
    name: "Lake Kariba Retreat",
    location: "Kariba, Southern Province",
    rating: 4.6,
    reviews: 145,
    price: 195,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
      "https://images.unsplash.com/photo-1540206395-688085723adb?w=1200&q=80",
    ],
    amenities: ["WiFi", "Water Sports", "Fishing"],
    type: "Resort",
    description:
      "A lakeside retreat on the shores of Lake Kariba — one of the world's largest man-made lakes. Spend your days fishing for tiger fish, cruising at sunset, or simply unwinding with panoramic water views from your private deck.",
    beds: 2,
    baths: 2,
    sqft: 520,
    guests: 4,
    checkInRules: ["Check-in from 13:00", "Boat transfer available on request"],
    checkOutRules: ["Check-out by 11:00"],
    lat: -16.5,
    lng: 28.8,
    closestAttraction: "Lake Kariba",
    distance: "Lakefront",
  },
  {
    id: "5",
    name: "Kafue River Lodge",
    location: "Kafue National Park, Central Province",
    rating: 4.8,
    reviews: 92,
    price: 380,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&q=80",
    ],
    amenities: ["Wildlife Viewing", "Boat Safaris", "Pool"],
    type: "Lodge",
    description:
      "Perched above the Kafue River in Zambia's largest national park, this lodge is a base for world-class wildlife encounters. Join expert guides on morning game drives, or drift silently along the river on a mokoro canoe.",
    beds: 1,
    baths: 1,
    sqft: 360,
    guests: 2,
    checkInRules: ["Check-in after 14:00", "Park fees included in rate"],
    checkOutRules: ["Check-out by 10:00"],
    lat: -14.5,
    lng: 26.1,
    closestAttraction: "Kafue River",
    distance: "Riverfront",
  },
  {
    id: "6",
    name: "Copperbelt City Hotel",
    location: "Ndola, Copperbelt Province",
    rating: 4.5,
    reviews: 178,
    price: 150,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&q=80",
    ],
    amenities: ["WiFi", "Gym", "Conference Rooms", "Restaurant"],
    type: "Hotel",
    description:
      "A modern business hotel at the heart of Ndola, offering contemporary comfort in the Copperbelt's commercial hub. Ideal for corporate travelers, with fast WiFi, fully equipped conference suites, and a rooftop restaurant.",
    beds: 1,
    baths: 1,
    sqft: 310,
    guests: 2,
    checkInRules: ["24-hour check-in", "Business visa support available"],
    checkOutRules: ["Check-out by 12:00", "Express check-out available"],
    lat: -12.97,
    lng: 28.64,
    closestAttraction: "Ndola City Center",
    distance: "1km",
  },
  {
    id: "7",
    name: "Bangweulu Wetlands Camp",
    location: "Bangweulu, Luapula Province",
    rating: 4.9,
    reviews: 67,
    price: 420,
    image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1200&q=80",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&q=80",
      "https://images.unsplash.com/photo-1534759846116-5799c33ce22a?w=1200&q=80",
    ],
    amenities: ["Bird Watching", "Guided Walks", "Meals Included"],
    type: "Camp",
    description:
      "A remote wilderness camp on the edge of the Bangweulu Swamps — home to the extraordinary shoebill stork and millions of migrating lechwe. An off-the-beaten-path experience for serious wildlife enthusiasts.",
    beds: 1,
    baths: 1,
    sqft: 240,
    guests: 2,
    checkInRules: ["Arrange charter flight in advance", "No generators after 21:00"],
    checkOutRules: ["Check-out by 09:00 for morning flight"],
    lat: -11.5,
    lng: 29.8,
    closestAttraction: "Bangweulu Swamps",
    distance: "Inside Reserve",
  },
  {
    id: "8",
    name: "Lusaka Boutique Stay",
    location: "Lusaka, Lusaka Province",
    rating: 4.6,
    reviews: 203,
    price: 120,
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80",
    ],
    amenities: ["WiFi", "Breakfast", "City Views"],
    type: "Boutique",
    description:
      "A chic boutique hotel tucked into one of Lusaka's leafy suburbs. Designed with a mix of African art and contemporary interiors, it's a perfect base for exploring the capital — close to Cairo Road, the National Museum, and the best restaurants in the city.",
    beds: 1,
    baths: 1,
    sqft: 290,
    guests: 2,
    checkInRules: ["Check-in from 14:00", "Complimentary airport pickup with 48h notice"],
    checkOutRules: ["Check-out by 12:00"],
    lat: -15.4166,
    lng: 28.2833,
    closestAttraction: "Lusaka National Museum",
    distance: "4km",
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
  //Wildlife & Nature ──
  {
    id: "e1",
    name: "Victoria Falls Helicopter Tour",
    location: "Livingstone, Southern Province",
    rating: 4.9,
    reviews: 342,
    price: 180,
    image: "https://images.unsplash.com/photo-1534234828563-02511c750b53?w=800&q=80",
    category: "adventure",
    duration: "15 min",
    groupSize: "1-6 people",
    description:
      "Soar above the legendary Victoria Falls for a bird's-eye view of the Smoke that Thunders. This helicopter tour offers unmatched aerial perspectives of the falls, the Zambezi River, and the Batoka Gorge.",
  },
  {
    id: "e2",
    name: "South Luangwa Walking Safari",
    location: "Mfuwe, Eastern Province",
    rating: 4.8,
    reviews: 189,
    price: 150,
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    category: "wildlife",
    duration: "Half Day",
    groupSize: "2-8 people",
    description:
      "Step off the vehicle and walk through the African bush with expert armed rangers. Learn tracking skills, identify medicinal plants, and encounter wildlife on foot — an unmatched safari experience.",
  },
  {
    id: "e3",
    name: "Lake Tanganyika Snorkeling",
    location: "Nsumbu, Northern Province",
    rating: 4.7,
    reviews: 156,
    price: 95,
    image: "https://images.unsplash.com/photo-1582967788606-a171f1080ca8?w=800&q=80",
    category: "water",
    duration: "Full Day",
    groupSize: "1-10 people",
    description:
      "Plunge into the crystal-clear waters of Lake Tanganyika, the world's longest freshwater lake. Snorkel among hundreds of species of vibrant cichlid fish found nowhere else on earth.",
  },
  {
    id: "e4",
    name: "Kafue Game Drive",
    location: "Kafue National Park, Central Province",
    rating: 4.8,
    reviews: 201,
    price: 120,
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    category: "wildlife",
    duration: "Full Day",
    groupSize: "1-6 people",
    description:
      "Explore Zambia's oldest and largest national park on a full-day game drive. Track lions, leopards, wild dogs and elephants across diverse habitats with expert guides.",
  },

  //Farm Visits & Agri-Tourism ──
  {
    id: "e5",
    name: "Chisamba Farm Stay & Milking Experience",
    location: "Chisamba, Central Province",
    rating: 4.6,
    reviews: 73,
    price: 85,
    image: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800&q=80",
    category: "farm",
    duration: "Full Day",
    groupSize: "1-8 people",
    description:
      "Spend a day on a working Zambian farm in the lush Chisamba Valley. Milk cows by hand, collect fresh eggs, help bake traditional bread, and enjoy a farm-to-table lunch with the family.",
  },
  {
    id: "e6",
    name: "Mkushi Organic Farm Tour",
    location: "Mkushi, Central Province",
    rating: 4.7,
    reviews: 54,
    price: 70,
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80",
    category: "farm",
    duration: "Half Day",
    groupSize: "1-12 people",
    description:
      "Tour a thriving organic farm in Mkushi — Zambia's breadbasket. Walk through fields of maize, soya, and vegetables, learn about sustainable irrigation, and taste freshly harvested produce.",
  },
  {
    id: "e7",
    name: "Kapishya Hot Springs & Farm Tour",
    location: "Mpika, Northern Province",
    rating: 4.9,
    reviews: 67,
    price: 120,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    category: "farm",
    duration: "Full Day",
    groupSize: "1-10 people",
    description:
      "Visit the historic Shiwa Ngandu estate and soak in the natural Kapishya Hot Springs. Tour the grand manor, explore working farmlands, and relax in geothermal springs nestled in the northern hills.",
  },

  //Cultural & Community ──
  {
    id: "e8",
    name: "Livingstone Village Tour & Craft Market",
    location: "Livingstone, Southern Province",
    rating: 4.5,
    reviews: 128,
    price: 45,
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    category: "cultural",
    duration: "Half Day",
    groupSize: "1-15 people",
    description:
      "Immerse yourself in a traditional Zambian village near Livingstone. Meet local artisans, watch batik and basket weaving demonstrations, and browse vibrant craft markets for authentic souvenirs.",
  },
  {
    id: "e9",
    name: "Lusaka Art & Food Walking Tour",
    location: "Lusaka, Lusaka Province",
    rating: 4.6,
    reviews: 94,
    price: 60,
    image: "https://images.unsplash.com/photo-1559336194-973ee0c45b4b?w=800&q=80",
    category: "cultural",
    duration: "Half Day",
    groupSize: "1-10 people",
    description:
      "Explore Lusaka's vibrant art scene and culinary culture. Visit local galleries, meet contemporary Zambian artists, sample street food delicacies, and learn to cook traditional Nshima.",
  },
  {
    id: "e10",
    name: "Mukuni Village Cultural Experience",
    location: "Livingstone, Southern Province",
    rating: 4.7,
    reviews: 203,
    price: 55,
    image: "https://images.unsplash.com/photo-1580747182610-dac5e078f8f5?w=800&q=80",
    category: "cultural",
    duration: "Half Day",
    groupSize: "1-20 people",
    description:
      "Visit the historic Mukuni Village, home of the Leya people. Tour the Chief's palace, watch traditional dancing and drumming performances, and learn about the deep cultural heritage of the region.",
  },

  //Industrial Heritage ──
  {
    id: "e11",
    name: "Copperbelt Mining Heritage Tour",
    location: "Kitwe, Copperbelt Province",
    rating: 4.4,
    reviews: 67,
    price: 110,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    category: "industrial",
    duration: "Full Day",
    groupSize: "1-10 people",
    description:
      "Journey into Zambia's industrial heartland. Tour active copper mines, visit the Mining Museum in Kitwe, and learn about the vital role copper has played in shaping Zambia's economy and identity.",
  },
  {
    id: "e12",
    name: "Kariba Dam Engineering Tour",
    location: "Kariba, Southern Province",
    rating: 4.5,
    reviews: 82,
    price: 95,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    category: "industrial",
    duration: "Half Day",
    groupSize: "1-8 people",
    description:
      "Stand at the foot of the massive Kariba Dam — one of Africa's largest hydroelectric projects. Tour the visitor centre, learn about the dam's construction and the legendary Nyami Nyami river god.",
  },

  //Adventure & Tours ──
  {
    id: "e13",
    name: "Zambezi White Water Rafting",
    location: "Livingstone, Southern Province",
    rating: 4.9,
    reviews: 276,
    price: 160,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    category: "adventure",
    duration: "Full Day",
    groupSize: "1-12 people",
    description:
      "Tackle some of the world's most thrilling rapids in the Batoka Gorge below Victoria Falls. Professional guides, top-grade safety equipment, and breathtaking canyon scenery included.",
  },
  {
    id: "e14",
    name: "Kundalila Falls Hike & Picnic",
    location: "Serenje, Central Province",
    rating: 4.8,
    reviews: 92,
    price: 45,
    image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80",
    category: "adventure",
    duration: "Half Day",
    groupSize: "1-10 people",
    description:
      "Trek through lush miombo woodlands to the spectacular Kundalila Falls. The Kaombe River plunges 70m into a deep basalt pool — perfect for a refreshing swim after the hike.",
  },

  //Water Sports & Lakes ──
  {
    id: "e15",
    name: "Lake Kariba Sunset Cruise",
    location: "Kariba, Southern Province",
    rating: 4.7,
    reviews: 115,
    price: 85,
    image: "https://images.unsplash.com/photo-1540206395-688085723adb?w=800&q=80",
    category: "water",
    duration: "3 Hours",
    groupSize: "1-20 people",
    description:
      "Set sail on a tranquil sunset cruise across Lake Kariba. Watch elephants and buffalo graze along the shoreline as the sun paints the sky in brilliant oranges and purples. Drinks and snacks included.",
  },
  {
    id: "e16",
    name: "Lower Zambezi Canoe Safari",
    location: "Lower Zambezi, Southern Province",
    rating: 4.9,
    reviews: 88,
    price: 140,
    image: "https://images.unsplash.com/photo-1505222011126-27b25b337dce?w=800&q=80",
    category: "water",
    duration: "Half Day",
    groupSize: "1-6 people",
    description:
      "Paddle silently along the Zambezi River in a Canadian canoe. Glide past hippos, crocodiles, and elephants drinking at the water's edge — an intimate and unforgettable wildlife encounter.",
  },
];

export const mockGems: Experience[] = [
  {
    id: "g1",
    name: "Shiwa Ngandu Estate",
    location: "Mpika, Northern Province",
    rating: 4.9,
    reviews: 78,
    price: 200,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    category: "farm",
  },
  {
    id: "g2",
    name: "Kundalila Falls Hike",
    location: "Serenje, Central Province",
    rating: 4.8,
    reviews: 92,
    price: 45,
    image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80",
    category: "adventure",
  },
  {
    id: "g3",
    name: "Liuwa Plain Migration",
    location: "Liuwa Plain, Western Province",
    rating: 4.9,
    reviews: 64,
    price: 280,
    image: "https://images.unsplash.com/photo-1534759846116-5799c33ce22a?w=800&q=80",
    category: "wildlife",
  },
  {
    id: "g4",
    name: "Chapel Island Sunset Cruise",
    location: "Lake Kariba, Southern Province",
    rating: 4.7,
    reviews: 115,
    price: 85,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    category: "water",
  },
];

export const mockPackages: Package[] = [
  {
    id: "p1",
    name: "Victoria Falls Weekend",
    location: "Livingstone, Southern Province",
    rating: 4.8,
    price: 550,
    image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=800&q=80",
    duration: "3 Days / 2 Nights",
  },
  {
    id: "p2",
    name: "South Luangwa Safari",
    location: "South Luangwa, Eastern Province",
    rating: 4.9,
    price: 1200,
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
    duration: "5 Days / 4 Nights",
  },
  {
    id: "p3",
    name: "Lake Kariba Relaxation",
    location: "Kariba, Southern Province",
    rating: 4.7,
    price: 380,
    image: "https://images.unsplash.com/photo-1540206395-688085723adb?w=800&q=80",
    duration: "2 Days / 1 Night",
  },
];

export const mockDestinations: Destination[] = [
  {
    name: "Livingstone",
    image: "https://images.unsplash.com/photo-1589979481223-deb893043163?w=800&q=80",
  },
  {
    name: "Lusaka",
    image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=800&q=80",
  },
  {
    name: "Ndola",
    image: "https://images.unsplash.com/photo-1512453979798-5ea904ac66de?w=800&q=80",
  },
  {
    name: "Mfuwe",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
  },
];
