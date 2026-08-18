"use client";

import { LayoutGrid } from "lucide-react";
import { LISTING_TYPE_OPTIONS } from "../wizard/onboarding";
import type { ListingType, OnboardingData, ValidationErrors } from "../wizard/onboarding";
import { SectionTitle } from "../wizard/SectionTitle";
import { SelectCard } from "../wizard/SelectCard";

interface ListingTypeStepProps {
  data: OnboardingData;
  errors: ValidationErrors;
  onChange: <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => void;
}

export function ListingTypeStep({ data, errors, onChange }: ListingTypeStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
      <SectionTitle
        icon={LayoutGrid}
        eyebrow="What are you hosting?"
        title="Choose your listing type"
        subtitle="Nearby Escapes supports three kinds of listings. Pick the one that fits your business."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {LISTING_TYPE_OPTIONS.map((option) => (
          <SelectCard
            key={option.value}
            icon={option.icon}
            label={option.label}
            description={option.description}
            selected={data.listingType === option.value}
            onSelect={() => {
              onChange("listingType", option.value as ListingType);
              onChange("subType", "");
            }}
          />
        ))}
      </div>

      {errors.listingType && (
        <p className="text-[11px] font-medium text-destructive flex items-center gap-1">
          {errors.listingType}
        </p>
      )}
    </div>
  );
}
