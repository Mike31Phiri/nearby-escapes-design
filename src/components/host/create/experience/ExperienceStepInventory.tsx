"use client";

import React from "react";
import { Clock, Plus, Minus, CheckCircle2 } from "lucide-react";
import { ExperienceInventoryState, ExperienceSlotUnit } from "./experienceTypes";
import { cn } from "@/lib/utils";

interface ExperienceStepInventoryProps {
  inventory: ExperienceInventoryState;
  onInventoryChange: (updated: ExperienceInventoryState) => void;
  onBack: () => void;
  onNext: () => void;
  submitting?: boolean;
}

const PRESET_SLOT_COUNTS = [1, 2, 3, 4, 6];

const DEFAULT_TIME_SLOTS = [
  "08:30 AM",
  "11:30 AM",
  "14:00 PM",
  "16:30 PM",
  "09:00 AM",
  "15:00 PM",
];

export function ExperienceStepInventory({
  inventory,
  onInventoryChange,
  onBack,
  onNext,
  submitting = false,
}: ExperienceStepInventoryProps) {
  const currentSlots: ExperienceSlotUnit[] = inventory.slots?.length
    ? inventory.slots
    : [
        { id: "slot-1", label: "Morning Departure", timeSlot: "08:30 AM", capacity: 8 },
        { id: "slot-2", label: "Midday Tour", timeSlot: "11:30 AM", capacity: 8 },
      ];
  const count = currentSlots.length;

  const handleSetCount = (newCount: number) => {
    const valid = Math.max(1, Math.min(10, newCount));
    let nextSlots = [...currentSlots];
    if (valid > currentSlots.length) {
      for (let i = currentSlots.length; i < valid; i++) {
        nextSlots.push({
          id: `slot-${i + 1}`,
          label: `Session ${i + 1}`,
          timeSlot: DEFAULT_TIME_SLOTS[i % DEFAULT_TIME_SLOTS.length],
          capacity: 8,
        });
      }
    } else {
      nextSlots = nextSlots.slice(0, valid);
    }

    onInventoryChange({ slots: nextSlots });
  };

  const handleUpdateSlot = (index: number, field: keyof ExperienceSlotUnit, val: any) => {
    const updated = currentSlots.map((s, i) => (i === index ? { ...s, [field]: val } : s));
    onInventoryChange({ slots: updated });
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple/10 text-purple text-xs font-semibold mb-3">
          <Clock className="h-3.5 w-3.5" />
          <span>Session Inventory</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
          Departure sessions &amp; available times
        </h2>
        <p className="text-sm text-neutral-500 mt-1 max-w-2xl">
          Enter the daily departure start times for this experience. These start times will appear directly on your experience detail page dropdown for guests to select.
        </p>
      </div>

      {/* Main Count Card */}
      <div className="bg-neutral-50/80 border border-neutral-200/80 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
              Daily Departure Slots
            </div>
            <p className="text-xs text-neutral-500 max-w-sm">
              Guests choose from these departure times when booking this activity.
            </p>
          </div>

          {/* Stepper with Large Counter */}
          <div className="flex items-center gap-3 bg-white border border-neutral-200 rounded-2xl p-2 shadow-xs self-start sm:self-auto">
            <button
              type="button"
              disabled={count <= 1}
              onClick={() => handleSetCount(count - 1)}
              className="w-11 h-11 rounded-xl bg-neutral-50 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-neutral-700 transition-colors cursor-pointer"
              aria-label="Decrease slots count"
            >
              <Minus className="h-4 w-4" />
            </button>

            <div className="w-20 text-center">
              <input
                type="number"
                min={1}
                max={10}
                value={count}
                onChange={(e) => handleSetCount(parseInt(e.target.value, 10) || 1)}
                className="w-full text-center text-2xl font-bold text-neutral-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="text-[11px] text-neutral-400 font-medium block -mt-1">
                {count === 1 ? "session" : "sessions"} / day
              </span>
            </div>

            <button
              type="button"
              disabled={count >= 10}
              onClick={() => handleSetCount(count + 1)}
              className="w-11 h-11 rounded-xl bg-purple text-white hover:bg-purple-hover disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              aria-label="Increase slots count"
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
            {PRESET_SLOT_COUNTS.map((preset) => (
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
                {preset} {preset === 1 ? "Slot / Day" : "Slots / Day"}
              </button>
            ))}
          </div>
        </div>

        {/* Individual Slot Departure Times & Capacity Configuration */}
        <div className="pt-4 border-t border-neutral-200/80 space-y-3">
          <div className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
            Configure Slot Departure Times
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentSlots.map((slot, idx) => (
              <div
                key={slot.id}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-neutral-200 shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-purple/10 text-purple text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <input
                      type="text"
                      value={slot.timeSlot}
                      onChange={(e) => handleUpdateSlot(idx, "timeSlot", e.target.value)}
                      placeholder="e.g. 08:30 AM"
                      className="text-xs font-bold text-neutral-900 border-b border-dashed border-neutral-300 focus:border-purple focus:outline-none w-24 py-0.5"
                    />
                    <div className="text-[10px] text-neutral-400 mt-0.5">Start time</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                  <span className="text-[11px] text-neutral-400">Cap:</span>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={slot.capacity}
                    onChange={(e) => handleUpdateSlot(idx, "capacity", parseInt(e.target.value, 10) || 8)}
                    className="w-12 h-7 text-center rounded-lg border border-neutral-200 text-xs font-semibold focus:outline-none focus:border-purple"
                  />
                  <span className="text-[11px] text-neutral-400">spots</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Explanatory Banner */}
      <div className="flex items-start gap-3.5 p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-900 text-xs sm:text-sm">
        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold">Departure Dropdown: </span>
          Guests booking this activity on the detail page will see these exact start times in a clean dropdown to pick their preferred session.
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
