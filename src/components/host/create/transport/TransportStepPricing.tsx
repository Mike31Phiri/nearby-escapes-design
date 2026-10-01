"use client";

import React, { useMemo } from "react";
import { Tag } from "lucide-react";
import { TransportPricingState } from "./transportTypes";
import { cn } from "@/lib/utils";

interface TransportStepPricingProps {
  pricing: TransportPricingState;
  onPricingChange: (updated: TransportPricingState) => void;
  onBack: () => void;
  onFinish: () => void;
  submitting?: boolean;
}

export function TransportStepPricing({
  pricing,
  onPricingChange,
  onBack,
  onFinish,
  submitting = false,
}: TransportStepPricingProps) {
  const {
    basePrice,
    rateUnit,
    multiDayDiscountEnabled,
    multiDayDiscountType,
    multiDayDiscountPercent,
    multiDayCustomPrice,
    groupCharterDiscountEnabled,
    groupCharterDiscountType,
    groupCharterDiscountPercent,
    groupCharterCustomPrice,
  } = pricing;

  // Calculate effective promo prices
  const effectiveMultiDayPromoPrice = useMemo(() => {
    if (!multiDayDiscountEnabled || !basePrice) return basePrice;
    if (multiDayDiscountType === "percent") {
      return Math.round(basePrice * (1 - multiDayDiscountPercent / 100));
    }
    return Math.min(multiDayCustomPrice || basePrice, basePrice);
  }, [basePrice, multiDayDiscountEnabled, multiDayDiscountType, multiDayDiscountPercent, multiDayCustomPrice]);

  const effectiveGroupPromoPrice = useMemo(() => {
    if (!groupCharterDiscountEnabled || !basePrice) return basePrice;
    if (groupCharterDiscountType === "percent") {
      return Math.round(basePrice * (1 - groupCharterDiscountPercent / 100));
    }
    return Math.min(groupCharterCustomPrice || basePrice, basePrice);
  }, [basePrice, groupCharterDiscountEnabled, groupCharterDiscountType, groupCharterDiscountPercent, groupCharterCustomPrice]);

  const isValid =
    basePrice > 0 &&
    (!multiDayDiscountEnabled || effectiveMultiDayPromoPrice < basePrice) &&
    (!groupCharterDiscountEnabled || effectiveGroupPromoPrice < basePrice);

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="mb-2">
        <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-black leading-snug">
          Price &amp; conditional discounts
        </h1>
        <p className="text-xs text-black-subtle mt-0.5">
          Set your standard price and configure optional conditional discounts.
        </p>
      </div>

      <div className="space-y-4">
        {/* Standard Base Rate Card */}
        <div className="p-4 sm:p-5 rounded-xl border border-neutral-200/80 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-purple" />
                <span>Standard Rate</span>
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Regular transportation rate before conditional discounts.
              </p>
            </div>

            {/* Clean ZMW Currency Badge & Rate Unit Toggle */}
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              <div className="flex items-center rounded-lg bg-neutral-100 p-0.5 border border-neutral-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => onPricingChange({ ...pricing, rateUnit: "trip" })}
                  className={cn(
                    "px-2.5 py-1 rounded-md transition-all cursor-pointer",
                    rateUnit === "trip"
                      ? "bg-white text-purple shadow-xs font-bold"
                      : "text-neutral-500 hover:text-neutral-900",
                  )}
                >
                  Per Trip
                </button>
                <button
                  type="button"
                  onClick={() => onPricingChange({ ...pricing, rateUnit: "day" })}
                  className={cn(
                    "px-2.5 py-1 rounded-md transition-all cursor-pointer",
                    rateUnit === "day"
                      ? "bg-white text-purple shadow-xs font-bold"
                      : "text-neutral-500 hover:text-neutral-900",
                  )}
                >
                  Per Day
                </button>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 rounded-lg border border-neutral-200 text-xs font-bold text-neutral-800">
                <span>🇿🇲</span>
                <span>ZMW (K)</span>
              </div>
            </div>
          </div>

          <div className="max-w-xs mt-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                K
              </span>
              <input
                type="number"
                min={1}
                step={50}
                value={basePrice || ""}
                onChange={(e) =>
                  onPricingChange({
                    ...pricing,
                    basePrice: Math.max(0, Number(e.target.value)),
                  })
                }
                placeholder="e.g. 1200"
                className="w-full h-10 pl-8 pr-16 rounded-xl border border-neutral-200 bg-white text-sm font-semibold text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-neutral-400 font-medium">
                / {rateUnit}
              </span>
            </div>
          </div>
        </div>

        {/* Conditional Discounts — Clickable, clean, non-expandable with setting element on far end */}
        <div className="space-y-2.5">
          <p className="text-xs font-semibold text-neutral-800 px-0.5">
            Conditional Discounts
          </p>

          {/* DISCOUNT 1: Multi-day / Multi-trip */}
          <div
            onClick={() =>
              onPricingChange({
                ...pricing,
                multiDayDiscountEnabled: !multiDayDiscountEnabled,
              })
            }
            className={cn(
              "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer select-none",
              multiDayDiscountEnabled
                ? "border-purple bg-purple/[0.02] shadow-2xs"
                : "border-neutral-200 bg-white hover:border-neutral-300",
            )}
          >
            {/* Left: Important Information Only */}
            <div className="flex items-center gap-3 min-w-0">
              <input
                type="checkbox"
                checked={multiDayDiscountEnabled}
                onChange={(e) => {
                  e.stopPropagation();
                  onPricingChange({
                    ...pricing,
                    multiDayDiscountEnabled: e.target.checked,
                  });
                }}
                className="h-4 w-4 rounded border-neutral-300 text-purple focus:ring-purple/20 cursor-pointer accent-purple shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={cn(
                      "text-xs sm:text-sm font-semibold transition-colors",
                      multiDayDiscountEnabled ? "text-purple" : "text-neutral-900",
                    )}
                  >
                    Multi-Day / Return Trip Discount
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple/10 text-purple border border-purple/20 shrink-0">
                    3+ Days / Return
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Automatic discount for rentals of 3 or more days or round-trip bookings.
                </p>
              </div>
            </div>

            {/* Far End: Discount Price Setting Element */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100"
            >
              {/* Unit Mode Toggle (% / K) */}
              <div className="flex items-center rounded-lg bg-neutral-100 p-0.5 border border-neutral-200 text-xs font-semibold">
                <button
                  type="button"
                  disabled={!multiDayDiscountEnabled}
                  onClick={() =>
                    onPricingChange({
                      ...pricing,
                      multiDayDiscountType: "percent",
                    })
                  }
                  className={cn(
                    "px-2 py-1 rounded-md transition-all cursor-pointer",
                    multiDayDiscountType === "percent"
                      ? "bg-white text-purple shadow-xs font-bold"
                      : "text-neutral-500 hover:text-neutral-900 disabled:opacity-40",
                  )}
                >
                  %
                </button>
                <button
                  type="button"
                  disabled={!multiDayDiscountEnabled}
                  onClick={() => {
                    onPricingChange({
                      ...pricing,
                      multiDayDiscountType: "fixed",
                      multiDayCustomPrice:
                        !multiDayCustomPrice || multiDayCustomPrice >= basePrice
                          ? Math.round(basePrice * 0.9)
                          : multiDayCustomPrice,
                    });
                  }}
                  className={cn(
                    "px-2 py-1 rounded-md transition-all cursor-pointer",
                    multiDayDiscountType === "fixed"
                      ? "bg-white text-purple shadow-xs font-bold"
                      : "text-neutral-500 hover:text-neutral-900 disabled:opacity-40",
                  )}
                >
                  K
                </button>
              </div>

              {/* Price / Percent Input */}
              <div className="relative">
                {multiDayDiscountType === "fixed" && (
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                    K
                  </span>
                )}
                <input
                  type="number"
                  min={1}
                  max={multiDayDiscountType === "percent" ? 90 : Math.max(1, basePrice - 1)}
                  disabled={!multiDayDiscountEnabled}
                  value={
                    multiDayDiscountType === "percent"
                      ? multiDayDiscountPercent || ""
                      : multiDayCustomPrice || ""
                  }
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (multiDayDiscountType === "percent") {
                      onPricingChange({
                        ...pricing,
                        multiDayDiscountPercent: Math.min(90, Math.max(1, val)),
                      });
                    } else {
                      onPricingChange({
                        ...pricing,
                        multiDayCustomPrice: val,
                      });
                    }
                  }}
                  placeholder={multiDayDiscountType === "percent" ? "10" : "1080"}
                  className={cn(
                    "h-9 rounded-lg border text-xs font-bold transition-all focus:outline-none",
                    multiDayDiscountType === "fixed"
                      ? "w-24 pl-6 pr-2.5"
                      : "w-20 px-2.5 pr-6 text-right",
                    multiDayDiscountEnabled
                      ? "border-neutral-300 bg-white text-neutral-900 focus:border-purple focus:ring-1 focus:ring-purple/20"
                      : "border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed",
                  )}
                />
                {multiDayDiscountType === "percent" && (
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 pointer-events-none">
                    %
                  </span>
                )}
              </div>

              {/* Rate preview on far right */}
              {multiDayDiscountEnabled && basePrice > 0 && (
                <div className="flex flex-col text-right min-w-[70px]">
                  <span className="text-xs font-bold text-purple">
                    K{effectiveMultiDayPromoPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    {multiDayDiscountType === "percent"
                      ? `-${multiDayDiscountPercent}%`
                      : `Save K${(basePrice - effectiveMultiDayPromoPrice).toLocaleString()}`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* DISCOUNT 2: Group / Full Vehicle Charter */}
          <div
            onClick={() =>
              onPricingChange({
                ...pricing,
                groupCharterDiscountEnabled: !groupCharterDiscountEnabled,
              })
            }
            className={cn(
              "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer select-none",
              groupCharterDiscountEnabled
                ? "border-purple bg-purple/[0.02] shadow-2xs"
                : "border-neutral-200 bg-white hover:border-neutral-300",
            )}
          >
            {/* Left: Important Information Only */}
            <div className="flex items-center gap-3 min-w-0">
              <input
                type="checkbox"
                checked={groupCharterDiscountEnabled}
                onChange={(e) => {
                  e.stopPropagation();
                  onPricingChange({
                    ...pricing,
                    groupCharterDiscountEnabled: e.target.checked,
                  });
                }}
                className="h-4 w-4 rounded border-neutral-300 text-purple focus:ring-purple/20 cursor-pointer accent-purple shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={cn(
                      "text-xs sm:text-sm font-semibold transition-colors",
                      groupCharterDiscountEnabled ? "text-purple" : "text-neutral-900",
                    )}
                  >
                    Group / Full Vehicle Charter Discount
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple/10 text-purple border border-purple/20 shrink-0">
                    Full Charter
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Automatic discount for full capacity passenger hire or exclusive charter.
                </p>
              </div>
            </div>

            {/* Far End: Discount Price Setting Element */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100"
            >
              {/* Unit Mode Toggle (% / K) */}
              <div className="flex items-center rounded-lg bg-neutral-100 p-0.5 border border-neutral-200 text-xs font-semibold">
                <button
                  type="button"
                  disabled={!groupCharterDiscountEnabled}
                  onClick={() =>
                    onPricingChange({
                      ...pricing,
                      groupCharterDiscountType: "percent",
                    })
                  }
                  className={cn(
                    "px-2 py-1 rounded-md transition-all cursor-pointer",
                    groupCharterDiscountType === "percent"
                      ? "bg-white text-purple shadow-xs font-bold"
                      : "text-neutral-500 hover:text-neutral-900 disabled:opacity-40",
                  )}
                >
                  %
                </button>
                <button
                  type="button"
                  disabled={!groupCharterDiscountEnabled}
                  onClick={() => {
                    onPricingChange({
                      ...pricing,
                      groupCharterDiscountType: "fixed",
                      groupCharterCustomPrice:
                        !groupCharterCustomPrice || groupCharterCustomPrice >= basePrice
                          ? Math.round(basePrice * 0.85)
                          : groupCharterCustomPrice,
                    });
                  }}
                  className={cn(
                    "px-2 py-1 rounded-md transition-all cursor-pointer",
                    groupCharterDiscountType === "fixed"
                      ? "bg-white text-purple shadow-xs font-bold"
                      : "text-neutral-500 hover:text-neutral-900 disabled:opacity-40",
                  )}
                >
                  K
                </button>
              </div>

              {/* Price / Percent Input */}
              <div className="relative">
                {groupCharterDiscountType === "fixed" && (
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                    K
                  </span>
                )}
                <input
                  type="number"
                  min={1}
                  max={groupCharterDiscountType === "percent" ? 90 : Math.max(1, basePrice - 1)}
                  disabled={!groupCharterDiscountEnabled}
                  value={
                    groupCharterDiscountType === "percent"
                      ? groupCharterDiscountPercent || ""
                      : groupCharterCustomPrice || ""
                  }
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (groupCharterDiscountType === "percent") {
                      onPricingChange({
                        ...pricing,
                        groupCharterDiscountPercent: Math.min(90, Math.max(1, val)),
                      });
                    } else {
                      onPricingChange({
                        ...pricing,
                        groupCharterCustomPrice: val,
                      });
                    }
                  }}
                  placeholder={groupCharterDiscountType === "percent" ? "15" : "1020"}
                  className={cn(
                    "h-9 rounded-lg border text-xs font-bold transition-all focus:outline-none",
                    groupCharterDiscountType === "fixed"
                      ? "w-24 pl-6 pr-2.5"
                      : "w-20 px-2.5 pr-6 text-right",
                    groupCharterDiscountEnabled
                      ? "border-neutral-300 bg-white text-neutral-900 focus:border-purple focus:ring-1 focus:ring-purple/20"
                      : "border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed",
                  )}
                />
                {groupCharterDiscountType === "percent" && (
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 pointer-events-none">
                    %
                  </span>
                )}
              </div>

              {/* Rate preview on far right */}
              {groupCharterDiscountEnabled && basePrice > 0 && (
                <div className="flex flex-col text-right min-w-[70px]">
                  <span className="text-xs font-bold text-purple">
                    K{effectiveGroupPromoPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    {groupCharterDiscountType === "percent"
                      ? `-${groupCharterDiscountPercent}%`
                      : `Save K${(basePrice - effectiveGroupPromoPrice).toLocaleString()}`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-100">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto h-11 px-6 rounded-xl border border-neutral-200/80 bg-white hover:bg-neutral-50 text-neutral-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
        >
          Back
        </button>

        <button
          type="button"
          disabled={!isValid || submitting}
          onClick={onFinish}
          className={cn(
            "w-full sm:w-auto h-11 px-8 rounded-xl font-semibold text-xs sm:text-sm inline-flex items-center justify-center transition-all cursor-pointer shadow-xs",
            isValid && !submitting
              ? "bg-purple text-white hover:bg-purple-hover active:scale-98"
              : "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200",
          )}
        >
          <span>{submitting ? "Publishing..." : "Finish and Publish"}</span>
        </button>
      </div>
    </div>
  );
}
