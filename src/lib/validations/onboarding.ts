import * as z from "zod";

// ==========================================
// 1. STAY WIZARD SCHEMAS
// ==========================================

export const stayStep1Schema = z.object({
  propertyType: z.string().min(1, "Please select a property type"),
  isMultiUnit: z.boolean(),
  isDedicated: z.boolean(),
});

export const stayStep2Schema = z.object({
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  arrivalInfo: z.string().optional(),
});

export const stayStep3Schema = z.object({
  maxGuests: z.number().min(1, "Must accommodate at least 1 guest"),
  bedrooms: z.number().min(0, "Cannot be negative"),
  beds: z
    .array(
      z.object({
        room: z.string().min(1, "Room name is required"),
        beds: z.array(z.string()).min(1, "Must have at least one bed"),
      }),
    )
    .min(1, "Must define at least one room and bed"),
});

export const stayStep4Schema = z.object({
  coreAmenities: z.array(z.string()),
  kitchenAmenities: z.array(z.string()),
  safetyAmenities: z.array(z.string()),
  outdoorAmenities: z.array(z.string()),
});

export const stayStep5Schema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(60, "Title too long"),
  slogan: z.string().max(100, "Slogan too long").optional(),
  images: z.array(z.string()).min(3, "Please upload at least 3 images"),
});

export const stayStep6Schema = z.object({
  baseRate: z.number().min(10, "Minimum rate is $10"),
  cancelPolicy: z.string().min(1, "Please select a cancellation policy"),
  houseRules: z.array(z.string()),
});

export const staySchema = stayStep1Schema
  .merge(stayStep2Schema)
  .merge(stayStep3Schema)
  .merge(stayStep4Schema)
  .merge(stayStep5Schema)
  .merge(stayStep6Schema);

export type StayFormValues = z.infer<typeof staySchema>;

// ==========================================
// 2. TRANSPORT WIZARD SCHEMAS
// ==========================================

export const transportStep1Schema = z.object({
  make: z.string().min(2, "Make is required"),
  model: z.string().min(2, "Model is required"),
  year: z
    .number()
    .min(1990, "Year must be 1990 or newer")
    .max(new Date().getFullYear() + 1),
  transmission: z.enum(["Automatic", "Manual"]),
  fuelType: z.enum(["Gasoline", "Diesel", "Electric", "Hybrid"]),
});

export const transportStep2Schema = z.object({
  passengers: z.number().min(1, "Must allow at least 1 passenger"),
  largeLuggage: z.number().min(0),
  smallLuggage: z.number().min(0),
});

export const transportStep3Schema = z.object({
  serviceType: z.enum(["self-drive", "chauffeured", "both"]),
  pricingType: z.enum(["daily", "distance"]),
  dailyRate: z.number().min(0).optional(),
  perKmRate: z.number().min(0).optional(),
});

export const transportStep4Schema = z.object({
  licensePlate: z.string().min(3, "License plate is required"),
  registrationUrl: z.string().min(1, "Registration document is required"),
  insuranceUrl: z.string().min(1, "Insurance document is required"),
  licenseUrl: z.string().min(1, "Driver's license is required"),
});

export const transportSchema = transportStep1Schema
  .merge(transportStep2Schema)
  .merge(transportStep3Schema)
  .merge(transportStep4Schema);

export type TransportFormValues = z.infer<typeof transportSchema>;

// ==========================================
// 3. EXPERIENCE WIZARD SCHEMAS
// ==========================================

export const experienceStep1Schema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(60),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(50, "Please provide a detailed description (min 50 chars)"),
});

export const experienceStep2Schema = z.object({
  meetingPoint: z.string().min(5, "Meeting point is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  endPoint: z.string().optional(),
  hotelPickup: z.boolean(),
});

export const experienceStep3Schema = z
  .object({
    durationHours: z.number().min(0.5, "Duration must be at least 30 minutes"),
    startTimes: z.array(z.string()).min(1, "Must provide at least one start time"),
    minGroup: z.number().min(1),
    maxGroup: z.number().min(1),
  })
  .refine((data) => data.maxGroup >= data.minGroup, {
    message: "Max group size must be greater than or equal to min group size",
    path: ["maxGroup"],
  });

export const experienceStep4Schema = z.object({
  inclusions: z.array(z.string()),
  exclusions: z.array(z.string()),
  difficulty: z.enum(["Easy", "Moderate", "Challenging", "Extreme"]),
  minAge: z.number().nullable().optional(),
  maxWeight: z.number().nullable().optional(),
});

export const experienceStep5Schema = z.object({
  priceAdult: z.number().min(5, "Minimum price is $5"),
  priceChild: z.number().min(0, "Cannot be negative"),
});

export const experienceSchema = experienceStep1Schema
  .and(experienceStep2Schema)
  .and(experienceStep3Schema)
  .and(experienceStep4Schema)
  .and(experienceStep5Schema);

export type ExperienceFormValues = z.infer<typeof experienceSchema>;

// ==========================================
// 4. GEM (ATTRACTION) WIZARD SCHEMAS
// ==========================================

export const gemStep1Schema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(80, "Title too long"),
  category: z.enum([
    "waterfall",
    "game-reserve",
    "heritage-site",
    "viewpoint",
    "natural-landmark",
    "other",
  ]),
  description: z.string().min(30, "Please provide at least 30 characters of description"),
});

export const gemStep2Schema = z.object({
  address: z.string().min(5, "Address is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accessInstructions: z.string().optional(),
});

export const gemStep3Schema = z.object({
  bestTimeToVisit: z.string().min(5, "Describe the best time to visit"),
});

export const gemStep4Schema = z.object({
  images: z.array(z.string()).min(1, "Please upload at least one image"),
});

export const gemSchema = gemStep1Schema
  .merge(gemStep2Schema)
  .merge(gemStep3Schema)
  .merge(gemStep4Schema);

export type GemFormValues = z.infer<typeof gemSchema>;
