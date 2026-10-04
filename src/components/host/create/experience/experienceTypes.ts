import type { LocationState, DetailsState } from "../shared";

export interface ExperienceItineraryStop {
  time: string;
  title: string;
  description: string;
}

export interface ExperienceItemsState {
  whatsIncluded: string[];
  whatsNotIncluded: string[];
  whatToCarry: string[];
  whatNotToBring: string[];
  importantInformation: string[];
  notSuitableFor: string[];
  customWhatsIncluded?: string[];
  customWhatsNotIncluded?: string[];
  customWhatToCarry?: string[];
  customWhatNotToBring?: string[];
  customImportantInformation?: string[];
  customNotSuitableFor?: string[];
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
  itinerary?: ExperienceItineraryStop[];
  inventory?: ExperienceInventoryState;
  pricing: ExperiencePricingState;
  draftId?: string | null;
}
