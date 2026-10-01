"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/store/authStore";
import { BackButton } from "@/components/shared/BackButton";
import { ROUTES } from "@/lib/constants/routes";

import { StepIndicator } from "./wizard/StepIndicator";
import { BusinessBasicsStep } from "./steps/BusinessBasicsStep";
import { ProofOfOwnershipStep } from "./steps/ProofOfOwnershipStep";
import { SuccessStep } from "./wizard/SuccessStep";
import {
  INITIAL_ONBOARDING_DATA,
  WIZARD_STEP_COUNT,
} from "./wizard/onboarding";
import type { OnboardingData, ValidationErrors } from "./wizard/onboarding";

const TOTAL_STEPS = WIZARD_STEP_COUNT; // 2 steps: Business Basics & Verification Docs

export function BecomeHostPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<OnboardingData>(INITIAL_ONBOARDING_DATA);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    router.prefetch(ROUTES.host.dashboard);
    router.prefetch(ROUTES.host.create);
    if (!success && user && (user.roles?.includes("host") || user.roles?.includes("admin"))) {
      router.replace(ROUTES.host.dashboard);
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
        if (data.pacraDocs.length === 0)
          errs.pacraDocs = "Please upload your PACRA registration document";
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

    await new Promise((r) => setTimeout(r, 250));

    if (user) {
      setUser({
        ...user,
        roles: [...(user.roles || []), "host"],
        name: data.businessName,
      });
    }

    toast.success("Application submitted", {
      description:
        "Our team will review your business documents and get back to you within 1–3 business days.",
    });

    setSubmitting(false);
    setSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [validateStep, user, setUser, data.businessName]);

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return <BusinessBasicsStep data={data} errors={errors} onChange={updateField} />;
      case 1:
        return <ProofOfOwnershipStep data={data} errors={errors} onChange={updateField} />;
      default:
        return null;
    }
  };

  const isLastStep = step === TOTAL_STEPS - 1;

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 pt-8 pb-20">
          {/* Header navigation bar */}
          {!success && (
            <div className="flex items-center justify-between mb-6">
              {step === 0 ? (
                <BackButton fallback={ROUTES.home} ariaLabel="Back to home" />
              ) : (
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-black-subtle hover:text-black transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
              )}

              {/* Clean 2-step indicator pill */}
              <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />
            </div>
          )}

          {/* Form Container */}
          <div className="bg-white border border-neutral-200/80 rounded-2xl shadow-2xs p-6 sm:p-10">
            {success ? (
              <SuccessStep
                businessName={data.businessName}
                onFinish={() => router.push(ROUTES.host.dashboard)}
              />
            ) : (
              <>
                {renderStepContent()}

                {/* Footer Navigation Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-neutral-100">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={goBack}
                      className="w-full sm:w-auto h-11 px-6 rounded-xl border border-neutral-200/80 bg-white hover:bg-neutral-50 text-neutral-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                    >
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {isLastStep ? (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="w-full sm:w-auto h-11 px-8 rounded-xl font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs bg-purple text-white hover:bg-purple-hover active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Submit Application</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={goNext}
                      className="w-full sm:w-auto h-11 px-8 rounded-xl font-semibold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs bg-purple text-white hover:bg-purple-hover active:scale-98"
                    >
                      <span>Continue</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
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
