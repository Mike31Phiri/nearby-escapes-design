// ─────────────────────────────────────────────────────────────────────────────
// DATA LAYER — single switching point between mock and real API
//
// HOW TO SWITCH TO REAL BACKEND:
//   1. Set NEXT_PUBLIC_API_URL=https://your-api.com in .env.local
//   2. Set NEXT_PUBLIC_USE_MOCK=false in .env.local
//   3. Implement each "TODO: replace" function below using apiRequest()
//   4. Delete mock-data.ts when all endpoints are live
// ─────────────────────────────────────────────────────────────────────────────

import { apiRequest } from "./api";
import {
  mockStays,
  mockTransport,
  mockExperiences,
  mockGems,
  mockPackages,
  mockDestinations,
  mockBookingResponse,
  type MockTransport,
  type MockExperience,
  type MockGem,
  type MockPackage,
} from "./mock-data";
import type { Stay } from "@/types/stay";
import type { Booking } from "@/types/booking";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

// ── Stays ─────────────────────────────────────────────────────────────────────

export async function getStays(): Promise<Stay[]> {
  if (USE_MOCK) return mockStays;
  // TODO: replace → return apiRequest<Stay[]>("/stays");
  return apiRequest<Stay[]>("/stays");
}

export async function getStay(id: string): Promise<Stay | undefined> {
  if (USE_MOCK) return mockStays.find((s) => s.id === id);
  // TODO: replace → return apiRequest<Stay>(`/stays/${id}`);
  return apiRequest<Stay>(`/stays/${id}`);
}

// ── Transport ─────────────────────────────────────────────────────────────────

export async function getTransport(): Promise<MockTransport[]> {
  if (USE_MOCK) return mockTransport;
  // TODO: replace → return apiRequest<MockTransport[]>("/transport");
  return apiRequest<MockTransport[]>("/transport");
}

// ── Experiences ───────────────────────────────────────────────────────────────

export async function getExperiences(): Promise<MockExperience[]> {
  if (USE_MOCK) return mockExperiences;
  // TODO: replace → return apiRequest<MockExperience[]>("/experiences");
  return apiRequest<MockExperience[]>("/experiences");
}

// ── Gems ──────────────────────────────────────────────────────────────────────

export async function getGems(): Promise<MockGem[]> {
  if (USE_MOCK) return mockGems;
  // TODO: replace → return apiRequest<MockGem[]>("/gems");
  return apiRequest<MockGem[]>("/gems");
}

// ── Packages ──────────────────────────────────────────────────────────────────

export async function getPackages(): Promise<MockPackage[]> {
  if (USE_MOCK) return mockPackages;
  // TODO: replace → return apiRequest<MockPackage[]>("/packages");
  return apiRequest<MockPackage[]>("/packages");
}

export async function getPackage(id: string): Promise<MockPackage | undefined> {
  if (USE_MOCK) return mockPackages.find((p) => p.id === id);
  // TODO: replace → return apiRequest<MockPackage>(`/packages/${id}`);
  return apiRequest<MockPackage>(`/packages/${id}`);
}

// ── Destinations ──────────────────────────────────────────────────────────────

export async function getDestinations() {
  if (USE_MOCK) return mockDestinations;
  // TODO: replace → return apiRequest("/destinations/popular");
  return apiRequest("/destinations/popular");
}

// ── Reviews ──────────────────────────────────────────────────────────────────

export type Review = {
  id: string;
  from: string;
  rating: number;
  text: string;
  listing: string;
  date: string;
};

export async function getUserReviews(userId: string, token?: string): Promise<Review[]> {
  if (USE_MOCK) return [];
  // TODO: replace → return apiRequest<Review[]>(`/users/${userId}/reviews`, { token });
  return apiRequest<Review[]>(`/users/${userId}/reviews`, { token });
}

export async function getListingReviews(listingId: string): Promise<Review[]> {
  if (USE_MOCK) return [];
  // TODO: replace → return apiRequest<Review[]>(`/stays/${listingId}/reviews`);
  return apiRequest<Review[]>(`/stays/${listingId}/reviews`);
}

// ── Bookings ──────────────────────────────────────────────────────────────────

export async function createBooking(payload: unknown, token?: string): Promise<Booking> {
  if (USE_MOCK) return mockBookingResponse;
  // TODO: replace → return apiRequest<Booking>("/bookings", { method: "POST", body: payload, token });
  return apiRequest<Booking>("/bookings", { method: "POST", body: payload, token });
}

export async function getBookings(token?: string): Promise<Booking[]> {
  if (USE_MOCK) return [mockBookingResponse];
  // TODO: replace → return apiRequest<Booking[]>("/bookings", { token });
  return apiRequest<Booking[]>("/bookings", { token });
}

// ── Re-export types so pages only need one import ─────────────────────────────
export type { Stay, Booking, MockTransport, MockExperience, MockGem, MockPackage };

// ── Sync helpers (for client components that can't use async) ─────────────────
// These stay mock-only until you add a client-side SWR/React Query layer
export { mockStays as listings, mockTransport, mockExperiences, mockGems, mockPackages };
