"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Hotel, Ticket, Bus, LucideIcon } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { BackButton } from "@/components/shared/BackButton";
import { cn } from "@/lib/utils";

import { STAY_STORAGE_KEY } from "./stay/stayConstants";
import { EXPERIENCE_STORAGE_KEY } from "./experience/experienceConstants";
import { TRANSPORT_STORAGE_KEY } from "./transport/transportConstants";

type VerticalId = "stay" | "experience" | "transport";

interface VerticalOption {
  id: VerticalId;
  icon: LucideIcon;
  title: string;
  description: string;
  route: string;
}

const VERTICAL_OPTIONS: VerticalOption[] = [
  {
    id: "stay",
    icon: Hotel,
    title: "Stay",
    description: "List a lodge, camp, guesthouse, chalet, or eco retreat.",
    route: ROUTES.host.createStay,
  },
  {
    id: "experience",
    icon: Ticket,
    title: "Experience",
    description: "Host tours, game drives, cultural visits, or activities.",
    route: ROUTES.host.createExperience,
  },
  {
    id: "transport",
    icon: Bus,
    title: "Transport",
    description: "Offer intercity shuttles, transfers, or self-drive vehicles.",
    route: ROUTES.host.createTransport,
  },
];

export function CreateVerticalGateway() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<VerticalId>("stay");
  const [draftStatuses, setDraftStatuses] = useState<Record<VerticalId, boolean>>({
    stay: false,
    experience: false,
    transport: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const hasStay = !!localStorage.getItem(STAY_STORAGE_KEY);
      const hasExp = !!localStorage.getItem(EXPERIENCE_STORAGE_KEY);
      const hasTrans = !!localStorage.getItem(TRANSPORT_STORAGE_KEY);
      setDraftStatuses({
        stay: hasStay,
        experience: hasExp,
        transport: hasTrans,
      });
    } catch (e) {
      console.error("Failed to inspect vertical drafts:", e);
    }
  }, []);

  const handleNext = () => {
    const option = VERTICAL_OPTIONS.find((v) => v.id === selectedType);
    if (option) {
      router.push(option.route);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 pt-8 pb-20">
          {/* Header navigation bar */}
          <div className="flex items-center justify-between mb-6">
            <BackButton fallback={ROUTES.host.listings} ariaLabel="Back to listings" />

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                Select Vertical
              </span>
            </div>
          </div>

          <div className="bg-white border border-neutral-200/80 rounded-2xl shadow-2xs p-6 sm:p-10">
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="text-center mb-6">
                <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-black leading-snug">
                  What are you listing?
                </h1>
                <p className="text-xs text-black-subtle mt-1 max-w-lg mx-auto leading-relaxed">
                  Choose a category to begin creating your listing.
                </p>
              </div>

              {/* Vertical Category Cards - Compact: Icons with names below */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto">
                {VERTICAL_OPTIONS.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;
                  const hasDraft = draftStatuses[type.id];

                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      onDoubleClick={handleNext}
                      className={cn(
                        "relative flex flex-col items-center justify-center text-center p-4 sm:p-5 rounded-xl border transition-all cursor-pointer outline-none bg-white min-h-[96px] sm:min-h-[104px]",
                        isSelected
                          ? "border-2 border-purple bg-purple/[0.02]"
                          : "border-neutral-300 hover:border-neutral-900",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-8 w-8 mb-2 transition-colors shrink-0",
                          isSelected ? "text-purple" : "text-neutral-800",
                        )}
                        strokeWidth={1.5}
                      />

                      <span
                        className={cn(
                          "text-xs sm:text-sm font-semibold transition-colors leading-tight",
                          isSelected ? "text-purple font-semibold" : "text-neutral-900",
                        )}
                      >
                        {type.title}
                      </span>

                      <p className="text-[11px] text-neutral-400 mt-1 max-w-[200px] leading-relaxed line-clamp-2">
                        {type.description}
                      </p>

                      {hasDraft && (
                        <span className="absolute top-2 right-2 text-[9px] font-semibold text-purple bg-purple/10 px-1.5 py-0.5 rounded-full">
                          Draft saved
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-100">
                <p className="text-xs text-neutral-400 text-center sm:text-left">
                  Packages are curated by the Nearby Escapes team and cannot be self-listed.
                </p>

                <button
                  type="button"
                  disabled={!selectedType}
                  onClick={handleNext}
                  className={cn(
                    "w-full sm:w-auto h-11 px-8 rounded-xl font-semibold text-xs sm:text-sm inline-flex items-center justify-center transition-all cursor-pointer shadow-xs",
                    selectedType
                      ? "bg-purple text-white hover:bg-purple-hover active:scale-98"
                      : "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200",
                  )}
                >
                  <span>Next</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
