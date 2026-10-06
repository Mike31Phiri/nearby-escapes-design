"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Landmark,
  ShieldCheck,
  KeyRound,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Banknote,
  UserCog,
} from "lucide-react";
import { HostPageHeader } from "@/components/layout/HostPageHeader";
import { AccountSettingsSection } from "@/components/host/AccountSettingsSection";
import { mockHostProfile } from "@/lib/mock-profile-data";
import {
  maskIban,

  isValidIban,
  isValidSwift,
  usePayoutSettingsStore,
  type BankDetails,
} from "@/store/payoutSettingsStore";

export function HostSettingsPage() {
  const { bank, verificationStatus, updatedAt, setBankDetails } = usePayoutSettingsStore();

  // Security gate state
  const [gateOpen, setGateOpen] = useState(false);
  const [gateMode, setGateMode] = useState<"password" | "2fa">("password");
  const [gateInput, setGateInput] = useState("");
  const [gateError, setGateError] = useState("");

  // Bank edit form state
  const [showBankForm, setShowBankForm] = useState(false);
  const [bankForm, setBankForm] = useState<BankDetails>({
    bankName: bank?.bankName ?? "",
    iban: bank?.iban ?? "",
    swift: bank?.swift ?? "",
  });
  const [bankErrors, setBankErrors] = useState<{
    bankName?: string;
    iban?: string;
    swift?: string;
  }>({});

  const openGate = () => {
    setGateMode("password");
    setGateInput("");
    setGateError("");
    setGateOpen(true);
  };

  const handleVerify = () => {
    if (!gateInput.trim()) {
      setGateError("Enter your password or verification code to continue.");
      return;
    }
    setGateOpen(false);
    setBankForm({
      bankName: bank?.bankName ?? "",
      iban: bank?.iban ?? "",
      swift: bank?.swift ?? "",
    });
    setBankErrors({});
    setShowBankForm(true);
  };

  const handleSaveBank = () => {
    const errors: typeof bankErrors = {};
    if (!bankForm.bankName.trim()) errors.bankName = "Bank name is required.";
    if (!isValidIban(bankForm.iban)) {
      errors.iban = "IBAN must be 15–34 alphanumeric characters.";
    }
    if (!isValidSwift(bankForm.swift)) {
      errors.swift = "SWIFT/BIC must be 8 or 11 characters (e.g. ZNBKZMLX).";
    }
    setBankErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setBankDetails({
      bankName: bankForm.bankName.trim(),
      iban: bankForm.iban.trim().toUpperCase(),
      swift: bankForm.swift.trim().toUpperCase(),
    });
    setShowBankForm(false);
    toast.success("Bank details saved — pending verification");
  };

  return (
    <div className="min-h-screen bg-background pb-16 font-sans">
      <HostPageHeader title="Settings" description="Account, business and payout configuration" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8 mt-8 space-y-12">
        <SettingsSection
          icon={UserCog}
          title="Account Settings"
          description="Security, notifications and preferences"
        >
          <AccountSettingsSection />
        </SettingsSection>

        <SettingsSection
          icon={Landmark}
          title="Payout Methods"
          description="Where your monthly payout earnings are sent."
          action={
            !showBankForm ? (
              <button
                onClick={openGate}
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-neutral-200/80 text-xs font-semibold text-neutral-700 hover:border-purple/40 hover:text-purple transition-all shadow-2xs"
              >
                Add Method
              </button>
            ) : undefined
          }
        >
          <PayoutMethodsSection
            bank={bank}
            verificationStatus={verificationStatus}
            updatedAt={updatedAt}
            onEdit={openGate}
            showBankForm={showBankForm}
            bankForm={bankForm}
            setBankForm={setBankForm}
            bankErrors={bankErrors}
            onCancelBankForm={() => setShowBankForm(false)}
            onSaveBank={handleSaveBank}
          />
        </SettingsSection>
      </div>

      {/* Security gate modal */}
      {gateOpen && (
        <SecurityGateModal
          gateMode={gateMode}
          gateInput={gateInput}
          setGateInput={setGateInput}
          gateError={gateError}
          onToggleMode={() => {
            setGateMode(gateMode === "password" ? "2fa" : "password");
            setGateInput("");
            setGateError("");
          }}
          onVerify={handleVerify}
          onClose={() => setGateOpen(false)}
        />
      )}
    </div>
  );
}

