/**
 * NEARBY ESCAPES — BACKEND API CONTRACT & PAYLOAD SPECIFICATION
 *
 * This file defines the exact Request and Response data shapes for all
 * endpoints required by the Nearby Escapes platform.
 *
 * BACKEND TEAMS (NestJS / Express / Django / FastAPI / Laravel / Go):
 * Implement endpoints matching these routes and payload contracts.
 */

// ============================================================================
// COMMON & SHARED TYPES
// ============================================================================

export type Currency = "ZMW" | "USD";

export type UserRole = "guest" | "host" | "admin";

export type ListingVertical = "stay" | "experience" | "transport" | "package";

export type ListingStatus = "active" | "draft" | "paused" | "archived";

export type BookingStatus = "confirmed" | "cancelled" | "completed";

export type PaymentStatus = "pending" | "successful" | "failed" | "refunded";

export type ScheduleItemType = "arriving" | "hosting" | "departing";

export type ScheduleItemStatus = "confirmed" | "checked_in" | "checked_out";

export type PayoutMethodType = "bank_transfer" | "mobile_money";

export type CancellationPolicyType = "flexible" | "moderate" | "strict";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: PaginationMeta;
}

// ============================================================================
// 1. AUTHENTICATION & SESSION (/api/auth)
// ============================================================================

/** POST /api/auth/register - Public Guest Registration */
export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role?: "guest"; // Host signup is separated from standard auth. Public registrations default to "guest".
}

export interface RegisterResponse {
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: UserRole;
    avatarUrl?: string;
    createdAt: string;
  };
  accessToken: string;
  refreshToken?: string;
}

/** POST /api/auth/login */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    role: UserRole;
    avatarUrl?: string;
  };
  accessToken: string;
  refreshToken?: string;
}

/** GET /api/auth/me */
export interface AuthMeResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  isHostVerified?: boolean;
  createdAt: string;
}

/** POST /api/auth/forgot-password */
export interface ForgotPasswordRequest {
  email: string;
}

/** POST /api/auth/reset-password */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

/** POST /api/auth/verify-otp */
export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

// ============================================================================
// 2. LISTINGS & DISCOVERY (/api/listings)
// ============================================================================

/** GET /api/listings (Search & Filter) */
export interface ListingSearchQuery {
  q?: string;
  vertical?: ListingVertical | "all";
  city?: string;
  province?: string;
  checkIn?: string; // YYYY-MM-DD
  checkOut?: string; // YYYY-MM-DD
  guests?: number;
  category?: string;
  minPriceNgwee?: number;
  maxPriceNgwee?: number;
  bedrooms?: number;
  amenities?: string[];
  sort?: "price_asc" | "price_desc" | "rating" | "popular" | "newest";
  page?: number;
  limit?: number;
}

export interface ListingSummaryDTO {
  id: string;
  vertical: ListingVertical;
  title: string;
  slug: string;
  city: string;
  province: string;
  featuredImage: string;
  images: string[];
  /** Nightly / per person rate in Ngwee (integer: ZMW × 100) */
  pricePerUnitNgwee: number;
  currency: Currency;
  rating: number;
  reviewCount: number;
  status: ListingStatus;
  host: {
    id: string;
    name: string;
    avatarUrl?: string;
    superhost?: boolean;
  };
}

/** GET /api/listings/:id */
export interface ListingDetailDTO extends ListingSummaryDTO {
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  cancellationPolicy: CancellationPolicyType;
  houseRules: string[];
  amenities: string[];
  // Stays-specific fields
  stayDetails?: {
    propertyType: string;
    bedrooms: number;
    beds: number;
    baths: number;
    maxGuests: number;
    checkInFrom: string; // "14:00"
    checkInUntil: string; // "20:00"
    checkOutBefore: string; // "11:00"
    unitsCount?: number;
  };
  // Experiences-specific fields
  experienceDetails?: {
    activityType: string;
    durationMinutes: number;
    maxParticipants: number;
    difficulty: "easy" | "moderate" | "challenging";
    whatsIncluded: string[];
    meetingPoint: string;
    timeSlots: string[];
  };
  // Transport-specific fields
  transportDetails?: {
    vehicleType: string;
    seatingCapacity: number;
    pickupLocation: string;
    dropoffLocation: string;
    includesDriver: boolean;
  };
}

