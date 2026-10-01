"use client";

import { Building2, CalendarDays, MapPin, Mail, Phone, ChevronDown } from "lucide-react";
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

const inputBaseClass =
  "w-full h-11 pl-9 pr-3.5 rounded-xl border border-neutral-200 bg-white text-xs sm:text-sm font-medium text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 transition-all placeholder:text-neutral-400";

const selectBaseClass =
  "w-full h-11 pl-9 pr-8 rounded-xl border border-neutral-200 bg-white text-xs sm:text-sm font-medium text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 transition-all appearance-none cursor-pointer";

export function BusinessBasicsStep({ data, errors, onChange }: BusinessBasicsStepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <SectionTitle
        title="Tell us about your business"
        subtitle="This helps us understand who we'll be hosting alongside and tailor your host profile."
      />

      <div className="space-y-4 max-w-2xl mx-auto">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-3">
            Business Details
          </span>
          <div className="space-y-3.5">
            <FormField
              label="Business Name"
              required
              error={errors.businessName}
              hint="Registered or trading name"
            >
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                <input
                  type="text"
                  value={data.businessName}
                  onChange={(e) => onChange("businessName", e.target.value)}
                  placeholder="e.g. Victoria Falls Bush Lodge"
                  className={inputBaseClass}
                />
              </div>
            </FormField>

            <FormField
              label="In Operation Since"
              required
              error={errors.operatingSince}
              hint="Year your business started operating"
            >
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                <select
                  value={data.operatingSince}
                  onChange={(e) => onChange("operatingSince", e.target.value)}
                  className={selectBaseClass}
                >
                  <option value="">Select year</option>
                  {YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
              </div>
            </FormField>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-100">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-3">
            Contact Information
          </span>
          <div className="space-y-3.5">
            <FormField
              label="Business Email"
              required
              error={errors.businessEmail}
              hint="Where booking enquiries will be sent"
            >
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                <input
                  type="email"
                  value={data.businessEmail}
                  onChange={(e) => onChange("businessEmail", e.target.value)}
                  placeholder="e.g. bookings@bushlodge.com"
                  className={inputBaseClass}
                />
              </div>
            </FormField>

            <FormField
              label="Business Phone"
              required
              error={errors.businessPhone}
              hint="Include country code, e.g. +260"
            >
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                <input
                  type="tel"
                  value={data.businessPhone}
                  onChange={(e) => onChange("businessPhone", e.target.value)}
                  placeholder="e.g. +260 97 123 4567"
                  className={inputBaseClass}
                />
              </div>
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <FormField label="Province" required error={errors.province}>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                  <select
                    value={data.province}
                    onChange={(e) => onChange("province", e.target.value)}
                    className={selectBaseClass}
                  >
                    <option value="">Select province</option>
                    {ZAMBIA_PROVINCES.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                </div>
              </FormField>

              <FormField label="Town / City" required error={errors.town}>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                  <input
                    type="text"
                    value={data.town}
                    onChange={(e) => onChange("town", e.target.value)}
                    placeholder="e.g. Livingstone"
                    className={inputBaseClass}
                  />
                </div>
              </FormField>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
