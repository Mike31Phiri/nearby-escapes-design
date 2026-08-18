"use client";

import { Bed, Bus, Ticket } from "lucide-react";
import { SUB_TYPE_OPTIONS } from "../wizard/onboarding";
import type { ListingType, OnboardingData, ValidationErrors } from "../wizard/onboarding";
import { SectionTitle } from "../wizard/SectionTitle";
import { SelectCard } from "../wizard/SelectCard";

interface ListingSubTypeStepProps {
  data: OnboardingData;
  errors: ValidationErrors;
  onChange: <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => void;
}

const SUB_TYPE_META: Record<
  ListingType,
  { icon: typeof Bed; eyebrow: string; title: string; subtitle: string }
> = {
  stays: {
    icon: Bed,
    eyebrow: "Your stays",
    title: "What type of stay is it?",
    subtitle: "Select the category that best describes your accommodation.",
  },
  experiences: {
    icon: Ticket,
    eyebrow: "Your experiences",
    title: "What type of activity is it?",
    subtitle: "Select the category that best describes the experience you offer.",
  },
  transport: {
    icon: Bus,
    eyebrow: "Your transport",
    title: "What type of route is it?",
    subtitle: "Select the category that best describes your transport service.",
  },
};

export function ListingSubTypeStep({ data, errors, onChange }: ListingSubTypeStepProps) {
  const listingType = data.listingType as ListingType;

  if (!listingType || !SUB_TYPE_OPTIONS[listingType]) {
    return (
      <div className="animate-in fade-in duration-300 py-12 text-center">
        <p className="text-base text-black-muted">
          Please choose a listing type first to see the available options.
        </p>
      </div>
    );
  }

  const meta = SUB_TYPE_META[listingType];
  const options = SUB_TYPE_OPTIONS[listingType];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
      <SectionTitle
        icon={meta.icon}
        eyebrow={meta.eyebrow}
        title={meta.title}
        subtitle={meta.subtitle}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {options.map((option) => (
          <SelectCard
            key={option.value}
            icon={option.icon}
            label={option.label}
            description={option.description}
            layout="compact"
            selected={data.subType === option.value}
            onSelect={() => onChange("subType", option.value)}
          />
        ))}
      </div>

      {errors.subType && (
        <p className="text-[11px] font-medium text-destructive flex items-center gap-1">
          {errors.subType}
        </p>
      )}
    </div>
  );
}
