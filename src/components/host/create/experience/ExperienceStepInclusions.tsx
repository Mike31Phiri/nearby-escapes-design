"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import {
  EXPERIENCE_WHATS_INCLUDED,
  EXPERIENCE_WHAT_TO_BRING,
  EXPERIENCE_WHAT_NOT_TO_BRING,
  ExperienceItemOption,
} from "./experienceConstants";
import { ExperienceItemsState } from "./experienceTypes";
import { CustomBulletList } from "../shared";
import { cn } from "@/lib/utils";

interface ExperienceStepInclusionsProps {
  items: ExperienceItemsState;
  onItemsChange: (updated: ExperienceItemsState) => void;
  onBack: () => void;
  onNext: () => void;
  submitting?: boolean;
}

export function ExperienceStepInclusions({
  items,
  onItemsChange,
  onBack,
  onNext,
  submitting = false,
}: ExperienceStepInclusionsProps) {
  const [activeInputCategory, setActiveInputCategory] = useState<string | null>(null);
  const [customInputValue, setCustomInputValue] = useState("");

  const toggleItem = (
    category: "whatsIncluded" | "whatToCarry" | "whatNotToBring",
    id: string,
  ) => {
    const list = items[category] || [];
    const exists = list.includes(id);
    const updatedList = exists ? list.filter((i) => i !== id) : [...list, id];
    onItemsChange({
      ...items,
      [category]: updatedList,
    });
  };

  const handleAddCustom = (category: "whatsIncluded" | "whatToCarry" | "whatNotToBring") => {
    const text = customInputValue.trim();
    if (!text) return;

    const customKey =
      category === "whatsIncluded"
        ? "customWhatsIncluded"
        : category === "whatToCarry"
          ? "customWhatToCarry"
          : "customWhatNotToBring";

    const currentCustom = items[customKey] || [];
    const updatedCustom = [...currentCustom, text];
    const updatedMain = [...(items[category] || []), text];

    onItemsChange({
      ...items,
      [customKey]: updatedCustom,
      [category]: updatedMain,
    });

    setCustomInputValue("");
    setActiveInputCategory(null);
  };

  const handleRemoveCustom = (
    category: "whatsIncluded" | "whatToCarry" | "whatNotToBring",
    item: string,
  ) => {
    const customKey =
      category === "whatsIncluded"
        ? "customWhatsIncluded"
        : category === "whatToCarry"
          ? "customWhatToCarry"
          : "customWhatNotToBring";

    const currentCustom = items[customKey] || [];
    const updatedCustom = currentCustom.filter((x) => x !== item);
    const updatedMain = (items[category] || []).filter((x) => x !== item);

    onItemsChange({
      ...items,
      [customKey]: updatedCustom,
      [category]: updatedMain,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="text-center mb-6">
        <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-black leading-snug">
          Inclusions &amp; guest guidelines
        </h1>
        <p className="text-xs text-black-subtle mt-1 max-w-xl mx-auto leading-relaxed">
          Select what is included and guidelines for attendees.
        </p>
      </div>

      <div className="space-y-8 sm:space-y-10">
        {/* Type 1: What's Included */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100">
            <h2 className="text-xs sm:text-sm font-semibold text-black tracking-tight">
              What&apos;s Included
            </h2>
            {activeInputCategory !== "whatsIncluded" && (
              <button
                type="button"
                onClick={() => setActiveInputCategory("whatsIncluded")}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple hover:underline cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Add custom</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {EXPERIENCE_WHATS_INCLUDED.map((item: ExperienceItemOption) => {
              const isSelected = items.whatsIncluded?.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleItem("whatsIncluded", item.id)}
                  className={cn(
                    "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer border select-none",
                    isSelected
                      ? "border-purple bg-purple/10 text-purple font-semibold shadow-2xs ring-1 ring-purple/20"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50/80 hover:text-neutral-900",
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full shrink-0 transition-colors",
                      isSelected ? "bg-purple" : "bg-neutral-400",
                    )}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <CustomBulletList
            items={items.customWhatsIncluded || []}
            selectedItems={items.whatsIncluded}
            onToggle={(custom) => toggleItem("whatsIncluded", custom)}
            onRemove={(custom) => handleRemoveCustom("whatsIncluded", custom)}
          />

          {activeInputCategory === "whatsIncluded" && (
            <div className="flex items-center gap-2 max-w-xs mt-1.5 animate-in fade-in duration-100">
              <input
                type="text"
                value={customInputValue}
                onChange={(e) => setCustomInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustom("whatsIncluded");
                  }
                }}
                placeholder="e.g. Bush breakfast"
                className="flex-1 h-8 px-2.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-purple"
                autoFocus
              />
              <button
                type="button"
                onClick={() => handleAddCustom("whatsIncluded")}
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

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {EXPERIENCE_WHAT_TO_BRING.map((item: ExperienceItemOption) => {
              const isSelected = items.whatToCarry?.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleItem("whatToCarry", item.id)}
                  className={cn(
                    "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer border select-none",
                    isSelected
                      ? "border-purple bg-purple/10 text-purple font-semibold shadow-2xs ring-1 ring-purple/20"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50/80 hover:text-neutral-900",
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full shrink-0 transition-colors",
                      isSelected ? "bg-purple" : "bg-neutral-400",
                    )}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <CustomBulletList
            items={items.customWhatToCarry || []}
            selectedItems={items.whatToCarry}
            onToggle={(custom) => toggleItem("whatToCarry", custom)}
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
                placeholder="e.g. Binoculars"
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

        {/* Type 3: What NOT to Bring */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100">
            <h2 className="text-xs sm:text-sm font-semibold text-black tracking-tight">
              What NOT to Bring
            </h2>
            {activeInputCategory !== "whatNotToBring" && (
              <button
                type="button"
                onClick={() => setActiveInputCategory("whatNotToBring")}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple hover:underline cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Add restriction</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {EXPERIENCE_WHAT_NOT_TO_BRING.map((item: ExperienceItemOption) => {
              const isSelected = items.whatNotToBring?.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleItem("whatNotToBring", item.id)}
                  className={cn(
                    "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer border select-none",
                    isSelected
                      ? "border-rose-400 bg-rose-50 text-rose-700 font-semibold shadow-2xs ring-1 ring-rose-200"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50/80 hover:text-neutral-900",
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full shrink-0 transition-colors",
                      isSelected ? "bg-rose-500" : "bg-neutral-400",
                    )}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <CustomBulletList
            items={items.customWhatNotToBring || []}
            selectedItems={items.whatNotToBring}
            onToggle={(custom) => toggleItem("whatNotToBring", custom)}
            onRemove={(custom) => handleRemoveCustom("whatNotToBring", custom)}
            isDanger
          />

          {activeInputCategory === "whatNotToBring" && (
            <div className="flex items-center gap-2 max-w-xs mt-1.5 animate-in fade-in duration-100">
              <input
                type="text"
                value={customInputValue}
                onChange={(e) => setCustomInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustom("whatNotToBring");
                  }
                }}
                placeholder="e.g. Drones"
                className="flex-1 h-8 px-2.5 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-purple"
                autoFocus
              />
              <button
                type="button"
                onClick={() => handleAddCustom("whatNotToBring")}
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
