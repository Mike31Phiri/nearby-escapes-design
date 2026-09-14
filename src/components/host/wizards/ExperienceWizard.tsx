"use client";

import { useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, Loader2, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createExperience, type CreateExperiencePayload } from "@/lib/api/experiences";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { MapLocationPicker } from "../MapLocationPicker";
import { experienceSchema, type ExperienceFormValues } from "@/lib/validations/onboarding";

const STEPS = [
  { id: "profile", label: "Profile", fields: ["title", "category", "description"] as const },
  {
    id: "logistics",
    label: "Logistics",
    fields: ["meetingPoint", "latitude", "longitude", "endPoint", "hotelPickup"] as const,
  },
  {
    id: "schedule",
    label: "Schedule",
    fields: ["durationHours", "startTimes", "minGroup", "maxGroup"] as const,
  },
  {
    id: "details",
    label: "Details",
    fields: ["inclusions", "exclusions", "difficulty", "minAge", "maxWeight"] as const,
  },
  { id: "pricing", label: "Pricing", fields: ["priceAdult", "priceChild"] as const },
];

export const EXPERIENCE_STEPS = STEPS;

export interface ExperienceWizardProps {
  draftId?: string;
  initialStep?: number;
  initialValues?: Record<string, unknown>;
  onStepChange?: (step: number) => void;
  onAutoSave?: (values: Record<string, unknown>, step: number) => void;
  onPublish?: (values: Record<string, unknown>) => void;
}

