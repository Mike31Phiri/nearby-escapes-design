"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { WIZARD_STEPS, WIZARD_STEP_COUNT } from "./onboarding";

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      <div className="flex items-center justify-between mb-3">
        {WIZARD_STEPS.map((step, idx) => {
          const isActive = idx === currentStep;
          const isCompleted = idx < currentStep;
          return (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center gap-1.5 transition-all duration-300",
                isActive ? "opacity-100" : isCompleted ? "opacity-90" : "opacity-40",
              )}
            >
              <div
                className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300 border-2",
                  isActive
                    ? "bg-gold text-black border-gold shadow-lg shadow-gold/25 scale-110"
                    : isCompleted
                      ? "bg-gold/15 text-black border-gold/40"
                      : "bg-black/5 text-black-faint border-black/10",
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" strokeWidth={3} /> : idx + 1}
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider hidden sm:block",
                  isActive ? "text-black" : "text-black-faint",
                )}
              >
                {step.short}
              </span>
            </div>
          );
        })}
      </div>
      <div className="h-1.5 rounded-full bg-black/10 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gold to-gold rounded-full transition-all duration-500"
          style={{ width: `${((currentStep + 1) / WIZARD_STEP_COUNT) * 100}%` }}
        />
      </div>
    </div>
  );
}
