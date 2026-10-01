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
  TRANSPORT_STORAGE_KEY,
  TRANSPORT_SAMPLE_PHOTOS,
} from "./transportConstants";
import {
  TransportFeaturesState,
  TransportPricingState,
  TransportFormState,
  TransportInventoryState,
} from "./transportTypes";
import { TransportStepSubtype } from "./TransportStepSubtype";
import { TransportStepFeatures } from "./TransportStepFeatures";
import { TransportStepInventory } from "./TransportStepInventory";
import { TransportStepPricing } from "./TransportStepPricing";
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

const INITIAL_INVENTORY: TransportInventoryState = {
  fleetSize: 3,
  units: [
    { id: "veh-1", label: "Vehicle 1", plateNumber: "", seats: 5 },
    { id: "veh-2", label: "Vehicle 2", plateNumber: "", seats: 5 },
    { id: "veh-3", label: "Vehicle 3", plateNumber: "", seats: 5 },
  ],
};

const INITIAL_PRICING: TransportPricingState = {
  currency: "ZMW",
  basePrice: 1200,
  rateUnit: "trip",
  multiDayDiscountEnabled: false,
  multiDayDiscountType: "percent",
  multiDayDiscountPercent: 10,
  multiDayCustomPrice: 1080,
  groupCharterDiscountEnabled: false,
  groupCharterDiscountType: "percent",
  groupCharterDiscountPercent: 15,
  groupCharterCustomPrice: 1020,
};

