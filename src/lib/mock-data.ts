export type Listing = {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  category: "Lodge" | "Hotel" | "Camp" | "Guesthouse";
  description: string;
};

const lodge = "/images/listing-lodge.jpg";
const hotel = "/images/listing-hotel.jpg";
const camp = "/images/listing-camp.jpg";
const guesthouse = "/images/listing-guesthouse.jpg";

export const listings: Listing[] = [
  {
    id: "mosi-oa-tunya-lodge",
    name: "Mosi-oa-Tunya Lodge",
    location: "Livingstone",
    price: 220,
    rating: 4.9,
    reviews: 312,
    image: lodge,
    category: "Lodge",
    description: "Luxury riverside lodge with views of the mighty Victoria Falls.",
  },
  {
    id: "lusaka-skyline-suite",
    name: "Skyline Boutique Suite",
    location: "Lusaka",
    price: 145,
    rating: 4.7,
    reviews: 198,
    image: hotel,
    category: "Hotel",
    description: "Modern boutique hotel in the heart of Lusaka's business district.",
  },
  {
    id: "luangwa-tented-camp",
    name: "Luangwa Tented Camp",
    location: "South Luangwa",
    price: 310,
    rating: 4.95,
    reviews: 421,
    image: camp,
    category: "Camp",
    description: "Authentic safari tented camp deep in South Luangwa National Park.",
  },
  {
    id: "zambezi-riverside",
    name: "Zambezi Riverside House",
    location: "Lower Zambezi",
    price: 175,
    rating: 4.8,
    reviews: 256,
    image: guesthouse,
    category: "Guesthouse",
    description: "Peaceful wooden guesthouse on the banks of the Zambezi.",
  },
  {
    id: "kafue-eco-lodge",
    name: "Kafue Eco Lodge",
    location: "Kafue",
    price: 195,
    rating: 4.85,
    reviews: 174,
    image: lodge,
    category: "Lodge",
    description: "Sustainable eco lodge surrounded by Kafue National Park.",
  },
  {
    id: "ndola-business-hotel",
    name: "Copperbelt Business Hotel",
    location: "Ndola",
    price: 110,
    rating: 4.5,
    reviews: 142,
    image: hotel,
    category: "Hotel",
    description: "Comfortable business-class hotel in central Ndola.",
  },
  {
    id: "chipata-bush-camp",
    name: "Chipata Bush Camp",
    location: "Chipata",
    price: 130,
    rating: 4.6,
    reviews: 98,
    image: camp,
    category: "Camp",
    description: "Rustic bush camp gateway to South Luangwa adventures.",
  },
  {
    id: "kitwe-garden-stay",
    name: "Kitwe Garden Stay",
    location: "Kitwe",
    price: 95,
    rating: 4.4,
    reviews: 87,
    image: guesthouse,
    category: "Guesthouse",
    description: "Cozy garden guesthouse perfect for family getaways.",
  },
];

export type Package = {
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
  itinerary: { day: number; title: string; desc: string }[];
};

export const packages: Package[] = [
  {
    id: "luxury-zambezi-escape",
    name: "Luxury Zambezi Escape",
    tagline: "4 Days of pure riverside bliss",
    price: 850,
    rating: 4.9,
    reviews: 84,
    image: "/images/hero-zambia.jpg",
    duration: "4 Days / 3 Nights",
    location: "Livingstone",
    description: "Experience the ultimate luxury on the banks of the Zambezi. This all-inclusive package includes luxury accommodation, private sunset cruises, and a guided tour of the Victoria Falls.",
    highlights: ["Luxury Riverside Suite", "Private Sunset Cruise", "Victoria Falls Guided Tour", "All-inclusive Dining"],
    itinerary: [
      { day: 1, title: "Arrival & Sunset Cruise", desc: "Arrive in Livingstone and check into your luxury lodge. Enjoy a private sunset cruise on the Zambezi." },
      { day: 2, title: "Victoria Falls Exploration", desc: "Guided tour of the Victoria Falls followed by a scenic helicopter flight." },
      { day: 3, title: "Leisure & Spa", desc: "A relaxing day with spa treatments and high tea overlooking the river." },
      { day: 4, title: "Departure", desc: "Enjoy a final breakfast before your transfer to the airport." }
    ]
  },
  {
    id: "safari-adventure-luangwa",
    name: "Safari Adventure Luangwa",
    tagline: "Into the heart of the wild",
    price: 1200,
    rating: 4.95,
    reviews: 126,
    image: "/images/listing-camp.jpg",
    duration: "5 Days / 4 Nights",
    location: "South Luangwa",
    description: "Immerse yourself in one of Africa's greatest wildlife sanctuaries. Enjoy daily game drives, walking safaris, and luxury tented accommodation.",
    highlights: ["Big Five Game Drives", "Walking Safaris", "Luxury Tented Camp", "Bush Dinners"],
    itinerary: [
      { day: 1, title: "Bush Welcome", desc: "Arrival at the camp and an evening game drive." },
      { day: 2, title: "The Walking Safari", desc: "Experience the wild on foot with expert guides." },
      { day: 3, title: "Game Drives", desc: "Morning and afternoon game drives to spot leopards and lions." },
      { day: 4, title: "Cultural Experience", desc: "Visit a local village and enjoy a traditional bush dinner." },
      { day: 5, title: "Farewell Drive", desc: "Early morning drive before departure." }
    ]
  },
  {
    id: "kafue-wilderness-trek",
    name: "Kafue Wilderness Trek",
    tagline: "Remote, wild, and untouched",
    price: 950,
    rating: 4.8,
    reviews: 42,
    image: "/images/listing-lodge.jpg",
    duration: "6 Days / 5 Nights",
    location: "Kafue",
    description: "Explore the vast and diverse landscapes of Kafue National Park. This package is perfect for nature lovers and those seeking solitude.",
    highlights: ["Remote Wilderness", "Boat Safaris", "Bird Watching", "Eco-friendly Lodging"],
    itinerary: [
      { day: 1, title: "Journey to Kafue", desc: "Travel to the remote heart of the park." },
      { day: 2, title: "River Exploration", desc: "Boat safari on the Kafue River." },
      { day: 3, title: "Savannah Drive", desc: "Full day drive to the Busanga Plains." },
      { day: 4, title: "Birding Safari", desc: "Expert-led bird watching session." },
      { day: 5, title: "Nature Walk", desc: "Guided walk focused on smaller flora and fauna." },
      { day: 6, title: "Departure", desc: "Scenic flight back to Lusaka." }
    ]
  }
];

export const getListing = (id: string) => listings.find((l) => l.id === id);
export const getPackage = (id: string) => packages.find((p) => p.id === id);
