import type { LocationState, DetailsState } from "../shared";

export interface TransportFeaturesState {
  vehicleFeatures: string[];
  whatToCarry: string[];
  guidelines: string[];
  customVehicleFeatures?: string[];
  customWhatToCarry?: string[];
  customGuidelines?: string[];
}

export interface TransportPricingState {
  currency: "ZMW";
  basePrice: number;
  rateUnit: "trip" | "day";
  multiDayDiscountEnabled: boolean;
  multiDayDiscountType: "percent" | "fixed";
  multiDayDiscountPercent: number;
  multiDayCustomPrice: number;
  groupCharterDiscountEnabled: boolean;
  groupCharterDiscountType: "percent" | "fixed";
  groupCharterDiscountPercent: number;
  groupCharterCustomPrice: number;
}

export interface TransportVehicleUnit {
  id: string;
  label: string;
  plateNumber?: string;
  seats: number;
}

export interface TransportInventoryState {
  fleetSize: number;
  units: TransportVehicleUnit[];
}

export interface TransportFormState {
  subtype: string;
  features: TransportFeaturesState;
  location: LocationState;
  images: string[];
  details: DetailsState;
  inventory?: TransportInventoryState;
  pricing: TransportPricingState;
  draftId?: string | null;
}
