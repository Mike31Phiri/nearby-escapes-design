import type { LocationState, DetailsState } from "../shared";

export interface StayAmenitiesState {
  guestFavourites: string[];
  standouts: string[];
  safety: string[];
  customGuestFavourites?: string[];
  customStandouts?: string[];
  customSafety?: string[];
}

export interface StayPricingState {
  currency: "ZMW";
  basePrice: number;
  groupDiscountEnabled: boolean;
  groupDiscountType: "percent" | "fixed";
  groupDiscountPercent: number;
  groupDiscountCustomPrice: number;
  extendedStayDiscountEnabled: boolean;
  extendedStayDiscountType: "percent" | "fixed";
  extendedStayDiscountPercent: number;
  extendedStayCustomPrice: number;
}

export interface StayRoomUnit {
  id: string;
  name: string;
  type: string;
  maxGuests: number;
}

export interface StayInventoryState {
  roomCount: number;
  units: StayRoomUnit[];
}

export interface StayFormState {
  subtype: string;
  amenities: StayAmenitiesState;
  location: LocationState;
  images: string[];
  details: DetailsState;
  inventory?: StayInventoryState;
  pricing: StayPricingState;
  draftId?: string | null;
}
