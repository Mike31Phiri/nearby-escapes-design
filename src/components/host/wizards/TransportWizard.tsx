"use client";

import { useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, UploadCloud, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createTransport, type CreateTransportPayload } from "@/lib/api/transport";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { transportSchema, type TransportFormValues } from "@/lib/validations/onboarding";

const STEPS = [
  {
    id: "identity",
    label: "Vehicle Identity",
    fields: ["make", "model", "year", "transmission", "fuelType"] as const,
  },
  {
    id: "capacity",
    label: "Capacity",
    fields: ["passengers", "largeLuggage", "smallLuggage"] as const,
  },
  { id: "scope", label: "Scope", fields: ["serviceType", "pricingType"] as const },
  {
    id: "legal",
    label: "Legal & Trust",
    fields: ["licensePlate", "registrationUrl", "insuranceUrl", "licenseUrl"] as const,
  },
];

export function TransportWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const methods = useForm<TransportFormValues>({
    resolver: zodResolver(transportSchema),
    mode: "onChange",
    defaultValues: {
      year: new Date().getFullYear(),
      passengers: 4,
      largeLuggage: 2,
      smallLuggage: 2,
      serviceType: "self-drive",
      pricingType: "daily",
      dailyRate: 50,
      perKmRate: 0,
    },
  });

  const {
    control,
    handleSubmit,
    trigger,
    setValue,
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

  const onSubmit = async (data: TransportFormValues) => {
    setIsSubmitting(true);
    try {
      const payload: CreateTransportPayload = {
        title: `${data.make} ${data.model} ${data.year}`,
        description: `Experience a premium ride with this ${data.year} ${data.make} ${data.model}.`,
        vehicleMake: data.make,
        vehicleModel: data.model,
        vehicleYear: data.year,
        transmission: data.transmission as any,
        fuelType: data.fuelType as any,
        passengerCapacity: data.passengers,
        serviceType: data.serviceType as any,
        images: ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2"], // Mock image
        dailyRateNgwee: Math.floor((data.dailyRate || 0) * 100),
        perKmRateNgwee: Math.floor((data.perKmRate || 0) * 100),
        location: {
          address: "N/A",
          city: "Lusaka",
          province: "Lusaka",
          latitude: -15.3875,
          longitude: 28.3228,
        },
      };

      await createTransport(payload);
      toast.success("Transport Created Successfully!");
      router.push("/host/listings");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create transport.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const mockUpload = (field: "registrationUrl" | "insuranceUrl" | "licenseUrl") => {
    setValue(field, `mock_url_${field}.pdf`);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Step 1: Identity */}
        {currentStep === 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-xl font-bold">Vehicle Identity</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="make"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Make</Label>
                    <Input {...field} placeholder="Toyota" />
                    {errors.make && (
                      <p className="text-destructive text-xs mt-1">{errors.make.message}</p>
                    )}
                  </div>
                )}
              />
              <Controller
                name="model"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Model</Label>
                    <Input {...field} placeholder="Camry" />
                    {errors.model && (
                      <p className="text-destructive text-xs mt-1">{errors.model.message}</p>
                    )}
                  </div>
                )}
              />
            </div>

            <Controller
              name="year"
              control={control}
              render={({ field }) => (
                <div>
                  <Label>Year</Label>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                  {errors.year && (
                    <p className="text-destructive text-xs mt-1">{errors.year.message}</p>
                  )}
                </div>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="transmission"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Transmission</Label>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                        <SelectItem value="Manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
              <Controller
                name="fuelType"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Fuel Type</Label>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gasoline">Gasoline</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Electric">Electric</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
            </div>
          </div>
        )}

        {/* Step 2: Capacity */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-xl font-bold">Capacity</h2>
            </div>
            <Controller
              name="passengers"
              control={control}
              render={({ field }) => (
                <div>
                  <Label>Passenger Capacity</Label>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </div>
              )}
            />
            <Controller
              name="largeLuggage"
              control={control}
              render={({ field }) => (
                <div>
                  <Label>Large Luggage Bags</Label>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </div>
              )}
            />
            <Controller
              name="smallLuggage"
              control={control}
              render={({ field }) => (
                <div>
                  <Label>Small Luggage Bags</Label>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </div>
              )}
            />
          </div>
        )}

        {/* Step 3: Scope */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-xl font-bold">Scope of Service</h2>
            </div>

            <Controller
              name="serviceType"
              control={control}
              render={({ field }) => (
                <div>
                  <Label className="mb-2 block">Service Type</Label>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="self-drive" id="self" />
                      <Label htmlFor="self">Self-drive</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="chauffeured" id="chauff" />
                      <Label htmlFor="chauff">Chauffeured</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="both" id="both" />
                      <Label htmlFor="both">Both</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
            />

            <Controller
              name="pricingType"
              control={control}
              render={({ field }) => (
                <div>
                  <Label className="mb-2 block mt-6">Pricing Model</Label>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="daily" id="daily" />
                      <Label htmlFor="daily">Daily Rate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="distance" id="distance" />
                      <Label htmlFor="distance">Per KM/Mile Rate</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
            />

            <div className="grid grid-cols-2 gap-4 mt-6">
              <Controller
                name="dailyRate"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Daily Rate (K)</Label>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </div>
                )}
              />
              <Controller
                name="perKmRate"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Per KM Rate (K)</Label>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </div>
                )}
              />
            </div>
          </div>
        )}

        {/* Step 4: Legal & Trust */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-xl font-bold">Legal & Trust</h2>
            </div>

            <Controller
              name="licensePlate"
              control={control}
              render={({ field }) => (
                <div>
                  <Label>License Plate Number</Label>
                  <Input {...field} />
                  {errors.licensePlate && (
                    <p className="text-destructive text-xs mt-1">{errors.licensePlate.message}</p>
                  )}
                </div>
              )}
            />

            {/* Document Upload Mocks */}
            {["registrationUrl", "insuranceUrl", "licenseUrl"].map((docName) => (
              <div
                key={docName}
                className="border p-4 rounded-xl flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">{docName}</p>
                  <p className="text-xs text-muted-foreground">Upload required document</p>
                </div>
                <Button type="button" variant="outline" onClick={() => mockUpload(docName as any)}>
                  <UploadCloud className="h-4 w-4 mr-2" /> Upload
                </Button>
              </div>
            ))}
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
              className="bg-[#D4AF37] hover:bg-[#B89430] text-[#1A0B2E] font-bold"
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