/* Security gate modal */

interface SecurityGateModalProps {
  gateMode: "password" | "2fa";
  gateInput: string;
  setGateInput: (v: string) => void;
  gateError: string;
  onToggleMode: () => void;
  onVerify: () => void;
  onClose: () => void;
}

function SecurityGateModal({
  gateMode,
  gateInput,
  setGateInput,
  gateError,
  onToggleMode,
  onVerify,
  onClose,
}: SecurityGateModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Security verification"
    >
      <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-5 pt-5 pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-purple/10 text-purple flex items-center justify-center">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900">Verify to continue</h2>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Re-enter your credentials before editing payout details.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="relative mb-4">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {gateMode === "password" ? (
                <KeyRound className="h-4 w-4" />
              ) : (
                <Smartphone className="h-4 w-4" />
              )}
            </div>
            <input
              type={gateMode === "password" ? "password" : "text"}
              autoFocus
              value={gateInput}
              onChange={(e) => setGateInput(e.target.value)}
              placeholder={gateMode === "password" ? "Enter your password" : "Enter 6-digit code"}
              className={`w-full pl-10 pr-4 h-11 rounded-xl border text-sm bg-neutral-50 focus:outline-none focus:bg-white ${gateError
                ? "border-rose-300 focus:border-rose-400"
                : "border-neutral-200/80 focus:border-purple focus:ring-1 focus:ring-purple/20"
                }`}
            />
          </div>

          {gateError && (
            <p className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 mb-3">
              <AlertTriangle className="h-3.5 w-3.5" /> {gateError}
            </p>
          )}

          <button
            onClick={onToggleMode}
            className="text-xs font-semibold text-purple hover:underline mb-4"
          >
            {gateMode === "password" ? "Use 2FA code instead" : "Use password instead"}
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onVerify}
              className="flex-1 h-10 rounded-xl bg-purple hover:bg-purple-hover text-white text-xs font-semibold shadow-xs transition-all"
            >
              Verify
            </button>
            <button
              onClick={onClose}
              className="h-10 px-4 rounded-xl border border-neutral-200/80 text-neutral-700 hover:bg-neutral-50 text-xs font-semibold transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Payout Methods section */

interface PayoutMethodsSectionProps {
  bank: BankDetails | null;
  verificationStatus: "verified" | "pending";
  updatedAt: string | null;
  onEdit: () => void;
  showBankForm: boolean;
  bankForm: BankDetails;
  setBankForm: (d: BankDetails) => void;
  bankErrors: { bankName?: string; iban?: string; swift?: string };
  onCancelBankForm: () => void;
  onSaveBank: () => void;
}

