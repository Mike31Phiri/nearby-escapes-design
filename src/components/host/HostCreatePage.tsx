"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Hotel,
  Bus,
  Ticket,
  ShieldAlert,
  Tent,
  Home,
  Building2,
  Coffee,
  Castle,
  Sparkles,
  Mountain,
  Landmark,
  Compass,
  Waves,
  Ship,
  Footprints,
  Palette,
  Plane,
  CarFront,
  Key,
  Navigation,
  Anchor,
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";

import { BackButton } from "@/components/shared/BackButton";
import { createDraftListing } from "@/lib/api/listings";
import { ROUTES } from "@/lib/constants/routes";
import { useHostStore } from "@/store/hostStore";
import type { ListingType } from "@/types/listing";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Step 1: Vertical Categories
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Step 2: Specific Sub-Types for Zambia
// ---------------------------------------------------------------------------

interface SubtypeOption {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const STAY_SUBTYPES: SubtypeOption[] = [
  {
    id: "safari_lodge",
    title: "Safari Lodge",
    description: "Wilderness lodge near national parks & wildlife reserves",
    icon: Hotel,
  },
  {
    id: "bush_camp",
    title: "Bush Camp / Tented Camp",
    description: "Canvas safari tents & immersive wilderness camps",
    icon: Tent,
  },
  {
    id: "chalet",
    title: "Chalet / Cottage",
    description: "Standalone self-catering or catered chalets",
    icon: Home,
  },
  {
    id: "apartment",
    title: "Apartment / Flat",
    description: "Modern self-contained apartment in urban centers",
    icon: Building2,
  },
  {
    id: "guest_house",
    title: "Guest House / B&B",
    description: "Cozy hosted rooms with morning breakfast",
    icon: Coffee,
  },
  {
    id: "villa",
    title: "Villa / Holiday Home",
    description: "Private spacious property for families and groups",
    icon: Castle,
  },
  {
    id: "boutique_hotel",
    title: "Boutique Hotel",
    description: "Intimate hotel with personalized hospitality",
    icon: Sparkles,
  },
  {
    id: "eco_retreat",
    title: "Eco Retreat / Farm Stay",
    description: "Working farm or off-grid nature sanctuary",
    icon: Mountain,
  },
];

const EXPERIENCE_SUBTYPES: SubtypeOption[] = [
  {
    id: "cultural_heritage",
    title: "Cultural & Heritage Tour",
    description: "Traditional ceremonies, historic trails & village visits",
    icon: Landmark,
  },
  {
    id: "tea_food_tasting",
    title: "Food, Drink & Tea Tasting",
    description: "Kawambwa tea sessions, local brews & culinary tastings",
    icon: Coffee,
  },
  {
    id: "game_drive_safari",
    title: "Wildlife Safari & Game Drive",
    description: "Guided 4x4 game viewing, night drives & walking safaris",
    icon: Compass,
  },
  {
    id: "vic_falls_adventure",
    title: "Victoria Falls & Adventure",
    description: "Devil's Pool, helicopter flights, gorge swing & rafting",
    icon: Waves,
  },
  {
    id: "boat_water_safari",
    title: "Boat Cruise & Water Safari",
    description: "Zambezi sunset cruises, canoe safaris & Kariba boat trips",
    icon: Ship,
  },
  {
    id: "nature_birding",
    title: "Nature Walk & Birding",
    description: "Guided birdwatching & botany walks across habitats",
    icon: Footprints,
  },
  {
    id: "art_craft_workshop",
    title: "Crafts, Art & Workshop",
    description: "Traditional basket weaving, copper art & pottery sessions",
    icon: Palette,
  },
];

const TRANSPORT_SUBTYPES: SubtypeOption[] = [
  {
    id: "airport_transfer",
    title: "Airport Transfer & Shuttle",
    description: "Direct airport pickups (KKIA Lusaka / Livingstone)",
    icon: Plane,
  },
  {
    id: "safari_4x4",
    title: "4x4 Safari Vehicle with Driver",
    description: "Pop-up roof Land Cruiser with professional driver-guide",
    icon: CarFront,
  },
  {
    id: "intercity_shuttle",
    title: "Intercity Private Shuttle",
    description: "City-to-city private transfers (e.g. Lusaka to Livingstone)",
    icon: Bus,
  },
  {
    id: "self_drive_rental",
    title: "Car Rental / Self-Drive",
    description: "Independent SUV, 4x4 or sedan rentals for self-guided trips",
    icon: Key,
  },
  {
    id: "chauffeur_service",
    title: "Chauffeur & City Ride",
    description: "Dedicated private driver for business or city sightseeing",
    icon: Navigation,
  },
  {
    id: "boat_transfer",
    title: "Boat & Water Transfer",
    description: "Lake Kariba speedboats, Zambezi river crossings & charters",
    icon: Anchor,
  },
];

const SUBTYPES_BY_VERTICAL: Record<ListingType, SubtypeOption[]> = {
  stay: STAY_SUBTYPES,
  experience: EXPERIENCE_SUBTYPES,
  transport: TRANSPORT_SUBTYPES,
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function HostCreatePage() {
  const router = useRouter();
  const enabledCategories = useHostStore((s) => s.enabledCategories);

  // Flow step state: 1 = vertical, 2 = specific sub-type
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<ListingType>("stay");
  const [selectedSubtype, setSelectedSubtype] = useState<string>("safari_lodge");
  const [submitting, setSubmitting] = useState(false);

  const availableTypes = LISTING_TYPES.filter((t) => enabledCategories.includes(t.id));
  const currentSubtypes = SUBTYPES_BY_VERTICAL[selectedType] ?? [];

  // When vertical changes, default sub-type to first option
  const handleSelectVertical = (typeId: ListingType) => {
    setSelectedType(typeId);
    const firstSubtype = SUBTYPES_BY_VERTICAL[typeId]?.[0]?.id ?? "";
    setSelectedSubtype(firstSubtype);
  };

  const handleNextFromStep1 = () => {
    setCurrentStep(2);
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  const handleFinish = () => {
    if (submitting) return;
    setSubmitting(true);

    const initialForm: Record<string, unknown> = {};
    if (selectedType === "stay") {
      initialForm.propertyType = selectedSubtype;
    } else if (selectedType === "experience") {
      initialForm.category = selectedSubtype;
    } else if (selectedType === "transport") {
      initialForm.vehicleType = selectedSubtype;
      initialForm.serviceType = selectedSubtype;
    }

    // Create the draft listing with selected vertical and sub-type
    createDraftListing(selectedType, initialForm).then((draft) => {
      router.push(ROUTES.listingDrafts.editor(draft.id, 1));
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 pt-8 pb-20">
          {currentStep === 1 ? (
            <BackButton className="mb-6" ariaLabel="Back to home" />
          ) : (
            <button
              type="button"
              onClick={handleBackToStep1}
              className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-black-subtle hover:text-black transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          )}

          <div className="bg-white border border-neutral-200/80 rounded-2xl shadow-2xs p-6 sm:p-10">
            {availableTypes.length === 0 ? (
              <div className="text-center py-12">
                <div className="h-16 w-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-5 border border-amber-200/60">
                  <ShieldAlert className="h-8 w-8 text-amber-500" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-black leading-snug">
                  No listing types enabled
                </h2>
                <p className="text-xs sm:text-sm text-black-subtle mt-2 max-w-md mx-auto leading-relaxed">
                  You haven&apos;t enabled any listing categories yet. Complete host onboarding to
                  choose the types you&apos;d like to offer.
                </p>
              </div>
            ) : currentStep === 1 ? (
              /* ========================================================================= */
              /* STEP 1: VERTICAL CATEGORY (STAY, EXPERIENCE, TRANSPORT)                    */
              /* ========================================================================= */
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="text-center mb-8">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-black leading-snug">
                    What are you listing?
                  </h1>
                  <p className="text-xs sm:text-sm text-black-subtle mt-2 max-w-lg mx-auto leading-relaxed">
                    Choose a category to begin. Stays, Experiences, and Transport can all be managed
                    seamlessly from your host portal.
                  </p>
                </div>

                {/* Cards horizontally in a single line on larger screens */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                  {availableTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selectedType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleSelectVertical(type.id)}
                        onDoubleClick={handleNextFromStep1}
                        className={cn(
                          "relative text-left rounded-2xl p-5 sm:p-6 transition-colors duration-150 cursor-pointer outline-none flex flex-col justify-between bg-white border",
                          isSelected
                            ? "border-purple"
                            : "border-neutral-200/80 hover:border-neutral-300"
                        )}
                      >
                        {/* Top: Icon */}
                        <div className="mb-4">
                          <div className="h-12 w-12 rounded-2xl bg-purple/10 text-purple border border-purple/20 flex items-center justify-center">
                            <Icon className="h-6 w-6" />
                          </div>
                        </div>

                        {/* Content: Title & Description */}
                        <div className="space-y-1.5 flex-1">
                          <h3
                            className={cn(
                              "text-base sm:text-lg font-semibold transition-colors leading-snug",
                              isSelected ? "text-purple" : "text-black"
                            )}
                          >
                            {type.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-black-subtle leading-relaxed">
                            {type.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Footer Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-100">
                  <p className="text-xs text-neutral-400 text-center sm:text-left">
                    Packages are curated by the Nearby Escapes team and cannot be self-listed.
                  </p>

                  <button
                    type="button"
                    disabled={!selectedType}
                    onClick={handleNextFromStep1}
                    className={cn(
                      "w-full sm:w-auto h-11 px-8 rounded-xl font-semibold text-xs sm:text-sm inline-flex items-center justify-center transition-all cursor-pointer shadow-xs",
                      selectedType
                        ? "bg-purple text-white hover:bg-purple-hover active:scale-98"
                        : "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200"
                    )}
                  >
                    <span>Next</span>
                  </button>
                </div>
              </div>
            ) : (
              /* ========================================================================= */
              /* STEP 2: SUB-TYPE SELECTION (ZAMBIAN OFFERINGS)                             */
              /* ========================================================================= */
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="text-center mb-8">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-black leading-snug">
                    {selectedType === "stay"
                      ? "Which of these best describes your stay?"
                      : selectedType === "experience"
                        ? "Which of these best describes your experience?"
                        : "Which of these best describes your transport service?"}
                  </h1>
                  <p className="text-xs sm:text-sm text-black-subtle mt-2 max-w-xl mx-auto leading-relaxed">
                    Select the option that most accurately represents your offering to help guests
                    find exactly what they are looking for in Zambia.
                  </p>
                </div>

                {/* Grid of Subtype Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                  {currentSubtypes.map((sub) => {
                    const Icon = sub.icon;
                    const isSelected = selectedSubtype === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setSelectedSubtype(sub.id)}
                        onDoubleClick={handleFinish}
                        className={cn(
                          "relative text-left rounded-2xl p-4 sm:p-5 transition-colors duration-150 cursor-pointer outline-none flex flex-col justify-between bg-white border",
                          isSelected
                            ? "border-purple"
                            : "border-neutral-200/80 hover:border-neutral-300"
                        )}
                      >
                        {/* Top: Icon */}
                        <div className="mb-3">
                          <div className="h-10 w-10 rounded-xl bg-purple/10 text-purple border border-purple/20 flex items-center justify-center">
                            <Icon className="h-5 w-5" />
                          </div>
                        </div>

                        {/* Content: Title & Description */}
                        <div className="space-y-1 flex-1">
                          <h3
                            className={cn(
                              "text-sm sm:text-base font-semibold transition-colors leading-snug",
                              isSelected ? "text-purple" : "text-black"
                            )}
                          >
                            {sub.title}
                          </h3>
                          <p className="text-xs text-black-subtle leading-relaxed">
                            {sub.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Footer Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={handleBackToStep1}
                    className="w-full sm:w-auto h-11 px-6 rounded-xl border border-neutral-200/80 bg-white hover:bg-neutral-50 text-neutral-700 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    disabled={!selectedSubtype || submitting}
                    onClick={handleFinish}
                    className={cn(
                      "w-full sm:w-auto h-11 px-8 rounded-xl font-semibold text-xs sm:text-sm inline-flex items-center justify-center transition-all cursor-pointer shadow-xs",
                      selectedSubtype && !submitting
                        ? "bg-purple text-white hover:bg-purple-hover active:scale-98"
                        : "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200"
                    )}
                  >
                    <span>{submitting ? "Creating..." : "Next"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
