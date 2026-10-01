// Onboarding Wizard configuration

export const WIZARD_STEPS = [
  { id: "business", label: "Business Details", short: "Business" },
  { id: "documents", label: "Verification Documents", short: "Documents" },
] as const;

export const WIZARD_STEP_COUNT = WIZARD_STEPS.length;

// Years in operation
export function buildYearsInOperation(): string[] {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let year = currentYear; year >= 1970; year -= 1) {
    years.push(String(year));
  }
  return years;
}

// Uploaded document shape
export interface UploadedDoc {
  id: string;
  name: string;
  size: number;
}

// Wizard form data - Simplified for business capturing & verification docs
export interface OnboardingData {
  // Step 1 — Business basics
  businessName: string;
  operatingSince: string;
  province: string;
  town: string;
  businessEmail: string;
  businessPhone: string;

  // Step 2 — Business documents
  pacraDocs: UploadedDoc[];
  ownershipDocs: UploadedDoc[];
  operationDocs: UploadedDoc[];
}

export const INITIAL_ONBOARDING_DATA: OnboardingData = {
  businessName: "",
  operatingSince: "",
  province: "",
  town: "",
  businessEmail: "",
  businessPhone: "",
  pacraDocs: [],
  ownershipDocs: [],
  operationDocs: [],
};

export type ValidationErrors = Partial<Record<keyof OnboardingData, string>>;
