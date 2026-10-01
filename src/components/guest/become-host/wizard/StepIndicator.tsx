"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { WIZARD_STEP_COUNT } from "./onboarding";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
  className?: string;
}

export function StepIndicator({
  currentStep,
  totalSteps = WIZARD_STEP_COUNT,
  className,
}: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
        Step {currentStep + 1} of {totalSteps}
      </span>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalSteps }).map((_, stepNum) => (
          <div
            key={stepNum}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              stepNum === currentStep
                ? "w-6 bg-purple"
                : stepNum < currentStep
                  ? "w-3 bg-purple/40"
                  : "w-3 bg-neutral-200",
            )}
          />
        ))}
      </div>
    </div>
  );
}
