"use client";

import { useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  MapPin,
  Loader2,
  Hotel,
  Maximize2,
  Sparkles,
  ShieldCheck,
  DollarSign,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createStay, type CreateStayPayload } from "@/lib/api/stays";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { MapLocationPicker } from "../MapLocationPicker";
import { staySchema, type StayFormValues } from "@/lib/validations/onboarding";

// Using mock options from the original page
import {
  PROPERTY_TYPES,
  STAY_AMENITIES,
  HOUSE_RULES_OPTIONS,
  CANCELLATION_POLICIES,
} from "@/lib/constants/listing";

const STEPS = [
  {
    id: "type",
    label: "Property Type",
    fields: ["propertyType", "isMultiUnit", "isDedicated"] as const,
  },
  {
    id: "location",
    label: "Location",
    fields: ["address", "city", "country", "latitude", "longitude", "arrivalInfo"] as const,
  },
  { id: "capacity", label: "Capacity", fields: ["maxGuests", "bedrooms", "beds"] as const },
  {
    id: "amenities",
    label: "Amenities",
    fields: ["coreAmenities", "kitchenAmenities", "safetyAmenities", "outdoorAmenities"] as const,
  },
  { id: "media", label: "Media & Title", fields: ["title", "slogan", "images"] as const },
  {
    id: "pricing",
    label: "Pricing & Rules",
    fields: ["baseRate", "cancelPolicy", "houseRules"] as const,
  },
];

export const STAY_STEPS = STEPS;

export interface StayWizardProps {
  draftId?: string;
  initialStep?: number;
  initialValues?: Record<string, unknown>;
  onStepChange?: (step: number) => void;
  onAutoSave?: (values: Record<string, unknown>, step: number) => void;
  onPublish?: (values: Record<string, unknown>) => void;
}

