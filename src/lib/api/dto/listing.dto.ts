import type {
  ListingSearchQuery,
  ListingSummaryDTO,
  ListingDetailDTO,
  CreateListingRequest,
  UpdateListingStatusRequest,
  ListingVertical,
  ListingStatus,
  Currency,
  CancellationPolicyType,
} from "@/types/backend-payloads";

export type {
  ListingSearchQuery,
  ListingSummaryDTO,
  ListingDetailDTO,
  CreateListingRequest,
  UpdateListingStatusRequest,
  ListingVertical,
  ListingStatus,
  Currency,
  CancellationPolicyType,
};

export interface ListingFilterQueryDto {
  vertical?: ListingVertical | "all";
  city?: string;
  province?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPriceNgwee?: number;
  maxPriceNgwee?: number;
  sort?: "price_asc" | "price_desc" | "rating" | "newest";
  page?: number;
  limit?: number;
}
