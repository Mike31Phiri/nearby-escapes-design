"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { FileQuestion, Loader2 } from "lucide-react";

import { getDraftListing, publishListing, updateDraftListing } from "@/lib/api/listings";
import { ROUTES } from "@/lib/constants/routes";
import type { ListingDraft } from "@/types/listing";

import {
  ListingWizardShell,
  type ListingSaveState,
  type WizardStep,
} from "./wizards/ListingWizardShell";
import { StayWizard, STAY_STEPS } from "./wizards/StayWizard";
import { ExperienceWizard, EXPERIENCE_STEPS } from "./wizards/ExperienceWizard";
import { TransportWizard, TRANSPORT_STEPS } from "./wizards/TransportWizard";

const STEPS_BY_TYPE: Record<string, WizardStep[]> = {
  stay: STAY_STEPS,
  experience: EXPERIENCE_STEPS,
  transport: TRANSPORT_STEPS,
};

const WIZARDS_BY_TYPE: Record<string, React.ElementType> = {
  stay: StayWizard,
  experience: ExperienceWizard,
  transport: TransportWizard,
};

/** 0–100 across the step flow: step 0 → 0%, final step → 100%. */
function computeProgress(step: number, totalSteps: number): number {
  if (totalSteps <= 1) return 100;
  return Math.min(100, Math.round((step / (totalSteps - 1)) * 100));
}

export function ListingEditorPage({ draftId }: { draftId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [draft, setDraft] = useState<ListingDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [saveState, setSaveState] = useState<ListingSaveState>("idle");

  // Latest form snapshot — lets Save & Exit flush even between debounce ticks.
  const latestValues = useRef<Record<string, unknown> | null>(null);
  const latestStep = useRef(0);
  const pendingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load the draft on mount (backend first, localStorage fallback).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const found = await getDraftListing(draftId);
        if (cancelled) return;
        if (!found) {
          setDraft(null);
        } else {
          const urlStep = Number(searchParams.get("step"));
          const initialStep =
            Number.isInteger(urlStep) && urlStep > 0 ? urlStep - 1 : found.currentStep;
          setDraft(found);
          setCurrentStep(initialStep);
          latestValues.current = found.form ?? null;
          latestStep.current = initialStep;
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftId]);

  const steps = useMemo<WizardStep[]>(
    () => (draft ? (STEPS_BY_TYPE[draft.type] ?? []) : []),
    [draft],
  );
  const Wizard = draft ? (WIZARDS_BY_TYPE[draft.type] as React.ElementType) : null;

  const saveSnapshot = useCallback(
    async (values: Record<string, unknown>, step: number) => {
      if (!draftId) return;
      latestValues.current = values;
      latestStep.current = step;
      setSaveState("saving");

      try {
        const updated = await updateDraftListing(draftId, {
          form: values,
          currentStep: step,
          progressPercent: computeProgress(step, steps.length),
        });
        setDraft(updated);
        setCurrentStep(step);
        setSaveState("saved");
        if (pendingTimeout.current) clearTimeout(pendingTimeout.current);
        pendingTimeout.current = setTimeout(
          () => setSaveState((s) => (s === "saved" ? "idle" : s)),
          1600,
        );
      } catch (err) {
        console.error("Auto-save failed", err);
        setSaveState("error");
      }
    },
    [draftId, steps.length],
  );

  const flushAndLeave = useCallback(async () => {
    if (!draftId) return;
    if (latestValues.current !== null) {
      await saveSnapshot(latestValues.current, latestStep.current);
    }
    router.push(ROUTES.host.listings);
  }, [draftId, router, saveSnapshot]);

  const handlePublish = useCallback(
    async (values: Record<string, unknown>) => {
      if (!draftId) return;
      // Final save so nothing is lost, then flip to live.
      await saveSnapshot(values, latestStep.current);
      try {
        await publishListing(draftId);
        toast.success("Listing published — it's now live!");
        router.push(ROUTES.host.listings);
      } catch (err) {
        console.error(err);
        toast.error("Couldn't publish the listing. Please try again.");
      }
    },
    [draftId, router, saveSnapshot],
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 font-sans">
        <Loader2 className="h-8 w-8 text-purple animate-spin mb-4" />
        <p className="text-sm font-semibold text-neutral-500">Loading draft…</p>
      </div>
    );
  }

  if (!draft || !Wizard || steps.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 font-sans px-4">
        <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
          <div className="h-14 w-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-5">
            <FileQuestion className="h-7 w-7 text-neutral-400" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Draft not found</h2>
          <p className="text-sm text-neutral-500 mb-6">
            This draft may have been deleted or never existed.
          </p>
          <Link
            href={ROUTES.host.listings}
            className="inline-flex items-center justify-center h-10 px-5 rounded-xl bg-purple text-white text-sm font-bold hover:bg-purple-hover transition-colors"
          >
            Back to my listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ListingWizardShell
      steps={steps}
      currentStep={currentStep}
      saveState={saveState}
      title={draft.title || "Untitled draft"}
      onSaveExit={flushAndLeave}
    >
      <Wizard
        key={draft.id}
        draftId={draft.id}
        initialStep={currentStep}
        initialValues={draft.form}
        onStepChange={(step: number) => setCurrentStep(step)}
        onAutoSave={saveSnapshot}
        onPublish={handlePublish}
      />
    </ListingWizardShell>
  );
}
