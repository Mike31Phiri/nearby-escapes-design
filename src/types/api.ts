/**
 * API Contract Types
 *
 * This file defines the expected request/response shapes for every
 * backend (NestJS) endpoint. Used by the apiClient for type-safe calls.
 *
 * Convention:
 *   - Req* = Request body type
 *   - Res* = Response body type
 *   - *DTO  = Data Transfer Object (server-side entity shape)
 */

import type { User as AuthUser } from "@/types/user";
import type { ConfirmedBooking } from "@/store/bookingStore";
import type { AppNotification, NotificationType } from "@/store/notificationStore";
import type { Review } from "@/store/reviewStore";

//Generic API Envelope ─────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp?: string;
  path?: string;
}

//Auth ─────────────────────────────────────────────────────────────────

export type ResAuthUser = AuthUser;

export interface ReqLogin {
  email: string;
  password: string;
}

export interface ResLogin {
  user: AuthUser;
  /** Set as httpOnly cookie by server; included here for reference */
  accessToken?: string;
}

export interface ReqRegister {
  name: string;
  email: string;
  password: string;
  role?: "guest" | "host";
}

export interface ResRegister {
  user: AuthUser;
  message: string;
}

export interface ReqForgotPassword {
  email: string;
}

export interface ReqResetPassword {
  token: string;
  password: string;
}

//Listings ─────────────────────────────────────────────────────────────

export type ListingType = "stay" | "experience" | "transport";

export interface ListingDTO {
  id: string;
  type: ListingType;
  name: string;
  description: string;
  location: string;
  images: string[];
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  hostId: string;
  hostName: string;
  status: "active" | "inactive" | "draft";
  createdAt: string;
  updatedAt: string;
}

export interface StayDTO extends ListingDTO {
  type: "stay";
  bedrooms: number;
  beds: number;
  baths: number;
  maxGuests: number;
  amenities: string[];
  checkInFrom: string;
  checkInUntil: string;
  checkOutBefore: string;
  cancellationPolicy: "flexible" | "moderate" | "strict";
}

export interface ExperienceDTO extends ListingDTO {
  type: "experience";
  duration: string;
  maxParticipants: number;
  difficultyLevel: "easy" | "moderate" | "challenging";
  whatsIncluded: string[];
  meetingPoint: string;
  timeSlots: string[];
}

export interface TransportDTO extends ListingDTO {
  type: "transport";
  from: string;
  to: string;
  vehicleType: string;
  capacity: number;
  duration: string;
  schedule: {
    frequency: "daily" | "weekly" | "custom";
    departureTimes: string[];
  };
}

export interface ReqCreateStay {
  name: string;
  description: string;
  propertyType: string;
  bedrooms: number;
  beds: number;
  baths: number;
  maxGuests: number;
  location: string;
  amenities: string[];
  images: string[];
  pricePerNight: number;
  checkInFrom: string;
  checkInUntil: string;
  checkOutBefore: string;
  houseRules: string[];
  cancellationPolicy: "flexible" | "moderate" | "strict";
}

export interface ReqCreateExperience {
  name: string;
  description: string;
  activityType: string;
  duration: string;
  maxParticipants: number;
  difficultyLevel: "easy" | "moderate" | "challenging";
  whatsIncluded: string[];
  meetingPoint: string;
  timeSlots: string[];
  images: string[];
  pricePerPerson: number;
}

export interface ReqCreateTransport {
  name: string;
  description: string;
  from: string;
  to: string;
  vehicleType: string;
  capacity: number;
  pricePerSeat: number;
  schedule: {
    frequency: "daily" | "weekly" | "custom";
    departureTimes: string[];
  };
  images: string[];
}

export interface ReqListingSearch {
  type?: ListingType | "all";
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sort?: "price_asc" | "price_desc" | "rating" | "newest";
}

//Bookings ─────────────────────────────────────────────────────────────

export interface BookingDTO extends Omit<ConfirmedBooking, "status"> {
  status: "pending" | "confirmed" | "cancelled" | "completed";
  type: ListingType;
  guestId: string;
  hostId: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReqCreateBooking {
  listingId: string;
  listingType: ListingType;
  checkIn?: string;
  checkOut?: string;
  date?: string;
  guests: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  specialRequests?: string;
}

export interface ReqCancelBooking {
  bookingRef: string;
  reason?: string;
}

//Payments ─────────────────────────────────────────────────────────────

export interface ReqCreatePaymentToken {
  bookingRef: string;
  amount: number;
  currency: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  listing: {
    id: string;
    name: string;
    type: ListingType;
  };
  details: {
    checkIn?: string;
    checkOut?: string;
    date?: string;
    guests: number;
  };
}

export interface ResCreatePaymentToken {
  success: boolean;
  transToken: string;
  paymentUrl: string;
  bookingRef: string;
  message: string;
}

//Reviews ──────────────────────────────────────────────────────────────

export interface ReviewDTO extends Review {
  id: string;
  listingId: string;
  bookingRef: string;
  guestId: string;
  guestName: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface ReqCreateReview {
  listingId: string;
  bookingRef: string;
  rating: number;
  text: string;
}

//Notifications ────────────────────────────────────────────────────────

export interface NotificationDTO extends Omit<AppNotification, "read"> {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface ResNotificationList {
  notifications: NotificationDTO[];
  unreadCount: number;
}

//User Profile ─────────────────────────────────────────────────────────

export interface UserProfileDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: "guest" | "host" | "admin";
  homeCity?: string;
  bio?: string;
  joinedAt: string;
  stats: {
    totalBookings: number;
    totalReviews: number;
    memberSince: string;
  };
}

export interface ReqUpdateProfile {
  name?: string;
  phone?: string;
  avatar?: string;
  homeCity?: string;
  bio?: string;
}

//Host Dashboard ───────────────────────────────────────────────────────

export interface HostDashboardDTO {
  stats: {
    totalListings: number;
    activeListings: number;
    totalBookings: number;
    pendingBookings: number;
    totalRevenue: number;
    averageRating: number;
    reviewCount: number;
  };
  recentBookings: BookingDTO[];
  recentReviews: ReviewDTO[];
  earningsByMonth: Array<{
    month: string;
    amount: number;
    bookingCount: number;
  }>;
}

//Admin ────────────────────────────────────────────────────────────────

export interface AdminDashboardDTO {
  stats: {
    totalUsers: number;
    totalHosts: number;
    totalGuests: number;
    totalListings: number;
    totalBookings: number;
    totalRevenue: number;
    pendingDisputes: number;
  };
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    joinedAt: string;
  }>;
  recentBookings: BookingDTO[];
  revenueByMonth: Array<{
    month: string;
    amount: number;
  }>;
}

//Availability ─────────────────────────────────────────────────────────

export interface AvailabilityDTO {
  listingId: string;
  date: string; // ISO "YYYY-MM-DD"
  status: "available" | "blocked" | "booked";
  price?: number; // Effective price with seasonal adjustments
}

export interface ReqBlockDates {
  listingId: string;
  dateFrom: string;
  dateTo: string;
}

//Messages ─────────────────────────────────────────────────────────────

export interface MessageDTO {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
  read: boolean;
}

export interface ConversationDTO {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  lastMessage?: MessageDTO;
  unreadCount: number;
  listingId?: string;
  listingName?: string;
}

//Wishlist ─────────────────────────────────────────────────────────────

export interface WishlistDTO {
  id: string;
  userId: string;
  items: ListingDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface ReqAddToWishlist {
  listingId: string;
  listingType: ListingType;
}
