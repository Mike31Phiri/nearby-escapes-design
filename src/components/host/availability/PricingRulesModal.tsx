"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tag, Moon, Sun, Percent, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PricingRules } from "@/store/availabilityStore";

interface PricingRulesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingId?: string;
  listingName: string;
  rules: PricingRules;
  onSave: (newRules: PricingRules) => void;
}

const WEEKEND_STAY_OPTIONS = [1, 2, 3, 4];
const WEEKDAY_STAY_OPTIONS = [1, 2, 3];
const WEEKLY_DISCOUNT_OPTIONS = [0, 5, 10, 15, 20];
const MONTHLY_DISCOUNT_OPTIONS = [0, 10, 15, 20, 25, 30];

export function PricingRulesModal({
  open,
  onOpenChange,
  listingName,
  rules,
  onSave,
}: PricingRulesModalProps) {
  const [draft, setDraft] = useState<PricingRules>(rules);

  // Sync draft when opened or rules change
  useEffect(() => {
    if (open) {
      setDraft(rules);
    }
  }, [open, rules]);

  // Weekend rate difference calculation
  const weekendDiff = useMemo(() => {
    const diff = draft.weekendPrice - draft.basePrice;
    if (draft.basePrice <= 0) return { diff: 0, percent: 0 };
    const percent = Math.round((diff / draft.basePrice) * 100);
    return { diff, percent };
  }, [draft.basePrice, draft.weekendPrice]);

  const handleSave = () => {
    if (draft.basePrice <= 0) {
      toast.error("Base nightly rate must be greater than 0");
      return;
    }
    if (draft.weekendPrice <= 0) {
      toast.error("Weekend rate must be greater than 0");
      return;
    }

    onSave(draft);
    onOpenChange(false);
    toast.success(`Pricing rules saved for "${listingName}"`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-6 bg-white border border-neutral-200/80 rounded-2xl shadow-xl">
        {/* Header */}
        <DialogHeader className="space-y-1 text-left pb-1 border-b border-neutral-100">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="h-8 w-8 rounded-lg bg-purple/10 text-purple border border-purple/15 flex items-center justify-center shrink-0">
              <Tag className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-neutral-900">
                Pricing & Stay Rules
              </DialogTitle>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-neutral-500 font-medium truncate max-w-[280px]">
                  {listingName}
                </span>
              </div>
            </div>
          </div>
          <DialogDescription className="text-xs text-neutral-500 pt-1">
            Customize base nightly rates, weekend premiums, and minimum length-of-stay requirements.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Section 1: Standard Nightly Rates */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Nightly Rates
              </label>
              {weekendDiff.diff !== 0 && (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                    weekendDiff.diff > 0
                      ? "bg-purple/10 text-purple border border-purple/20"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {weekendDiff.diff > 0
                    ? `+K${weekendDiff.diff.toLocaleString()} (+${weekendDiff.percent}%) weekend markup`
                    : `-K${Math.abs(weekendDiff.diff).toLocaleString()} (${weekendDiff.percent}%) discount`}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Base Rate */}
              <div className="p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/50 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
                  <Sun className="h-3.5 w-3.5 text-amber-500" />
                  <span>Base Rate (Sun–Thu)</span>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-semibold text-neutral-500">K</span>
                  <input
                    type="number"
                    min="1"
                    step="50"
                    value={draft.basePrice || ""}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        basePrice: Math.max(0, parseInt(e.target.value, 10) || 0),
                      }))
                    }
                    className="w-full h-10 pl-7 pr-3 rounded-lg bg-white border border-neutral-200/80 text-sm font-semibold text-neutral-900 focus:outline-none focus:border-purple transition-colors"
                  />
                </div>
                <p className="text-[11px] text-neutral-400">Standard weekday rate per night</p>
              </div>

              {/* Weekend Rate */}
              <div className="p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/50 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
                  <Moon className="h-3.5 w-3.5 text-purple" />
                  <span>Weekend Rate (Fri–Sat)</span>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-semibold text-purple">K</span>
                  <input
                    type="number"
                    min="1"
                    step="50"
                    value={draft.weekendPrice || ""}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        weekendPrice: Math.max(0, parseInt(e.target.value, 10) || 0),
                      }))
                    }
                    className="w-full h-10 pl-7 pr-3 rounded-lg bg-white border border-neutral-200/80 text-sm font-semibold text-neutral-900 focus:outline-none focus:border-purple transition-colors"
                  />
                </div>
                <p className="text-[11px] text-neutral-400">Higher rate for peak weekend nights</p>
              </div>
            </div>
          </div>

          {/* Section 2: Minimum Stay Requirements */}
          <div className="space-y-3 pt-1">
            <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider block">
              Minimum Stay Requirements
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Weekend Min Stay */}
              <div className="p-3.5 rounded-xl border border-neutral-200/80 bg-white space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-neutral-800">Weekends (Fri–Sat)</span>
                  <span className="text-xs font-semibold text-purple">
                    {draft.minStayWeekends} {draft.minStayWeekends === 1 ? "night" : "nights"}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {WEEKEND_STAY_OPTIONS.map((nights) => (
                    <button
                      key={nights}
                      type="button"
                      onClick={() => setDraft((prev) => ({ ...prev, minStayWeekends: nights }))}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                        draft.minStayWeekends === nights
                          ? "bg-purple text-white border-purple shadow-xs"
                          : "bg-neutral-50 text-neutral-600 border-neutral-200/80 hover:bg-neutral-100"
                      }`}
                    >
                      {nights} {nights === 1 ? "nt" : "nts"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weekday Min Stay */}
              <div className="p-3.5 rounded-xl border border-neutral-200/80 bg-white space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-neutral-800">Weekdays (Sun–Thu)</span>
                  <span className="text-xs font-semibold text-neutral-900">
                    {draft.minStayWeekdays} {draft.minStayWeekdays === 1 ? "night" : "nights"}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {WEEKDAY_STAY_OPTIONS.map((nights) => (
                    <button
                      key={nights}
                      type="button"
                      onClick={() => setDraft((prev) => ({ ...prev, minStayWeekdays: nights }))}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                        draft.minStayWeekdays === nights
                          ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                          : "bg-neutral-50 text-neutral-600 border-neutral-200/80 hover:bg-neutral-100"
                      }`}
                    >
                      {nights} {nights === 1 ? "nt" : "nts"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Length-of-Stay Discounts */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-1.5">
              <Percent className="h-3.5 w-3.5 text-neutral-500" />
              <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Length-of-Stay Discounts
              </label>
            </div>

            <div className="space-y-3">
              {/* Weekly Discount */}
              <div className="p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/50 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-neutral-800">Weekly Discount (7+ nights)</span>
                  <span className="font-semibold text-emerald-700">
                    {draft.weeklyDiscount > 0 ? `${draft.weeklyDiscount}% discount` : "No discount"}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {WEEKLY_DISCOUNT_OPTIONS.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setDraft((prev) => ({ ...prev, weeklyDiscount: val }))}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                        draft.weeklyDiscount === val
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                          : "bg-white text-neutral-600 border-neutral-200/80 hover:bg-neutral-100"
                      }`}
                    >
                      {val === 0 ? "Off" : `${val}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monthly Discount */}
              <div className="p-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/50 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-neutral-800">Monthly Discount (28+ nights)</span>
                  <span className="font-semibold text-emerald-700">
                    {draft.monthlyDiscount > 0 ? `${draft.monthlyDiscount}% discount` : "No discount"}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {MONTHLY_DISCOUNT_OPTIONS.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setDraft((prev) => ({ ...prev, monthlyDiscount: val }))}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                        draft.monthlyDiscount === val
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                          : "bg-white text-neutral-600 border-neutral-200/80 hover:bg-neutral-100"
                      }`}
                    >
                      {val === 0 ? "Off" : `${val}%`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Live Summary Card */}
          <div className="p-4 rounded-xl border border-neutral-200/80 bg-neutral-50/80 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-700 font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-purple" />
              <span>Summary of Applied Rates</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 text-neutral-600">
              <div>
                <span className="text-neutral-400 block text-[11px]">Sun – Thu:</span>
                <span className="font-semibold text-neutral-900">K{draft.basePrice.toLocaleString()}/night</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[11px]">Fri – Sat:</span>
                <span className="font-semibold text-purple">K{draft.weekendPrice.toLocaleString()}/night</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[11px]">Weekend Min:</span>
                <span className="font-semibold text-neutral-800">{draft.minStayWeekends} nights</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[11px]">Weekly 7+ nights:</span>
                <span className="font-semibold text-emerald-700">
                  {draft.weeklyDiscount > 0 ? `${draft.weeklyDiscount}% off` : "None"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-10 px-4 rounded-xl text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="h-10 px-5 rounded-xl bg-purple hover:bg-purple-hover text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Check className="h-4 w-4" />
            Save Pricing Rules
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
