import { apiRequest } from "./client";
import type { Stay } from "@/types/stay";
import type { MockTransport, MockExperience, MockPackage } from "@/lib/mock-data";

export const getPopularAccommodations = () =>
  apiRequest<Stay[]>("/popular/accommodations");

export const getPopularBuses = () =>
  apiRequest<MockTransport[]>("/popular/buses");

export const getPopularAttractions = () =>
  apiRequest<MockExperience[]>("/popular/attractions");

export const getPopularPackages = () =>
  apiRequest<MockPackage[]>("/popular/packages");
