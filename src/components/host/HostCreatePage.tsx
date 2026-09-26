"use client";

import { useRouter } from "next/navigation";
import { Hotel, Bus, Ticket, ShieldAlert, ChevronRight } from "lucide-react";

import { BackButton } from "@/components/shared/BackButton";
import { createDraftListing } from "@/lib/api/listings";
import { ROUTES } from "@/lib/constants/routes";
import { useHostStore } from "@/store/hostStore";
import type { ListingType } from "@/types/listing";

const LISTING_TYPES: {
  id: ListingType;
  icon: React.ElementType;
  title: string;
  description: string;
}[] = [
  {
    id: "stay",
    icon: Hotel,
    title: "Stay",
    description: "List a lodge, camp, guesthouse, chalet, or eco retreat.",
  },
  {
    id: "experience",
    icon: Ticket,
    title: "Experience",
    description: "Host tours, game drives, cultural visits, or activities.",
  },
  {
    id: "transport",
    icon: Bus,
    title: "Transport",
    description: "Offer intercity shuttles, transfers, or self-drive vehicles.",
  },
];

export function HostCreatePage() {
  const router = useRouter();
  const enabledCategories = useHostStore((s) => s.enabledCategories);

  const availableTypes = LISTING_TYPES.filter((t) => enabledCategories.includes(t.id));

  const handleSelect = (type: ListingType) => {
    // createDraftListing is purely client-side (Zustand) — no network, resolves instantly
    createDraftListing(type).then((draft) => {
      router.push(ROUTES.listingDrafts.editor(draft.id, 1));
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 md:px-8 pt-8 pb-20">
          <BackButton className="mb-6" ariaLabel="Back to home" />

          <div className="bg-white border border-neutral-200/80 rounded-2xl shadow-2xs p-6 sm:p-10">
            {availableTypes.length === 0 ? (
              <div className="text-center py-12">
                <div className="h-16 w-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-5 border border-amber-200/60">
                  <ShieldAlert className="h-8 w-8 text-amber-500" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-black leading-tight">
                  No listing types enabled
                </h2>
                <p className="text-sm text-black-subtle mt-2 max-w-md mx-auto leading-relaxed">
                  You haven&apos;t enabled any listing categories yet. Complete host onboarding to
                  choose the types you&apos;d like to offer.
                </p>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="text-center mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-black leading-tight">
                    What are you listing?
                  </h2>
                  <p className="text-sm text-black-subtle mt-2 max-w-lg mx-auto leading-relaxed">
                    Choose a category to begin. Stays, Experiences, and Transport can all be managed
                    seamlessly from your host dashboard.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {availableTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleSelect(type.id)}
                        className="text-left bg-white hover:bg-neutral-50/80 border border-neutral-200/80 rounded-2xl p-5 sm:p-6 transition-all duration-200 shadow-2xs hover:border-purple/40 group flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5 cursor-pointer outline-none w-full"
                      >
                        <div className="h-12 w-12 sm:h-14 sm:w-14 mx-auto sm:mx-0 shrink-0 rounded-2xl bg-purple/10 text-purple flex items-center justify-center border border-purple/20">
                          <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                        </div>
                        <div className="flex-1 min-w-0 text-center sm:text-left">
                          <h3 className="text-lg sm:text-xl font-semibold text-black mb-1 group-hover:text-purple transition-colors">
                            {type.title}
                          </h3>
                          <p className="text-sm text-black-subtle leading-relaxed">
                            {type.description}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-neutral-300 group-hover:text-purple transition-colors shrink-0 sm:mt-1 self-end sm:self-start" />
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs text-neutral-400 text-center pt-2">
                  Packages are curated by the Nearby Escapes team and cannot be self-listed.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
