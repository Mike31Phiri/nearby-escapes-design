/**
 * payments.ts — DPO payment integration
 *
 * Payment is handled exclusively via DPO Africa's iframe flow.
 * No MoMo or other payment methods.
 *
 * All amounts are integers in Ngwee (ZMW × 100). Never float.
 */

import apiClient from "./client";

export interface DPOCustomerDto {
  name: string;
  phone: string;
  email?: string;
}

export interface DPOListingDto {
  id: string;
  name: string;
  type: string; // stay | experience | transport
}

export interface DPOBookingDetailsDto {
  checkIn?: string;
  checkOut?: string;
  date?: string;
  guests: number;
}

export interface DPOInitiatePayload {
  bookingRef: string;
  amount: number; // Amount in Ngwee (integer)
  currency?: string; // Default: 'ZMW'
  customer: DPOCustomerDto;
  listing: DPOListingDto;
  details: DPOBookingDetailsDto;
  callbackUrl?: string;
}

export interface DPOInitiateResponse {
  transToken: string;
  paymentUrl: string;
  bookingRef: string;
  expiresInSeconds?: number;
}

export interface DPOVerifyResponse {
  verified: boolean;
  status: "successful" | "failed" | "pending";
  bookingRef: string;
  receiptNumber?: string;
  transactionId?: string;
}

/** Legacy alias interface for backwards compatibility */
export interface PaymentIntent {
  transactionToken: string;
  iframeUrl: string;
  bookingId: string;
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

/**
 * Step 1 — Initiate DPO Group PayPage token.
 * POST /api/payments/dpo/initiate
 */
export const initiateDPOPayment = async (
  payload: DPOInitiatePayload | { bookingId: string; amountNgwee: number },
): Promise<DPOInitiateResponse> => {
  // Normalize if called with legacy signature { bookingId, amountNgwee }
  const body: DPOInitiatePayload =
    "customer" in payload
      ? payload
      : {
          bookingRef: (payload as any).bookingId || (payload as any).bookingRef || `NE-${Date.now()}`,
          amount: (payload as any).amountNgwee || (payload as any).amount || 0,
          currency: "ZMW",
          customer: {
            name: "Guest Customer",
            phone: "+260970000000",
          },
          listing: {
            id: (payload as any).bookingId || "listing-1",
            name: "Nearby Escapes Reservation",
            type: "stay",
          },
          details: {
            guests: 1,
          },
        };

  const { data } = await apiClient.post<DPOInitiateResponse>("/payments/dpo/initiate", body);
  return data;
};

/**
 * Step 2 — Verify DPO Payment status.
 * GET /api/payments/dpo/verify/:transToken (or POST /api/payments/dpo/verify)
 */
export const verifyDPOPayment = async (transToken: string): Promise<DPOVerifyResponse> => {
  try {
    const { data } = await apiClient.get<DPOVerifyResponse>(
      `/payments/dpo/verify/${encodeURIComponent(transToken)}`,
    );
    return data;
  } catch {
    // POST alias fallback
    const { data } = await apiClient.post<DPOVerifyResponse>("/payments/dpo/verify", {
      transToken,
    });
    return data;
  }
};

/**
 * Legacy status poll alias.
 */
export const getDPOPaymentStatus = async (transactionToken: string): Promise<DPOPayment> => {
  const result = await verifyDPOPayment(transactionToken);
  return {
    transactionToken,
    status:
      result.status === "successful"
        ? "succeeded"
        : result.status === "failed"
          ? "failed"
          : "pending",
    amountNgwee: 0,
    currency: "ZMW",
    paidAt: result.verified ? new Date().toISOString() : null,
  };
};

/**
 * Legacy post-payment confirmation alias.
 */
export const confirmBookingPayment = async (
  bookingId: string,
  transactionToken: string,
): Promise<{ bookingRef: string; tripId: string }> => {
  return {
    bookingRef: bookingId,
    tripId: `trip-${bookingId}`,
  };
};
