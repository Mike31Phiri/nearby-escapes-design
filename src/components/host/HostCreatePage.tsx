"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Hotel, Bus, Ticket, Loader2, ShieldAlert } from "lucide-react";

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
  const [creatingType, setCreatingType] = useState<ListingType | null>(null);

  const availableTypes = LISTING_TYPES.filter((t) => enabledCategories.includes(t.id));

  const handleSelect = async (type: ListingType) => {
    if (creatingType) return; // already creating
    setCreatingType(type);
    try {
      // Spec: on "+ Create New Listing" → immediately create a draft (status: draft)
      // and store the draft id, then enter the wizard.
      const draft = await createDraftListing(type);
      router.push(ROUTES.listingDrafts.editor(draft.id, 1));
    } catch (err) {
      console.error(err);
      setCreatingType(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 font-sans">
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 md:px-6 pt-5 pb-20">
          <BackButton className="mb-4" ariaLabel="Back to dashboard" />

          <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6 md:p-8">
            {availableTypes.length === 0 ? (
              <div className="text-center py-10">
                <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-5">
                  <ShieldAlert className="h-7 w-7 text-amber-500" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                  No listing types enabled
                </h2>{" "}
                <p className="text-neutral-500 mt-2 max-w-md mx-auto">
                  You haven&apos;t enabled any listing categories yet. Complete host onboarding to
                  choose the types you&apos;d like to offer.
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900">
                    What are you listing?
                  </h2>
                  <p className="text-neutral-500 mt-2 max-w-lg mx-auto">
                    Choose a category to begin. Stays, Experiences, and Transport can all be managed
                    from one host dashboard.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {availableTypes.map((type) => {
                    const Icon = type.icon;
                    const busy = creatingType === type.id;
                    return (
                      <button
                        key={type.id}
                        onClick={() => handleSelect(type.id)}
                        disabled={creatingType !== null}
                        className="text-left bg-white hover:bg-neutral-50 border border-neutral-200 rounded-2xl p-6 transition-all hover:shadow-md hover:border-purple/30 group flex items-start gap-4 disabled:opacity-70 disabled:hover:shadow-none"
                      >
                        <div className="h-12 w-12 shrink-0 rounded-xl bg-purple/10 text-purple flex items-center justify-center">
                          {busy ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                          ) : (
                            <Icon className="h-6 w-6" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-neutral-900 mb-1 group-hover:text-purple transition-colors">
                            {type.title}
                          </h3>
                          <p className="text-base text-neutral-500">{type.description}</p>
                        </div>
                        {busy && (
                          <p className="text-sm font-semibold text-purple pt-1">Creating draft…</p>
                        )}
                      </button>
                    );
                  })}
                </div>

                <p className="text-sm text-neutral-500 text-center pt-4">
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