export function TransportCreateFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Flow State
  const [subtype, setSubtype] = useState<string>("");
  const [features, setFeatures] = useState<TransportFeaturesState>({
    vehicleFeatures: [],
    whatToCarry: [],
    guidelines: [],
  });
  const [location, setLocation] = useState<LocationState>(INITIAL_LOCATION);
  const [images, setImages] = useState<string[]>([]);
  const [details, setDetails] = useState<DetailsState>({ title: "", description: "" });
  const [inventory, setInventory] = useState<TransportInventoryState>(INITIAL_INVENTORY);
  const [pricing, setPricing] = useState<TransportPricingState>(INITIAL_PRICING);

  // Restore draft from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(TRANSPORT_STORAGE_KEY);
      if (saved) {
        const parsed: Partial<TransportFormState> = JSON.parse(saved);
        if (parsed.subtype) setSubtype(parsed.subtype);
        if (parsed.features) setFeatures(parsed.features);
        if (parsed.location) setLocation(parsed.location);
        if (parsed.images) setImages(parsed.images);
        if (parsed.details) setDetails(parsed.details);
        if (parsed.inventory) setInventory(parsed.inventory);
        if (parsed.pricing) setPricing(parsed.pricing);
        if (parsed.draftId) setDraftId(parsed.draftId);
      }
    } catch (e) {
      console.error("Failed to restore transport draft:", e);
    }
  }, []);

  // Save to localStorage whenever form state changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stateToSave: TransportFormState = {
        subtype,
        features,
        location,
        images,
        details,
        inventory,
        pricing,
        draftId,
      };
      localStorage.setItem(TRANSPORT_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error("Failed to save transport draft to localStorage:", e);
    }
  }, [subtype, features, location, images, details, inventory, pricing, draftId]);

  // Step 2 Next: Save Features
  const handleSaveFeaturesStep = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        type: "transport",
        vertical: "transport",
        subtype,
        vehicleType: subtype,
        serviceType: subtype,
        features: features.vehicleFeatures,
        whatToBring: features.whatToCarry,
        guidelines: features.guidelines,
        transportDetails: {
          vehicleType: subtype,
          features: features.vehicleFeatures,
          whatToBring: features.whatToCarry,
          guidelines: features.guidelines,
        },
      };

      if (!draftId) {
        const res = await createDraftListing("transport", payload);
        setDraftId(res.id);
      } else {
        await updateDraftListing(draftId, { form: payload });
      }

      toast.success("Features saved! Next, set vehicle depot or base location.");
      setCurrentStep(3);
    } catch (err) {
      console.error("Failed to save transport features:", err);
      toast.error("Couldn't save vehicle features. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Step 3 Next: Save Base Location
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
        const res = await createDraftListing("transport", {
          type: "transport",
          vertical: "transport",
          subtype,
          ...locationPayload,
        });
        setDraftId(res.id);
      }

      toast.success("Depot location saved! Next, add vehicle photos.");
      setCurrentStep(4);
    } catch (err) {
      console.error("Failed to save transport location:", err);
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

      toast.success("Photos saved! Next, add vehicle name and description.");
      setCurrentStep(5);
    } catch (err) {
      console.error("Failed to save transport media:", err);
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

      toast.success("Description saved! Next, configure your vehicle fleet.");
      setCurrentStep(6);
    } catch (err) {
      console.error("Failed to save transport details:", err);
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
      const count = inventory.fleetSize || inventory.units?.length || 1;
      const inventoryPayload = {
        inventoryCount: count,
        unitsCount: count,
        fleetSize: count,
        totalVehicles: count,
        inventory: {
          count,
          fleetSize: count,
        },
      };

      if (draftId) {
        await updateDraftListing(draftId, { form: inventoryPayload, currentStep: 4 });
      }

      toast.success("Fleet inventory saved! Next, configure your rates.");
      setCurrentStep(7);
    } catch (err) {
      console.error("Failed to save transport inventory:", err);
      toast.error("Could not save fleet inventory. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Step 7 Finish: Save Pricing & Publish
  const handleFinishTransport = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const count = inventory.fleetSize || inventory.units?.length || 1;
      const effectiveMultiDayPrice =
        pricing.multiDayDiscountType === "percent"
          ? Math.round(pricing.basePrice * (1 - pricing.multiDayDiscountPercent / 100))
          : pricing.multiDayCustomPrice;

      const effectiveGroupPrice =
        pricing.groupCharterDiscountType === "percent"
          ? Math.round(pricing.basePrice * (1 - pricing.groupCharterDiscountPercent / 100))
          : pricing.groupCharterCustomPrice;

      const pricingPayload = {
        pricePerUnitNgwee: Math.round(pricing.basePrice * 100),
        currency: "ZMW",
        basePrice: pricing.basePrice,
        rateUnit: pricing.rateUnit,
        inventoryCount: count,
        unitsCount: count,
        fleetSize: count,
        totalVehicles: count,
        pricingRules: {
          basePrice: pricing.basePrice,
          currency: "ZMW",
          rateUnit: pricing.rateUnit,
          multiDayDiscount: {
            enabled: pricing.multiDayDiscountEnabled,
            minDays: 3,
            discountPercent:
              pricing.multiDayDiscountType === "percent"
                ? pricing.multiDayDiscountPercent
                : Math.round(
                    ((pricing.basePrice - pricing.multiDayCustomPrice) / pricing.basePrice) * 100,
                  ),
            promoPrice: effectiveMultiDayPrice,
          },
          groupCharterDiscount: {
            enabled: pricing.groupCharterDiscountEnabled,
            minSeats: 6,
            discountPercent:
              pricing.groupCharterDiscountType === "percent"
                ? pricing.groupCharterDiscountPercent
                : Math.round(
                    ((pricing.basePrice - pricing.groupCharterCustomPrice) / pricing.basePrice) * 100,
                  ),
            promoPrice: effectiveGroupPrice,
          },
        },
        conditionalDiscounts: {
          multiDayDiscount: pricing.multiDayDiscountEnabled
            ? {
                minDays: 3,
                discountPercent:
                  pricing.multiDayDiscountType === "percent"
                    ? pricing.multiDayDiscountPercent
                    : Math.round(
                        ((pricing.basePrice - pricing.multiDayCustomPrice) / pricing.basePrice) *
                          100,
                      ),
                promoPrice: effectiveMultiDayPrice,
              }
            : null,
          groupCharterDiscount: pricing.groupCharterDiscountEnabled
            ? {
                minSeats: 6,
                discountPercent:
                  pricing.groupCharterDiscountType === "percent"
                    ? pricing.groupCharterDiscountPercent
                    : Math.round(
                        ((pricing.basePrice - pricing.groupCharterCustomPrice) /
                          pricing.basePrice) *
                          100,
                      ),
                promoPrice: effectiveGroupPrice,
              }
            : null,
        },
      };

      if (draftId) {
        await updateDraftListing(draftId, { form: pricingPayload, currentStep: 5 });
        // Register newly created listing into persistent inventory store
        useInventoryStore.getState().setListingInventory(draftId, {
          listingId: draftId,
          unitType: "vehicle",
          unitLabel: "Vehicle",
          unitLabelPlural: "Vehicles",
          total: count,
          units: Array.from({ length: count }, (_, i) => ({
            id: `veh-${i + 1}`,
            label: count === 1 ? "Vehicle" : `Vehicle ${i + 1}`,
            status: "available",
            price: pricing.basePrice,
            capacity: 5,
            note: "Inspected & ready for dispatch",
          })),
        });
      }

      if (typeof window !== "undefined") {
        localStorage.removeItem(TRANSPORT_STORAGE_KEY);
      }

      toast.success("Transport listing published successfully!");
      router.push(ROUTES.host.listings);
    } catch (err) {
      console.error("Failed to publish transport listing:", err);
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
              <TransportStepSubtype
                selectedSubtype={subtype}
                onSelectSubtype={setSubtype}
                onNext={() => setCurrentStep(2)}
                onBack={() => router.push(ROUTES.host.create)}
              />
            )}

            {currentStep === 2 && (
              <TransportStepFeatures
                features={features}
                onFeaturesChange={setFeatures}
                onBack={() => setCurrentStep(1)}
                onNext={handleSaveFeaturesStep}
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
                samplePhotos={TRANSPORT_SAMPLE_PHOTOS}
                onBack={() => setCurrentStep(3)}
                onNext={handleSaveMediaStep}
                submitting={submitting}
              />
            )}

            {currentStep === 5 && (
              <SharedDetailsStep
                verticalName="transport"
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
              <TransportStepInventory
                inventory={inventory}
                onInventoryChange={setInventory}
                onBack={() => setCurrentStep(5)}
                onNext={handleSaveInventoryStep}
                submitting={submitting}
              />
            )}

            {currentStep === 7 && (
              <TransportStepPricing
                pricing={pricing}
                onPricingChange={setPricing}
                onBack={() => setCurrentStep(6)}
                onFinish={handleFinishTransport}
                submitting={submitting}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
