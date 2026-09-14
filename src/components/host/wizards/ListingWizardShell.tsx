"use client";

import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants/routes";

export interface WizardStep {
  id: string;
  label: string;
  fields?: readonly string[];
}

export type ListingSaveState = "idle" | "saving" | "saved" | "error";

interface ListingWizardShellProps {
  steps: WizardStep[];
  currentStep: number;
  saveState: ListingSaveState;
  title: string;
  onSaveExit: () => void;
  children: React.ReactNode;
}

export function ListingWizardShell({
  steps,
  currentStep,
  saveState,
  title,
  onSaveExit,
  children,
}: ListingWizardShellProps) {
  const progress =
    steps.length <= 1 ? 100 : Math.min(100, Math.round((currentStep / (steps.length - 1)) * 100));

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80">
        <div className="mx-auto max-w-4xl flex items-center justify-between px-4 sm:px-6 h-16">
          <div className="flex items-center gap-3.5 min-w-0">
            <Link
              href={ROUTES?.host?.listings ?? "/host/listings"}
              className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-neutral-200/80 bg-white text-neutral-600 hover:bg-neutral-100 hover:text-purple transition-colors shadow-2xs"
              aria-label="Back to listings"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="min-w-0">
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider truncate">
                Create Listing
              </p>
              <h1 className="text-base font-bold text-neutral-900 truncate">{title}</h1>
            </div>
          </div>

          <button
            onClick={onSaveExit}
            className={cn(
              "inline-flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold transition-all border shadow-2xs",
              saveState === "saving"
                ? "border-amber-200 bg-amber-50 text-amber-700"
                : saveState === "saved"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-neutral-200/80 bg-white text-neutral-700 hover:border-purple/40 hover:text-purple hover:bg-neutral-50",
            )}
          >
            <Save className="h-4 w-4" />
            {saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved" : "Save & exit"}
          </button>
        </div>

        <div className="h-1 bg-neutral-200/50">
          <div
            className="h-full bg-purple transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 pt-6 pb-3">
        <div className="flex items-center gap-2">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-2 flex-1">
              <div
                className={cn(
                  "h-8 min-w-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all",
                  i < currentStep
                    ? "bg-purple text-white shadow-xs"
                    : i === currentStep
                      ? "bg-purple text-white ring-4 ring-purple/15 shadow-xs"
                      : "bg-neutral-200/80 text-neutral-500",
                )}
              >
                {i + 1}
              </div>
              <span
                className={cn(
                  "text-sm font-semibold truncate hidden sm:inline",
                  i === currentStep ? "text-neutral-900" : "text-neutral-400",
                )}
              >
                {step.label}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 transition-colors",
                    i < currentStep ? "bg-purple" : "bg-neutral-200/80",
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <main className="flex-1 mx-auto max-w-4xl w-full px-4 sm:px-6 pb-20 pt-4">{children}</main>
    </div>
  );
}
