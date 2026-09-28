import type { WizardStep } from "./ListingWizardShell";

export const STAY_STEPS: WizardStep[] = [
  {
    id: "type",
    label: "Property Type",
    fields: ["propertyType", "isMultiUnit", "isDedicated"],
  },
  {
    id: "location",
    label: "Location",
    fields: ["address", "city", "country", "latitude", "longitude", "arrivalInfo"],
  },
  {
    id: "capacity",
    label: "Capacity",
    fields: ["maxGuests", "bedrooms", "beds"],
  },
  {
    id: "amenities",
    label: "Amenities",
    fields: ["coreAmenities", "kitchenAmenities", "safetyAmenities", "outdoorAmenities"],
  },
  {
    id: "media",
    label: "Media & Title",
    fields: ["title", "slogan", "images"],
  },
  {
    id: "pricing",
    label: "Pricing & Rules",
    fields: ["baseRate", "cancelPolicy", "houseRules"],
  },
];

export const EXPERIENCE_STEPS: WizardStep[] = [
  {
    id: "overview",
    label: "Overview",
    fields: ["title", "category", "description", "images"],
  },
  {
    id: "logistics",
    label: "Logistics",
    fields: ["meetingPoint", "latitude", "longitude", "endPoint", "hotelPickup"],
  },
  {
    id: "schedule",
    label: "Schedule",
    fields: ["durationHours", "startTimes", "minGroup", "maxGroup"],
  },
  {
    id: "details",
    label: "Details",
    fields: ["inclusions", "exclusions", "difficulty", "minAge", "maxWeight"],
  },
  {
    id: "pricing",
    label: "Pricing",
    fields: ["priceAdult", "priceChild"],
  },
];

export const TRANSPORT_STEPS: WizardStep[] = [
  {
    id: "vehicle",
    label: "Vehicle Info",
    fields: ["make", "model", "year", "vehicleType", "transmission", "fuelType"],
  },
  {
    id: "photos",
    label: "Photos",
    fields: ["images"],
  },
  {
    id: "capacity",
    label: "Capacity",
    fields: ["passengers", "largeLuggage", "smallLuggage"],
  },
  {
    id: "scope",
    label: "Scope",
    fields: ["serviceType", "pricingType"],
  },
  {
    id: "legal",
    label: "Legal & Trust",
    fields: ["licensePlate", "registrationUrl", "insuranceUrl", "licenseUrl"],
  },
];

export const STEPS_BY_TYPE: Record<string, WizardStep[]> = {
  stay: STAY_STEPS,
  experience: EXPERIENCE_STEPS,
  transport: TRANSPORT_STEPS,
};
