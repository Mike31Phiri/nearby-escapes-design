// Province → City → Attraction hierarchy for Discovery pages

export interface ProvinceData {
  id: string; // slug e.g. 'southern'
  name: string;
  tagline: string;
  coverImage: string;
  cities: CityData[];
  stayCount: number;
  experienceCount: number;
}

export interface CityData {
  id: string; // slug e.g. 'livingstone'
  name: string;
  province: string; // province slug
  tagline: string;
  coverImage: string;
  attractions: AttractionData[];
  stayCount: number;
  experienceCount: number;
  transportCount: number;
}

export interface AttractionData {
  id: string; // slug e.g. 'victoria-falls'
  name: string;
  city: string; // city slug
  province: string; // province slug
  category:
    | "waterfall"
    | "game-reserve"
    | "heritage-site"
    | "viewpoint"
    | "natural-landmark"
    | "lake"
    | "dam"
    | "other";
  description: string;
  coverImage: string;
  nearbyStayIds: string[];
  nearbyExperienceIds: string[];
  nearbyTransportIds: string[];
  isFeatured?: boolean;
}

// ─── ATTRACTIONS ────────────────────────────────────────────────────────────

export const ATTRACTIONS: AttractionData[] = [
  {
    id: "victoria-falls",
    name: "Victoria Falls",
    city: "livingstone",
    province: "southern",
    category: "waterfall",
    description:
      "One of the Seven Natural Wonders of the World — the Smoke that Thunders. The Zambezi River plunges 108m into the Batoka Gorge creating the world's largest sheet of falling water.",
    coverImage: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=80",
    nearbyStayIds: ["2"],
    nearbyExperienceIds: ["e1", "e8", "e10", "e13"],
    nearbyTransportIds: ["t1"],
    isFeatured: true,
  },
  {
    id: "batoka-gorge",
    name: "Batoka Gorge",
    city: "livingstone",
    province: "southern",
    category: "viewpoint",
    description:
      "A dramatic canyon carved by the Zambezi River below Victoria Falls. The site of world-class white-water rafting, bungee jumping, and stunning gorge hikes.",
    coverImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
    nearbyStayIds: ["2"],
    nearbyExperienceIds: ["e13"],
    nearbyTransportIds: ["t1"],
  },
  {
    id: "mukuni-village",
    name: "Mukuni Village",
    city: "livingstone",
    province: "southern",
    category: "heritage-site",
    description:
      "The ancestral home of the Leya people, led by Chief Mukuni. This living cultural village offers authentic insight into the traditions and daily life of the people of the Zambezi Valley.",
    coverImage: "https://images.unsplash.com/photo-1580747182610-dac5e078f8f5?w=1200&q=80",
    nearbyStayIds: ["2"],
    nearbyExperienceIds: ["e8", "e10"],
    nearbyTransportIds: ["t1"],
  },
  {
    id: "lusaka-national-museum",
    name: "Lusaka National Museum",
    city: "lusaka",
    province: "lusaka",
    category: "heritage-site",
    description:
      "Zambia's premier museum tracing the nation's history from pre-colonial kingdoms to independence. Home to remarkable collections of Zambian art, archaeology, and cultural heritage.",
    coverImage: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=1200&q=80",
    nearbyStayIds: ["8"],
    nearbyExperienceIds: ["e9"],
    nearbyTransportIds: ["t1", "t2"],
  },
  {
    id: "manda-hill",
    name: "Manda Hill Shopping Centre",
    city: "lusaka",
    province: "lusaka",
    category: "other",
    description:
      "Lusaka's premier urban destination for dining, entertainment, and retail. The social hub of the capital with a vibrant mix of restaurants, cafes, cinemas, and local boutiques.",
    coverImage: "https://images.unsplash.com/photo-1559336194-973ee0c45b4b?w=1200&q=80",
    nearbyStayIds: ["8"],
    nearbyExperienceIds: ["e9"],
    nearbyTransportIds: ["t2"],
  },
  {
    id: "south-luangwa-national-park",
    name: "South Luangwa National Park",
    city: "mfuwe",
    province: "eastern",
    category: "game-reserve",
    description:
      "One of Africa's finest wildlife sanctuaries, home to the famous walking safari. Over 60 mammal species roam freely across diverse habitats along the Luangwa River.",
    coverImage: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80",
    nearbyStayIds: ["3"],
    nearbyExperienceIds: ["e2", "e4"],
    nearbyTransportIds: [],
    isFeatured: true,
  },
  {
    id: "kundalila-falls",
    name: "Kundalila Falls",
    city: "serenje",
    province: "central",
    category: "waterfall",
    description:
      "A hidden gem waterfall where the Kaombe River plunges 70m into a deep crystal-clear pool. Ideal for swimming, hiking, and picnicking in unspoiled miombo woodland.",
    coverImage: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200&q=80",
    nearbyStayIds: [],
    nearbyExperienceIds: ["e14"],
    nearbyTransportIds: [],
    isFeatured: true,
  },
  {
    id: "kapishya-hot-springs",
    name: "Kapishya Hot Springs",
    city: "mpika",
    province: "northern",
    category: "natural-landmark",
    description:
      "Natural geothermal springs on the historic Shiwa Ngandu estate. Soak in warm mineral-rich waters surrounded by lush tropical forest — a remote but deeply rewarding experience.",
    coverImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80",
    nearbyStayIds: [],
    nearbyExperienceIds: ["e7"],
    nearbyTransportIds: [],
  },
  {
    id: "lake-kariba",
    name: "Lake Kariba",
    city: "kariba",
    province: "southern",
    category: "lake",
    description:
      "One of the world's largest man-made lakes, stretching 280km along the Zambia-Zimbabwe border. Famous for houseboat safaris, tiger fishing, and spectacular sunset cruises.",
    coverImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
    nearbyStayIds: ["4"],
    nearbyExperienceIds: ["e12", "e15"],
    nearbyTransportIds: [],
  },
  {
    id: "bangweulu-swamps",
    name: "Bangweulu Swamps",
    city: "samfya",
    province: "luapula",
    category: "natural-landmark",
    description:
      "A vast and remote wetland system home to the extraordinary shoebill stork and millions of migrating black lechwe. One of Africa's most important bird habitats.",
    coverImage: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1200&q=80",
    nearbyStayIds: ["7"],
    nearbyExperienceIds: [],
    nearbyTransportIds: [],
  },
  {
    id: "kafue-national-park",
    name: "Kafue National Park",
    city: "kafue",
    province: "central",
    category: "game-reserve",
    description:
      "Zambia's largest and oldest national park — twice the size of Wales. Home to an extraordinary diversity of wildlife across miombo woodland, flood plains, and riverine forest.",
    coverImage: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80",
    nearbyStayIds: ["5"],
    nearbyExperienceIds: ["e4", "e16"],
    nearbyTransportIds: [],
  },
  {
    id: "lake-tanganyika",
    name: "Lake Tanganyika",
    city: "mpulungu",
    province: "northern",
    category: "lake",
    description:
      "The world's longest and second-deepest freshwater lake. Crystal-clear waters teeming with hundreds of endemic cichlid species make it a world-class snorkeling and diving destination.",
    coverImage: "https://images.unsplash.com/photo-1582967788606-a171f1080ca8?w=1200&q=80",
    nearbyStayIds: [],
    nearbyExperienceIds: ["e3"],
    nearbyTransportIds: [],
    isFeatured: true,
  },
];

