"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CalendarClock, Zap, Check, Building2, Smartphone } from "lucide-react";
import { toast } from "sonner";

export interface PayoutSettings {
  mode: "automated" | "instant";
  frequency: "weekly" | "biweekly" | "monthly";
  payoutDay: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  channel: string;
  account: string;
}

interface PayoutSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: PayoutSettings;
  onSave: (newSettings: PayoutSettings) => void;
}

const DAYS_OF_WEEK = [
  { full: "Monday", short: "Mon" },
  { full: "Tuesday", short: "Tue" },
  { full: "Wednesday", short: "Wed" },
  { full: "Thursday", short: "Thu" },
  { full: "Friday", short: "Fri" },
  { full: "Saturday", short: "Sat" },
  { full: "Sunday", short: "Sun" },
] as const;

export function PayoutSettingsModal({
  open,
  onOpenChange,
  settings,
  onSave,
}: PayoutSettingsModalProps) {
  const [draft, setDraft] = useState<PayoutSettings>(settings);

  // Sync draft whenever modal is opened
  useEffect(() => {
    if (open) {
      setDraft(settings);
    }
  }, [open, settings]);

  const handleSave = () => {
    if (!draft.account.trim()) {
      toast.error("Please enter a valid account or phone number");
      return;
    }
    onSave(draft);
    onOpenChange(false);
    toast.success(
      draft.mode === "instant"
        ? "Payout setting updated to Instant (post-check-in)"
        : `Payout setting updated to Weekly on ${draft.payoutDay}s`,
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-6 bg-white border border-neutral-200/80 rounded-2xl shadow-xl">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-lg font-semibold text-neutral-900">
            Payout Settings
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-500">
            Configure how and when your host earnings are transferred to your account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Payout Mode Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              Payout Schedule Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Automated */}
              <button
                type="button"
                onClick={() => setDraft((prev) => ({ ...prev, mode: "automated" }))}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  draft.mode === "automated"
                    ? "border-purple bg-purple/[0.03] ring-1 ring-purple/30"
                    : "border-neutral-200/80 bg-white hover:border-neutral-300"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="h-8 w-8 rounded-lg bg-purple/10 text-purple border border-purple/15 flex items-center justify-center">
                    <CalendarClock className="h-4 w-4" />
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${
                      draft.mode === "automated"
                        ? "border-purple bg-purple text-white"
                        : "border-neutral-300 bg-white"
                    }`}
                  >
                    {draft.mode === "automated" && <Check className="h-3 w-3" />}
                  </div>
                </div>
                <p className="text-sm font-semibold text-neutral-900">Automated</p>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Bulk transfers on a chosen day. Minimizes mobile money and bank fees.
                </p>
              </button>

              {/* Option 2: Instant */}
              <button
                type="button"
                onClick={() => setDraft((prev) => ({ ...prev, mode: "instant" }))}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  draft.mode === "instant"
                    ? "border-purple bg-purple/[0.03] ring-1 ring-purple/30"
                    : "border-neutral-200/80 bg-white hover:border-neutral-300"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="h-8 w-8 rounded-lg bg-purple/10 text-purple border border-purple/15 flex items-center justify-center">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${
                      draft.mode === "instant"
                        ? "border-purple bg-purple text-white"
                        : "border-neutral-300 bg-white"
                    }`}
                  >
                    {draft.mode === "instant" && <Check className="h-3 w-3" />}
                  </div>
                </div>
                <p className="text-sm font-semibold text-neutral-900">Instant Payout</p>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Disbursed 24h after each guest check-in for faster individual cash flow.
                </p>
              </button>
            </div>
          </div>

          {/* Automated Mode Details: Day of week selector */}
          {draft.mode === "automated" && (
            <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-900">Payout Frequency</span>
                <span className="text-xs font-medium text-purple bg-purple/10 border border-purple/20 px-2.5 py-0.5 rounded-full">
                  Weekly
                </span>
              </div>

              <div>
                <label className="text-xs text-neutral-600 block mb-2">
                  Select Payout Day of the Week
                </label>
                <div className="grid grid-cols-7 gap-1.5">
                  {DAYS_OF_WEEK.map((d) => {
                    const isSelected = draft.payoutDay === d.full;
                    return (
                      <button
                        key={d.full}
                        type="button"
                        onClick={() => setDraft((prev) => ({ ...prev, payoutDay: d.full }))}
                        className={`h-9 rounded-xl text-xs font-medium transition-all ${
                          isSelected
                            ? "bg-purple text-white shadow-xs font-semibold"
                            : "bg-white border border-neutral-200/80 text-neutral-700 hover:bg-neutral-100/80"
                        }`}
                        title={d.full}
                      >
                        {d.short}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-neutral-500 mt-2">
                  Earnings accumulate throughout the week and release every{" "}
                  <strong className="font-semibold text-neutral-800">{draft.payoutDay}</strong> at
                  10:00 CAT.
                </p>
              </div>
            </div>
          )}

          {/* Instant Mode Notice */}
          {draft.mode === "instant" && (
            <div className="rounded-xl border border-purple/20 bg-purple/[0.03] p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-purple">
                <Zap className="h-4 w-4 shrink-0" />
                <span>Post-Check-in Settlement Policy</span>
              </div>
              <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                For each confirmed booking, payout will be initiated 24 hours after the scheduled
                check-in time directly to your destination account. Standard carrier transaction
                fees apply per disbursement.
              </p>
            </div>
          )}

          {/* Destination Account & Channel */}
          <div className="space-y-3 pt-2 border-t border-neutral-100">
            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                Payment Channel
              </label>
              <div className="relative">
                <select
                  value={draft.channel}
                  onChange={(e) => setDraft((prev) => ({ ...prev, channel: e.target.value }))}
                  className="w-full h-10 rounded-xl border border-neutral-200/80 px-3 text-sm bg-white text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20"
                >
                  <option value="Airtel Money">Airtel Mobile Money</option>
                  <option value="MTN Mobile Money">MTN Mobile Money</option>
                  <option value="Bank Transfer">Bank Account Transfer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">
                {draft.channel === "Bank Transfer"
                  ? "Bank Routing & Account #"
                  : "Mobile Money Phone Number"}
              </label>
              <input
                type="text"
                value={draft.account}
                onChange={(e) => setDraft((prev) => ({ ...prev, account: e.target.value }))}
                placeholder={
                  draft.channel === "Bank Transfer" ? "e.g. 0123456789" : "e.g. +260 97X XXX XXX"
                }
                className="w-full h-10 rounded-xl border border-neutral-200/80 px-3.5 text-sm text-neutral-900 bg-white focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20"
              />
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-4 mt-2 border-t border-neutral-100">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-10 px-4 rounded-xl border border-neutral-200/80 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="h-10 px-5 rounded-xl bg-purple hover:bg-purple-hover text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Save Payout Settings
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
