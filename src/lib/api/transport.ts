/**
 * transport.ts — Transport API stubs
 *
 * All prices are integers in Ngwee (ZMW × 100). Never float.
 * All listings are Instant Book — no pending approval flow.
 *
 * TODO: Connect to real API
 */

import apiClient from "./client";
import type {
  TransportListing,
  TransportServiceType,
  Transmission,
  FuelType,
} from "@/types/listing";

export interface TransportSearchQuery {
  from?: string;
  to?: string;
  date?: string;
  seats?: number;
  serviceType?: TransportServiceType;
  page?: number;
  limit?: number;
}

export interface TransportSearchResult {
  data: TransportListing[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateTransportPayload {
  title: string;
  description: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  transmission: Transmission;
  fuelType: FuelType;
  passengerCapacity: number;
  serviceType: TransportServiceType;
  images: string[];
  location: {
    address: string;
    city: string;
    province: string;
    latitude: number;
    longitude: number;
  };
  /** Daily rate in Ngwee (integer). Never float. */
  dailyRateNgwee: number;
  /** Per-km rate in Ngwee (integer). Never float. */
  perKmRateNgwee: number;
}

/** Search / list transport listings with optional filters. */
export const searchTransport = async (
  query: TransportSearchQuery,
): Promise<TransportSearchResult> => {
  const { data } = await apiClient.get<TransportSearchResult>("/listings", {
    params: { type: "TRANSPORT", ...query },
  });
  return data;
};

/** Fetch a single transport listing by ID or slug. */
export const getTransport = async (idOrSlug: string): Promise<TransportListing> => {
  const { data } = await apiClient.get<TransportListing>(`/listings/${idOrSlug}`);
  return data;
};

/** Create a new transport listing (host only). */
export const createTransport = async (
  payload: CreateTransportPayload,
): Promise<TransportListing> => {
  const dto = {
    name: payload.title || `${payload.vehicleMake} ${payload.vehicleModel}`,
    description: payload.description,
    from: typeof payload.location === "object" ? payload.location.city : payload.location,
    to: "Anywhere", // Fallback for private hire
    vehicleType: payload.serviceType || "Car",
    capacity: payload.passengerCapacity,
    pricePerSeat: payload.dailyRateNgwee || payload.perKmRateNgwee || 0,
    images: payload.images,
  };

  const { data } = await apiClient.post<TransportListing>("/listings/transport", dto);
  return data;
};

/** Update an existing transport listing (host only). */
export const updateTransport = async (
  id: string,
  payload: Partial<CreateTransportPayload>,
): Promise<TransportListing> => {
  const { data } = await apiClient.put<TransportListing>(`/listings/transport/${id}`, payload);
  return data;
};

/** Delete / deactivate a transport listing (host only). */
export const deleteTransport = async (id: string): Promise<{ success: boolean }> => {
  await apiClient.delete(`/listings/${id}`);
  return { success: true };
};
