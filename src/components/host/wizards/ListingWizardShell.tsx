"use client";

import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants/routes";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Shell                                                              */
/* ------------------------------------------------------------------ */

export function ListingWizardShell({
  steps,
  currentStep,
  saveState,
  title,
  onSaveExit,
  children,
}: ListingWizardShellProps) {
  const progress =
    steps.length <= 1
      ? 100
      : Math.min(100, Math.round((currentStep / (steps.length - 1)) * 100));

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 font-sans">
      {/* ── Top bar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-3xl flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={ROUTES.host.listings}
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-neutral-100 transition-colors"
              aria-label="Back to listings"
            >
              <ArrowLeft className="h-4 w-4 text-neutral-600" />
            </Link>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide truncate">
                Create listing
              </p>
              <h1 className="text-[13px] font-bold text-neutral-900 truncate">{title}</h1>
            </div>
          </div>

          <button
            onClick={onSaveExit}
            className={cn(
              "inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[11px] font-bold transition-colors border",
              saveState === "saving"
                ? "border-amber-200 bg-amber-50 text-amber-700"
                : saveState === "saved"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50",
            )}
          >
            <Save className="h-3.5 w-3.5" />
            {saveState === "saving"
              ? "Saving…"
              : saveState === "saved"
                ? "Saved"
                : "Save & exit"}
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-neutral-100">
          <div
            className="h-full bg-purple transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* ── Step indicators ─────────────────────────────────── */}
      <div className="mx-auto max-w-3xl w-full px-4 pt-4 pb-2">
        <div className="flex items-center gap-1.5">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-1.5 flex-1">
              <div
                className={cn(
                  "h-6 min-w-6 rounded-full flex items-center justify-center text-[9px] font-black shrink-0",
                  i < currentStep
                    ? "bg-purple text-white"
                    : i === currentStep
                      ? "bg-purple text-white ring-2 ring-purple/20"
                      : "bg-neutral-200 text-neutral-500",
                )}
              >
                {i + 1}
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold truncate hidden sm:inline",
                  i === currentStep ? "text-neutral-900" : "text-neutral-400",
                )}
              >
                {step.label}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "h-px flex-1",
                    i < currentStep ? "bg-purple" : "bg-neutral-200",
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Wizard content ──────────────────────────────────── */}
      <main className="flex-1 mx-auto max-w-3xl w-full px-4 pb-20 pt-2">
        {children}
      </main>
    </div>
  );
}