export function StayWizard({
  draftId,
  initialStep = 0,
  initialValues,
  onStepChange,
  onAutoSave,
  onPublish,
}: StayWizardProps = {}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const methods = useForm<StayFormValues>({
    resolver: zodResolver(staySchema),
    mode: "onChange",
    defaultValues: {
      isMultiUnit: false,
      isDedicated: true,
      maxGuests: 2,
      bedrooms: 1,
      beds: [{ room: "Bedroom 1", beds: ["Queen"] }],
      coreAmenities: [],
      kitchenAmenities: [],
      safetyAmenities: [],
      outdoorAmenities: [],
      images: [],
      houseRules: [],
      country: "Zambia",
      city: "Lusaka",
      latitude: -15.3875,
      longitude: 28.3228,
      ...(initialValues as any),
    },
  });

  const {
    control,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const nextStep = async () => {
    const fieldsToValidate = STEPS[currentStep].fields;
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      const next = Math.min(currentStep + 1, STEPS.length - 1);
      setCurrentStep(next);
      onStepChange?.(next);
      onAutoSave?.(methods.getValues() as any, next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    const prev = Math.max(currentStep - 1, 0);
    setCurrentStep(prev);
    onStepChange?.(prev);
    onAutoSave?.(methods.getValues() as any, prev);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data: StayFormValues) => {
    setIsSubmitting(true);
    try {
      if (onPublish) {
        await onPublish(data as any);
        return;
      }

      // Synthesize a single "entire property" room type from the flat
      // capacity + rate fields the wizard collects.
      const roomTypeBeds = Array.from(
        data.beds
          .flatMap((r) => r.beds)
          .reduce(
            (counts, type) => counts.set(type, (counts.get(type) ?? 0) + 1),
            new Map<string, number>(),
          )
          .entries(),
      ).map(([type, count]) => ({ type, count }));

      const payload: CreateStayPayload = {
        title: data.title,
        description: data.slogan || "Enjoy a wonderful stay at this property.",
        propertyType: data.propertyType,
        maxGuests: data.maxGuests,
        bedrooms: data.bedrooms,
        bathrooms: 1,
        amenities: [
          ...data.coreAmenities,
          ...data.kitchenAmenities,
          ...data.safetyAmenities,
          ...data.outdoorAmenities,
        ],
        images: data.images,
        location: {
          address: data.address,
          city: data.city || "Lusaka",
          province: data.country || "Zambia",
          latitude: data.latitude || -15.3875,
          longitude: data.longitude || 28.3228,
        },
        baseRateNgwee: Math.floor((data.baseRate || 0) * 100),
        cancellationPolicy: data.cancelPolicy,
        roomTypes: [
          {
            id: "whole-property",
            name: "Entire property",
            count: 1,
            maxGuests: data.maxGuests,
            bedrooms: data.bedrooms,
            beds: roomTypeBeds,
            pricePerNightNgwee: Math.floor((data.baseRate || 0) * 100),
          },
        ],
      };

      await createStay(payload);
      toast.success("Stay Listing Created Successfully!");
      router.push("/host/listings");
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to create listing.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock photo upload
  const handlePhotoUpload = () => {
    const currentImages = watch("images");
    setValue("images", [
      ...currentImages,
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800",
    ]);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Step 1: Type */}
        {currentStep === 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-xl font-bold">What type of place will guests have?</h2>
              <p className="text-muted-foreground text-base">
                Select the category that best describes your property.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PROPERTY_TYPES.map((pt: import("@/lib/constants/listing").OptionItem) => (
                  <Controller
                    key={pt.value}
                    name="propertyType"
                    control={control}
                    render={({ field }) => (
                      <div
                        className={`cursor-pointer rounded-xl border p-4 transition-all ${
                          field.value === pt.value
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => field.onChange(pt.value)}
                      >
                        <p className="font-semibold">{pt.label}</p>
                      </div>
                    )}
                  />
                ))}
              </div>
              {errors.propertyType && (
                <p className="text-destructive text-base">{errors.propertyType.message}</p>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t">
              <Controller
                name="isMultiUnit"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Is this a multi-unit building?</p>
                      <p className="text-sm text-muted-foreground">
                        Like an apartment complex or boutique hotel.
                      </p>
                    </div>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </div>
                )}
              />
              <Controller
                name="isDedicated"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Is this set up entirely for guests?</p>
                      <p className="text-sm text-muted-foreground">
                        Or do you keep personal belongings here?
                      </p>
                    </div>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </div>
                )}
              />
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-xl font-bold">Where is your place located?</h2>
              <p className="text-muted-foreground text-base">
                Guests will only get your exact address once they&apos;ve booked.
              </p>
            </div>

            <div className="space-y-4">
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Street Address</Label>
                    <Input {...field} placeholder="123 Main St" />
                    {errors.address && (
                      <p className="text-destructive text-sm mt-1">{errors.address.message}</p>
                    )}
                  </div>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Label>City / Town</Label>
                      <Input {...field} placeholder="Lusaka, Livingstone, etc." />
                      {errors.city && (
                        <p className="text-destructive text-sm mt-1">{errors.city.message}</p>
                      )}
                    </div>
                  )}
                />
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Label>Country / Province</Label>
                      <Input {...field} placeholder="Zambia" />
                      {errors.country && (
                        <p className="text-destructive text-sm mt-1">{errors.country.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Map Location Picker with Free Map & Google Maps options */}
              <div className="pt-2">
                <MapLocationPicker
                  latitude={watch("latitude")}
                  longitude={watch("longitude")}
                  address={watch("address")}
                  city={watch("city")}
                  onChange={({ latitude, longitude, city }) => {
                    setValue("latitude", latitude, { shouldValidate: true });
                    setValue("longitude", longitude, { shouldValidate: true });
                    if (city) {
                      setValue("city", city, { shouldValidate: true });
                    }
                  }}
                />
              </div>
              <Controller
                name="arrivalInfo"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Arrival Instructions (Optional)</Label>
                    <Textarea {...field} placeholder="How to find the entrance..." />
                  </div>
                )}
              />
            </div>
          </div>
        )}

        {/* Step 3: Capacity */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-xl font-bold">Share some basics about your place</h2>
              <p className="text-muted-foreground text-base">How many guests can stay here?</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="maxGuests"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Max Guests</Label>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                    {errors.maxGuests && (
                      <p className="text-destructive text-sm mt-1">{errors.maxGuests.message}</p>
                    )}
                  </div>
                )}
              />
              <Controller
                name="bedrooms"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Bedrooms</Label>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                    {errors.bedrooms && (
                      <p className="text-destructive text-sm mt-1">{errors.bedrooms.message}</p>
                    )}
                  </div>
                )}
              />
            </div>

            <div>
              <Label className="mb-2 block">Beds Configuration</Label>
              <Controller
                name="beds"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    {field.value?.map((room, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <Input
                          value={room.room}
                          onChange={(e) => {
                            const newBeds = [...field.value];
                            newBeds[idx].room = e.target.value;
                            field.onChange(newBeds);
                          }}
                          className="w-1/3"
                          placeholder="Room name"
                        />
                        <Input
                          value={room.beds.join(", ")}
                          onChange={(e) => {
                            const newBeds = [...field.value];
                            newBeds[idx].beds = e.target.value.split(",").map((s) => s.trim());
                            field.onChange(newBeds);
                          }}
                          className="flex-1"
                          placeholder="Beds (e.g. Queen, Single)"
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        field.onChange([
                          ...field.value,
                          { room: `Bedroom ${field.value.length + 1}`, beds: ["Queen"] },
                        ])
                      }
                    >
                      Add Room
                    </Button>
                  </div>
                )}
              />
              {errors.beds && (
                <p className="text-destructive text-sm mt-1">{errors.beds.message}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Amenities */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-xl font-bold">Tell guests what your place has to offer</h2>
              <p className="text-muted-foreground text-base">
                You can add more amenities after you publish.
              </p>
            </div>

            <Controller
              name="coreAmenities"
              control={control}
              render={({ field }) => (
                <div className="space-y-3">
                  <Label>All Amenities</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {STAY_AMENITIES.map((item: import("@/lib/constants/listing").AmenityItem) => (
                      <div key={item.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={item.value}
                          checked={field.value.includes(item.value)}
                          onCheckedChange={(checked) => {
                            field.onChange(
                              checked
                                ? [...field.value, item.value]
                                : field.value.filter((i: string) => i !== item.value),
                            );
                          }}
                        />
                        <label
                          htmlFor={item.value}
                          className="text-base cursor-pointer flex items-center gap-2"
                        >
                          <item.icon className="w-4 h-4" /> {item.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            />
            {/* Same for kitchen, safety, outdoor (omitted repetitive code for brevity, assuming standard checkboxes) */}
          </div>
        )}

        {/* Step 5: Media */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-xl font-bold">Add some photos of your place</h2>
              <p className="text-muted-foreground text-base">
                You&apos;ll need 3 photos to get started.
              </p>
            </div>

            <Controller
              name="images"
              control={control}
              render={({ field }) => (
                <div>
                  <div
                    onClick={handlePhotoUpload}
                    className="border-2 border-dashed border-border/60 rounded-xl p-10 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <UploadCloud className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                    <p className="font-semibold">Click to mock upload photos</p>
                    <p className="text-sm text-muted-foreground mt-1">Requires at least 3 images</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {field.value.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt="upload"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                  {errors.images && (
                    <p className="text-destructive text-sm mt-1">{errors.images.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <div>
                  <Label>Title</Label>
                  <Input {...field} placeholder="Cozy Mountain Cabin" />
                  {errors.title && (
                    <p className="text-destructive text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        )}

        {/* Step 6: Pricing & Policies */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-xl font-bold">Set your price & policies</h2>
            </div>

            <Controller
              name="baseRate"
              control={control}
              render={({ field }) => (
                <div>
                  <Label>Nightly Rate ($)</Label>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                  {errors.baseRate && (
                    <p className="text-destructive text-sm mt-1">{errors.baseRate.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="cancelPolicy"
              control={control}
              render={({ field }) => (
                <div>
                  <Label>Cancellation Policy</Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select policy" />
                    </SelectTrigger>
                    <SelectContent>
                      {CANCELLATION_POLICIES.map(
                        (p: import("@/lib/constants/listing").OptionItem) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  {errors.cancelPolicy && (
                    <p className="text-destructive text-sm mt-1">{errors.cancelPolicy.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8 border-t border-neutral-200/80 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="rounded-xl border-neutral-200/80 hover:bg-neutral-100 text-sm font-semibold h-11 px-5 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4 mr-1.5" /> Back
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={nextStep}
              className="bg-purple text-white hover:bg-purple-hover font-semibold px-6 h-11 text-sm rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Continue <ChevronRight className="h-4 w-4 ml-1.5" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple text-white hover:bg-purple-hover font-semibold px-7 h-11 text-sm rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Publish Listing
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