/** POST /api/listings (Host create listing) */
export interface CreateListingRequest {
  vertical: ListingVertical;
  title: string;
  description: string;
  city: string;
  province: string;
  address: string;
  latitude?: number;
  longitude?: number;
  pricePerUnitNgwee: number;
  currency: Currency;
  images: string[];
  amenities: string[];
  houseRules: string[];
  cancellationPolicy: CancellationPolicyType;
  stayDetails?: {
    propertyType: string;
    bedrooms?: number;
    beds?: number;
    baths?: number;
    maxGuests?: number;
    checkInFrom?: string;
    checkInUntil?: string;
    checkOutBefore?: string;
    guestFavourites?: string[];
    standoutAmenities?: string[];
    safetyAmenities?: string[];
  };
  experienceDetails?: {
    activityType: string;
    durationMinutes?: number;
    maxParticipants?: number;
    difficulty?: "easy" | "moderate" | "challenging";
    whatsIncluded: string[];
    whatToBring?: string[];
    whatNotToBring?: string[];
    meetingPoint?: string;
    timeSlots?: string[];
  };
  transportDetails?: {
    vehicleType: string;
    seatingCapacity?: number;
    pickupLocation?: string;
    dropoffLocation?: string;
    includesDriver?: boolean;
    features?: string[];
    whatToBring?: string[];
    guidelines?: string[];
  };
}

/** PATCH /api/listings/:id/status */
export interface UpdateListingStatusRequest {
  status: ListingStatus;
}

// ============================================================================
// 2B. SAVED / WISHLISTS (/api/saved)
// ============================================================================

export interface SavedListingItemDTO {
  id: string;
  listingId: string;
  vertical: ListingVertical;
  title: string;
  city: string;
  province: string;
  featuredImage: string;
  pricePerUnitNgwee: number;
  currency: Currency;
  rating: number;
  reviewCount: number;
  savedAt: string;
}

/** GET /api/saved */
export interface GetSavedListingsResponse {
  data: SavedListingItemDTO[];
  total: number;
}

/** POST /api/saved/toggle */
export interface ToggleSavedListingRequest {
  listingId: string;
}

export interface ToggleSavedListingResponse {
  saved: boolean;
  listingId: string;
  totalSaved: number;
}

/** POST /api/saved */
export interface AddSavedListingRequest {
  listingId: string;
}

export interface AddSavedListingResponse {
  success: boolean;
  savedId: string;
  listingId: string;
  savedAt: string;
}

// ============================================================================
// 2C. HOMEPAGE FEEDS & POPULAR VERTICALS (/api/home/feed & /api/destinations)
// ============================================================================

export interface FlashDealDTO {
  id: string;
  name: string;
  location: string;
  originalPriceNgwee: number;
  dealPriceNgwee: number;
  discountPercent: number;
  badge: string;
  ends: string;
  image: string;
}

export interface PopularDestinationProvinceDTO {
  id: string;
  name: string;
  image: string;
  staysCount: number;
}

export interface PopularDestinationCityDTO {
  id: string;
  provinceId: string;
  name: string;
  image: string;
  staysCount: number;
}

export interface PopularTransportRouteDTO {
  id: string;
  from: string;
  to: string;
  operator: string;
  duration: string;
  departures: string;
  priceNgwee: number;
  image: string;
}

export interface PopularPackageDTO {
  id: string;
  name: string;
  location: string;
  duration: string;
  rating: number;
  priceNgwee: number;
  image: string;
}

/** GET /api/home/feed (Unified homepage feed for fast single-roundtrip load) */
export interface HomepageFeedResponse {
  popularStays: ListingSummaryDTO[];
  recommendedStays: ListingSummaryDTO[];
  flashDeals: FlashDealDTO[];
  popularExperiences: ListingSummaryDTO[];
  popularTransport: PopularTransportRouteDTO[];
  popularPackages: PopularPackageDTO[];
  topProvinces: PopularDestinationProvinceDTO[];
  topCities: PopularDestinationCityDTO[];
}

// ============================================================================
// 3. CALENDAR & AVAILABILITY (/api/availability)
// ============================================================================

