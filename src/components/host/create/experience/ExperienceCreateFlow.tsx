"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { BackButton } from "@/components/shared/BackButton";
import { createDraftListing, updateDraftListing } from "@/lib/api/listings";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

import { useInventoryStore } from "@/store/inventoryStore";
import {
  EXPERIENCE_STORAGE_KEY,
  EXPERIENCE_SAMPLE_PHOTOS,
  DEFAULT_EXPERIENCE_ITINERARY,
} from "./experienceConstants";
import {
  ExperienceItemsState,
  ExperiencePricingState,
  ExperienceFormState,
  ExperienceInventoryState,
  ExperienceItineraryStop,
} from "./experienceTypes";
import { ExperienceStepSubtype } from "./ExperienceStepSubtype";
import { ExperienceStepInclusions } from "./ExperienceStepInclusions";
import { ExperienceStepDetails } from "./ExperienceStepDetails";
import { ExperienceStepInventory } from "./ExperienceStepInventory";
import { ExperienceStepPricing } from "./ExperienceStepPricing";
import {
  SharedLocationStep,
  SharedMediaStep,
  LocationState,
  DetailsState,
} from "../shared";

const INITIAL_LOCATION: LocationState = {
  province: "Southern",
  city: "Livingstone",
  district: "",
  address: "",
  meetingPoint: "Livingstone Waterfront Reception & Pier",
  coordinates: { lat: -17.8419, lng: 25.8543 },
};

const INITIAL_INVENTORY: ExperienceInventoryState = {
  slots: [
    { id: "slot-1", label: "Morning Departure", timeSlot: "08:30 AM", capacity: 8 },
    { id: "slot-2", label: "Midday Tour", timeSlot: "11:30 AM", capacity: 8 },
    { id: "slot-3", label: "Afternoon Tour", timeSlot: "14:00 PM", capacity: 8 },
    { id: "slot-4", label: "Sunset Session", timeSlot: "16:30 PM", capacity: 8 },
  ],
};

const INITIAL_PRICING: ExperiencePricingState = {
  currency: "ZMW",
  basePrice: 750,
  groupDiscountEnabled: false,
  groupDiscountType: "percent",
  groupDiscountPercent: 15,
  groupDiscountCustomPrice: 635,
};

