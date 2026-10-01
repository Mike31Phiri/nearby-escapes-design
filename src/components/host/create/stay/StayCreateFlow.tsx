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
  STAY_STORAGE_KEY,
  STAY_SAMPLE_PHOTOS,
} from "./stayConstants";
import {
  StayAmenitiesState,
  StayPricingState,
  StayFormState,
  StayInventoryState,
} from "./stayTypes";
import { StayStepSubtype } from "./StayStepSubtype";
import { StayStepAmenities } from "./StayStepAmenities";
import { StayStepInventory } from "./StayStepInventory";
import { StayStepPricing } from "./StayStepPricing";
import {
  SharedLocationStep,
  SharedMediaStep,
  SharedDetailsStep,
  LocationState,
  DetailsState,
} from "../shared";

const INITIAL_LOCATION: LocationState = {
  province: "Lusaka",
  city: "Lusaka City",
  district: "",
  address: "",
  coordinates: { lat: -15.3875, lng: 28.3228 },
};

const INITIAL_INVENTORY: StayInventoryState = {
  roomCount: 3,
  units: [
    { id: "room-1", name: "Chalet 1", type: "Double / King Room", maxGuests: 2 },
    { id: "room-2", name: "Chalet 2", type: "Double / King Room", maxGuests: 2 },
    { id: "room-3", name: "Chalet 3 (River View)", type: "Family Suite", maxGuests: 4 },
  ],
};

const INITIAL_PRICING: StayPricingState = {
  currency: "ZMW",
  basePrice: 1500,
  groupDiscountEnabled: false,
  groupDiscountType: "percent",
  groupDiscountPercent: 15,
  groupDiscountCustomPrice: 1275,
  extendedStayDiscountEnabled: false,
  extendedStayDiscountType: "percent",
  extendedStayDiscountPercent: 10,
  extendedStayCustomPrice: 1350,
};