/** GET /api/availability/:listingId?month=YYYY-MM */
export interface CalendarDayDTO {
  date: string; // YYYY-MM-DD
  status: "available" | "blocked" | "booked";
  /** Override price in Ngwee if seasonal rate active, else base price */
  effectivePriceNgwee: number;
  minimumStayNights: number;
  bookingRef?: string;
  guestName?: string;
}

/** POST /api/availability/block-dates */
export interface BlockDatesRequest {
  listingId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  reason?: string;
  unitId?: string; // Optional unit specification for multi-unit lodges
}

/** POST /api/availability/unblock-dates */
export interface UnblockDatesRequest {
  listingId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  unitId?: string;
}

/** POST /api/availability/pricing-rules */
export interface SetPricingRulesRequest {
  listingId: string;
  startDate: string;
  endDate: string;
  pricePerUnitNgwee: number;
  minimumStayNights?: number;
  weekendMultiplier?: number; // e.g. 1.15 for +15%
}

// ============================================================================
// 4. BOOKINGS & RESERVATIONS (/api/bookings)
// ============================================================================

/** POST /api/bookings (Create Reservation) */
export interface CreateBookingRequest {
  listingId: string;
  vertical: ListingVertical;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate?: string; // YYYY-MM-DD
  timeSlot?: string; // For experiences & tours
  guestCount: number;
  specialRequests?: string;
  guestDetails: {
    fullName: string;
    email: string;
    phone: string;
  };
  pricingSnapshot: {
    baseAmountNgwee: number;
    cleaningFeeNgwee?: number;
    serviceFeeNgwee: number;
    totalAmountNgwee: number;
    currency: Currency;
  };
}

export interface BookingResponseDTO {
  bookingId: string;
  bookingRef: string; // e.g. "NE-2026-8945"
  status: BookingStatus;
  listingId: string;
  listingTitle: string;
  vertical: ListingVertical;
  checkInDate: string;
  checkOutDate?: string;
  guestCount: number;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  totalAmountNgwee: number;
  currency: Currency;
  paymentStatus: PaymentStatus;
  qrCodeUrl?: string;
  createdAt: string;
}

/** POST /api/bookings/:bookingRef/cancel */
export interface CancelBookingRequest {
  bookingRef: string;
  reason: string;
  cancelledBy: "guest" | "host";
}

export interface CancelBookingResponse {
  bookingRef: string;
  status: "cancelled";
  refundAmountNgwee: number;
  penaltyFeeNgwee: number;
  cancellationDate: string;
}

// ============================================================================
// 5. PAYMENTS & DPO INTEGRATION (/api/payments)
// ============================================================================

/** POST /api/payments/create-token */
export interface CreatePaymentTokenRequest {
  bookingRef: string;
  amountNgwee: number;
  currency: Currency;
  paymentMethod?: "card" | "airtel_money" | "mtn_momo";
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  redirectUrls: {
    successUrl: string;
    cancelUrl: string;
    backUrl: string;
  };
}

export interface CreatePaymentTokenResponse {
  transToken: string;
  paymentUrl: string;
  bookingRef: string;
  expiresInSeconds: number;
}

/** POST /api/payments/verify (DPO Callback verification) */
export interface VerifyPaymentRequest {
  transToken: string;
  transactionId?: string;
}

export interface VerifyPaymentResponse {
  verified: boolean;
  status: "successful" | "failed" | "pending";
  bookingRef: string;
  receiptNumber?: string;
}

// ============================================================================
// 5B. HOST ONBOARDING & VERIFICATION (/api/host/onboard)
// ============================================================================

export type HostApplicationStatus = "pending_review" | "under_review" | "approved" | "rejected";

/** POST /api/host/onboard - Submit host KYC & business onboarding application */
export interface HostOnboardingRequest {
  businessName: string;
  operatingSince: string;
  province: string;
  town: string;
  businessEmail: string;
  businessPhone: string;
  pacraDocs: Array<{ id: string; name: string; url: string; size?: number }>;
  ownershipDocs: Array<{ id: string; name: string; url: string; size?: number }>;
  operationDocs: Array<{ id: string; name: string; url: string; size?: number }>;
}

export interface HostOnboardingResponse {
  applicationId: string;
  userId: string;
  businessName: string;
  status: HostApplicationStatus;
  submittedAt: string;
  message: string;
}

