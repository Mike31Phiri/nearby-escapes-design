import { apiRequest } from "./client";
import type { Stay } from "@/types/stay";
import type { Feedback } from "@/types/feedback";

export const getStays = (params?: { q?: string; location?: string; minPrice?: number; maxPrice?: number }) => {
  const qs = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : "";
  return apiRequest<Stay[]>(`/stays${qs}`);
};

export const getStay = (id: string) =>
  apiRequest<Stay>(`/stays/${id}`);

export const getStayFeedback = (id: string) =>
  apiRequest<Feedback[]>(`/stays/${id}/feedback`);
