"use client";

import React from "react";
import { STAY_SUBTYPES, StaySubtypeOption } from "./stayConstants";
import { cn } from "@/lib/utils";

interface StayStepSubtypeProps {
  selectedSubtype: string;
  onSelectSubtype: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function StayStepSubtype({
  selectedSubtype,
  onSelectSubtype,
  onBack,
  onNext,
}: StayStepSubtypeProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="text-center mb-6">
        <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-black leading-snug">
          Which of these best describes your stay?
        </h1>
        <p className="text-xs text-black-subtle mt-1.5 max-w-xl mx-auto leading-relaxed">
          Select the property category that most accurately represents your accommodation.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
        {STAY_SUBTYPES.map((sub: StaySubtypeOption) => {
          const Icon = sub.icon;
          const isSelected = selectedSubtype === sub.id;
          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => onSelectSubtype(sub.id)}
              onDoubleClick={onNext}
              className={cn(
                "flex flex-col items-center justify-center text-center p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[104px] sm:min-h-[116px]",
                isSelected
                  ? "border-2 border-purple bg-purple/[0.02]"
                  : "border-neutral-300 hover:border-neutral-900",
              )}
            >
              <Icon
                className={cn(
                  "h-6 w-6 sm:h-7 sm:w-7 mb-1.5 transition-colors shrink-0",
                  isSelected ? "text-purple" : "text-neutral-800",
                )}
                strokeWidth={1.5}
              />
              <span
                className={cn(
                  "text-xs sm:text-sm font-semibold leading-tight line-clamp-1 text-center transition-colors",
                  isSelected ? "text-purple font-semibold" : "text-neutral-900",
                )}
              >
                {sub.title}
              </span>
              <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-1 leading-snug line-clamp-2 text-center">
                {sub.description}
              </p>
            </button>
          );
        })}
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
          disabled={!selectedSubtype}
          onClick={onNext}
          className={cn(
            "w-full sm:w-auto h-11 px-8 rounded-xl font-semibold text-xs sm:text-sm inline-flex items-center justify-center transition-all cursor-pointer shadow-xs",
            selectedSubtype
              ? "bg-purple text-white hover:bg-purple-hover active:scale-98"
              : "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200",
          )}
        >
          <span>Next</span>
        </button>
      </div>
    </div>
  );
}
