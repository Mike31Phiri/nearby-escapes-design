export interface Stay {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  type?: string;
  [key: string]: unknown;
}
