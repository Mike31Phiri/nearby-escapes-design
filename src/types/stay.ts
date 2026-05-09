export type StayCategory = "Lodge" | "Hotel" | "Camp" | "Guesthouse";

export type Stay = {
  id: string;
  name: string;
  location: string;
  price: number;
  priceZmw: number;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  category: StayCategory;
  description: string;
  amenities: string[];
  maxGuests: number;
  host: {
    id: string;
    displayName: string;
    avatarUrl?: string;
    location: string;
    verified: boolean;
  };
};
