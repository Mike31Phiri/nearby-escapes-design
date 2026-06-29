/**
 * payments.ts — DPO payment integration
 *
 * Payment is handled exclusively via DPO Africa's iframe flow.
 * No MoMo or other payment methods.
 *
 * All amounts are integers in Ngwee (ZMW × 100). Never float.
 */

import apiClient from "./client";

export interface PaymentIntent {
  /** Unique DPO transaction token */
  transactionToken: string;
  /** URL to embed in the DPO payment iframe */
  iframeUrl: string;
  /** Booking ID this intent is tied to */
  bookingId: string;
  /** Amount in Ngwee (integer). Never float. */
  amountNgwee: number;
  currency: "ZMW";
  expiresAt: string;
}

export interface DPOPayment {
  transactionToken: string;
  status: "pending" | "succeeded" | "failed" | "cancelled";
  amountNgwee: number;
  currency: "ZMW";
  paidAt: string | null;
}

/** Initiate a DPO payment — returns a PaymentIntent with the iframeUrl to embed. */
export const initiateDPOPayment = async (
  bookingId: string,
  amountNgwee: number,
): Promise<PaymentIntent> => {
  const { data } = await apiClient.post<PaymentIntent>("/payments/dpo/initiate", {
    bookingId,
    amountNgwee,
    currency: "ZMW",
  });
  return data;
};

/** Poll for DPO payment status — call after the DPO iframe posts a postMessage event. */
export const getDPOPaymentStatus = async (transactionToken: string): Promise<DPOPayment> => {
  const { data } = await apiClient.get<DPOPayment>(`/payments/dpo/status/${transactionToken}`);
  return data;
};

/** Confirm booking post-payment — returns bookingRef and tripId for Instant Book confirmation. */
export const confirmBookingPayment = async (
  bookingId: string,
  transactionToken: string,
): Promise<{ bookingRef: string; tripId: string }> => {
  const { data } = await apiClient.post<{ bookingRef: string; tripId: string }>(
    "/payments/dpo/confirm",
    { bookingId, transactionToken },
  );
  return data;
};
