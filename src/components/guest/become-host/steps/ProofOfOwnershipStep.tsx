"use client";

import { ShieldCheck } from "lucide-react";
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
      <SectionTitle
        icon={ShieldCheck}
        eyebrow="Almost done"
        title="Proof of ownership & operation"
        subtitle="We verify every host to keep the community safe. Upload clear, readable copies of the documents below."
      />

      <div className="rounded-xl border border-gold/30 bg-gold/5 p-4">
        <p className="text-sm text-black-muted leading-relaxed">
          <span className="font-bold text-black">Accepted formats:</span> PDF, JPG or PNG. Each file
          must be legible and show the full document. Your files are encrypted and only viewed by
          our verification team.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-base font-bold text-black">1. Proof of Ownership</h3>
          <UploadZone
            title="Proof of Ownership"
            description="Title deed, lease agreement, business registration (PACRA) or council permit"
            docs={data.ownershipDocs}
            onDocsChange={(docs) => onChange("ownershipDocs", docs)}
            error={errors.ownershipDocs}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-bold text-black">2. Proof of Operation</h3>
          <UploadZone
            title="Proof of Operation"
            description="Operating license, tax clearance (TPIN), or insurance certificate"
            docs={data.operationDocs}
            onDocsChange={(docs) => onChange("operationDocs", docs)}
            error={errors.operationDocs}
          />
        </div>
      </div>
    </div>
  );
}
