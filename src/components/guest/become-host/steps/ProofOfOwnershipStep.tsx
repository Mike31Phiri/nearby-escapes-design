"use client";

import { UploadZone } from "../wizard/UploadZone";
import { SectionTitle } from "../wizard/SectionTitle";
import type { OnboardingData, ValidationErrors } from "../wizard/onboarding";

interface ProofOfOwnershipStepProps {
  data: OnboardingData;
  errors: ValidationErrors;
  onChange: <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => void;
}

export function ProofOfOwnershipStep({ data, errors, onChange }: ProofOfOwnershipStepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <SectionTitle
        title="Business verification documents"
        subtitle="We verify all hosts to keep the platform trusted and safe. Upload clear copies of your business documentation below."
      />

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-xl border border-purple/20 bg-purple/[0.03] p-4">
          <p className="text-xs text-neutral-600 leading-relaxed">
            <span className="font-semibold text-neutral-900">Accepted formats:</span> PDF, JPG or PNG (up to 10MB each).
            Ensure company names, registration numbers, and dates are legible. Documents are encrypted and reviewed only by our compliance team.
          </p>
        </div>

        <div className="space-y-5">
          {/* 1. PACRA Business Registration */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-800">
              1. PACRA Business Registration <span className="text-rose-500">*</span>
            </label>
            <UploadZone
              title="PACRA Registration Document"
              description="Certificate of incorporation, PACRA business registration, or official certificate"
              docs={data.pacraDocs}
              onDocsChange={(docs) => onChange("pacraDocs", docs)}
              error={errors.pacraDocs}
            />
          </div>

          {/* 2. Proof of Ownership */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-neutral-800">
              2. Proof of Ownership <span className="text-rose-500">*</span>
            </label>
            <UploadZone
              title="Proof of Ownership"
              description="Title deed, signed lease agreement, council property permit, or vehicle logbook"
              docs={data.ownershipDocs}
              onDocsChange={(docs) => onChange("ownershipDocs", docs)}
              error={errors.ownershipDocs}
            />
          </div>

          {/* 3. Proof of Operation */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-neutral-800">
              3. Proof of Operation <span className="text-rose-500">*</span>
            </label>
            <UploadZone
              title="Proof of Operation"
              description="Operating license, TPIN tax clearance, council operating permit, or insurance certificate"
              docs={data.operationDocs}
              onDocsChange={(docs) => onChange("operationDocs", docs)}
              error={errors.operationDocs}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
