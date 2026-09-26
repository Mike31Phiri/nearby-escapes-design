"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Loader2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/lib/store/authStore";

import { StepIndicator } from "./wizard/StepIndicator";
import { BusinessBasicsStep } from "./steps/BusinessBasicsStep";
import { ListingTypeStep } from "./steps/ListingTypeStep";
import { ListingSubTypeStep } from "./steps/ListingSubTypeStep";
import { ProofOfOwnershipStep } from "./steps/ProofOfOwnershipStep";
import { SuccessStep } from "./wizard/SuccessStep";
import {
  INITIAL_ONBOARDING_DATA,
  WIZARD_STEP_COUNT,
  LISTING_TYPE_OPTIONS,
  SUB_TYPE_OPTIONS,
} from "./wizard/onboarding";
import type { OnboardingData, ValidationErrors } from "./wizard/onboarding";

const TOTAL_STEPS = WIZARD_STEP_COUNT;

export function BecomeHostPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<OnboardingData>(INITIAL_ONBOARDING_DATA);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!success && user && (user.roles?.includes("host") || user.roles?.includes("admin"))) {
      router.replace("/host");
    }
  }, [user, router, success]);

  const updateField = useCallback(
    <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => {
      setData((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        if (!(key in prev)) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [],
  );

  const validateStep = useCallback((): boolean => {
    const errs: ValidationErrors = {};

    switch (step) {
      case 0:
        if (!data.businessName.trim()) errs.businessName = "Business name is required";
        if (!data.operatingSince) errs.operatingSince = "Select the year you started operating";
        if (!data.province) errs.province = "Select your province";
        if (!data.town.trim()) errs.town = "Town / city is required";
        if (!data.businessEmail.trim()) errs.businessEmail = "Business email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.businessEmail))
          errs.businessEmail = "Enter a valid email address";
        if (!data.businessPhone.trim()) errs.businessPhone = "Business phone is required";
        else if (!/^[+()\d\s-]{7,20}$/.test(data.businessPhone))
          errs.businessPhone = "Enter a valid phone number";
        break;
      case 1:
        if (!data.listingType) errs.listingType = "Select the type of listing you'd like to host";
        break;
      case 2:
        if (!data.subType) errs.subType = "Select a category to continue";
        break;
      case 3:
        if (data.ownershipDocs.length === 0)
          errs.ownershipDocs = "Please upload at least one proof of ownership document";
        if (data.operationDocs.length === 0)
          errs.operationDocs = "Please upload at least one proof of operation document";
        break;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [step, data]);

  const goNext = useCallback(() => {
    if (validateStep()) {
      setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [validateStep]);

  const goBack = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateStep()) return;
    setSubmitting(true);

    await new Promise((r) => setTimeout(r, 2000));

    if (user) {
      setUser({
        ...user,
        roles: [...(user.roles || []), "host"],
        name: data.businessName,
      });
    }

    toast.success("Application submitted! 🎉", {
      description:
        "Our team will review your documents and get back to you within 1–3 business days.",
    });

    setSubmitting(false);
    setSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [validateStep, user, setUser, data.businessName]);

  const listingLabel =
    LISTING_TYPE_OPTIONS.find((option) => option.value === data.listingType)?.label ?? "";
  const subTypeLabel =
    data.listingType && data.subType
      ? (SUB_TYPE_OPTIONS[data.listingType].find((option) => option.value === data.subType)
          ?.label ?? "")
      : "";

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return <BusinessBasicsStep data={data} errors={errors} onChange={updateField} />;
      case 1:
        return <ListingTypeStep data={data} errors={errors} onChange={updateField} />;
      case 2:
        return <ListingSubTypeStep data={data} errors={errors} onChange={updateField} />;
      case 3:
        return <ProofOfOwnershipStep data={data} errors={errors} onChange={updateField} />;
      default:
        return null;
    }
  };

  const isLastStep = step === TOTAL_STEPS - 1;

  return (
    <div className="min-h-screen flex flex-col bg-white-warm font-sans">
      <main className="flex-1">
        {/* Compact step indicator only */}
        {!success && (
          <div className="mx-auto max-w-3xl px-4 md:px-6 pt-6 md:pt-8">
            <div className="scale-90 origin-left">
              <StepIndicator currentStep={step} />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="mx-auto max-w-3xl px-4 md:px-6 pt-6 md:pt-8 pb-20">
          <div className="bg-white border border-border rounded-2xl shadow-sm p-6 md:p-10">
            {success ? (
              <SuccessStep
                businessName={data.businessName}
                listingLabel={listingLabel}
                subTypeLabel={subTypeLabel}
                onFinish={() => router.push("/host")}
              />
            ) : (
              <>
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-8 mt-8 border-t border-border">
                  {step > 0 ? (
                    <Button
                      variant="outline"
                      onClick={goBack}
                      className="rounded-xl font-semibold text-base border-border text-black-soft hover:bg-white-soft"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Back
                    </Button>
                  ) : (
                    <span />
                  )}

                  {isLastStep ? (
                    <Button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="bg-yellow hover:bg-yellow-hover text-black font-bold uppercase tracking-widest text-base rounded-xl shadow-lg shadow-yellow/25 hover:shadow-yellow/40 transition-all h-11 px-6"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Award className="h-4 w-4" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={goNext}
                      className="bg-yellow hover:bg-yellow-hover text-black font-bold uppercase tracking-widest text-base rounded-xl shadow-lg shadow-yellow/25 hover:shadow-yellow/40 transition-all h-11 px-6"
                    >
                      Continue
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