export function ExperienceWizard({
  draftId,
  initialStep = 0,
  initialValues,
  onStepChange,
  onAutoSave,
  onPublish,
}: ExperienceWizardProps = {}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const methods = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    mode: "onChange",
    defaultValues: {
      hotelPickup: false,
      startTimes: ["09:00"],
      inclusions: [],
      exclusions: [],
      difficulty: "Moderate",
      minGroup: 1,
      maxGroup: 10,
      latitude: -17.8419,
      longitude: 25.8543,
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

  const onSubmit = async (data: ExperienceFormValues) => {
    setIsSubmitting(true);
    try {
      if (onPublish) {
        await onPublish(data as any);
        return;
      }

      const payload: CreateExperiencePayload = {
        title: data.title,
        description: data.description,
        category: data.category,
        durationHours: data.durationHours,
        meetingPointAddress: data.meetingPoint,
        meetingLatitude: data.latitude,
        meetingLongitude: data.longitude,
        difficulty: data.difficulty as any,
        minAge: data.minAge || 0,
        maxGroupSize: data.maxGroup,
        minGroupSize: data.minGroup,
        inclusions: data.inclusions,
        exclusions: data.exclusions,
        images: ["https://images.unsplash.com/photo-1518780664697-55e3ad937233"],
        pricePerAdultNgwee: Math.floor((data.priceAdult || 0) * 100),
        pricePerChildNgwee: Math.floor((data.priceChild || 0) * 100),
        location: {
          address: data.meetingPoint,
          city: "Livingstone",
          province: "Southern",
          latitude: data.latitude,
          longitude: data.longitude,
        },
      };

      await createExperience(payload);
      toast.success("Experience Created Successfully!");
      router.push("/host/listings");
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to create experience.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Step 1: Profile */}
        {currentStep === 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-xl font-bold">Experience Profile</h2>
            </div>

            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <div>
                  <Label>Title</Label>
                  <Input {...field} placeholder="Sunset Safari Drive" />
                  {errors.title && (
                    <p className="text-destructive text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <div>
                  <Label>Category</Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nature & Outdoors">Nature & Outdoors</SelectItem>
                      <SelectItem value="Food & Drink">Food & Drink</SelectItem>
                      <SelectItem value="Art & Culture">Art & Culture</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-destructive text-sm mt-1">{errors.category.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <div>
                  <Label>Description</Label>
                  <Textarea {...field} className="h-32" placeholder="Describe the experience..." />
                  {errors.description && (
                    <p className="text-destructive text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        )}

        {/* Step 2: Logistics */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-xl font-bold">Logistics</h2>
            </div>

            <Controller
              name="meetingPoint"
              control={control}
              render={({ field }) => (
                <div>
                  <Label>Meeting Point</Label>
                  <Input {...field} />
                  {errors.meetingPoint && (
                    <p className="text-destructive text-sm mt-1">{errors.meetingPoint.message}</p>
                  )}
                </div>
              )}
            />

            <div className="pt-2">
              <MapLocationPicker
                latitude={watch("latitude")}
                longitude={watch("longitude")}
                address={watch("meetingPoint")}
                onChange={({ latitude, longitude, city }) => {
                  setValue("latitude", latitude, { shouldValidate: true });
                  setValue("longitude", longitude, { shouldValidate: true });
                  if (city && !watch("meetingPoint")) {
                    setValue("meetingPoint", city, { shouldValidate: true });
                  }
                }}
              />
            </div>

            <Controller
              name="endPoint"
              control={control}
              render={({ field }) => (
                <div>
                  <Label>End Point (if different)</Label>
                  <Input {...field} />
                </div>
              )}
            />

            <Controller
              name="hotelPickup"
              control={control}
              render={({ field }) => (
                <div className="flex items-center justify-between border p-4 rounded-xl">
                  <div>
                    <p className="font-semibold">Offer Hotel Pickup?</p>
                  </div>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </div>
              )}
            />
          </div>
        )}

        {/* Step 3: Schedule */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-xl font-bold">Schedule & Group Size</h2>
            </div>

            <Controller
              name="durationHours"
              control={control}
              render={({ field }) => (
                <div>
                  <Label>Duration (Hours)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </div>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="minGroup"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Min Group Size</Label>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </div>
                )}
              />
              <Controller
                name="maxGroup"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Max Group Size</Label>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                    {errors.maxGroup && (
                      <p className="text-destructive text-sm mt-1">{errors.maxGroup.message}</p>
                    )}
                  </div>
                )}
              />
            </div>

            <Controller
              name="startTimes"
              control={control}
              render={({ field }) => (
                <div>
                  <Label>Start Times</Label>
                  <div className="flex gap-2 mt-2">
                    {field.value.map((t, idx) => (
                      <Badge key={idx} variant="secondary" className="px-3 py-1">
                        {t}{" "}
                        <X
                          className="h-3 w-3 ml-2 cursor-pointer"
                          onClick={() => field.onChange(field.value.filter((_, i) => i !== idx))}
                        />
                      </Badge>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => field.onChange([...field.value, "12:00"])}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Time
                    </Button>
                  </div>
                </div>
              )}
            />
          </div>
        )}

        {/* Step 4: Details */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-xl font-bold">Details & Limits</h2>
            </div>

            <Controller
              name="difficulty"
              control={control}
              render={({ field }) => (
                <div>
                  <Label>Physical Difficulty</Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Easy", "Moderate", "Challenging", "Extreme"].map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="minAge"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Min Age (Optional)</Label>
                    <Input
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || null)}
                    />
                  </div>
                )}
              />
              <Controller
                name="maxWeight"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Max Weight (Optional)</Label>
                    <Input
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || null)}
                    />
                  </div>
                )}
              />
            </div>

            <Controller
              name="inclusions"
              control={control}
              render={({ field }) => (
                <div>
                  <Label>What&apos;s Included?</Label>
                  <Textarea
                    placeholder="Comma separated..."
                    onChange={(e) => field.onChange(e.target.value.split(","))}
                    value={field.value?.join(",") ?? ""}
                  />
                </div>
              )}
            />

            <Controller
              name="exclusions"
              control={control}
              render={({ field }) => (
                <div>
                  <Label>What&apos;s NOT Included?</Label>
                  <Textarea
                    placeholder="Comma separated..."
                    onChange={(e) => field.onChange(e.target.value.split(","))}
                    value={field.value?.join(",") ?? ""}
                  />
                </div>
              )}
            />
          </div>
        )}

        {/* Step 5: Pricing */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-xl font-bold">Pricing</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="priceAdult"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Adult Price ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </div>
                )}
              />
              <Controller
                name="priceChild"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Child Price ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </div>
                )}
              />
            </div>
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
              Publish Experience
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

function Badge({ children, className, variant }: any) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-semibold ${className}`}
    >
      {children}
    </span>
  );
}
