"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

interface SharedDetailsStepProps {
  verticalName: "stay" | "experience" | "transport";
  title: string;
  description: string;
  submitting?: boolean;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onBack: () => void;
  onNext: () => void;
  titlePlaceholder?: string;
  descriptionPlaceholder?: string;
}

export function SharedDetailsStep({
  verticalName,
  title,
  description,
  submitting = false,
  onTitleChange,
  onDescriptionChange,
  onBack,
  onNext,
  titlePlaceholder,
  descriptionPlaceholder,
}: SharedDetailsStepProps) {
  const descriptionWordCount = useMemo(() => {
    const trimmed = description.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(Boolean).length;
  }, [description]);

  const isDescriptionOverLimit = descriptionWordCount > 300;

  const defaultTitlePlaceholder =
    verticalName === "stay"
      ? "e.g. Mukuni Riverfront Safari Lodge"
      : verticalName === "experience"
        ? "e.g. South Luangwa Walking Safari"
        : "e.g. VIP Airport Transfer & Chauffeur";

  const defaultDescPlaceholder =
    verticalName === "stay"
      ? "Describe your lodge or stay, room layout, scenic views, safari surroundings, and amenities..."
      : verticalName === "experience"
        ? "Describe what makes this experience memorable, guided itinerary, and equipment provided..."
        : "Describe vehicle features, comfort, luggage capacity, and professional chauffeur service...";

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="mb-2">
        <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-black leading-snug">
          Name and description
        </h1>
        <p className="text-xs text-black-subtle mt-0.5">
          Provide a clear title and description (maximum 300 words).
        </p>
      </div>

      <div className="space-y-4">
        {/* Listing Name / Title */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-800">
              Listing Name / Title <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-neutral-400 font-mono">
              {title.length}/80
            </span>
          </div>

          <input
            type="text"
            maxLength={80}
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder={titlePlaceholder || defaultTitlePlaceholder}
            className="w-full h-10 px-3.5 rounded-xl border border-neutral-200 bg-white text-xs sm:text-sm font-medium text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 transition-all"
          />
        </div>

        {/* Description with 300 Words Maximum Limit */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-800">
              Description <span className="text-rose-500">*</span>
            </label>

            <span
              className={cn(
                "text-[11px] px-2 py-0.5 rounded-full border transition-all font-medium",
                isDescriptionOverLimit
                  ? "bg-rose-50 text-rose-600 border-rose-200/80 font-bold"
                  : descriptionWordCount > 250
                    ? "bg-amber-50 text-amber-700 border-amber-200/80"
                    : "bg-purple/10 text-purple border-purple/20",
              )}
            >
              {isDescriptionOverLimit
                ? `Exceeded by ${descriptionWordCount - 300} words (max 300)`
                : `${descriptionWordCount} / 300 words`}
            </span>
          </div>

          <textarea
            rows={6}
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder={descriptionPlaceholder || defaultDescPlaceholder}
            className={cn(
              "w-full p-3 rounded-xl border bg-white text-xs sm:text-sm font-normal text-neutral-900 focus:outline-none transition-all leading-relaxed resize-y",
              isDescriptionOverLimit
                ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-200"
                : "border-neutral-200 focus:border-purple focus:ring-1 focus:ring-purple/20",
            )}
          />

          <div className="flex items-center justify-between pt-0.5 text-[11px]">
            {isDescriptionOverLimit ? (
              <p className="text-rose-500 font-semibold">
                Description exceeds 300 words. Please trim to proceed.
              </p>
            ) : (
              <p className="text-neutral-400">Maximum 300 words.</p>
            )}
            {!isDescriptionOverLimit && descriptionWordCount > 0 && (
              <span className="text-neutral-400">
                {300 - descriptionWordCount} words remaining
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Controls */}
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
          disabled={
            !title.trim() || !description.trim() || isDescriptionOverLimit || submitting
          }
          onClick={onNext}
          className={cn(
            "w-full sm:w-auto h-11 px-8 rounded-xl font-semibold text-xs sm:text-sm inline-flex items-center justify-center transition-all cursor-pointer shadow-xs",
            title.trim() && description.trim() && !isDescriptionOverLimit && !submitting
              ? "bg-purple text-white hover:bg-purple-hover active:scale-98"
              : "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200",
          )}
        >
          <span>{submitting ? "Saving..." : "Next"}</span>
        </button>
      </div>
    </div>
  );
}
