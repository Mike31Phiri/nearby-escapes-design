"use client";

/**
 * DPO (Direct Pay Online) Payment Service
 *
 * Flow:
 * 1. `createPaymentToken(transaction)` → Returns a `TransToken` + redirect URL
 * 2. User is redirected to DPO hosted PayPage: https://secure.directpay.online/pay/{TransToken}
 * 3. After payment, DPO redirects back to our callback URL
 * 4. `verifyPayment(transToken)` → Confirms payment status
 *
 * In mock/dev mode, the flow is simulated end-to-end without real credentials.
 */

// ─── Types ────────────────────────────────────────────────────────────────

export interface DPOTransaction {
  /** Internal booking reference */
  bookingRef: string;
  /** Amount in ZMW */
  amount: number;
  /** 3-letter currency code */
  currency: string;
  /** Customer details */
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  /** Listing details (for reference) */
  listing: {
    id: string;
    name: string;
    type: "stay" | "experience" | "transport";
  };
  /** Additional booking details */
  details: {
    checkIn?: string;
    checkOut?: string;
    date?: string;
    guests: number;
    extras?: Record<string, string | number>;
  };
  /** Callback URL for post-payment redirect */
  callbackUrl: string;
}

export interface DPOTransactionResult {
  success: boolean;
  transToken: string;
  paymentUrl: string;
  bookingRef: string;
  message: string;
}

export interface DPOVerificationResult {
  success: boolean;
  status: "paid" | "pending" | "failed" | "cancelled";
  amount: number;
  currency: string;
  transToken: string;
}

// ─── Configuration ───────────────────────────────────────────────────────

interface DPOConfig {
  /** Company token from DPO dashboard */
  companyToken: string;
  /** Service type ID for travel/bookings on DPO */
  serviceTypeId: number;
  /** Whether to use mock mode (no real API calls) */
  mockMode: boolean;
  /** Payment redirect base URL */
  paymentBaseUrl: string;
}

const config: DPOConfig = {
  // Replace with actual credentials in production
  companyToken: process.env.NEXT_PUBLIC_DPO_COMPANY_TOKEN || "MOCK_TOKEN",
  serviceTypeId: Number(process.env.NEXT_PUBLIC_DPO_SERVICE_TYPE_ID) || 6666,
  mockMode: process.env.NEXT_PUBLIC_DPO_MOCK_MODE !== "false",
  paymentBaseUrl: "https://secure.directpay.online",
};

// ─── Generate Booking Reference ──────────────────────────────────────────

export function generateBookingRef(): string {
  const year = new Date().getFullYear();
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `NE-${year}-${seq}`;
}

// ─── Generate Unique Token (for mock) ────────────────────────────────────

function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";
  for (let i = 0; i < 24; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// ─── Create Payment Token ────────────────────────────────────────────────

export async function createPaymentToken(
  transaction: DPOTransaction,
): Promise<DPOTransactionResult> {
  if (config.mockMode) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const transToken = generateToken();

    // In mock mode, redirect directly to the confirmation page with success status.
    // In production, this would be the DPO hosted PayPage URL.
    const callbackUrl = new URL(transaction.callbackUrl);
    callbackUrl.searchParams.set("status", "success");
    callbackUrl.searchParams.set("token", transToken);

    return {
      success: true,
      transToken,
      paymentUrl: callbackUrl.toString(),
      bookingRef: transaction.bookingRef,
      message: "Payment token created successfully (mock mode).",
    };
  }

  // ─── Live DPO API Integration ────────────────────────────────────────────
  try {
    const response = await fetch("https://secure.directpay.online/directtrade/TPG/createToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyToken: config.companyToken,
        accountType: "GENERAL",
        transaction: {
          paymentAmount: transaction.amount.toFixed(2),
          paymentCurrency: transaction.currency,
          companyRef: transaction.bookingRef,
          customerFirstName: transaction.customer.name.split(" ")[0] || "",
          customerLastName: transaction.customer.name.split(" ").slice(1).join(" ") || "",
          customerPhone: transaction.customer.phone,
          customerEmail: transaction.customer.email || "",
          serviceTypeId: config.serviceTypeId,
          redirectURL: transaction.callbackUrl,
          backURL: transaction.callbackUrl,
        },
      }),
    });

    const data = await response.json();

    if (data?.result === "000" && data?.transToken) {
      return {
        success: true,
        transToken: data.transToken,
        paymentUrl: `${config.paymentBaseUrl}/pay/${data.transToken}`,
        bookingRef: transaction.bookingRef,
        message: "Payment token created successfully.",
      };
    }

    return {
      success: false,
      transToken: "",
      paymentUrl: "",
      bookingRef: transaction.bookingRef,
      message: data?.resultExplanation || "Failed to create payment token.",
    };
  } catch (err) {
    return {
      success: false,
      transToken: "",
      paymentUrl: "",
      bookingRef: transaction.bookingRef,
      message: err instanceof Error ? err.message : "Unknown error creating payment token.",
    };
  }
}

// ─── Verify Payment ──────────────────────────────────────────────────────

export async function verifyPayment(transToken: string): Promise<DPOVerificationResult> {
  if (config.mockMode) {
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      success: true,
      status: "paid",
      amount: 0,
      currency: "ZMW",
      transToken,
    };
  }

  // ─── Live DPO API Integration ────────────────────────────────────────────
  try {
    const response = await fetch("https://secure.directpay.online/directtrade/TPG/verifyToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyToken: config.companyToken,
        transToken,
      }),
    });

    const data = await response.json();

    const statusMap: Record<string, DPOVerificationResult["status"]> = {
      "000": "paid",
      "001": "pending",
      "002": "failed",
      "003": "cancelled",
    };

    return {
      success: data?.result === "000",
      status: statusMap[data?.result] || "pending",
      amount: Number(data?.amount) || 0,
      currency: data?.currency || "ZMW",
      transToken,
    };
  } catch (err) {
    return {
      success: false,
      status: "failed",
      amount: 0,
      currency: "ZMW",
      transToken,
    };
  }
}
