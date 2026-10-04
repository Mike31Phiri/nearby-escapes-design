"use client";

import React, { useMemo, useState } from "react";
import { Plus, Trash2, Clock, RotateCcw } from "lucide-react";
import { ExperienceItineraryStop } from "./experienceTypes";
import { DEFAULT_EXPERIENCE_ITINERARY } from "./experienceConstants";
import { cn } from "@/lib/utils";

interface ExperienceStepDetailsProps {
  title: string;
  description: string;
  itinerary: ExperienceItineraryStop[];
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onItineraryChange: (stops: ExperienceItineraryStop[]) => void;
  onBack: () => void;
  onNext: () => void;
  submitting?: boolean;
}

export function ExperienceStepDetails({
  title,
  description,
  itinerary,
  onTitleChange,
  onDescriptionChange,
  onItineraryChange,
  onBack,
  onNext,
  submitting = false,
}: ExperienceStepDetailsProps) {
  const descriptionWordCount = useMemo(() => {
    const trimmed = description.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(Boolean).length;
  }, [description]);

  const isDescriptionOverLimit = descriptionWordCount > 300;

  const currentStops: ExperienceItineraryStop[] = useMemo(() => {
    if (Array.isArray(itinerary) && itinerary.length > 0) return itinerary;
    return DEFAULT_EXPERIENCE_ITINERARY;
  }, [itinerary]);

  const handleUpdateStop = (index: number, field: keyof ExperienceItineraryStop, value: string) => {
    const updated = currentStops.map((stop, i) =>
      i === index ? { ...stop, [field]: value } : stop,
    );
    onItineraryChange(updated);
  };

  const handleAddStop = () => {
    const newStop: ExperienceItineraryStop = {
      time: "12:00 PM",
      title: "New Activity Stop",
      description: "Briefly explain what happens during this part of the experience.",
    };
    onItineraryChange([...currentStops, newStop]);
  };

  const handleRemoveStop = (index: number) => {
    if (currentStops.length <= 1) {
      return;
    }
    const updated = currentStops.filter((_, i) => i !== index);
    onItineraryChange(updated);
  };

  const handleResetItinerary = () => {
    onItineraryChange(DEFAULT_EXPERIENCE_ITINERARY);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="mb-2">
        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-black leading-snug">
          Name, description &amp; itinerary
        </h1>
        <p className="text-xs text-neutral-600 mt-0.5">
          Provide a captivating title, summary description (up to 300 words), and your guided schedule.
        </p>
      </div>

      <div className="space-y-5">
        {/* Title */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-900">
              Listing Title <span className="text-rose-500">*</span>
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
            placeholder="e.g. South Luangwa Walking Safari & Game Drive"
            className="w-full h-10 px-3.5 rounded-xl border border-neutral-200 bg-white text-xs sm:text-sm font-medium text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 transition-all"
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-900">
              Overview Description <span className="text-rose-500">*</span>
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
            rows={5}
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Describe what makes this experience memorable, wildlife highlights, landscapes, and guided activities..."
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

        {/* Experience Itinerary Builder */}
        <div className="pt-4 border-t border-neutral-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple" />
                <h2 className="text-xs sm:text-sm font-bold text-black tracking-tight">
                  Experience Itinerary &amp; Timeline
                </h2>
              </div>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Set each stop in chronological order with time, title, and a brief description.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleResetItinerary}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
                title="Reset to default stops"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={handleAddStop}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple/10 text-purple text-xs font-bold hover:bg-purple/20 transition-colors cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Add Stop</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {currentStops.map((stop, idx) => (
              <div
                key={`stop-${idx}`}
                className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:bg-white hover:border-purple/30 transition-all space-y-2.5 relative group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="w-5 h-5 rounded-full bg-purple/10 text-purple font-bold text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={stop.time}
                      onChange={(e) => handleUpdateStop(idx, "time", e.target.value)}
                      placeholder="e.g. 08:30 AM"
                      className="w-24 sm:w-28 h-8 px-2.5 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-800 focus:outline-none focus:border-purple"
                    />
                    <input
                      type="text"
                      value={stop.title}
                      onChange={(e) => handleUpdateStop(idx, "title", e.target.value)}
                      placeholder="Stop title (e.g. Morning River Crossing)"
                      className="flex-1 h-8 px-2.5 rounded-lg border border-neutral-200 bg-white text-xs font-bold text-neutral-900 focus:outline-none focus:border-purple"
                    />
                  </div>

                  {currentStops.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStop(idx)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove stop"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <textarea
                  rows={2}
                  value={stop.description}
                  onChange={(e) => handleUpdateStop(idx, "description", e.target.value)}
                  placeholder="Details about this stop..."
                  className="w-full p-2.5 rounded-lg border border-neutral-200 bg-white text-xs text-neutral-700 focus:outline-none focus:border-purple leading-relaxed resize-y"
                />
              </div>
            ))}
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
          <span>{submitting ? "Saving..." : "Next: Departure Sessions"}</span>
        </button>
      </div>
    </div>
  );
}
