import lodge from "@/assets/listing-lodge.jpg";
import hotel from "@/assets/listing-hotel.jpg";
import camp from "@/assets/listing-camp.jpg";
import guesthouse from "@/assets/listing-guesthouse.jpg";

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

export const getListing = (id: string) => listings.find((l) => l.id === id);
