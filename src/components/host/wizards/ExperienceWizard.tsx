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

export function ExperienceWizard() {
  const [currentStep, setCurrentStep] = useState(0);
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
    },
  });

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = methods;

  const nextStep = async () => {
    const fieldsToValidate = STEPS[currentStep].fields;
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: ExperienceFormValues) => {
    setIsSubmitting(true);
    try {
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
        images: ["https://images.unsplash.com/photo-1518780664697-55e3ad937233"], // Mock image
        pricePerAdultNgwee: Math.floor((data.priceAdult || 0) * 100),
        pricePerChildNgwee: Math.floor((data.priceChild || 0) * 100),
        location: {
          address: data.meetingPoint,
          city: "Lusaka", // Fallback since city isn't captured
          province: "Lusaka",
          latitude: data.latitude,
          longitude: data.longitude,
        },
      };

      await createExperience(payload);
      toast.success("Experience Created Successfully!");
      router.push("/host/listings");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create experience.");
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

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="latitude"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Latitude</Label>
                    <Input
                      type="number"
                      step="any"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </div>
                )}
              />
              <Controller
                name="longitude"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Longitude</Label>
                    <Input
                      type="number"
                      step="any"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </div>
                )}
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
        <div className="flex items-center justify-between pt-8 border-t mt-8">
          <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0}>
            <ChevronLeft className="h-4 w-4 mr-2" /> Back
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button type="button" onClick={nextStep} className="bg-primary text-primary-foreground">
              Continue <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#f2ba0d] hover:bg-[#B89430] text-[#1f1433] font-bold"
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

function Badge({ children, className, variant }: any) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-semibold ${className}`}
    >
      {children}
    </span>
  );
}