// ─── CITIES ──────────────────────────────────────────────────────────────────

export const CITIES: CityData[] = [
  {
    id: "livingstone",
    name: "Livingstone",
    province: "southern",
    tagline: "Adventure capital of Africa",
    coverImage: "https://images.unsplash.com/photo-1589979481223-deb893043163?w=1200&q=80",
    attractions: ATTRACTIONS.filter((a) => a.city === "livingstone"),
    stayCount: 12,
    experienceCount: 10,
    transportCount: 6,
  },
  {
    id: "lusaka",
    name: "Lusaka",
    province: "lusaka",
    tagline: "Culture, cuisine and city life",
    coverImage: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=1200&q=80",
    attractions: ATTRACTIONS.filter((a) => a.city === "lusaka"),
    stayCount: 8,
    experienceCount: 5,
    transportCount: 8,
  },
  {
    id: "ndola",
    name: "Ndola",
    province: "copperbelt",
    tagline: "Industrial heritage and gardens",
    coverImage: "https://images.unsplash.com/photo-1512453979798-5ea904ac66de?w=1200&q=80",
    attractions: ATTRACTIONS.filter((a) => a.city === "ndola"),
    stayCount: 6,
    experienceCount: 4,
    transportCount: 4,
  },
  {
    id: "mfuwe",
    name: "Mfuwe",
    province: "eastern",
    tagline: "Gateway to South Luangwa",
    coverImage: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200&q=80",
    attractions: ATTRACTIONS.filter((a) => a.city === "mfuwe"),
    stayCount: 5,
    experienceCount: 4,
    transportCount: 2,
  },
  {
    id: "mpika",
    name: "Mpika",
    province: "northern",
    tagline: "Springs, estates and wilderness",
    coverImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80",
    attractions: ATTRACTIONS.filter((a) => a.city === "mpika"),
    stayCount: 4,
    experienceCount: 3,
    transportCount: 2,
  },
  {
    id: "mongu",
    name: "Mongu",
    province: "western",
    tagline: "The royal Lozi floodplains",
    coverImage: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80",
    attractions: ATTRACTIONS.filter((a) => a.city === "mongu"),
    stayCount: 3,
    experienceCount: 2,
    transportCount: 1,
  },
];

