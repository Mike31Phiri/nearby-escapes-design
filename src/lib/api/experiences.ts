/**
 * experiences.ts — Experiences API stubs
 *
 * All prices are integers in Ngwee (ZMW × 100). Never float.
 * All listings are Instant Book — no pending approval flow.
 *
 * TODO: Connect to real API
 */

import apiClient from "./client";
import type { ExperienceListing, ExperienceDifficulty } from "@/types/listing";

export interface ExperienceSearchQuery {
  province?: string;
  date?: string;
  category?: string;
  groupSize?: number;
  /** Minimum per-adult price in Ngwee (integer) */
  minPriceNgwee?: number;
  /** Maximum per-adult price in Ngwee (integer) */
  maxPriceNgwee?: number;
  difficulty?: ExperienceDifficulty;
  page?: number;
  limit?: number;
}

export interface ExperienceSearchResult {
  data: ExperienceListing[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateExperiencePayload {
  title: string;
  description: string;
  category: string;
  durationHours: number;
  meetingPointAddress: string;
  meetingLatitude: number;
  meetingLongitude: number;
  difficulty: ExperienceDifficulty;
  minAge: number;
  maxGroupSize: number;
  minGroupSize: number;
  inclusions: string[];
  exclusions: string[];
  images: string[];
  /** Per-adult price in Ngwee (integer). Never float. */
  pricePerAdultNgwee: number;
  /** Per-child price in Ngwee (integer). Never float. */
  pricePerChildNgwee: number;
  location: {
    address: string;
    city: string;
    province: string;
    latitude: number;
    longitude: number;
  };
}

/** Search / list experiences with optional filters. */
export const searchExperiences = async (
  query: ExperienceSearchQuery,
): Promise<ExperienceSearchResult> => {
  const { data } = await apiClient.get<ExperienceSearchResult>("/listings", {
    params: { type: "EXPERIENCE", ...query },
  });
  return data;
};

/** Fetch a single experience by ID or slug. */
export const getExperience = async (idOrSlug: string): Promise<ExperienceListing> => {
  const { data } = await apiClient.get<ExperienceListing>(`/listings/experiences/${idOrSlug}`);
  return data;
};

/** Create a new experience listing (host only). */
export const createExperience = async (
  payload: CreateExperiencePayload,
): Promise<ExperienceListing> => {
  // Map frontend payload to backend DTO
  const dto = {
    name: payload.title,
    description: payload.description,
    activityType: payload.category,
    duration: `${payload.durationHours} hours`,
    maxParticipants: payload.maxGroupSize,
    difficultyLevel: payload.difficulty?.toLowerCase(),
    whatsIncluded: payload.inclusions,
    meetingPoint: payload.meetingPointAddress,
    images: payload.images,
    pricePerPerson: payload.pricePerAdultNgwee,
    location:
      typeof payload.location === "object"
        ? `${payload.location.city}, ${payload.location.province}`
        : payload.location,
  };

  const { data } = await apiClient.post<ExperienceListing>("/listings/experiences", dto);
  return data;
};

/** Update an existing experience listing (host only). */
export const updateExperience = async (
  id: string,
  payload: Partial<CreateExperiencePayload>,
): Promise<ExperienceListing> => {
  const { data } = await apiClient.put<ExperienceListing>(`/listings/experiences/${id}`, payload);
  return data;
};

/** Delete / deactivate an experience listing (host only). */
export const deleteExperience = async (id: string): Promise<{ success: boolean }> => {
  await apiClient.delete(`/listings/${id}`);
  return { success: true };
};
