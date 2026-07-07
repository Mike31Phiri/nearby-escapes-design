"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ShieldCheck, Hotel, Bus, Ticket } from "lucide-react";

import { HostPageHeader } from "@/components/layout/HostPageHeader";
import { StayWizard } from "./wizards/StayWizard";
import { TransportWizard } from "./wizards/TransportWizard";
import { ExperienceWizard } from "./wizards/ExperienceWizard";

type HostListingType = "stay" | "transport" | "experience";

const LISTING_TYPES: {
  id: HostListingType;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}[] = [
  {
    id: "stay",
    icon: Hotel,
    title: "Stay",
    description: "List a lodge, camp, guesthouse, chalet, or eco retreat.",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: "experience",
    icon: Ticket,
    title: "Experience",
    description: "Host tours, game drives, cultural visits, or activities.",
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    id: "transport",
    icon: Bus,
    title: "Transport",
    description: "Offer intercity shuttles, transfers, or self-drive vehicles.",
    color: "bg-emerald-500/10 text-emerald-500",
  },
];

export function HostCreatePage() {
  const [listingType, setListingType] = useState<HostListingType | null>(null);

  const renderTypeSelection = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          What are you listing?
        </h2>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
          Choose a category to begin. Stays, Experiences, and Transport can all be managed from one
          host dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {LISTING_TYPES.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => setListingType(type.id)}
              className="text-left bg-card hover:bg-muted/50 border border-border/40 rounded-2xl p-6 transition-all hover:shadow-md hover:border-primary/30 group flex items-start gap-4"
            >
              <div
                className={`h-12 w-12 shrink-0 rounded-xl flex items-center justify-center ${type.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {type.title}
                </h3>
                <p className="text-base text-muted-foreground">{type.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-sm text-muted-foreground text-center pt-4">
        Packages are curated by the Nearby Escapes team and cannot be self-listed.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <main className="flex-1">
        <HostPageHeader
          eyebrow={listingType ? `Create ${listingType} listing` : "Select a type"}
          title="Create New Listing"
          actions={
            <div className="flex items-center gap-4">
              <Link
                href="/host"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-colors text-white font-bold text-base shadow-sm"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                  Verified
                </span>
              </div>
            </div>
          }
        />

        <div className="mx-auto max-w-3xl px-4 md:px-6 pt-8 pb-20">
          {listingType && (
            <button
              onClick={() => setListingType(null)}
              className="mb-6 flex items-center text-base font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Change listing type
            </button>
          )}

          <div className="bg-card border border-border/40 rounded-2xl shadow-sm p-6 md:p-8">
            {!listingType && renderTypeSelection()}
            {listingType === "stay" && <StayWizard />}
            {listingType === "transport" && <TransportWizard />}
            {listingType === "experience" && <ExperienceWizard />}
          </div>
        </div>
      </main>
    </div>
  );
}
