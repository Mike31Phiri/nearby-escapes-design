"use client";

import { Building2, CalendarDays, MapPin, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ZAMBIA_PROVINCES } from "@/lib/constants/provinces";
import { FormField } from "../wizard/FormField";
import { SectionTitle } from "../wizard/SectionTitle";
import { buildYearsInOperation } from "../wizard/onboarding";
import type { OnboardingData, ValidationErrors } from "../wizard/onboarding";

interface BusinessBasicsStepProps {
  data: OnboardingData;
  errors: ValidationErrors;
  onChange: <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => void;
}

const YEARS = buildYearsInOperation();

const selectClass =
  "flex h-11 w-full rounded-xl border border-border bg-white px-4 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold focus-visible:border-gold appearance-none cursor-pointer";

export function BusinessBasicsStep({ data, errors, onChange }: BusinessBasicsStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
      <SectionTitle
        icon={Building2}
        eyebrow="Let's start here"
        title="Tell us about your business"
        subtitle="This helps us understand who we'll be hosting alongside and tailor your experience."
      />

      <div className="space-y-4">
        <h3 className="text-base font-bold text-black mb-1">Business Details</h3>
        <FormField
          label="Business Name"
          error={errors.businessName}
          hint="Registered or trading name"
        >
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black-subtle" />
            <Input
              value={data.businessName}
              onChange={(e) => onChange("businessName", e.target.value)}
              placeholder="e.g. Victoria Falls Bush Lodge"
              className="pl-9 h-11 rounded-xl border-border placeholder:text-black-faint/70"
            />
          </div>
        </FormField>

        <FormField
          label="In Operation Since"
          error={errors.operatingSince}
          hint="The year your business started operating"
        >
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black-subtle pointer-events-none" />
            <select
              value={data.operatingSince}
              onChange={(e) => onChange("operatingSince", e.target.value)}
              className={`${selectClass} pl-9`}
            >
              <option value="">Select year</option>
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </FormField>

        <div className="pt-6 mt-2 border-t border-border">
          <h3 className="text-base font-bold text-black mb-0.5">Contact Information</h3>
          <p className="text-sm text-black-muted mb-4">
            How guests and our team can reach your business.
          </p>
        </div>

        <FormField
          label="Business Email"
          error={errors.businessEmail}
          hint="Where booking enquiries should be sent"
        >
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black-subtle" />
            <Input
              type="email"
              value={data.businessEmail}
              onChange={(e) => onChange("businessEmail", e.target.value)}
              placeholder="e.g. bookings@victoriafallsbushlodge.com"
              className="pl-9 h-11 rounded-xl border-border placeholder:text-black-faint/70"
            />
          </div>
        </FormField>

        <FormField
          label="Business Phone"
          error={errors.businessPhone}
          hint="Include country code, e.g. +260"
        >
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black-subtle" />
            <Input
              type="tel"
              value={data.businessPhone}
              onChange={(e) => onChange("businessPhone", e.target.value)}
              placeholder="e.g. +260 97 123 4567"
              className="pl-9 h-11 rounded-xl border-border placeholder:text-black-faint/70"
            />
          </div>
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Province" error={errors.province}>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black-subtle pointer-events-none" />
              <select
                value={data.province}
                onChange={(e) => onChange("province", e.target.value)}
                className={`${selectClass} pl-9`}
              >
                <option value="">Select province</option>
                {ZAMBIA_PROVINCES.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.label}
                  </option>
                ))}
              </select>
            </div>
          </FormField>

          <FormField label="Town / City" error={errors.town}>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black-subtle" />
              <Input
                value={data.town}
                onChange={(e) => onChange("town", e.target.value)}
                placeholder="e.g. Livingstone"
                className="pl-9 h-11 rounded-xl border-border placeholder:text-black-faint/70"
              />
            </div>
          </FormField>
        </div>
      </div>
    </div>
  );
}
