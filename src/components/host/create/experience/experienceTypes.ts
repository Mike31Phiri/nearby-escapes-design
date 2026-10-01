import type { LocationState, DetailsState } from "../shared";

export interface ExperienceItemsState {
  whatsIncluded: string[];
  whatToCarry: string[];
  whatNotToBring: string[];
  customWhatsIncluded?: string[];
  customWhatToCarry?: string[];
  customWhatNotToBring?: string[];
}

export interface ExperiencePricingState {
  currency: "ZMW";
  basePrice: number;
  groupDiscountEnabled: boolean;
  groupDiscountType: "percent" | "fixed";
  groupDiscountPercent: number;
  groupDiscountCustomPrice: number;
}

export interface ExperienceSlotUnit {
  id: string;
  label: string;
  timeSlot: string;
  capacity: number;
}

export interface ExperienceInventoryState {
  slots: ExperienceSlotUnit[];
}

export interface ExperienceFormState {
  subtype: string;
  items: ExperienceItemsState;
  location: LocationState;
  images: string[];
  details: DetailsState;
  inventory?: ExperienceInventoryState;
  pricing: ExperiencePricingState;
  draftId?: string | null;
}
