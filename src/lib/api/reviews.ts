/**
 * reviews.ts — Guest & Platform Reviews Service
 *
 * Dedicated guest API service for:
 * 1. Fetching reviews submitted by the current authenticated guest (GET /api/reviews/user).
 *    Uses the guest's authenticated session/ID to return only their authored reviews.
 * 2. Creating a review as a guest for a completed booking (POST /api/reviews).
 * 3. Fetching public reviews for a property/listing (GET /api/reviews/property/:id).
 */

import apiClient from "./client";

export interface ReviewItemDto {
  id: string;
  propertyId: string;
  listingId?: string;
  bookingRef?: string | null;
  guestId: string;
  guestName: string;
  rating: number;
  text?: string;
  createdAt: string;
  propertyName?: string;
  listingName?: string;
}

export interface CreateReviewInput {
  propertyId?: string;
  listingId?: string;
  bookingRef?: string;
  rating: number;
  text?: string;
}

/**
 * Fetch all reviews authored by the currently authenticated guest.
 * GET /api/reviews/user
 *
 * The backend filters strictly by the authenticated user's ID (guestId).
 */
export const getMyGuestReviews = async (): Promise<ReviewItemDto[]> => {
  try {
    const { data } = await apiClient.get<ReviewItemDto[]>("/reviews/user");
    return data;
  } catch {
    return [];
  }
};

/**
 * Submit a review as a guest for a stay or experience.
 * POST /api/reviews
 *
 * The backend verifies that the booking belongs to the caller's userId
 * and is completed before recording the review.
 */
export const createGuestReview = async (payload: CreateReviewInput): Promise<ReviewItemDto> => {
  const { data } = await apiClient.post<ReviewItemDto>("/reviews", payload);
  return data;
};

/**
 * Fetch reviews for a specific property or listing (public).
 * GET /api/reviews/property/:propertyId
 */
export const getPropertyReviews = async (propertyId: string): Promise<ReviewItemDto[]> => {
  try {
    const { data } = await apiClient.get<ReviewItemDto[]>(`/reviews/property/${propertyId}`);
    return data;
  } catch {
    try {
      const { data } = await apiClient.get<ReviewItemDto[]>(`/reviews/listing/${propertyId}`);
      return data;
    } catch {
      return [];
    }
  }
};