/** GET /api/host/application-status */
export interface HostApplicationStatusResponse {
  applicationId: string;
  status: HostApplicationStatus;
  businessName: string;
  submittedAt: string;
  reviewerNotes?: string | null;
}

// ============================================================================
// 6. HOST OPERATIONS & DASHBOARD (/api/host)
// ============================================================================

/** GET /api/host/overview */
export interface HostOverviewResponse {
  stats: {
    totalRevenueNgwee: number;
    activeListingsCount: number;
    todayCheckInsCount: number;
    todayCheckOutsCount: number;
    currentlyHostingCount: number;
    occupancyRatePercent: number;
    averageRating: number;
  };
  unreadNotificationsCount: number;
}

/** GET /api/host/schedule/today */
export interface HostScheduleQueueResponse {
  arriving: HostScheduleItemDTO[];
  hosting: HostScheduleItemDTO[];
  departing: HostScheduleItemDTO[];
}

export interface HostScheduleItemDTO {
  id: string;
  type: ScheduleItemType;
  listingType: ListingVertical;
  bookingRef: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  guestAvatar?: string;
  listingId: string;
  listingName: string;
  listingImage: string;
  checkInDate: string;
  checkOutDate?: string;
  timeSlot?: string;
  stayProgress?: string;
  guestCount: number;
  totalAmountNgwee: number;
  currency: Currency;
  status: ScheduleItemStatus;
}

/** PATCH /api/host/schedule/:id/check-in */
export interface CheckInGuestResponse {
  bookingRef: string;
  status: "checked_in";
  checkInTimestamp: string;
}

/** PATCH /api/host/schedule/:id/check-out */
export interface CheckOutGuestResponse {
  bookingRef: string;
  status: "checked_out";
  checkOutTimestamp: string;
}

/** GET /api/host/finances/summary */
export interface HostFinancesSummaryResponse {
  currency: Currency;
  availableBalanceNgwee: number;
  pendingPayoutsNgwee: number;
  lifetimeEarningsNgwee: number;
  nextPayoutDate: string;
  payoutMethods: HostPayoutMethodDTO[];
}

export interface HostPayoutMethodDTO {
  id: string;
  type: PayoutMethodType;
  isDefault: boolean;
  details: {
    bankName?: string; // e.g. "Absa Bank Zambia", "Stanbic", "Zanaco"
    accountNumber?: string;
    accountName?: string;
    branchCode?: string;
    swiftCode?: string;
    provider?: "Airtel Money" | "MTN Mobile Money";
    mobileNumber?: string;
  };
}

/** POST /api/host/payout-methods */
export interface AddPayoutMethodRequest {
  type: PayoutMethodType;
  isDefault?: boolean;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    branchCode?: string;
    swiftCode?: string;
  };
  mobileMoneyDetails?: {
    provider: "Airtel Money" | "MTN Mobile Money";
    mobileNumber: string;
    accountName: string;
  };
}

// ============================================================================
// 7. REVIEWS & RATINGS (/api/reviews)
// ============================================================================

/** POST /api/reviews (Guest submits review) */
export interface CreateReviewRequest {
  bookingRef: string;
  listingId: string;
  overallRating: number; // 1-5
  categoryRatings: {
    cleanliness: number;
    accuracy: number;
    communication: number;
    location: number;
    value: number;
  };
  reviewText: string;
  publicName: string;
}

export interface ReviewResponseDTO {
  id: string;
  bookingRef: string;
  listingId: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  reviewText: string;
  hostResponse?: {
    text: string;
    date: string;
  };
  createdAt: string;
}

// ============================================================================
// 8. HOST SUPPORT & HELP CENTER (/api/host/support)
// ============================================================================

/** POST /api/host/support/tickets */
export interface CreateHostSupportTicketRequest {
  topic: "payout" | "calendar" | "guest" | "verification" | "other";
  subject: string;
  message: string;
  listingId?: string;
  bookingRef?: string;
}

export interface HostSupportTicketResponse {
  ticketId: string;
  referenceNumber: string; // e.g. "TKT-8941"
  status: "open" | "in_progress" | "resolved";
  estimatedResponseTime: string; // "Within 2 hours"
  createdAt: string;
}
