"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import {
  TRANSPORT_FEATURES,
  TRANSPORT_WHAT_TO_CARRY,
  TRANSPORT_GUIDELINES,
  TransportFeatureOption,
  TransportRuleOption,
} from "./transportConstants";
import { TransportFeaturesState } from "./transportTypes";
import { CustomBulletList } from "../shared";
import { cn } from "@/lib/utils";

interface TransportStepFeaturesProps {
  features: TransportFeaturesState;
  onFeaturesChange: (updated: TransportFeaturesState) => void;
  onBack: () => void;
  onNext: () => void;
  submitting?: boolean;
}

export function TransportStepFeatures({
  features,
  onFeaturesChange,
  onBack,
  onNext,
  submitting = false,
}: TransportStepFeaturesProps) {
  const [activeInputCategory, setActiveInputCategory] = useState<string | null>(null);
  const [customInputValue, setCustomInputValue] = useState("");

  const toggleFeature = (id: string) => {
    const list = features.vehicleFeatures || [];
    const exists = list.includes(id);
    const updated = exists ? list.filter((i) => i !== id) : [...list, id];
    onFeaturesChange({ ...features, vehicleFeatures: updated });
  };

  const toggleRule = (category: "whatToCarry" | "guidelines", id: string) => {
    const list = features[category] || [];
    const exists = list.includes(id);
    const updated = exists ? list.filter((i) => i !== id) : [...list, id];
    onFeaturesChange({ ...features, [category]: updated });
  };

  const handleAddCustom = (category: "vehicleFeatures" | "whatToCarry" | "guidelines") => {
    const text = customInputValue.trim();
    if (!text) return;

    const customKey =
      category === "vehicleFeatures"
        ? "customVehicleFeatures"
        : category === "whatToCarry"
          ? "customWhatToCarry"
          : "customGuidelines";

    const currentCustom = features[customKey] || [];
    const updatedCustom = [...currentCustom, text];
    const updatedMain = [...(features[category] || []), text];

    onFeaturesChange({
      ...features,
      [customKey]: updatedCustom,
      [category]: updatedMain,
    });

    setCustomInputValue("");
    setActiveInputCategory(null);
  };

  const handleRemoveCustom = (
    category: "vehicleFeatures" | "whatToCarry" | "guidelines",
    item: string,
  ) => {
    const customKey =
      category === "vehicleFeatures"
        ? "customVehicleFeatures"
        : category === "whatToCarry"
          ? "customWhatToCarry"
          : "customGuidelines";

    const currentCustom = features[customKey] || [];
    const updatedCustom = currentCustom.filter((x) => x !== item);
    const updatedMain = (features[category] || []).filter((x) => x !== item);

    onFeaturesChange({
      ...features,
      [customKey]: updatedCustom,
      [category]: updatedMain,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="text-center mb-6">
        <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-black leading-snug">
          Vehicle features &amp; guidelines
        </h1>
        <p className="text-xs text-black-subtle mt-1 max-w-xl mx-auto leading-relaxed">
          Select vehicle features, passenger requirements, and onboard rules.
        </p>
      </div>

      <div className="space-y-8 sm:space-y-10">
        {/* Type 1: Vehicle Features */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100">
            <h2 className="text-xs sm:text-sm font-semibold text-black tracking-tight">
              Vehicle Features &amp; Inclusions
            </h2>
            {activeInputCategory !== "vehicleFeatures" && (
              <button
                type="button"
                onClick={() => setActiveInputCategory("vehicleFeatures")}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple hover:underline cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Add custom</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-2.5">
            {TRANSPORT_FEATURES.map((item: TransportFeatureOption) => {
              const Icon = item.icon!;
              const isSelected = features.vehicleFeatures?.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleFeature(item.id)}
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
            items={features.customVehicleFeatures || []}
            selectedItems={features.vehicleFeatures}
            onToggle={(custom) => toggleFeature(custom)}
            onRemove={(custom) => handleRemoveCustom("vehicleFeatures", custom)}
          />

          {activeInputCategory === "vehicleFeatures" && (
            <div className="flex items-center gap-2 max-w-xs mt-1.5 animate-in fade-in duration-100">
              <input
                type="text"
                value={customInputValue}
                onChange={(e) => setCustomInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustom("vehicleFeatures");
                  }
                }}
                placeholder="e.g. Electric Vehicle"
                className="flex-1 h-8 px-2.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-purple"
                autoFocus
              />
              <button
                type="button"
                onClick={() => handleAddCustom("vehicleFeatures")}
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

        {/* Type 2: What to Bring */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100">
            <h2 className="text-xs sm:text-sm font-semibold text-black tracking-tight">
              What to Bring
            </h2>
            {activeInputCategory !== "whatToCarry" && (
              <button
                type="button"
                onClick={() => setActiveInputCategory("whatToCarry")}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple hover:underline cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Add custom</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-2.5">
            {TRANSPORT_WHAT_TO_CARRY.map((item: TransportRuleOption) => {
              const isSelected = features.whatToCarry?.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleRule("whatToCarry", item.id)}
                  className={cn(
                    "flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[84px] sm:min-h-[92px]",
                    isSelected
                      ? "border-2 border-purple bg-purple/[0.02]"
                      : "border-neutral-300 hover:border-neutral-900",
                  )}
                >
                  <span
                    className={cn(
                      "text-xs font-semibold leading-tight line-clamp-2 text-center transition-colors my-auto",
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
            items={features.customWhatToCarry || []}
            selectedItems={features.whatToCarry}
            onToggle={(custom) => toggleRule("whatToCarry", custom)}
            onRemove={(custom) => handleRemoveCustom("whatToCarry", custom)}
          />

          {activeInputCategory === "whatToCarry" && (
            <div className="flex items-center gap-2 max-w-xs mt-1.5 animate-in fade-in duration-100">
              <input
                type="text"
                value={customInputValue}
                onChange={(e) => setCustomInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustom("whatToCarry");
                  }
                }}
                placeholder="e.g. Deposit card"
                className="flex-1 h-8 px-2.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-purple"
                autoFocus
              />
              <button
                type="button"
                onClick={() => handleAddCustom("whatToCarry")}
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

        {/* Type 3: Vehicle Guidelines */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100">
            <h2 className="text-xs sm:text-sm font-semibold text-black tracking-tight">
              Vehicle Guidelines
            </h2>
            {activeInputCategory !== "guidelines" && (
              <button
                type="button"
                onClick={() => setActiveInputCategory("guidelines")}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple hover:underline cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Add rule</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-2.5">
            {TRANSPORT_GUIDELINES.map((item: TransportRuleOption) => {
              const isSelected = features.guidelines?.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleRule("guidelines", item.id)}
                  className={cn(
                    "flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[84px] sm:min-h-[92px]",
                    isSelected
                      ? "border-2 border-rose-500 bg-rose-50/30"
                      : "border-neutral-300 hover:border-neutral-900",
                  )}
                >
                  <span
                    className={cn(
                      "text-xs font-semibold leading-tight line-clamp-2 text-center transition-colors my-auto",
                      isSelected ? "text-rose-600 font-semibold" : "text-neutral-900",
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          <CustomBulletList
            items={features.customGuidelines || []}
            selectedItems={features.guidelines}
            onToggle={(custom) => toggleRule("guidelines", custom)}
            onRemove={(custom) => handleRemoveCustom("guidelines", custom)}
            isDanger
          />

          {activeInputCategory === "guidelines" && (
            <div className="flex items-center gap-2 max-w-xs mt-1.5 animate-in fade-in duration-100">
              <input
                type="text"
                value={customInputValue}
                onChange={(e) => setCustomInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustom("guidelines");
                  }
                }}
                placeholder="e.g. No strong food odors"
                className="flex-1 h-8 px-2.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-purple"
                autoFocus
              />
              <button
                type="button"
                onClick={() => handleAddCustom("guidelines")}
                className="h-8 px-3 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 cursor-pointer"
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
