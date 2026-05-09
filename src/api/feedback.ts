import { apiRequest } from "./client";
import type { Feedback } from "@/types/feedback";

export const submitFeedback = (payload: {
  stayId: string;
  bookingId: string;
  rating: number;
  comment?: string;
}) => apiRequest<Feedback>("/feedback", { method: "POST", body: JSON.stringify(payload) });
