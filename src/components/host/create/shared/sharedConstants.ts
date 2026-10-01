import type { ListingType } from "@/types/listing";

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

export const SAMPLE_PHOTOS_BY_VERTICAL: Record<ListingType, string[]> = {
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
