export type PaymentStatus = "pending" | "processing" | "succeeded" | "failed" | "refunded";

export type PaymentMethod = "card" | "mobile_money";

// DPOPayment — a completed or in-flight payment record via DPO Pay
export interface DPOPayment {
  id: string;
  bookingId: string;
  /** DPO Pay's own transaction reference returned after token creation */
  dpoTransactionRef: string;
  /** Total charge in Ngwee (integer). Never float. */
  amount: number;
  /** Always ZMW for Zambian Kwacha */
  currency: "ZMW";
  method: PaymentMethod;
  status: PaymentStatus;
   /**
   * The src URL for the DPO-hosted payment iframe.
   * Render this inside an <iframe> on the checkout page.
   * e.g. 'https://secure.3gdirectpay.com/payv2.php?ID=<token>'
   */
  iframeUrl: string;
  createdAt: string;
  updatedAt: string;
}

// PaymentIntent — short-lived object used to initialise the checkout flow
export interface PaymentIntent {
  bookingId: string;
  /** Amount the guest will be charged, in Ngwee (integer). Never float. */
  amountNgwee: number;
   /**
   * The DPO-hosted iframe URL to embed on the checkout page.
   * Valid only until expiresAt.
   */
  iframeUrl: string;
  /** DPO transaction token, used to verify payment server-side */
  transactionToken: string;
  /** ISO 8601 datetime after which this intent is no longer valid */
  expiresAt: string;
}
