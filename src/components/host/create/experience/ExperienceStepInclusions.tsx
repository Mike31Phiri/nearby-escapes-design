"use client";

import React, { useState } from "react";
import { Plus, X, CheckCircle2, Ban, Info, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";
import {
  EXPERIENCE_WHATS_INCLUDED,
  EXPERIENCE_WHATS_NOT_INCLUDED,
  EXPERIENCE_WHAT_TO_BRING,
  EXPERIENCE_WHAT_NOT_TO_BRING,
  EXPERIENCE_IMPORTANT_INFO,
  EXPERIENCE_NOT_SUITABLE_FOR,
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

type InclusionCategory =
  | "whatsIncluded"
  | "whatsNotIncluded"
  | "whatToCarry"
  | "whatNotToBring"
  | "importantInformation"
  | "notSuitableFor";

interface CategoryConfig {
  key: InclusionCategory;
  customKey: keyof ExperienceItemsState;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  options: ExperienceItemOption[];
  placeholder: string;
}

const CATEGORIES: CategoryConfig[] = [
  {
    key: "whatsIncluded",
    customKey: "customWhatsIncluded",
    title: "What's Included",
    subtitle: "Equipment, admission fees, meals, and services provided by you",
    icon: CheckCircle2,
    accentColor: "emerald",
    options: EXPERIENCE_WHATS_INCLUDED,
    placeholder: "e.g. Bush breakfast or certified wildlife guide",
  },
  {
    key: "whatsNotIncluded",
    customKey: "customWhatsNotIncluded",
    title: "What's Not Included",
    subtitle: "Expenses or extras guests should budget for separately",
    icon: X,
    accentColor: "neutral",
    options: EXPERIENCE_WHATS_NOT_INCLUDED,
    placeholder: "e.g. Gratuities & tips, alcoholic beverages",
  },
  {
    key: "whatToCarry",
    customKey: "customWhatToCarry",
    title: "What to Bring",
    subtitle: "Clothing, personal gear, documents, and essentials to pack",
    icon: ShieldCheck,
    accentColor: "purple",
    options: EXPERIENCE_WHAT_TO_BRING,
    placeholder: "e.g. Hiking shoes, valid ID, sun protection",
  },
  {
    key: "whatNotToBring",
    customKey: "customWhatNotToBring",
    title: "What's Not Allowed / What NOT to Bring",
    subtitle: "Restricted or prohibited items for safety and national park conservation",
    icon: Ban,
    accentColor: "rose",
    options: EXPERIENCE_WHAT_NOT_TO_BRING,
    placeholder: "e.g. Drones, plastic bags, domestic pets",
  },
  {
    key: "importantInformation",
    customKey: "customImportantInformation",
    title: "Important Information & Guidelines",
    subtitle: "Arrival timing, gate clearance, safety notices, and health policies",
    icon: Info,
    accentColor: "purple",
    options: EXPERIENCE_IMPORTANT_INFO,
    placeholder: "e.g. Arrive 15 minutes before scheduled start time",
  },
  {
    key: "notSuitableFor",
    customKey: "customNotSuitableFor",
    title: "Not Suitable For (Suitability)",
    subtitle: "Mobility requirements, terrain notices, age, or medical restrictions",
    icon: AlertTriangle,
    accentColor: "amber",
    options: EXPERIENCE_NOT_SUITABLE_FOR,
    placeholder: "e.g. Wheelchair users (due to unpaved natural tracks)",
  },
];

export function ExperienceStepInclusions({
  items,
  onItemsChange,
  onBack,
  onNext,
  submitting = false,
}: ExperienceStepInclusionsProps) {
  const [activeInputCategory, setActiveInputCategory] = useState<InclusionCategory | null>(null);
  const [customInputValue, setCustomInputValue] = useState("");

  const toggleItem = (category: InclusionCategory, idOrLabel: string) => {
    const list = items[category] || [];
    const exists = list.includes(idOrLabel);
    const updatedList = exists ? list.filter((i) => i !== idOrLabel) : [...list, idOrLabel];
    onItemsChange({
      ...items,
      [category]: updatedList,
    });
  };

  const handleAddCustom = (category: InclusionCategory, customKey: keyof ExperienceItemsState) => {
    const text = customInputValue.trim();
    if (!text) return;

    const currentCustom = ((items[customKey] as string[]) || []);
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
    category: InclusionCategory,
    customKey: keyof ExperienceItemsState,
    item: string,
  ) => {
    const currentCustom = ((items[customKey] as string[]) || []);
    const updatedCustom = currentCustom.filter((x) => x !== item);
    const updatedMain = (items[category] || []).filter((x) => x !== item);

    onItemsChange({
      ...items,
      [customKey]: updatedCustom,
      [category]: updatedMain,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="text-center mb-4">
        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-black leading-snug">
          Inclusions, Guidelines &amp; Suitability
        </h1>
        <p className="text-xs text-neutral-600 mt-1 max-w-xl mx-auto leading-relaxed">
          Select or add custom bullet points for your experience. These points are displayed as clear lists on your experience detail page and stored for easy retrieval.
        </p>
      </div>

      <div className="space-y-8 sm:space-y-10 divide-y divide-neutral-100">
        {CATEGORIES.map((cat, catIdx) => {
          const Icon = cat.icon;
          const currentList = items[cat.key] || [];
          const customList = (items[cat.customKey] as string[]) || [];

          return (
            <div key={cat.key} className={cn("space-y-3.5", catIdx > 0 ? "pt-6" : "")}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-1">
                <div>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-purple shrink-0" />
                    <h2 className="text-xs sm:text-sm font-bold text-black tracking-tight">
                      {cat.title}
                    </h2>
                    <span className="text-[11px] font-semibold text-neutral-500">
                      ({currentList.length} selected)
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">{cat.subtitle}</p>
                </div>

                {activeInputCategory !== cat.key && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveInputCategory(cat.key);
                      setCustomInputValue("");
                    }}
                    className="self-start sm:self-auto inline-flex items-center gap-1 text-[11px] font-bold text-purple hover:underline cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add custom point</span>
                  </button>
                )}
              </div>

              {/* Preset Chips */}
              <div className="flex flex-wrap items-center gap-2">
                {cat.options.map((opt) => {
                  const isSelected = currentList.includes(opt.id) || currentList.includes(opt.label);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleItem(cat.key, opt.id)}
                      className={cn(
                        "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border select-none text-left",
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
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Items list */}
              {customList.length > 0 && (
                <CustomBulletList
                  items={customList}
                  selectedItems={currentList}
                  onToggle={(custom) => toggleItem(cat.key, custom)}
                  onRemove={(custom) => handleRemoveCustom(cat.key, cat.customKey, custom)}
                />
              )}

              {/* Add Custom Input Form */}
              {activeInputCategory === cat.key && (
                <div className="flex items-center gap-2 max-w-md mt-2 animate-in fade-in duration-100">
                  <input
                    type="text"
                    value={customInputValue}
                    onChange={(e) => setCustomInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustom(cat.key, cat.customKey);
                      }
                    }}
                    placeholder={cat.placeholder}
                    className="flex-1 h-8 px-3 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:border-purple"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => handleAddCustom(cat.key, cat.customKey)}
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
                    className="h-8 px-2 rounded-lg text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
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
          <span>{submitting ? "Saving..." : "Next: Location & Meeting Point"}</span>
        </button>
      </div>
    </div>
  );
}
