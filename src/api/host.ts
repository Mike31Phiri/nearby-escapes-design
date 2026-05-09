import { apiRequest } from "./client";
import type { Stay } from "@/types/stay";

export type HostListing = Stay & { totalRooms: number; status: "active" | "inactive" | "pending" };

export type CreateListingPayload = {
  name: string;
  description: string;
  location: string;
  pricePerNight: number;
  totalRooms: number;
};

export const getHostDashboard = () =>
  apiRequest("/host/dashboard");

export const getHostEarnings = () =>
  apiRequest("/host/earnings");

export const getHostCalendar = (listingId: string) =>
  apiRequest(`/host/calendar/${listingId}`);

export const getHostListings = () =>
  apiRequest<HostListing[]>("/host/listings");

export const createHostListing = (payload: CreateListingPayload) =>
  apiRequest<HostListing>("/host/listings", { method: "POST", body: JSON.stringify(payload) });

export const updateHostListing = (id: string, payload: Partial<CreateListingPayload>) =>
  apiRequest<HostListing>(`/host/listings/${id}`, { method: "PATCH", body: JSON.stringify(payload) });

export const deleteHostListing = (id: string) =>
  apiRequest<void>(`/host/listings/${id}`, { method: "DELETE" });