// ─── PROVINCES ───────────────────────────────────────────────────────────────

export const PROVINCES: ProvinceData[] = [
  {
    id: "southern",
    name: "Southern Province",
    tagline: "Home of the Smoke that Thunders",
    coverImage: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=80",
    cities: CITIES.filter((c) => c.province === "southern"),
    stayCount: 24,
    experienceCount: 18,
  },
  {
    id: "lusaka",
    name: "Lusaka Province",
    tagline: "The beating heart of Zambia",
    coverImage: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=1200&q=80",
    cities: CITIES.filter((c) => c.province === "lusaka"),
    stayCount: 16,
    experienceCount: 12,
  },
  {
    id: "copperbelt",
    name: "Copperbelt Province",
    tagline: "Where industry meets heritage",
    coverImage: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80",
    cities: CITIES.filter((c) => c.province === "copperbelt"),
    stayCount: 10,
    experienceCount: 8,
  },
  {
    id: "eastern",
    name: "Eastern Province",
    tagline: "Wildlife and wild spaces",
    coverImage: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=80",
    cities: CITIES.filter((c) => c.province === "eastern"),
    stayCount: 12,
    experienceCount: 9,
  },
  {
    id: "northern",
    name: "Northern Province",
    tagline: "Ancient escarpments and hidden falls",
    coverImage: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200&q=80",
    cities: CITIES.filter((c) => c.province === "northern"),
    stayCount: 8,
    experienceCount: 6,
  },
  {
    id: "western",
    name: "Western Province",
    tagline: "The floodplains and royal traditions",
    coverImage: "https://images.unsplash.com/photo-1534759846116-5799c33ce22a?w=1200&q=80",
    cities: CITIES.filter((c) => c.province === "western"),
    stayCount: 6,
    experienceCount: 5,
  },
];

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────

export function getProvince(id: string): ProvinceData | undefined {
  return PROVINCES.find((p) => p.id === id);
}

export function getCity(id: string): CityData | undefined {
  return CITIES.find((c) => c.id === id);
}

export function getAttraction(id: string): AttractionData | undefined {
  return ATTRACTIONS.find((a) => a.id === id);
}

export function getCitiesByProvince(provinceId: string): CityData[] {
  return CITIES.filter((c) => c.province === provinceId);
}

export function getAttractionsByCity(cityId: string): AttractionData[] {
  return ATTRACTIONS.filter((a) => a.city === cityId);
}

export function getAttractionsByProvince(provinceId: string): AttractionData[] {
  return ATTRACTIONS.filter((a) => a.province === provinceId);
}

export function getFeaturedAttractions(): AttractionData[] {
  return ATTRACTIONS.filter((a) => a.isFeatured === true);
}
