"use client";

import React from "react";
import { Car, Plus, Minus, CheckCircle2 } from "lucide-react";
import { TransportInventoryState } from "./transportTypes";
import { cn } from "@/lib/utils";

interface TransportStepInventoryProps {
  inventory: TransportInventoryState;
  onInventoryChange: (updated: TransportInventoryState) => void;
  onBack: () => void;
  onNext: () => void;
  submitting?: boolean;
}

const PRESET_COUNTS = [1, 2, 3, 5, 8, 10];

export function TransportStepInventory({
  inventory,
  onInventoryChange,
  onBack,
  onNext,
  submitting = false,
}: TransportStepInventoryProps) {
  const count = Math.max(1, inventory.fleetSize || 1);

  const handleSetCount = (newCount: number) => {
    const valid = Math.max(1, Math.min(100, newCount));
    const autoUnits = Array.from({ length: valid }, (_, i) => ({
      id: `veh-${i + 1}`,
      label: valid === 1 ? "Vehicle" : `Vehicle ${i + 1}`,
      seats: 5,
    }));

    onInventoryChange({
      fleetSize: valid,
      units: autoUnits,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple/10 text-purple text-xs font-semibold mb-3">
          <Car className="h-3.5 w-3.5" />
          <span>Vehicle Inventory</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
          How many vehicles of this exact type do you have?
        </h2>
        <p className="text-sm text-neutral-500 mt-1 max-w-2xl">
          If you have multiple identical vehicles (e.g. 2, 3, or 5 cars of this model) under this single listing, enter the count below.
          The listing remains live and bookable on search until available inventory reaches zero.
        </p>
      </div>

      {/* Main Count Card */}
      <div className="bg-neutral-50/80 border border-neutral-200/80 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
              Fleet Count
            </div>
            <p className="text-xs text-neutral-500 max-w-sm">
              All vehicles share the same model specs, rates, and features for this listing.
            </p>
          </div>

          {/* Stepper with Large Counter */}
          <div className="flex items-center gap-3 bg-white border border-neutral-200 rounded-2xl p-2 shadow-xs self-start sm:self-auto">
            <button
              type="button"
              disabled={count <= 1}
              onClick={() => handleSetCount(count - 1)}
              className="w-11 h-11 rounded-xl bg-neutral-50 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-neutral-700 transition-colors cursor-pointer"
              aria-label="Decrease fleet count"
            >
              <Minus className="h-4 w-4" />
            </button>

            <div className="w-20 text-center">
              <input
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(e) => handleSetCount(parseInt(e.target.value, 10) || 1)}
                className="w-full text-center text-2xl font-bold text-neutral-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="text-[11px] text-neutral-400 font-medium block -mt-1">
                {count === 1 ? "vehicle" : "vehicles"}
              </span>
            </div>

            <button
              type="button"
              disabled={count >= 100}
              onClick={() => handleSetCount(count + 1)}
              className="w-11 h-11 rounded-xl bg-purple text-white hover:bg-purple-hover disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              aria-label="Increase fleet count"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Quick Pick Presets */}
        <div>
          <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2.5">
            Quick Select
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_COUNTS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleSetCount(preset)}
                className={cn(
                  "h-10 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer",
                  count === preset
                    ? "bg-purple text-white shadow-xs"
                    : "bg-white border border-neutral-200 text-neutral-700 hover:border-purple/40 hover:bg-purple/5",
                )}
              >
                {preset} {preset === 1 ? "Vehicle" : "Vehicles"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Explanatory Banner */}
      <div className="flex items-start gap-3.5 p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-900 text-xs sm:text-sm">
        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold">Independent Fleet Bookings: </span>
          Setting your count to <strong className="underline">{count} {count === 1 ? "vehicle" : "vehicles"}</strong> means {count} separate guests can reserve this vehicle model on the same date.
          The listing stays live and bookable on search until all {count} are booked.
        </div>
      </div>

      {/* Navigation Buttons */}
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
          disabled={submitting}
          onClick={onNext}
          className={cn(
            "w-full sm:w-auto h-11 px-8 rounded-xl font-semibold text-xs sm:text-sm inline-flex items-center justify-center transition-all cursor-pointer shadow-xs",
            !submitting
              ? "bg-purple text-white hover:bg-purple-hover active:scale-98"
              : "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200",
          )}
        >
          <span>{submitting ? "Saving..." : "Next: Pricing"}</span>
        </button>
      </div>
    </div>
  );
}