export function StayCreateFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Flow State
  const [subtype, setSubtype] = useState<string>("");
  const [amenities, setAmenities] = useState<StayAmenitiesState>({
    guestFavourites: [],
    standouts: [],
    safety: [],
  });
  const [location, setLocation] = useState<LocationState>(INITIAL_LOCATION);
  const [images, setImages] = useState<string[]>([]);
  const [details, setDetails] = useState<DetailsState>({ title: "", description: "" });
  const [inventory, setInventory] = useState<StayInventoryState>(INITIAL_INVENTORY);
  const [pricing, setPricing] = useState<StayPricingState>(INITIAL_PRICING);

  // Restore draft from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STAY_STORAGE_KEY);
      if (saved) {
        const parsed: Partial<StayFormState> = JSON.parse(saved);
        if (parsed.subtype) setSubtype(parsed.subtype);
        if (parsed.amenities) setAmenities(parsed.amenities);
        if (parsed.location) setLocation(parsed.location);
        if (parsed.images) setImages(parsed.images);
        if (parsed.details) setDetails(parsed.details);
        if (parsed.inventory) setInventory(parsed.inventory);
        if (parsed.pricing) setPricing(parsed.pricing);
        if (parsed.draftId) setDraftId(parsed.draftId);
      }
    } catch (e) {
      console.error("Failed to restore stay draft:", e);
    }
  }, []);

  // Save to localStorage whenever form state changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stateToSave: StayFormState = {
        subtype,
        amenities,
        location,
        images,
        details,
        inventory,
        pricing,
        draftId,
      };
      localStorage.setItem(STAY_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Failed to save stay draft to localStorage:", e);
    }
  }, [subtype, amenities, location, images, details, inventory, pricing, draftId]);

  // Step 2 Next: Send initial stay info to backend
  const handleSaveAmenitiesStep = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        type: "stay",
        vertical: "stay",
        subtype,
        propertyType: subtype,
        guestFavourites: amenities.guestFavourites,
        standoutAmenities: amenities.standouts,
        safetyAmenities: amenities.safety,
        amenities: [
          ...amenities.guestFavourites,
          ...amenities.standouts,
          ...amenities.safety,
        ],
        stayDetails: {
          propertyType: subtype,
          guestFavourites: amenities.guestFavourites,
          standoutAmenities: amenities.standouts,
          safetyAmenities: amenities.safety,
        },
      };

      if (!draftId) {
        const res = await createDraftListing("stay", payload);
        setDraftId(res.id);
      } else {
        await updateDraftListing(draftId, { form: payload });
      }

      toast.success("Stay details saved! Now let's set your location.");
      setCurrentStep(3);
    } catch (err) {
      console.error("Failed to save stay amenities:", err);
      toast.error("Couldn't save details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Step 3 Next: Save Location
  const handleSaveLocationStep = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const locationPayload = {
        country: "Zambia",
        province: location.province,
        city: location.city,
        district: location.district.trim() || location.city,
        address:
          location.address.trim() ||
          `${location.district ? `${location.district}, ` : ""}${location.city}, ${location.province}, Zambia`,
        latitude: location.coordinates.lat,
        longitude: location.coordinates.lng,
      };

      if (draftId) {
        await updateDraftListing(draftId, { form: locationPayload, currentStep: 1 });
      } else {
        const res = await createDraftListing("stay", {
          type: "stay",
          vertical: "stay",
          subtype,
          ...locationPayload,
        });
        setDraftId(res.id);
      }

      toast.success("Location saved! Next, upload photos.");
      setCurrentStep(4);
    } catch (err) {
      console.error("Failed to save stay location:", err);
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

      toast.success("Photos saved! Next, add title and description.");
      setCurrentStep(5);
    } catch (err) {
      console.error("Failed to save stay media:", err);
      toast.error("Could not save photos. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Step 5 Next: Save Details
  const handleSaveDetailsStep = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const detailsPayload = {
        title: details.title.trim(),
        name: details.title.trim(),
        description: details.description.trim(),
      };

      if (draftId) {
        await updateDraftListing(draftId, { form: detailsPayload, currentStep: 3 });
      }

      toast.success("Description saved! Next, configure your rooms and chalets.");
      setCurrentStep(6);
    } catch (err) {
      console.error("Failed to save stay details:", err);
      toast.error("Could not save details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Step 6 Next: Save Inventory
  const handleSaveInventoryStep = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const count = inventory.roomCount || inventory.units?.length || 1;
      const inventoryPayload = {
        inventoryCount: count,
        unitsCount: count,
        totalRooms: count,
        roomCount: count,
        inventory: {
          count,
          roomCount: count,
        },
      };

      if (draftId) {
        await updateDraftListing(draftId, { form: inventoryPayload, currentStep: 4 });
      }

      toast.success("Inventory saved! Next, configure your nightly pricing.");
      setCurrentStep(7);
    } catch (err) {
      console.error("Failed to save stay inventory:", err);
      toast.error("Could not save inventory. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Step 7 Finish: Save Pricing & Publish
  const handleFinishStay = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const count = inventory.roomCount || inventory.units?.length || 1;
      const pricingPayload = {
        pricePerUnitNgwee: Math.round(pricing.basePrice * 100),
        currency: "ZMW",
        basePrice: pricing.basePrice,
        inventoryCount: count,
        unitsCount: count,
        totalRooms: count,
        roomCount: count,
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
            promoPrice:
              pricing.groupDiscountType === "percent"
                ? Math.round(pricing.basePrice * (1 - pricing.groupDiscountPercent / 100))
                : pricing.groupDiscountCustomPrice,
          },
          extendedStayDiscount: {
            enabled: pricing.extendedStayDiscountEnabled,
            minDays: 7,
            discountPercent:
              pricing.extendedStayDiscountType === "percent"
                ? pricing.extendedStayDiscountPercent
                : Math.round(
                    ((pricing.basePrice - pricing.extendedStayCustomPrice) / pricing.basePrice) * 100,
                  ),
            promoPrice:
              pricing.extendedStayDiscountType === "percent"
                ? Math.round(pricing.basePrice * (1 - pricing.extendedStayDiscountPercent / 100))
                : pricing.extendedStayCustomPrice,
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
                promoPrice:
                  pricing.groupDiscountType === "percent"
                    ? Math.round(pricing.basePrice * (1 - pricing.groupDiscountPercent / 100))
                    : pricing.groupDiscountCustomPrice,
              }
            : null,
          extendedStay7DaysPlus: pricing.extendedStayDiscountEnabled
            ? {
                minDays: 7,
                discountPercent:
                  pricing.extendedStayDiscountType === "percent"
                    ? pricing.extendedStayDiscountPercent
                    : Math.round(
                        ((pricing.basePrice - pricing.extendedStayCustomPrice) /
                          pricing.basePrice) *
                          100,
                      ),
                promoPrice:
                  pricing.extendedStayDiscountType === "percent"
                    ? Math.round(pricing.basePrice * (1 - pricing.extendedStayDiscountPercent / 100))
                    : pricing.extendedStayCustomPrice,
              }
            : null,
        },
      };

      if (draftId) {
        await updateDraftListing(draftId, { form: pricingPayload, currentStep: 5 });
        // Register newly created listing into persistent inventory store
        useInventoryStore.getState().setListingInventory(draftId, {
          listingId: draftId,
          unitType: "room",
          unitLabel: "Chalet / Room",
          unitLabelPlural: "Chalets / Rooms",
          total: count,
          units: Array.from({ length: count }, (_, i) => ({
            id: `unit-${i + 1}`,
            label: count === 1 ? "Entire Property / Room" : `Chalet / Room ${i + 1}`,
            status: "available",
            price: pricing.basePrice,
            note: "Ready for check-in",
          })),
        });
      }

      if (typeof window !== "undefined") {
        localStorage.removeItem(STAY_STORAGE_KEY);
      }

      toast.success("Stay listing published successfully!");
      router.push(ROUTES.host.listings);
    } catch (err) {
      console.error("Failed to publish stay listing:", err);
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
              <StayStepSubtype
                selectedSubtype={subtype}
                onSelectSubtype={setSubtype}
                onNext={() => setCurrentStep(2)}
                onBack={() => router.push(ROUTES.host.create)}
              />
            )}

            {currentStep === 2 && (
              <StayStepAmenities
                amenities={amenities}
                onAmenitiesChange={setAmenities}
                onBack={() => setCurrentStep(1)}
                onNext={handleSaveAmenitiesStep}
                submitting={submitting}
              />
            )}

            {currentStep === 3 && (
              <SharedLocationStep
                location={location}
                onLocationChange={setLocation}
                onBack={() => setCurrentStep(2)}
                onNext={handleSaveLocationStep}
                submitting={submitting}
              />
            )}

            {currentStep === 4 && (
              <SharedMediaStep
                images={images}
                onImagesChange={setImages}
                samplePhotos={STAY_SAMPLE_PHOTOS}
                onBack={() => setCurrentStep(3)}
                onNext={handleSaveMediaStep}
                submitting={submitting}
              />
            )}

            {currentStep === 5 && (
              <SharedDetailsStep
                verticalName="stay"
                title={details.title}
                description={details.description}
                onTitleChange={(t) => setDetails((prev) => ({ ...prev, title: t }))}
                onDescriptionChange={(d) => setDetails((prev) => ({ ...prev, description: d }))}
                onBack={() => setCurrentStep(4)}
                onNext={handleSaveDetailsStep}
                submitting={submitting}
              />
            )}

            {currentStep === 6 && (
              <StayStepInventory
                inventory={inventory}
                onInventoryChange={setInventory}
                onBack={() => setCurrentStep(5)}
                onNext={handleSaveInventoryStep}
                submitting={submitting}
              />
            )}

            {currentStep === 7 && (
              <StayStepPricing
                pricing={pricing}
                onPricingChange={setPricing}
                onBack={() => setCurrentStep(6)}
                onFinish={handleFinishStay}
                submitting={submitting}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
