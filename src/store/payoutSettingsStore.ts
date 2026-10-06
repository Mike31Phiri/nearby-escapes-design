"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BankVerificationStatus = "verified" | "pending";

export interface BankDetails {
  bankName: string;
  iban: string;
  swift: string;
}

interface PayoutSettingsState {
  bank: BankDetails | null;
  verificationStatus: BankVerificationStatus;
  /** ISO timestamp of the last saved change (drives the "sent alert" banner) */
  updatedAt: string | null;
  setBankDetails: (details: BankDetails) => void;
}

export const DEFAULT_BANK: BankDetails = {
  bankName: "Zambia National Bank",
  iban: "ZM48 0100 0000 0000 4821",
  swift: "ZNBKZMLX",
};

/** Mask an IBAN, keeping only the last 4 characters visible. */
export function maskIban(iban: string): string {
  const compact = iban.replace(/\s+/g, "");
  if (compact.length <= 4) return compact;
  return `•••• •••• •••• ${compact.slice(-4)}`;
}

/** Basic IBAN shape validation: 15–34 alphanumeric characters. */
export function isValidIban(iban: string): boolean {
  const compact = iban.replace(/\s+/g, "");
  return /^[A-Za-z0-9]{15,34}$/.test(compact);
}

/** Basic SWIFT/BIC validation: 8 or 11 uppercase letters/digits. */
export function isValidSwift(swift: string): boolean {
  return /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(swift.trim().toUpperCase());
}

export const usePayoutSettingsStore = create<PayoutSettingsState>()(
  persist(
    (set) => ({
      bank: null,
      verificationStatus: "pending",
      updatedAt: null,
      setBankDetails: (details) =>
        set({
          bank: details,
          verificationStatus: "pending",
          updatedAt: new Date().toISOString(),
        }),
    }),
    {
      name: "nearby-escapes-payout-settings",
      partialize: (state) => ({
        bank: state.bank,
        verificationStatus: state.verificationStatus,
        updatedAt: state.updatedAt,
      }),
    },
  ),
);