function PayoutMethodsSection({
  bank,
  verificationStatus,
  updatedAt,
  onEdit,
  showBankForm,
  bankForm,
  setBankForm,
  bankErrors,
  onCancelBankForm,
  onSaveBank,
}: PayoutMethodsSectionProps) {
  const pending = verificationStatus === "pending";

  return (
    <>
      {/* Confirmation banner shown after saving pending details */}
      {pending && updatedAt && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200/70 rounded-2xl p-4 shadow-2xs mb-4">
          <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-4.5 w-4.5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-amber-900">
              Bank details change pending verification
            </div>
            <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
              We&apos;ve sent an alert to{" "}
              <strong className="font-bold">{mockHostProfile.email}</strong> noting this change.
              Verification can take up to 24 hours.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-2xs">
        {showBankForm ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                Bank Name
              </label>
              <input
                type="text"
                value={bankForm.bankName}
                onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                placeholder="e.g. Zambia National Bank"
                className={`w-full h-11 rounded-xl border px-3.5 text-sm bg-white text-neutral-900 focus:outline-none ${bankErrors.bankName
                  ? "border-rose-300 focus:border-rose-400"
                  : "border-neutral-200/80 focus:border-purple focus:ring-1 focus:ring-purple/20"
                  }`}
              />
              {bankErrors.bankName && (
                <p className="text-xs font-semibold text-rose-600 mt-1">{bankErrors.bankName}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1.5">IBAN</label>
              <input
                type="text"
                value={bankForm.iban}
                onChange={(e) => setBankForm({ ...bankForm, iban: e.target.value })}
                placeholder="ZM48 0100 0000 0000 0000 4821"
                className={`w-full h-11 rounded-xl border px-3.5 font-mono text-sm bg-white text-neutral-900 focus:outline-none ${bankErrors.iban
                  ? "border-rose-300 focus:border-rose-400"
                  : "border-neutral-200/80 focus:border-purple focus:ring-1 focus:ring-purple/20"
                  }`}
              />
              {bankErrors.iban ? (
                <p className="text-xs font-semibold text-rose-600 mt-1">{bankErrors.iban}</p>
              ) : (
                <p className="text-xs text-neutral-400 mt-1">15–34 alphanumeric characters.</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                SWIFT / BIC Code
              </label>
              <input
                type="text"
                value={bankForm.swift}
                onChange={(e) => setBankForm({ ...bankForm, swift: e.target.value })}
                placeholder="ZNBKZMLX"
                className={`w-full h-11 rounded-xl border px-3.5 font-mono uppercase text-sm bg-white text-neutral-900 focus:outline-none ${bankErrors.swift
                  ? "border-rose-300 focus:border-rose-400"
                  : "border-neutral-200/80 focus:border-purple focus:ring-1 focus:ring-purple/20"
                  }`}
              />
              {bankErrors.swift ? (
                <p className="text-xs font-semibold text-rose-600 mt-1">{bankErrors.swift}</p>
              ) : (
                <p className="text-xs text-neutral-400 mt-1">8 or 11 characters, e.g. ZNBKZMLX.</p>
              )}
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                onClick={onSaveBank}
                className="flex-1 h-10 rounded-xl bg-purple hover:bg-purple-hover text-white text-xs font-semibold shadow-xs transition-all"
              >
                Save
              </button>
              <button
                onClick={onCancelBankForm}
                className="h-10 px-4 rounded-xl border border-neutral-200/80 text-neutral-700 hover:bg-neutral-50 text-xs font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : bank ? (
          <div className="space-y-3">
            {/* Bank */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <div className="h-11 w-11 rounded-xl bg-purple/10 text-purple flex items-center justify-center shrink-0">
                <Banknote className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-neutral-900">
                    {bank.bankName}
                  </span>
                  {pending ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5 tracking-wide">
                      <AlertTriangle className="h-3 w-3" /> Pending Verification
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5 tracking-wide">
                      <CheckCircle2 className="h-3 w-3" /> Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-600 mt-1 font-mono">
                  {maskIban(bank.iban)}
                  <span className="text-neutral-400 font-sans ml-2">
                    SWIFT {bank.swift ? bank.swift.toUpperCase() : "—"}
                  </span>
                </p>
              </div>
              <button
                onClick={onEdit}
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl border border-neutral-200/80 text-xs font-semibold text-neutral-700 hover:border-purple/40 hover:text-purple transition-all shrink-0 shadow-2xs"
              >
                Edit
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50/50 p-6 text-center">
            <Banknote className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-800">No payout method configured</p>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              You haven&apos;t added your bank or payout details yet. Add your bank details to receive payouts.
            </p>
            <button
              onClick={onEdit}
              className="mt-3.5 inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-purple text-white text-xs font-semibold hover:bg-purple-hover transition-all shadow-xs"
            >
              Set Up Bank Details
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/* Section wrapper (heading + content) */

function SettingsSection({
  icon: Icon,
  title,
  description,
  action,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 shrink-0 rounded-xl bg-purple/10 text-purple flex items-center justify-center">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900">{title}</h2>
            {description && <p className="text-xs text-neutral-500 mt-0.5">{description}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}