export function ExperienceCreateFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Flow State
  const [subtype, setSubtype] = useState<string>("");
  const [items, setItems] = useState<ExperienceItemsState>({
    whatsIncluded: [],
    whatsNotIncluded: [],
    whatToCarry: [],
    whatNotToBring: [],
    importantInformation: [],
    notSuitableFor: [],
  });
  const [location, setLocation] = useState<LocationState>(INITIAL_LOCATION);
  const [images, setImages] = useState<string[]>([]);
  const [details, setDetails] = useState<DetailsState>({ title: "", description: "" });
  const [itinerary, setItinerary] = useState<ExperienceItineraryStop[]>(DEFAULT_EXPERIENCE_ITINERARY);
  const [inventory, setInventory] = useState<ExperienceInventoryState>(INITIAL_INVENTORY);
  const [pricing, setPricing] = useState<ExperiencePricingState>(INITIAL_PRICING);

  // Restore draft from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(EXPERIENCE_STORAGE_KEY);
      if (saved) {
        const parsed: Partial<ExperienceFormState> = JSON.parse(saved);
        if (parsed.subtype) setSubtype(parsed.subtype);
        if (parsed.items) setItems(parsed.items);
        if (parsed.location) setLocation(parsed.location);
        if (parsed.images) setImages(parsed.images);
        if (parsed.details) setDetails(parsed.details);
        if (parsed.itinerary && Array.isArray(parsed.itinerary) && parsed.itinerary.length > 0) {
          setItinerary(parsed.itinerary);
        }
        if (parsed.inventory) setInventory(parsed.inventory);
        if (parsed.pricing) setPricing(parsed.pricing);
        if (parsed.draftId) setDraftId(parsed.draftId);
      }
    } catch (e) {
      console.error("Failed to restore experience draft:", e);
    }
  }, []);

  // Save to localStorage whenever form state changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stateToSave: ExperienceFormState = {
        subtype,
        items,
        location,
        images,
        details,
        itinerary,
        inventory,
        pricing,
        draftId,
      };
      localStorage.setItem(EXPERIENCE_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Failed to save experience draft to localStorage:", e);
    }
  }, [subtype, items, location, images, details, itinerary, inventory, pricing, draftId]);

  // Step 2 Next: Save Inclusions, Guidelines & Suitability
  const handleSaveInclusionsStep = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        type: "experience",
        vertical: "experience",
        subtype,
        category: subtype,
        activityType: subtype,
        whatsIncluded: items.whatsIncluded,
        whatsNotIncluded: items.whatsNotIncluded,
        whatToBring: items.whatToCarry,
        whatNotToBring: items.whatNotToBring,
        importantInformation: items.importantInformation,
        notSuitableFor: items.notSuitableFor,
        inclusions: items.whatsIncluded,
        exclusions: items.whatsNotIncluded,
        guidelines: items.importantInformation,
        suitability: items.notSuitableFor,
        experienceDetails: {
          activityType: subtype,
          whatsIncluded: items.whatsIncluded,
          whatsNotIncluded: items.whatsNotIncluded,
          whatToBring: items.whatToCarry,
          whatNotToBring: items.whatNotToBring,
          importantInformation: items.importantInformation,
          notSuitableFor: items.notSuitableFor,
        },
      };

      if (!draftId) {
        const res = await createDraftListing("experience", payload);
        setDraftId(res.id);
      } else {
        await updateDraftListing(draftId, { form: payload });
      }

      toast.success("Inclusions & guidelines saved! Next, set your location.");
      setCurrentStep(3);
    } catch (err) {
      console.error("Failed to save experience inclusions:", err);
      toast.error("Couldn't save inclusions. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Step 3 Next: Save Meeting Location
  const handleSaveLocationStep = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const resolvedMeetingPoint =
        location.meetingPoint?.trim() ||
        location.address?.trim() ||
        `${location.district ? `${location.district}, ` : ""}${location.city}, ${location.province}`;

      const locationPayload = {
        country: "Zambia",
        province: location.province,
        city: location.city,
        district: location.district.trim() || location.city,
        address:
          location.address.trim() ||
          `${location.district ? `${location.district}, ` : ""}${location.city}, ${location.province}, Zambia`,
        meetingPoint: resolvedMeetingPoint,
        meetingPointAddress: resolvedMeetingPoint,
        latitude: location.coordinates.lat,
        longitude: location.coordinates.lng,
        experienceDetails: {
          meetingPoint: resolvedMeetingPoint,
          meetingLatitude: location.coordinates.lat,
          meetingLongitude: location.coordinates.lng,
        },
      };

      if (draftId) {
        await updateDraftListing(draftId, { form: locationPayload, currentStep: 1 });
      } else {
        const res = await createDraftListing("experience", {
          type: "experience",
          vertical: "experience",
          subtype,
          ...locationPayload,
        });
        setDraftId(res.id);
      }

      toast.success("Meeting location saved! Next, add photos.");
      setCurrentStep(4);
    } catch (err) {
      console.error("Failed to save experience location:", err);
      toast.error("Could not save location. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Step 4 Next: Save Media
  const handleSaveMediaStep = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const mediaPayload = {
        images,
        coverPhotoUrl: images[0] || "",
        photos: images,
      };

      if (draftId) {
        await updateDraftListing(draftId, { form: mediaPayload, currentStep: 2 });
      }

      toast.success("Photos saved! Next, add description and itinerary.");
      setCurrentStep(5);
    } catch (err) {
      console.error("Failed to save experience media:", err);
      toast.error("Could not save photos. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Step 5 Next: Save Details & Itinerary
  const handleSaveDetailsStep = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const detailsPayload = {
        title: details.title.trim(),
        name: details.title.trim(),
        description: details.description.trim(),
        itinerary,
        experienceDetails: {
          itinerary,
        },
      };

      if (draftId) {
        await updateDraftListing(draftId, { form: detailsPayload, currentStep: 3 });
      }

      toast.success("Details & itinerary saved! Next, configure sessions.");
      setCurrentStep(6);
    } catch (err) {
      console.error("Failed to save experience details:", err);
      toast.error("Could not save details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Step 6 Next: Save Inventory & Sessions
  const handleSaveInventoryStep = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const count = inventory.slots?.length || 2;
      const inventoryPayload = {
        inventoryCount: count,
        unitsCount: count,
        slotCount: count,
        slots: inventory.slots,
        inventory: {
          count,
          slotCount: count,
        },
        experienceDetails: {
          slots: inventory.slots,
        },
      };

      if (draftId) {
        await updateDraftListing(draftId, { form: inventoryPayload, currentStep: 4 });
      }

      toast.success("Sessions saved! Next, configure your pricing.");
      setCurrentStep(7);
    } catch (err) {
      console.error("Failed to save experience time slots:", err);
      toast.error("Could not save sessions. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Step 7 Finish: Save Pricing & Publish
  const handleFinishExperience = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const count = inventory.slots?.length || 2;
      const effectiveGroupPrice =
        pricing.groupDiscountType === "percent"
          ? Math.round(pricing.basePrice * (1 - pricing.groupDiscountPercent / 100))
          : pricing.groupDiscountCustomPrice;

      const resolvedMeetingPoint =
        location.meetingPoint?.trim() ||
        location.address?.trim() ||
        `${location.district ? `${location.district}, ` : ""}${location.city}, ${location.province}`;

      const pricingPayload = {
        pricePerUnitNgwee: Math.round(pricing.basePrice * 100),
        currency: "ZMW",
        basePrice: pricing.basePrice,
        meetingPoint: resolvedMeetingPoint,
        meetingPointAddress: resolvedMeetingPoint,
        whatsIncluded: items.whatsIncluded,
        whatsNotIncluded: items.whatsNotIncluded,
        whatToBring: items.whatToCarry,
        whatNotToBring: items.whatNotToBring,
        importantInformation: items.importantInformation,
        notSuitableFor: items.notSuitableFor,
        inclusions: items.whatsIncluded,
        exclusions: items.whatsNotIncluded,
        guidelines: items.importantInformation,
        suitability: items.notSuitableFor,
        itinerary,
        slots: inventory.slots,
        inventoryCount: count,
        unitsCount: count,
        slotCount: count,
        pricingRules: {
          basePrice: pricing.basePrice,
          currency: "ZMW",
          groupDiscount: {
            enabled: pricing.groupDiscountEnabled,
            minGuests: 10,
            discountPercent:
              pricing.groupDiscountType === "percent"
                ? pricing.groupDiscountPercent
                : Math.round(
                    ((pricing.basePrice - pricing.groupDiscountCustomPrice) / pricing.basePrice) * 100,
                  ),
            promoPrice: effectiveGroupPrice,
          },
        },
        conditionalDiscounts: {
          groupDiscount10Plus: pricing.groupDiscountEnabled
            ? {
                minPeople: 10,
                discountPercent:
                  pricing.groupDiscountType === "percent"
                    ? pricing.groupDiscountPercent
                    : Math.round(
                        ((pricing.basePrice - pricing.groupDiscountCustomPrice) /
                          pricing.basePrice) *
                          100,
                      ),
                promoPrice: effectiveGroupPrice,
              }
            : null,
        },
        experienceDetails: {
          activityType: subtype,
          meetingPoint: resolvedMeetingPoint,
          whatsIncluded: items.whatsIncluded,
          whatsNotIncluded: items.whatsNotIncluded,
          whatToBring: items.whatToCarry,
          whatNotToBring: items.whatNotToBring,
          importantInformation: items.importantInformation,
          notSuitableFor: items.notSuitableFor,
          itinerary,
          slots: inventory.slots,
        },
      };

      if (draftId) {
        await updateDraftListing(draftId, { form: pricingPayload, currentStep: 5 });
        // Register newly created listing into persistent inventory store
        useInventoryStore.getState().setListingInventory(draftId, {
          listingId: draftId,
          unitType: "slot",
          unitLabel: "Session",
          unitLabelPlural: "Sessions",
          total: count,
          units: Array.from({ length: count }, (_, i) => ({
            id: `slot-${i + 1}`,
            label: `Session ${i + 1}`,
            timeSlot: inventory.slots?.[i]?.timeSlot || "09:00 AM",
            status: "available",
            price: pricing.basePrice,
            capacity: 8,
            note: "8 spots available",
          })),
        });
      }

      if (typeof window !== "undefined") {
        localStorage.removeItem(EXPERIENCE_STORAGE_KEY);
      }

      toast.success("Experience listing published successfully!");
      router.push(ROUTES.host.listings);
    } catch (err) {
      console.error("Failed to publish experience listing:", err);
      toast.error("Could not save pricing. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 pt-8 pb-20">
          {/* Header navigation bar */}
          <div className="flex items-center justify-between mb-6">
            {currentStep === 1 ? (
              <BackButton fallback={ROUTES.host.create} ariaLabel="Back to categories" />
            ) : (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7)}
                className="inline-flex items-center gap-2 text-xs font-semibold text-black-subtle hover:text-black transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            )}

            {/* Clean 7-step indicator pill */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                Step {currentStep} of 7
              </span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7].map((stepNum) => (
                  <div
                    key={stepNum}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      stepNum === currentStep
                        ? "w-6 bg-purple"
                        : stepNum < currentStep
                          ? "w-3 bg-purple/40"
                          : "w-3 bg-neutral-200",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Step Form Container */}
          <div className="bg-white border border-neutral-200/80 rounded-2xl shadow-2xs p-6 sm:p-10">
            {currentStep === 1 && (
              <ExperienceStepSubtype
                selectedSubtype={subtype}
                onSelectSubtype={setSubtype}
                onNext={() => setCurrentStep(2)}
                onBack={() => router.push(ROUTES.host.create)}
              />
            )}

            {currentStep === 2 && (
              <ExperienceStepInclusions
                items={items}
                onItemsChange={setItems}
                onBack={() => setCurrentStep(1)}
                onNext={handleSaveInclusionsStep}
                submitting={submitting}
              />
            )}

            {currentStep === 3 && (
              <SharedLocationStep
                location={location}
                onLocationChange={setLocation}
                showMeetingPoint={true}
                title="Meeting point & location"
                subtitle="Specify the town and designated meeting point location for attendees."
                onBack={() => setCurrentStep(2)}
                onNext={handleSaveLocationStep}
                submitting={submitting}
              />
            )}

            {currentStep === 4 && (
              <SharedMediaStep
                images={images}
                onImagesChange={setImages}
                samplePhotos={EXPERIENCE_SAMPLE_PHOTOS}
                onBack={() => setCurrentStep(3)}
                onNext={handleSaveMediaStep}
                submitting={submitting}
              />
            )}

            {currentStep === 5 && (
              <ExperienceStepDetails
                title={details.title}
                description={details.description}
                itinerary={itinerary}
                onTitleChange={(t) => setDetails((prev) => ({ ...prev, title: t }))}
                onDescriptionChange={(d) => setDetails((prev) => ({ ...prev, description: d }))}
                onItineraryChange={setItinerary}
                onBack={() => setCurrentStep(4)}
                onNext={handleSaveDetailsStep}
                submitting={submitting}
              />
            )}

            {currentStep === 6 && (
              <ExperienceStepInventory
                inventory={inventory}
                onInventoryChange={setInventory}
                onBack={() => setCurrentStep(5)}
                onNext={handleSaveInventoryStep}
                submitting={submitting}
              />
            )}

            {currentStep === 7 && (
              <ExperienceStepPricing
                pricing={pricing}
                onPricingChange={setPricing}
                onBack={() => setCurrentStep(6)}
                onFinish={handleFinishExperience}
                submitting={submitting}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
