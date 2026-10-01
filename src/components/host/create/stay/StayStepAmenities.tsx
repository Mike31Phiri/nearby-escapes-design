"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import {
  STAY_GUEST_FAVOURITES,
  STAY_STANDOUTS,
  STAY_SAFETY,
  StayAmenityItem,
} from "./stayConstants";
import { StayAmenitiesState } from "./stayTypes";
import { CustomBulletList } from "../shared";
import { cn } from "@/lib/utils";

interface StayStepAmenitiesProps {
  amenities: StayAmenitiesState;
  onAmenitiesChange: (updated: StayAmenitiesState) => void;
  onBack: () => void;
  onNext: () => void;
  submitting?: boolean;
}

export function StayStepAmenities({
  amenities,
  onAmenitiesChange,
  onBack,
  onNext,
  submitting = false,
}: StayStepAmenitiesProps) {
  const [activeInputCategory, setActiveInputCategory] = useState<string | null>(null);
  const [customInputValue, setCustomInputValue] = useState("");

  const toggleAmenity = (category: "guestFavourites" | "standouts" | "safety", id: string) => {
    const list = amenities[category] || [];
    const exists = list.includes(id);
    const updatedList = exists ? list.filter((item) => item !== id) : [...list, id];
    onAmenitiesChange({
      ...amenities,
      [category]: updatedList,
    });
  };

  const handleAddCustom = (category: "guestFavourites" | "standouts" | "safety") => {
    const text = customInputValue.trim();
    if (!text) return;
    const customKey =
      category === "guestFavourites"
        ? "customGuestFavourites"
        : category === "standouts"
          ? "customStandouts"
          : "customSafety";

    const currentCustom = amenities[customKey] || [];
    const updatedCustom = [...currentCustom, text];
    const updatedMain = [...(amenities[category] || []), text];

    onAmenitiesChange({
      ...amenities,
      [customKey]: updatedCustom,
      [category]: updatedMain,
    });

    setCustomInputValue("");
    setActiveInputCategory(null);
  };

  const handleRemoveCustom = (
    category: "guestFavourites" | "standouts" | "safety",
    item: string,
  ) => {
    const customKey =
      category === "guestFavourites"
        ? "customGuestFavourites"
        : category === "standouts"
          ? "customStandouts"
          : "customSafety";

    const currentCustom = amenities[customKey] || [];
    const updatedCustom = currentCustom.filter((x) => x !== item);
    const updatedMain = (amenities[category] || []).filter((x) => x !== item);

    onAmenitiesChange({
      ...amenities,
      [customKey]: updatedCustom,
      [category]: updatedMain,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="text-center mb-6">
        <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-black leading-snug">
          Select amenities for your stay
        </h1>
        <p className="text-xs text-black-subtle mt-1 max-w-xl mx-auto leading-relaxed">
          Select the amenities that apply to your offering.
        </p>
      </div>

      <div className="space-y-8 sm:space-y-10">
        {/* Type 1: Guest Favourites */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100">
            <h2 className="text-xs sm:text-sm font-semibold text-black tracking-tight">
              Guest Favourites
            </h2>
            {activeInputCategory !== "guestFavourites" && (
              <button
                type="button"
                onClick={() => setActiveInputCategory("guestFavourites")}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple hover:underline cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Add custom</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-2.5">
            {STAY_GUEST_FAVOURITES.map((item: StayAmenityItem) => {
              const Icon = item.icon!;
              const isSelected = amenities.guestFavourites?.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleAmenity("guestFavourites", item.id)}
                  className={cn(
                    "flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[84px] sm:min-h-[92px]",
                    isSelected
                      ? "border-2 border-purple bg-purple/[0.02]"
                      : "border-neutral-300 hover:border-neutral-900",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-7 w-7 mb-2 transition-colors shrink-0",
                      isSelected ? "text-purple" : "text-neutral-800",
                    )}
                    strokeWidth={1.5}
                  />
                  <span
                    className={cn(
                      "text-xs font-semibold leading-tight line-clamp-2 text-center transition-colors",
                      isSelected ? "text-purple font-semibold" : "text-neutral-900",
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          <CustomBulletList
            items={amenities.customGuestFavourites || []}
            selectedItems={amenities.guestFavourites}
            onToggle={(custom) => toggleAmenity("guestFavourites", custom)}
            onRemove={(custom) => handleRemoveCustom("guestFavourites", custom)}
          />

          {activeInputCategory === "guestFavourites" && (
            <div className="flex items-center gap-2 max-w-xs mt-1.5 animate-in fade-in duration-100">
              <input
                type="text"
                value={customInputValue}
                onChange={(e) => setCustomInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustom("guestFavourites");
                  }
                }}
                placeholder="e.g. Daily Turn-down Service"
                className="flex-1 h-8 px-2.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-purple"
                autoFocus
              />
              <button
                type="button"
                onClick={() => handleAddCustom("guestFavourites")}
                className="h-8 px-3 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-hover cursor-pointer"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveInputCategory(null);
                  setCustomInputValue("");
                }}
                className="h-8 px-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Type 2: Standout Amenities */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100">
            <h2 className="text-xs sm:text-sm font-semibold text-black tracking-tight">
              Standout Amenities
            </h2>
            {activeInputCategory !== "standouts" && (
              <button
                type="button"
                onClick={() => setActiveInputCategory("standouts")}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple hover:underline cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Add custom</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-2.5">
            {STAY_STANDOUTS.map((item: StayAmenityItem) => {
              const Icon = item.icon!;
              const isSelected = amenities.standouts?.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleAmenity("standouts", item.id)}
                  className={cn(
                    "flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[84px] sm:min-h-[92px]",
                    isSelected
                      ? "border-2 border-purple bg-purple/[0.02]"
                      : "border-neutral-300 hover:border-neutral-900",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-7 w-7 mb-2 transition-colors shrink-0",
                      isSelected ? "text-purple" : "text-neutral-800",
                    )}
                    strokeWidth={1.5}
                  />
                  <span
                    className={cn(
                      "text-xs font-semibold leading-tight line-clamp-2 text-center transition-colors",
                      isSelected ? "text-purple font-semibold" : "text-neutral-900",
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          <CustomBulletList
            items={amenities.customStandouts || []}
            selectedItems={amenities.standouts}
            onToggle={(custom) => toggleAmenity("standouts", custom)}
            onRemove={(custom) => handleRemoveCustom("standouts", custom)}
          />

          {activeInputCategory === "standouts" && (
            <div className="flex items-center gap-2 max-w-xs mt-1.5 animate-in fade-in duration-100">
              <input
                type="text"
                value={customInputValue}
                onChange={(e) => setCustomInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustom("standouts");
                  }
                }}
                placeholder="e.g. Private river pontoon"
                className="flex-1 h-8 px-2.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-purple"
                autoFocus
              />
              <button
                type="button"
                onClick={() => handleAddCustom("standouts")}
                className="h-8 px-3 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-hover cursor-pointer"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveInputCategory(null);
                  setCustomInputValue("");
                }}
                className="h-8 px-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Type 3: Safety & Essentials */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100">
            <h2 className="text-xs sm:text-sm font-semibold text-black tracking-tight">
              Safety &amp; Essentials
            </h2>
            {activeInputCategory !== "safety" && (
              <button
                type="button"
                onClick={() => setActiveInputCategory("safety")}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple hover:underline cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Add custom</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-2.5">
            {STAY_SAFETY.map((item: StayAmenityItem) => {
              const Icon = item.icon!;
              const isSelected = amenities.safety?.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleAmenity("safety", item.id)}
                  className={cn(
                    "flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[84px] sm:min-h-[92px]",
                    isSelected
                      ? "border-2 border-purple bg-purple/[0.02]"
                      : "border-neutral-300 hover:border-neutral-900",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-7 w-7 mb-2 transition-colors shrink-0",
                      isSelected ? "text-purple" : "text-neutral-800",
                    )}
                    strokeWidth={1.5}
                  />
                  <span
                    className={cn(
                      "text-xs font-semibold leading-tight line-clamp-2 text-center transition-colors",
                      isSelected ? "text-purple font-semibold" : "text-neutral-900",
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          <CustomBulletList
            items={amenities.customSafety || []}
            selectedItems={amenities.safety}
            onToggle={(custom) => toggleAmenity("safety", custom)}
            onRemove={(custom) => handleRemoveCustom("safety", custom)}
          />

          {activeInputCategory === "safety" && (
            <div className="flex items-center gap-2 max-w-xs mt-1.5 animate-in fade-in duration-100">
              <input
                type="text"
                value={customInputValue}
                onChange={(e) => setCustomInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustom("safety");
                  }
                }}
                placeholder="e.g. 24h Guard patrol"
                className="flex-1 h-8 px-2.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-purple"
                autoFocus
              />
              <button
                type="button"
                onClick={() => handleAddCustom("safety")}
                className="h-8 px-3 rounded-lg bg-purple text-white text-xs font-semibold hover:bg-purple-hover cursor-pointer"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveInputCategory(null);
                  setCustomInputValue("");
                }}
                className="h-8 px-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
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
          disabled={submitting}
          onClick={onNext}
          className={cn(
            "w-full sm:w-auto h-11 px-8 rounded-xl font-semibold text-xs sm:text-sm inline-flex items-center justify-center transition-all cursor-pointer shadow-xs",
            !submitting
              ? "bg-purple text-white hover:bg-purple-hover active:scale-98"
              : "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200",
          )}
        >
          <span>{submitting ? "Saving details..." : "Next"}</span>
        </button>
      </div>
    </div>
  );
}
