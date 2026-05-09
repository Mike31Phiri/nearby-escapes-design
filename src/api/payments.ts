import { apiRequest } from "./client";

export type PaymentIntentPayload = {
  bookingId: string;
  amount: number;
  currency?: string;
};

export type PaymentIntentResponse = {
  intentId: string;
  status: "succeeded" | "failed" | "pending";
  confirmationId: string;
};

export const createPaymentIntent = (payload: PaymentIntentPayload) =>
  apiRequest<PaymentIntentResponse>("/payments/intent", { method: "POST", body: JSON.stringify(payload) });
