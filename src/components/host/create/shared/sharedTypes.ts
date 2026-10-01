export interface LocationState {
  province: string;
  city: string;
  district: string;
  address: string;
  coordinates: { lat: number; lng: number };
}

export interface DetailsState {
  title: string;
  description: string;
}
