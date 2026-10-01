import type {
  CreatePaymentTokenRequest,
  CreatePaymentTokenResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
  Currency,
  PaymentStatus,
} from "@/types/backend-payloads";

export type {
  CreatePaymentTokenRequest,
  CreatePaymentTokenResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
  Currency,
  PaymentStatus,
};

export interface DpoInitiateDto {
  bookingId: string;
  amountNgwee: number;
  currency?: Currency;
}

export interface DpoStatusDto {
  transactionToken: string;
  status: "pending" | "succeeded" | "failed" | "cancelled";
  amountNgwee: number;
  currency: Currency;
  paidAt: string | null;
}

export interface DpoConfirmDto {
  bookingId: string;
  transactionToken: string;
}
