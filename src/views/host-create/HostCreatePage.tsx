"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bed,
  Ticket,
  Bus,
  Gem,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Image,
  DollarSign,
  Users,
  Sparkles,
  Wifi,
  Waves,
  Coffee,
  UtensilsCrossed,
  Compass,
  Dumbbell,
  Bath,
  Maximize2,
  ShieldCheck,
  FileText,
  Eye,
  Send,
  X,
  Plus,
  AlertCircle,
  Clock,
  Hotel,
  Loader2,
  Landmark,
  Car,
  Wind,
  PawPrint,
  Shirt,
  Smartphone,
  Accessibility,
  BaggageClaim,
  Sun,
  TreePine,
  Tent,
  Navigation,
  Timer,
  ShieldAlert,
  Star,
  Trash2,
  GripVertical,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  INITIAL_STAY_FORM,
  INITIAL_TRANSPORT_FORM,
  INITIAL_EXPERIENCE_FORM,
  INITIAL_GEM_FORM,
  PROPERTY_TYPES,
  VEHICLE_TYPES,
  EXPERIENCE_TYPES,
  STAY_AMENITIES,
  TRANSPORT_AMENITIES,
  EXPERIENCE_INCLUSIONS,
  WHAT_TO_BRING,
  NEARBY_CATEGORIES,
  HOUSE_RULES_OPTIONS,
  CANCELLATION_POLICIES,
  DIFFICULTY_LEVELS,
  TIME_SLOT_OPTIONS,
  WEEK_DAYS,
  NEARBY_OPTIONS,
} from "@/types/listing";
import type {
  ListingType,
  StayFormData,
  TransportFormData,
  ExperienceFormData,
  GemFormData,
  NearestAttraction,
  RouteStop,
  TransportSchedule,
} from "@/types/listing";

// ─── Step Configuration ─────────────────────────────────────────────────

interface StepConfig {
  id: string;
  icon: React.ElementType;
  label: string;
  short: string;
}

const STAY_STEPS: StepConfig[] = [
  { id: "type", icon: Hotel, label: "Property Type", short: "Type" },
  { id: "property", icon: Maximize2, label: "Property Details", short: "Details" },
  { id: "location", icon: MapPin, label: "Location & Attractions", short: "Location" },
  { id: "amenities", icon: Sparkles, label: "Amenities", short: "Amenities" },
  { id: "rules", icon: ShieldCheck, label: "House Rules", short: "Rules" },
  { id: "media", icon: DollarSign, label: "Media & Pricing", short: "Pricing" },
  { id: "review", icon: Eye, label: "Review", short: "Review" },
];

const TRANSPORT_STEPS: StepConfig[] = [
  { id: "basic", icon: FileText, label: "Basic Info", short: "Info" },
  { id: "route", icon: Navigation, label: "Route", short: "Route" },
  { id: "schedule", icon: Clock, label: "Schedule", short: "Schedule" },
  { id: "vehicle", icon: Bus, label: "Vehicle & Operator", short: "Vehicle" },
  { id: "media", icon: DollarSign, label: "Media & Pricing", short: "Pricing" },
  { id: "review", icon: Eye, label: "Review", short: "Review" },
];

const EXPERIENCE_STEPS: StepConfig[] = [
  { id: "basic", icon: FileText, label: "Basic Info", short: "Info" },
  { id: "activity", icon: Ticket, label: "Activity Details", short: "Activity" },
  { id: "included", icon: UtensilsCrossed, label: "What's Included", short: "Included" },
  { id: "schedule", icon: Clock, label: "Schedule & Availability", short: "Schedule" },
  { id: "media", icon: DollarSign, label: "Media & Pricing", short: "Pricing" },
  { id: "review", icon: Eye, label: "Review", short: "Review" },
];

const GEM_STEPS: StepConfig[] = [
  { id: "basic", icon: FileText, label: "Basic Info", short: "Info" },
  { id: "location", icon: MapPin, label: "Location & Access", short: "Location" },
  { id: "discovery", icon: Gem, label: "Discovery Details", short: "Discovery" },
  { id: "tips", icon: Star, label: "Tips & Nearby", short: "Tips" },
  { id: "media", icon: Image, label: "Media", short: "Media" },
  { id: "review", icon: Eye, label: "Review", short: "Review" },
];

// ─── Listing Type Cards ─────────────────────────────────────────────────

const LISTING_TYPE_CARDS: {
  value: ListingType;
  icon: React.ElementType;
  label: string;
  desc: string;
  examples: string;
}[] = [
  {
    value: "stay",
    icon: Bed,
    label: "Stay / Accommodation",
    desc: "Hotels, lodges, camps, guesthouses, and private rentals",
    examples: "Luxury Safari Lodge, Bush Camp, Boutique Hotel",
  },
  {
    value: "experience",
    icon: Ticket,
    label: "Experience / Activity",
    desc: "Tours, safaris, classes, guided walks, and cultural activities",
    examples: "Helicopter Tour, Walking Safari, Snorkeling Trip",
  },
  {
    value: "transport",
    icon: Bus,
    label: "Transport / Route",
    desc: "Bus routes, transfers, shuttle services, and car rentals",
    examples: "Lusaka→Livingstone Bus, Airport Shuttle, Private Transfer",
  },
  {
    value: "gem",
    icon: Gem,
    label: "Hidden Gem / Spot",
    desc: "Off-the-beaten-path spots, viewpoints, waterfalls, and local secrets",
    examples: "Secret Waterfall, Sunset Viewpoint, Local Market",
  },
];

// ─── Shared UI Components ───────────────────────────────────────────────

function StepIndicator({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: StepConfig[];
}) {
  const totalSteps = steps.length;
  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      <div className="flex items-center justify-between mb-3">
        {steps.map((step, idx) => {
          const isActive = idx === currentStep;
          const isCompleted = idx < currentStep;
          return (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center gap-1.5 transition-all duration-300",
                isActive ? "opacity-100" : isCompleted ? "opacity-80" : "opacity-40",
              )}
            >
              <div
                className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110"
                    : isCompleted
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <step.icon className="h-4 w-4" />
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider hidden sm:block",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                {step.short}
              </span>
            </div>
          );
        })}
      </div>
      <Progress
        value={((currentStep + 1) / totalSteps) * 100}
        className="h-1.5 rounded-full bg-muted"
      />
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-8">
      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
      {error && (
        <p className="text-[11px] font-medium text-destructive flex items-center gap-1 mt-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}

function ChipSelect<T extends string>({
  options,
  selected,
  onChange,
  max,
}: {
  options: { value: T; label: string; icon?: React.ElementType }[];
  selected: T[];
  onChange: (value: T[]) => void;
  max?: number;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isSelected = selected.includes(opt.value);
        const atMax = max !== undefined && selected.length >= max && !isSelected;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={atMax}
            onClick={() =>
              onChange(
                isSelected
                  ? selected.filter((v) => v !== opt.value)
                  : [...selected, opt.value],
              )
            }
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200",
              isSelected
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-card border-border/50 text-muted-foreground hover:border-border hover:text-foreground",
              atMax && "opacity-30 cursor-not-allowed",
            )}
          >
            {opt.icon && <opt.icon className="h-3 w-3" />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function ImageUploader({
  images,
  onChange,
  error,
}: {
  images: string[];
  onChange: (images: string[]) => void;
  error?: string;
}) {
  return (
    <div className="space-y-3">
      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Image URLs
      </Label>
      {images.map((url, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Image className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={url}
              onChange={(e) => {
                const next = [...images];
                next[idx] = e.target.value;
                onChange(next);
              }}
              placeholder="https://images.unsplash.com/..."
              className="pl-9 h-11 rounded-xl border-border/60"
            />
          </div>
          {images.length > 1 && (
            <button
              type="button"
              onClick={() => onChange(images.filter((_, i) => i !== idx))}
              className="h-11 w-11 rounded-xl border border-border/60 flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-full text-xs font-semibold border-border/60"
        onClick={() => onChange([...images, ""])}
      >
        <Plus className="h-3.5 w-3.5 mr-1" />
        Add another image
      </Button>
      {error && (
        <p className="text-[11px] font-medium text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      {images.filter((u) => u.trim()).length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images
            .filter((u) => u.trim())
            .map((url, idx) => (
              <div
                key={idx}
                className="h-20 w-28 shrink-0 rounded-lg overflow-hidden bg-muted border border-border/50"
              >
                <img
                  src={url}
                  alt={`Preview ${idx + 1}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='112' height='80'><rect fill='%23f0f0f0' width='112' height='80'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='10'>Invalid URL</text></svg>";
                  }}
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

// ─── Nearest Attraction Input ───────────────────────────────────────────

function NearestAttractionInput({
  attractions,
  onChange,
}: {
  attractions: NearestAttraction[];
  onChange: (attractions: NearestAttraction[]) => void;
}) {
  const addAttraction = () => {
    onChange([
      ...attractions,
      { name: "", distance: "", category: "landmark" },
    ]);
  };

  const updateAttraction = (
    idx: number,
    field: keyof NearestAttraction,
    value: string,
  ) => {
    const next = attractions.map((a, i) =>
      i === idx ? { ...a, [field]: value } : a,
    );
    onChange(next);
  };

  const removeAttraction = (idx: number) => {
    onChange(attractions.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Nearest Attractions
      </Label>
      {attractions.map((attr, idx) => (
        <div
          key={idx}
          className="flex items-start gap-2 p-3 rounded-xl border border-border/40 bg-muted/20"
        >
          <div className="flex-1 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={attr.name}
                onChange={(e) => updateAttraction(idx, "name", e.target.value)}
                placeholder="Attraction name"
                className="h-9 rounded-lg border-border/60 text-sm"
              />
              <div className="relative">
                <Navigation className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={attr.distance}
                  onChange={(e) => updateAttraction(idx, "distance", e.target.value)}
                  placeholder="e.g. 2.5 km"
                  className="pl-8 h-9 rounded-lg border-border/60 text-sm"
                />
              </div>
            </div>
            <Select
              value={attr.category}
              onValueChange={(v) => updateAttraction(idx, "category", v)}
            >
              <SelectTrigger className="h-9 rounded-lg border-border/60 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NEARBY_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <button
            type="button"
            onClick={() => removeAttraction(idx)}
            className="h-9 w-9 rounded-lg border border-border/60 flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors shrink-0 mt-0"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-full text-xs font-semibold border-border/60"
        onClick={addAttraction}
      >
        <Plus className="h-3.5 w-3.5 mr-1" />
        Add attraction
      </Button>
    </div>
  );
}

// ─── Route Stop Input ──────────────────────────────────────────────────

function RouteStopInput({
  stops,
  onChange,
}: {
  stops: RouteStop[];
  onChange: (stops: RouteStop[]) => void;
}) {
  const addStop = () => {
    onChange([...stops, { name: "", arrivalTime: "", departureTime: "", notes: "" }]);
  };

  const updateStop = (idx: number, field: keyof RouteStop, value: string) => {
    const next = stops.map((s, i) => (i === idx ? { ...s, [field]: value } : s));
    onChange(next);
  };

  const removeStop = (idx: number) => {
    onChange(stops.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Intermediate Stops
      </Label>
      {stops.map((stop, idx) => (
        <div
          key={idx}
          className="flex items-start gap-2 p-3 rounded-xl border border-border/40 bg-muted/20"
        >
          <div className="flex-1 space-y-2">
            <Input
              value={stop.name}
              onChange={(e) => updateStop(idx, "name", e.target.value)}
              placeholder="Stop name (e.g. Kafue Town)"
              className="h-9 rounded-lg border-border/60 text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={stop.arrivalTime || ""}
                onChange={(e) => updateStop(idx, "arrivalTime", e.target.value)}
                placeholder="Arrival (e.g. 10:30)"
                className="h-9 rounded-lg border-border/60 text-sm"
              />
              <Input
                value={stop.departureTime || ""}
                onChange={(e) => updateStop(idx, "departureTime", e.target.value)}
                placeholder="Departure (e.g. 10:45)"
                className="h-9 rounded-lg border-border/60 text-sm"
              />
            </div>
            <Input
              value={stop.notes || ""}
              onChange={(e) => updateStop(idx, "notes", e.target.value)}
              placeholder="Notes (optional)"
              className="h-9 rounded-lg border-border/60 text-sm"
            />
          </div>
          <button
            type="button"
            onClick={() => removeStop(idx)}
            className="h-9 w-9 rounded-lg border border-border/60 flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors shrink-0 mt-0"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-full text-xs font-semibold border-border/60"
        onClick={addStop}
      >
        <Plus className="h-3.5 w-3.5 mr-1" />
        Add stop
      </Button>
    </div>
  );
}

// ─── Schedule Input ────────────────────────────────────────────────────

function ScheduleInput({
  schedule,
  onChange,
}: {
  schedule: TransportSchedule;
  onChange: (schedule: TransportSchedule) => void;
}) {
  const updateSched = (field: keyof TransportSchedule, value: unknown) => {
    onChange({ ...schedule, [field]: value });
  };

  return (
    <div className="space-y-4">
      <FormField label="Frequency">
        <Select
          value={schedule.frequency}
          onValueChange={(v) => updateSched("frequency", v)}
        >
          <SelectTrigger className="h-11 rounded-xl border-border/60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly (certain days)</SelectItem>
            <SelectItem value="custom">Custom Schedule</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      {schedule.frequency === "weekly" && (
        <FormField label="Days of Week">
          <ChipSelect
            options={WEEK_DAYS.map((d) => ({ value: d, label: d }))}
            selected={schedule.daysOfWeek || []}
            onChange={(days) => updateSched("daysOfWeek", days)}
          />
        </FormField>
      )}

      <FormField label="Departure Times">
        <div className="space-y-2">
          {schedule.departureTimes.map((time, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Input
                type="time"
                value={time}
                onChange={(e) => {
                  const next = [...schedule.departureTimes];
                  next[idx] = e.target.value;
                  updateSched("departureTimes", next);
                }}
                className="h-10 rounded-xl border-border/60 w-40"
              />
              {schedule.departureTimes.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    updateSched(
                      "departureTimes",
                      schedule.departureTimes.filter((_, i) => i !== idx),
                    )
                  }
                  className="h-10 w-10 rounded-xl border border-border/60 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full text-xs font-semibold border-border/60"
            onClick={() =>
              updateSched("departureTimes", [...schedule.departureTimes, "12:00"])
            }
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add departure time
          </Button>
        </div>
      </FormField>

      <FormField label="Seasonal Notes (optional)">
        <Textarea
          value={schedule.seasonalNotes || ""}
          onChange={(e) => updateSched("seasonalNotes", e.target.value)}
          placeholder="e.g. Reduced frequency during rainy season (Nov-Mar)"
          rows={2}
          className="rounded-xl border-border/60 resize-none"
        />
      </FormField>
    </div>
  );
}

// ─── Validation ─────────────────────────────────────────────────────────

type ValidationErrors = Record<string, string>;

function validateStayStep(
  step: number,
  form: StayFormData,
): ValidationErrors {
  const errs: ValidationErrors = {};
  switch (step) {
    case 0:
      if (!form.propertyType) errs.propertyType = "Select a property type";
      if (!form.name.trim()) errs.name = "Name is required";
      if (!form.description.trim()) errs.description = "Description is required";
      break;
    case 1:
      if (form.bedrooms < 1) errs.bedrooms = "At least 1 bedroom";
      if (form.beds < 1) errs.beds = "At least 1 bed";
      if (form.baths < 1) errs.baths = "At least 1 bathroom";
      if (form.maxGuests < 1) errs.maxGuests = "At least 1 guest";
      break;
    case 2:
      if (!form.location.trim()) errs.location = "Location is required";
      for (let i = 0; i < form.nearestAttractions.length; i++) {
        if (!form.nearestAttractions[i].name.trim())
          errs[`attr-${i}-name`] = "Attraction name required";
        if (!form.nearestAttractions[i].distance.trim())
          errs[`attr-${i}-dist`] = "Distance required";
      }
      break;
    case 5:
      if (form.images.filter((u) => u.trim()).length === 0)
        errs.images = "At least one image required";
      if (form.pricePerNight <= 0)
        errs.pricePerNight = "Price is required";
      break;
  }
  return errs;
}

function validateTransportStep(
  step: number,
  form: TransportFormData,
): ValidationErrors {
  const errs: ValidationErrors = {};
  switch (step) {
    case 0:
      if (!form.name.trim()) errs.name = "Name is required";
      if (!form.description.trim()) errs.description = "Description is required";
      break;
    case 1:
      if (!form.from.trim()) errs.from = "Departure required";
      if (!form.to.trim()) errs.to = "Destination required";
      break;
    case 2:
      if (!form.duration.trim()) errs.duration = "Duration required";
      if (form.schedule.departureTimes.length === 0)
        errs.departureTimes = "At least one departure time required";
      break;
    case 3:
      if (!form.vehicleType) errs.vehicleType = "Vehicle type required";
      if (form.capacity < 1) errs.capacity = "Capacity required";
      if (!form.operatorName.trim()) errs.operatorName = "Operator name required";
      if (!form.operatorContact.trim()) errs.operatorContact = "Contact required";
      break;
    case 4:
      if (form.images.filter((u) => u.trim()).length === 0) errs.images = "At least one image required";
      if (form.pricePerSeat <= 0) errs.pricePerSeat = "Price is required";
      break;
  }
  return errs;
}

function validateExperienceStep(
  step: number,
  form: ExperienceFormData,
): ValidationErrors {
  const errs: ValidationErrors = {};
  switch (step) {
    case 0:
      if (!form.name.trim()) errs.name = "Name is required";
      if (!form.description.trim()) errs.description = "Description is required";
      break;
    case 1:
      if (!form.activityType) errs.activityType = "Activity type required";
      if (!form.duration.trim()) errs.duration = "Duration required";
      if (form.maxParticipants < 1) errs.maxParticipants = "At least 1 participant";
      break;
    case 2:
      if (!form.meetingPoint.trim()) errs.meetingPoint = "Meeting point required";
      break;
    case 3:
      if (form.timeSlots.length === 0) errs.timeSlots = "At least one time slot required";
      break;
    case 4:
      if (form.images.filter((u) => u.trim()).length === 0) errs.images = "At least one image required";
      if (form.pricePerPerson <= 0) errs.pricePerPerson = "Price is required";
      break;
  }
  return errs;
}

function validateGemStep(
  step: number,
  form: GemFormData,
): ValidationErrors {
  const errs: ValidationErrors = {};
  switch (step) {
    case 0:
      if (!form.name.trim()) errs.name = "Name is required";
      if (!form.description.trim()) errs.description = "Description is required";
      break;
    case 1:
      if (!form.location.trim()) errs.location = "Location required";
      if (!form.directions.trim()) errs.directions = "Directions required";
      if (!form.accessibility.trim()) errs.accessibility = "Accessibility info required";
      break;
    case 2:
      if (!form.bestTimeToVisit.trim()) errs.bestTimeToVisit = "Best time required";
      if (!form.whatMakesItSpecial.trim()) errs.whatMakesItSpecial = "This field is required";
      if (!form.recommendedDuration.trim()) errs.recommendedDuration = "Duration required";
      break;
    case 4:
      if (form.images.filter((u) => u.trim()).length === 0) errs.images = "At least one image required";
      break;
  }
  return errs;
}

// ─── Main Component ─────────────────────────────────────────────────────

export function HostCreatePage() {
  const router = useRouter();

  // ─── State ─────────────────────────────────────────────────────────

  const [listingType, setListingType] = useState<ListingType | null>(null);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const [stayForm, setStayForm] = useState<StayFormData>(INITIAL_STAY_FORM);
  const [transportForm, setTransportForm] = useState<TransportFormData>(INITIAL_TRANSPORT_FORM);
  const [experienceForm, setExperienceForm] = useState<ExperienceFormData>(INITIAL_EXPERIENCE_FORM);
  const [gemForm, setGemForm] = useState<GemFormData>(INITIAL_GEM_FORM);

  // ─── Derived ───────────────────────────────────────────────────────

  const steps = listingType === "stay"
    ? STAY_STEPS
    : listingType === "transport"
      ? TRANSPORT_STEPS
      : listingType === "experience"
        ? EXPERIENCE_STEPS
        : listingType === "gem"
          ? GEM_STEPS
          : [];

  const totalSteps = steps.length;

  // ─── Validation ────────────────────────────────────────────────────

  const validateStep = useCallback((): boolean => {
    if (!listingType) {
      setErrors({ type: "Please select a listing type" });
      return false;
    }
    let errs: ValidationErrors = {};
    switch (listingType) {
      case "stay":
        errs = validateStayStep(step, stayForm);
        break;
      case "transport":
        errs = validateTransportStep(step, transportForm);
        break;
      case "experience":
        errs = validateExperienceStep(step, experienceForm);
        break;
      case "gem":
        errs = validateGemStep(step, gemForm);
        break;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [listingType, step, stayForm, transportForm, experienceForm, gemForm]);

  // ─── Navigation ────────────────────────────────────────────────────

  const goNext = useCallback(() => {
    if (validateStep()) {
      setStep((s) => Math.min(s + 1, totalSteps - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [validateStep, totalSteps]);

  const goBack = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const selectType = useCallback((type: ListingType) => {
    setListingType(type);
    setStep(0);
    setErrors({});
  }, []);

  // ─── Submit ────────────────────────────────────────────────────────

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success("Listing created successfully!", {
      description: "Your listing is now live and visible to travelers.",
    });
    setSubmitting(false);
    router.push("/host");
  }, [router]);

  // ═══════════════════════════════════════════════════════════════════
  //  STAY FORM RENDERERS
  // ═══════════════════════════════════════════════════════════════════

  const renderStayStep = () => {
    switch (step) {
      case 0: return renderStayType();
      case 1: return renderStayProperty();
      case 2: return renderStayLocation();
      case 3: return renderStayAmenities();
      case 4: return renderStayRules();
      case 5: return renderStayMedia();
      case 6: return renderStayReview();
      default: return null;
    }
  };

  function renderStayType() {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
        <SectionTitle
          icon={Hotel}
          title="Property Type & Basic Info"
          subtitle="Tell guests what kind of accommodation you're offering"
        />
        <FormField label="Property Type" error={errors.propertyType}>
          <Select
            value={stayForm.propertyType}
            onValueChange={(v) => setStayForm((f) => ({ ...f, propertyType: v }))}
          >
            <SelectTrigger className="h-11 rounded-xl border-border/60">
              <SelectValue placeholder="Select property type..." />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map((pt) => (
                <SelectItem key={pt.value} value={pt.value}>
                  {pt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Listing Name" error={errors.name}>
          <Input
            value={stayForm.name}
            onChange={(e) => setStayForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Luxury Safari Lodge"
            className="h-11 rounded-xl border-border/60"
          />
        </FormField>
        <FormField label="Description" error={errors.description}>
          <Textarea
            value={stayForm.description}
            onChange={(e) => setStayForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Describe your property — what makes it special, what guests can expect..."
            rows={4}
            className="rounded-xl border-border/60 resize-none"
          />
        </FormField>
      </div>
    );
  }

  function renderStayProperty() {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
        <SectionTitle
          icon={Maximize2}
          title="Property Details"
          subtitle="Tell guests about the space"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <FormField label="Bedrooms" error={errors.bedrooms}>
            <Input
              type="number"
              min={1}
              value={stayForm.bedrooms}
              onChange={(e) => setStayForm((f) => ({ ...f, bedrooms: Number(e.target.value) || 1 }))}
              className="h-11 rounded-xl border-border/60"
            />
          </FormField>
          <FormField label="Beds" error={errors.beds}>
            <Input
              type="number"
              min={1}
              value={stayForm.beds}
              onChange={(e) => setStayForm((f) => ({ ...f, beds: Number(e.target.value) || 1 }))}
              className="h-11 rounded-xl border-border/60"
            />
          </FormField>
          <FormField label="Bathrooms" error={errors.baths}>
            <Input
              type="number"
              min={1}
              value={stayForm.baths}
              onChange={(e) => setStayForm((f) => ({ ...f, baths: Number(e.target.value) || 1 }))}
              className="h-11 rounded-xl border-border/60"
            />
          </FormField>
          <FormField label="Max Guests" error={errors.maxGuests}>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                min={1}
                value={stayForm.maxGuests}
                onChange={(e) => setStayForm((f) => ({ ...f, maxGuests: Number(e.target.value) || 1 }))}
                className="pl-9 h-11 rounded-xl border-border/60"
              />
            </div>
          </FormField>
          <FormField label="Size (sq ft)">
            <div className="relative">
              <Maximize2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                min={0}
                value={stayForm.sqft || ""}
                onChange={(e) => setStayForm((f) => ({ ...f, sqft: Number(e.target.value) || 0 }))}
                placeholder="e.g. 420"
                className="pl-9 h-11 rounded-xl border-border/60"
              />
            </div>
          </FormField>
        </div>
      </div>
    );
  }

  function renderStayLocation() {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
        <SectionTitle
          icon={MapPin}
          title="Location & Nearby Attractions"
          subtitle="Let guests know what's nearby — with distances"
        />
        <FormField label="Property Location" error={errors.location}>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={stayForm.location}
              onChange={(e) => setStayForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="e.g. Lower Zambezi, Livingstone, Lusaka"
              className="pl-9 h-11 rounded-xl border-border/60"
            />
          </div>
        </FormField>
        <NearestAttractionInput
          attractions={stayForm.nearestAttractions}
          onChange={(attrs) => setStayForm((f) => ({ ...f, nearestAttractions: attrs }))}
        />
        {errors["attr-0-name"] && (
          <p className="text-[11px] font-medium text-destructive">{errors["attr-0-name"]}</p>
        )}
      </div>
    );
  }

  function renderStayAmenities() {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
        <SectionTitle
          icon={Sparkles}
          title="Amenities"
          subtitle="Select what your property offers"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {STAY_AMENITIES.map((amenity) => {
            const selected = stayForm.amenities.includes(amenity.value);
            return (
              <button
                key={amenity.value}
                type="button"
                onClick={() =>
                  setStayForm((f) => ({
                    ...f,
                    amenities: selected
                      ? f.amenities.filter((a) => a !== amenity.value)
                      : [...f.amenities, amenity.value],
                  }))
                }
                className={cn(
                  "flex items-center gap-2.5 p-3 rounded-xl border text-sm font-medium transition-all duration-200",
                  selected
                    ? "border-primary/40 bg-primary/5 text-primary shadow-sm"
                    : "border-border/50 bg-card text-muted-foreground hover:border-border hover:text-foreground",
                )}
              >
                <amenity.icon className={cn("h-4 w-4", selected ? "text-primary" : "text-muted-foreground")} />
                <span className="text-xs">{amenity.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  function renderStayRules() {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
        <SectionTitle
          icon={ShieldCheck}
          title="House Rules & Policies"
          subtitle="Set expectations for your guests"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Check-in From">
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                value={stayForm.checkInFrom}
                onChange={(e) => setStayForm((f) => ({ ...f, checkInFrom: e.target.value }))}
                className="pl-9 h-11 rounded-xl border-border/60"
              />
            </div>
          </FormField>
          <FormField label="Check-in Until">
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                value={stayForm.checkInUntil}
                onChange={(e) => setStayForm((f) => ({ ...f, checkInUntil: e.target.value }))}
                className="pl-9 h-11 rounded-xl border-border/60"
              />
            </div>
          </FormField>
          <FormField label="Check-out Before">
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                value={stayForm.checkOutBefore}
                onChange={(e) => setStayForm((f) => ({ ...f, checkOutBefore: e.target.value }))}
                className="pl-9 h-11 rounded-xl border-border/60"
              />
            </div>
          </FormField>
          <FormField label="Cancellation Policy">
            <Select
              value={stayForm.cancellationPolicy}
              onValueChange={(v) =>
                setStayForm((f) => ({ ...f, cancellationPolicy: v as "flexible" | "moderate" | "strict" }))
              }
            >
              <SelectTrigger className="h-11 rounded-xl border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CANCELLATION_POLICIES.map((cp) => (
                  <SelectItem key={cp.value} value={cp.value}>
                    {cp.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {stayForm.cancellationPolicy && (
              <p className="text-[11px] text-muted-foreground mt-1">
                {CANCELLATION_POLICIES.find((cp) => cp.value === stayForm.cancellationPolicy)?.desc}
              </p>
            )}
          </FormField>
        </div>

        <FormField label="House Rules">
          <ChipSelect
            options={HOUSE_RULES_OPTIONS.map((r) => ({ value: r.value, label: r.label }))}
            selected={stayForm.houseRules}
            onChange={(rules) => setStayForm((f) => ({ ...f, houseRules: rules }))}
          />
        </FormField>
      </div>
    );
  }

  function renderStayMedia() {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
        <SectionTitle
          icon={DollarSign}
          title="Photos & Pricing"
          subtitle="Add photos and set your nightly rate"
        />
        <ImageUploader
          images={stayForm.images}
          onChange={(imgs) => setStayForm((f) => ({ ...f, images: imgs }))}
          error={errors.images}
        />
        <div className="h-px bg-border/40" />
        <FormField label="Price per Night (K)" error={errors.pricePerNight}>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              min={1}
              value={stayForm.pricePerNight || ""}
              onChange={(e) => setStayForm((f) => ({ ...f, pricePerNight: Number(e.target.value) || 0 }))}
              placeholder="e.g. 450"
              className="pl-9 h-11 rounded-xl border-border/60"
            />
          </div>
        </FormField>
      </div>
    );
  }

  function renderStayReview() {
    const f = stayForm;
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-8">
        <SectionTitle icon={Eye} title="Review Your Stay Listing" subtitle="Double-check everything" />
        <div className="flex items-center gap-3 pb-6 border-b border-border/40">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Bed className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{f.name}</h3>
            <p className="text-sm text-muted-foreground capitalize">{f.propertyType.replace(/-/g, " ")} · {f.location}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Details</h4>
            <div className="space-y-2 text-sm">
              <DetailRow icon={Bed} label="Bedrooms" value={String(f.bedrooms)} />
              <DetailRow icon={Bed} label="Beds" value={String(f.beds)} />
              <DetailRow icon={Bath} label="Baths" value={String(f.baths)} />
              <DetailRow icon={Users} label="Max Guests" value={String(f.maxGuests)} />
              {f.sqft > 0 && <DetailRow icon={Maximize2} label="Size" value={`${f.sqft} sq ft`} />}
              <DetailRow icon={DollarSign} label="Price" value={`K${f.pricePerNight}/night`} />
            </div>
          </div>
          {f.nearestAttractions.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Nearby Attractions</h4>
              <div className="space-y-1.5">
                {f.nearestAttractions.map((attr, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                    <span className="text-muted-foreground">{attr.name}</span>
                    <span className="font-semibold text-foreground ml-auto">{attr.distance}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {f.amenities.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Amenities</h4>
            <div className="flex flex-wrap gap-1.5">
              {f.amenities.map((a) => (
                <Badge key={a} variant="secondary" className="rounded-full text-[10px] font-semibold capitalize">
                  {a.replace(/-/g, " ")}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {f.houseRules.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">House Rules</h4>
            <div className="flex flex-wrap gap-1.5">
              {f.houseRules.map((r) => (
                <Badge key={r} variant="outline" className="rounded-full text-[10px] font-medium capitalize">
                  {r.replace(/-/g, " ")}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <div className="space-y-2">
          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Check-in/Out</h4>
          <p className="text-sm text-muted-foreground">
            Check-in: {f.checkInFrom}–{f.checkInUntil} · Check-out: before {f.checkOutBefore}
          </p>
          <p className="text-sm text-muted-foreground">
            Cancellation: {CANCELLATION_POLICIES.find((cp) => cp.value === f.cancellationPolicy)?.label}
          </p>
        </div>
        {renderDescription(f.description)}
        {renderImages(f.images)}
        {renderSubmit()}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  TRANSPORT FORM RENDERERS
  // ═══════════════════════════════════════════════════════════════════

  const renderTransportStep = () => {
    switch (step) {
      case 0: return renderTransportBasic();
      case 1: return renderTransportRoute();
      case 2: return renderTransportSchedule();
      case 3: return renderTransportVehicle();
      case 4: return renderTransportMedia();
      case 5: return renderTransportReview();
      default: return null;
    }
  };

  function renderTransportBasic() {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
        <SectionTitle icon={FileText} title="Basic Info" subtitle="Tell travelers about your transport service" />
        <FormField label="Service Name" error={errors.name}>
          <Input
            value={transportForm.name}
            onChange={(e) => setTransportForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Lusaka to Livingstone Express Bus"
            className="h-11 rounded-xl border-border/60"
          />
        </FormField>
        <FormField label="Description" error={errors.description}>
          <Textarea
            value={transportForm.description}
            onChange={(e) => setTransportForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Describe your service — comfort level, highlights of the journey..."
            rows={4}
            className="rounded-xl border-border/60 resize-none"
          />
        </FormField>
      </div>
    );
  }

  function renderTransportRoute() {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
        <SectionTitle icon={Navigation} title="Route" subtitle="Where does this service start and end?" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Departure Location" error={errors.from}>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={transportForm.from}
                onChange={(e) => setTransportForm((f) => ({ ...f, from: e.target.value }))}
                placeholder="e.g. Lusaka"
                className="pl-9 h-11 rounded-xl border-border/60"
              />
            </div>
          </FormField>
          <FormField label="Destination" error={errors.to}>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={transportForm.to}
                onChange={(e) => setTransportForm((f) => ({ ...f, to: e.target.value }))}
                placeholder="e.g. Livingstone"
                className="pl-9 h-11 rounded-xl border-border/60"
              />
            </div>
          </FormField>
        </div>
        <RouteStopInput
          stops={transportForm.stops}
          onChange={(stops) => setTransportForm((f) => ({ ...f, stops }))}
        />
      </div>
    );
  }

  function renderTransportSchedule() {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
        <SectionTitle icon={Clock} title="Schedule & Duration" subtitle="When does this service run?" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Journey Duration" error={errors.duration}>
            <div className="relative">
              <Timer className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={transportForm.duration}
                onChange={(e) => setTransportForm((f) => ({ ...f, duration: e.target.value }))}
                placeholder="e.g. 6h 30m"
                className="pl-9 h-11 rounded-xl border-border/60"
              />
            </div>
          </FormField>
          <FormField label="Booking Lead Time">
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={transportForm.bookingLeadTime}
                onChange={(e) => setTransportForm((f) => ({ ...f, bookingLeadTime: e.target.value }))}
                placeholder="e.g. 1 hour before"
                className="pl-9 h-11 rounded-xl border-border/60"
              />
            </div>
          </FormField>
        </div>
        <ScheduleInput
          schedule={transportForm.schedule}
          onChange={(sched) => setTransportForm((f) => ({ ...f, schedule: sched }))}
        />
      </div>
    );
  }

  function renderTransportVehicle() {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
        <SectionTitle icon={Bus} title="Vehicle & Operator" subtitle="Tell travelers about the vehicle and who runs it" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Vehicle Type" error={errors.vehicleType}>
            <Select
              value={transportForm.vehicleType}
              onValueChange={(v) => setTransportForm((f) => ({ ...f, vehicleType: v }))}
            >
              <SelectTrigger className="h-11 rounded-xl border-border/60">
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent>
                {VEHICLE_TYPES.map((vt) => (
                  <SelectItem key={vt.value} value={vt.value}>
                    {vt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Capacity (seats)" error={errors.capacity}>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                min={1}
                value={transportForm.capacity}
                onChange={(e) => setTransportForm((f) => ({ ...f, capacity: Number(e.target.value) || 1 }))}
                className="pl-9 h-11 rounded-xl border-border/60"
              />
            </div>
          </FormField>
          <FormField label="Operator Name" error={errors.operatorName}>
            <Input
              value={transportForm.operatorName}
              onChange={(e) => setTransportForm((f) => ({ ...f, operatorName: e.target.value }))}
              placeholder="e.g. Zambia Bus Lines"
              className="h-11 rounded-xl border-border/60"
            />
          </FormField>
          <FormField label="Operator Contact" error={errors.operatorContact}>
            <div className="relative">
              <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={transportForm.operatorContact}
                onChange={(e) => setTransportForm((f) => ({ ...f, operatorContact: e.target.value }))}
                placeholder="e.g. +260 97 XXX XXXX"
                className="pl-9 h-11 rounded-xl border-border/60"
              />
            </div>
          </FormField>
        </div>
        <FormField label="Vehicle Amenities">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TRANSPORT_AMENITIES.map((amenity) => {
              const selected = transportForm.vehicleAmenities.includes(amenity.value);
              return (
                <button
                  key={amenity.value}
                  type="button"
                  onClick={() =>
                    setTransportForm((f) => ({
                      ...f,
                      vehicleAmenities: selected
                        ? f.vehicleAmenities.filter((a) => a !== amenity.value)
                        : [...f.vehicleAmenities, amenity.value],
                    }))
                  }
                  className={cn(
                    "flex items-center gap-2.5 p-3 rounded-xl border text-sm font-medium transition-all duration-200",
                    selected
                      ? "border-primary/40 bg-primary/5 text-primary shadow-sm"
                      : "border-border/50 bg-card text-muted-foreground hover:border-border hover:text-foreground",
                  )}
                >
                  <amenity.icon className={cn("h-4 w-4", selected ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-xs">{amenity.label}</span>
                </button>
              );
            })}
          </div>
        </FormField>
      </div>
    );
  }

  function renderTransportMedia() {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
        <SectionTitle icon={DollarSign} title="Photos & Pricing" subtitle="Add photos and set your price per seat" />
        <ImageUploader
          images={transportForm.images}
          onChange={(imgs) => setTransportForm((f) => ({ ...f, images: imgs }))}
          error={errors.images}
        />
        <div className="h-px bg-border/40" />
        <FormField label="Price per Seat (K)" error={errors.pricePerSeat}>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              min={1}
              value={transportForm.pricePerSeat || ""}
              onChange={(e) => setTransportForm((f) => ({ ...f, pricePerSeat: Number(e.target.value) || 0 }))}
              placeholder="e.g. 250"
              className="pl-9 h-11 rounded-xl border-border/60"
            />
          </div>
        </FormField>
      </div>
    );
  }

  function renderTransportReview() {
    const f = transportForm;
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-8">
        <SectionTitle icon={Eye} title="Review Your Transport Listing" subtitle="Double-check everything" />
        <div className="flex items-center gap-3 pb-6 border-b border-border/40">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Bus className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{f.name}</h3>
            <p className="text-sm text-muted-foreground">{f.from} → {f.to}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Route</h4>
            <div className="space-y-2 text-sm">
              <DetailRow icon={Navigation} label="Route" value={`${f.from} → ${f.to}`} />
              <DetailRow icon={Timer} label="Duration" value={f.duration} />
              <DetailRow icon={Users} label="Capacity" value={String(f.capacity)} />
              <DetailRow icon={DollarSign} label="Price" value={`K${f.pricePerSeat}/seat`} />
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Operator</h4>
            <div className="space-y-2 text-sm">
              <DetailRow icon={ShieldCheck} label="Name" value={f.operatorName} />
              <DetailRow icon={Smartphone} label="Contact" value={f.operatorContact} />
              <DetailRow icon={Clock} label="Lead Time" value={f.bookingLeadTime} />
            </div>
          </div>
        </div>
        {f.stops.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Stops ({f.stops.length})</h4>
            <div className="space-y-1">
              {f.stops.map((stop, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                  <span className="font-medium">{stop.name}</span>
                  {stop.arrivalTime && <span className="text-muted-foreground text-xs">arr: {stop.arrivalTime}</span>}
                  {stop.departureTime && <span className="text-muted-foreground text-xs">dep: {stop.departureTime}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
        {f.vehicleAmenities.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Amenities</h4>
            <div className="flex flex-wrap gap-1.5">
              {f.vehicleAmenities.map((a) => (
                <Badge key={a} variant="secondary" className="rounded-full text-[10px] font-semibold capitalize">
                  {a.replace(/-/g, " ")}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <div className="space-y-2">
          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Schedule</h4>
          <p className="text-sm text-muted-foreground">
            {f.schedule.frequency === "daily" ? "Daily departures" :
             f.schedule.frequency === "weekly" ? `Weekly on ${(f.schedule.daysOfWeek || []).join(", ")}` :
             "Custom schedule"}
            {" · "}Times: {f.schedule.departureTimes.join(", ")}
          </p>
        </div>
        {renderDescription(f.description)}
        {renderImages(f.images)}
        {renderSubmit()}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  EXPERIENCE FORM RENDERERS
  // ═══════════════════════════════════════════════════════════════════

  const renderExperienceStep = () => {
    switch (step) {
      case 0: return renderExperienceBasic();
      case 1: return renderExperienceActivity();
      case 2: return renderExperienceIncluded();
      case 3: return renderExperienceSchedule();
      case 4: return renderExperienceMedia();
      case 5: return renderExperienceReview();
      default: return null;
    }
  };

  function renderExperienceBasic() {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
        <SectionTitle icon={FileText} title="Basic Info" subtitle="Tell travelers about your experience" />
        <FormField label="Experience Name" error={errors.name}>
          <Input
            value={experienceForm.name}
            onChange={(e) => setExperienceForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Victoria Falls Helicopter Tour"
            className="h-11 rounded-xl border-border/60"
          />
        </FormField>
        <FormField label="Description" error={errors.description}>
          <Textarea
            value={experienceForm.description}
            onChange={(e) => setExperienceForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Describe the experience — what makes it special, what travelers will see and do..."
            rows={4}
            className="rounded-xl border-border/60 resize-none"
          />
        </FormField>
      </div>
    );
  }

  function renderExperienceActivity() {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
        <SectionTitle icon={Ticket} title="Activity Details" subtitle="What kind of experience is it?" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Activity Type" error={errors.activityType}>
            <Select
              value={experienceForm.activityType}
              onValueChange={(v) => setExperienceForm((f) => ({ ...f, activityType: v }))}
            >
              <SelectTrigger className="h-11 rounded-xl border-border/60">
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent>
                {EXPERIENCE_TYPES.map((et) => (
                  <SelectItem key={et.value} value={et.value}>
                    {et.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Language">
            <Input
              value={experienceForm.language}
              onChange={(e) => setExperienceForm((f) => ({ ...f, language: e.target.value }))}
              placeholder="e.g. English"
              className="h-11 rounded-xl border-border/60"
            />
          </FormField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField label="Duration" error={errors.duration}>
            <div className="relative">
              <Timer className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={experienceForm.duration}
                onChange={(e) => setExperienceForm((f) => ({ ...f, duration: e.target.value }))}
                placeholder="e.g. 3 hours"
                className="pl-9 h-11 rounded-xl border-border/60"
              />
            </div>
          </FormField>
          <FormField label="Max Participants" error={errors.maxParticipants}>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                min={1}
                value={experienceForm.maxParticipants}
                onChange={(e) => setExperienceForm((f) => ({ ...f, maxParticipants: Number(e.target.value) || 1 }))}
                className="pl-9 h-11 rounded-xl border-border/60"
              />
            </div>
          </FormField>
          <FormField label="Difficulty Level">
            <Select
              value={experienceForm.difficultyLevel}
              onValueChange={(v) => setExperienceForm((f) => ({ ...f, difficultyLevel: v as "easy" | "moderate" | "challenging" }))}
            >
              <SelectTrigger className="h-11 rounded-xl border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTY_LEVELS.map((dl) => (
                  <SelectItem key={dl.value} value={dl.value}>
                    {dl.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {experienceForm.difficultyLevel && (
              <p className="text-[11px] text-muted-foreground mt-1">
                {DIFFICULTY_LEVELS.find((dl) => dl.value === experienceForm.difficultyLevel)?.desc}
              </p>
            )}
          </FormField>
        </div>
        <FormField label="Age Restrictions (optional)">
          <Input
            value={experienceForm.ageRestrictions}
            onChange={(e) => setExperienceForm((f) => ({ ...f, ageRestrictions: e.target.value }))}
            placeholder="e.g. Minimum age 12, All ages welcome"
            className="h-11 rounded-xl border-border/60"
          />
        </FormField>
      </div>
    );
  }

  function renderExperienceIncluded() {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
        <SectionTitle icon={UtensilsCrossed} title="What's Included" subtitle="Let travelers know what's provided and what to bring" />
        <FormField label="What's Included">
          <ChipSelect
            options={EXPERIENCE_INCLUSIONS.map((i) => ({ value: i.value, label: i.label }))}
            selected={experienceForm.whatsIncluded}
            onChange={(vals) => setExperienceForm((f) => ({ ...f, whatsIncluded: vals }))}
          />
        </FormField>
        <FormField label="What to Bring">
          <ChipSelect
            options={WHAT_TO_BRING.map((i) => ({ value: i.value, label: i.label }))}
            selected={experienceForm.whatToBring}
            onChange={(vals) => setExperienceForm((f) => ({ ...f, whatToBring: vals }))}
          />
        </FormField>
        <FormField label="Meeting Point" error={errors.meetingPoint}>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={experienceForm.meetingPoint}
              onChange={(e) => setExperienceForm((f) => ({ ...f, meetingPoint: e.target.value }))}
              placeholder="e.g. Victoria Falls Hotel Lobby"
              className="pl-9 h-11 rounded-xl border-border/60"
            />
          </div>
        </FormField>
      </div>
    );
  }

  function renderExperienceSchedule() {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
        <SectionTitle icon={Clock} title="Schedule & Availability" subtitle="When is this experience available?" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Available Dates">
            <Input
              value={experienceForm.availableDates}
              onChange={(e) => setExperienceForm((f) => ({ ...f, availableDates: e.target.value }))}
              placeholder="e.g. Year-round, Jun-Oct"
              className="h-11 rounded-xl border-border/60"
            />
          </FormField>
          <FormField label="Booking Lead Time">
            <Input
              value={experienceForm.bookingLeadTime}
              onChange={(e) => setExperienceForm((f) => ({ ...f, bookingLeadTime: e.target.value }))}
              placeholder="e.g. 24 hours in advance"
              className="h-11 rounded-xl border-border/60"
            />
          </FormField>
        </div>
        <FormField label="Available Time Slots" error={errors.timeSlots}>
          <div className="flex flex-wrap gap-2">
            {TIME_SLOT_OPTIONS.map((slot) => {
              const selected = experienceForm.timeSlots.includes(slot.value);
              return (
                <button
                  key={slot.value}
                  type="button"
                  onClick={() =>
                    setExperienceForm((f) => ({
                      ...f,
                      timeSlots: selected
                        ? f.timeSlots.filter((t) => t !== slot.value)
                        : [...f.timeSlots, slot.value],
                    }))
                  }
                  className={cn(
                    "px-3 py-2 rounded-xl border text-xs font-semibold transition-all duration-200",
                    selected
                      ? "border-primary/40 bg-primary/5 text-primary"
                      : "border-border/50 bg-card text-muted-foreground hover:border-border",
                  )}
                >
                  {slot.label}
                </button>
              );
            })}
          </div>
        </FormField>
        <FormField label="Seasonal Notes (optional)">
          <Textarea
            value={experienceForm.seasonalNotes}
            onChange={(e) => setExperienceForm((f) => ({ ...f, seasonalNotes: e.target.value }))}
            placeholder="e.g. Not available during rainy season"
            rows={2}
            className="rounded-xl border-border/60 resize-none"
          />
        </FormField>
      </div>
    );
  }

  function renderExperienceMedia() {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
        <SectionTitle icon={DollarSign} title="Photos & Pricing" subtitle="Add photos and set pricing" />
        <ImageUploader
          images={experienceForm.images}
          onChange={(imgs) => setExperienceForm((f) => ({ ...f, images: imgs }))}
          error={errors.images}
        />
        <div className="h-px bg-border/40" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Price per Person (K)" error={errors.pricePerPerson}>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                min={1}
                value={experienceForm.pricePerPerson || ""}
                onChange={(e) => setExperienceForm((f) => ({ ...f, pricePerPerson: Number(e.target.value) || 0 }))}
                placeholder="e.g. 180"
                className="pl-9 h-11 rounded-xl border-border/60"
              />
            </div>
          </FormField>
          <FormField label="Group Price (optional)">
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                min={0}
                value={experienceForm.groupPrice || ""}
                onChange={(e) => setExperienceForm((f) => ({ ...f, groupPrice: Number(e.target.value) || 0 }))}
                placeholder="e.g. 1500 (for group of 10+)"
                className="pl-9 h-11 rounded-xl border-border/60"
              />
            </div>
          </FormField>
        </div>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={experienceForm.privateOption}
            onChange={(e) => setExperienceForm((f) => ({ ...f, privateOption: e.target.checked }))}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-sm font-medium text-foreground">Offer private booking option</span>
        </label>
      </div>
    );
  }

  function renderExperienceReview() {
    const f = experienceForm;
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-8">
        <SectionTitle icon={Eye} title="Review Your Experience Listing" subtitle="Double-check everything" />
        <div className="flex items-center gap-3 pb-6 border-b border-border/40">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Ticket className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{f.name}</h3>
            <p className="text-sm text-muted-foreground">{f.activityType?.replace(/-/g, " ")} · {f.duration}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Details</h4>
            <div className="space-y-2 text-sm">
              <DetailRow icon={Ticket} label="Type" value={EXPERIENCE_TYPES.find((et) => et.value === f.activityType)?.label || f.activityType} />
              <DetailRow icon={Timer} label="Duration" value={f.duration} />
              <DetailRow icon={Users} label="Max" value={String(f.maxParticipants)} />
              <DetailRow icon={ShieldCheck} label="Difficulty" value={DIFFICULTY_LEVELS.find((dl) => dl.value === f.difficultyLevel)?.label || f.difficultyLevel} />
              <DetailRow icon={MapPin} label="Meeting" value={f.meetingPoint} />
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Pricing</h4>
            <div className="space-y-2 text-sm">
              <DetailRow icon={DollarSign} label="Per Person" value={`K${f.pricePerPerson}`} />
              {f.groupPrice && f.groupPrice > 0 && <DetailRow icon={Users} label="Group" value={`K${f.groupPrice}`} />}
              {f.privateOption && <DetailRow icon={Star} label="Private Option" value="Available" />}
            </div>
          </div>
        </div>
        {f.whatsIncluded.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Included</h4>
            <div className="flex flex-wrap gap-1.5">
              {f.whatsIncluded.map((i) => (
                <Badge key={i} variant="secondary" className="rounded-full text-[10px]">{i.replace(/-/g, " ")}</Badge>
              ))}
            </div>
          </div>
        )}
        {f.whatToBring.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Bring</h4>
            <div className="flex flex-wrap gap-1.5">
              {f.whatToBring.map((i) => (
                <Badge key={i} variant="outline" className="rounded-full text-[10px]">{i.replace(/-/g, " ")}</Badge>
              ))}
            </div>
          </div>
        )}
        <div className="space-y-2">
          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Availability</h4>
          <p className="text-sm text-muted-foreground">
            {f.availableDates} · Slots: {f.timeSlots.map((t) => TIME_SLOT_OPTIONS.find((to) => to.value === t)?.label || t).join(", ")}
          </p>
          {f.bookingLeadTime && <p className="text-sm text-muted-foreground">Book at least {f.bookingLeadTime} in advance</p>}
        </div>
        {renderDescription(f.description)}
        {renderImages(f.images)}
        {renderSubmit()}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  GEM FORM RENDERERS
  // ═══════════════════════════════════════════════════════════════════

  const renderGemStep = () => {
    switch (step) {
      case 0: return renderGemBasic();
      case 1: return renderGemLocation();
      case 2: return renderGemDiscovery();
      case 3: return renderGemTips();
      case 4: return renderGemMedia();
      case 5: return renderGemReview();
      default: return null;
    }
  };

  function renderGemBasic() {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
        <SectionTitle icon={FileText} title="Basic Info" subtitle="Name your hidden gem" />
        <FormField label="Gem Name" error={errors.name}>
          <Input
            value={gemForm.name}
            onChange={(e) => setGemForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Secret Waterfall, Sunset Viewpoint"
            className="h-11 rounded-xl border-border/60"
          />
        </FormField>
        <FormField label="Description" error={errors.description}>
          <Textarea
            value={gemForm.description}
            onChange={(e) => setGemForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Describe this hidden gem — what makes it special, why someone should visit..."
            rows={4}
            className="rounded-xl border-border/60 resize-none"
          />
        </FormField>
      </div>
    );
  }

  function renderGemLocation() {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
        <SectionTitle icon={MapPin} title="Location & Access" subtitle="How to get there" />
        <FormField label="Location" error={errors.location}>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={gemForm.location}
              onChange={(e) => setGemForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="e.g. 15 km North of Livingstone"
              className="pl-9 h-11 rounded-xl border-border/60"
            />
          </div>
        </FormField>
        <FormField label="Directions" error={errors.directions}>
          <Textarea
            value={gemForm.directions}
            onChange={(e) => setGemForm((f) => ({ ...f, directions: e.target.value }))}
            placeholder="Detailed directions — landmarks, turns, GPS coordinates if available..."
            rows={3}
            className="rounded-xl border-border/60 resize-none"
          />
        </FormField>
        <FormField label="Accessibility" error={errors.accessibility}>
          <Select
            value={gemForm.accessibility}
            onValueChange={(v) => setGemForm((f) => ({ ...f, accessibility: v }))}
          >
            <SelectTrigger className="h-11 rounded-xl border-border/60">
              <SelectValue placeholder="How do you get there?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paved-road">Paved road — any vehicle</SelectItem>
              <SelectItem value="gravel-road">Gravel road — sedan OK</SelectItem>
              <SelectItem value="4x4-required">4x4 required</SelectItem>
              <SelectItem value="boat-access">Boat access only</SelectItem>
              <SelectItem value="hiking">Hiking trail only</SelectItem>
              <SelectItem value="guided-visit">Must visit with a guide</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </div>
    );
  }

  function renderGemDiscovery() {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
        <SectionTitle icon={Gem} title="Discovery Details" subtitle="What makes this gem special?" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Best Time to Visit" error={errors.bestTimeToVisit}>
            <div className="relative">
              <Sun className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={gemForm.bestTimeToVisit}
                onChange={(e) => setGemForm((f) => ({ ...f, bestTimeToVisit: e.target.value }))}
                placeholder="e.g. Dry season (May-Oct), Sunrise"
                className="pl-9 h-11 rounded-xl border-border/60"
              />
            </div>
          </FormField>
          <FormField label="Entry Fee">
            <Input
              value={gemForm.entryFee}
              onChange={(e) => setGemForm((f) => ({ ...f, entryFee: e.target.value }))}
              placeholder="e.g. Free, K50 per person"
              className="h-11 rounded-xl border-border/60"
            />
          </FormField>
        </div>
        <FormField label="What Makes It Special" error={errors.whatMakesItSpecial}>
          <Textarea
            value={gemForm.whatMakesItSpecial}
            onChange={(e) => setGemForm((f) => ({ ...f, whatMakesItSpecial: e.target.value }))}
            placeholder="What makes this spot unique? The view, the experience, the story behind it..."
            rows={3}
            className="rounded-xl border-border/60 resize-none"
          />
        </FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Recommended Duration">
            <div className="relative">
              <Timer className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={gemForm.recommendedDuration}
                onChange={(e) => setGemForm((f) => ({ ...f, recommendedDuration: e.target.value }))}
                placeholder="e.g. 2-3 hours, Half day"
                className="pl-9 h-11 rounded-xl border-border/60"
              />
            </div>
          </FormField>
          <FormField label="Difficulty Level">
            <Select
              value={gemForm.difficultyLevel}
              onValueChange={(v) => setGemForm((f) => ({ ...f, difficultyLevel: v as "easy" | "moderate" | "challenging" }))}
            >
              <SelectTrigger className="h-11 rounded-xl border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTY_LEVELS.map((dl) => (
                  <SelectItem key={dl.value} value={dl.value}>
                    {dl.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>
      </div>
    );
  }

  function renderGemTips() {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
        <SectionTitle icon={Star} title="Tips & Nearby" subtitle="Help visitors make the most of their trip" />
        <FormField label="Tips for Visitors">
          <div className="space-y-2">
            {gemForm.tipsForVisitors.map((tip, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Input
                  value={tip}
                  onChange={(e) => {
                    const next = [...gemForm.tipsForVisitors];
                    next[idx] = e.target.value;
                    setGemForm((f) => ({ ...f, tipsForVisitors: next }));
                  }}
                  placeholder="e.g. Bring water and sunscreen"
                  className="h-10 rounded-xl border-border/60 flex-1"
                />
                <button
                  type="button"
                  onClick={() =>
                    setGemForm((f) => ({
                      ...f,
                      tipsForVisitors: f.tipsForVisitors.filter((_, i) => i !== idx),
                    }))
                  }
                  className="h-10 w-10 rounded-xl border border-border/60 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors shrink-0"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full text-xs font-semibold border-border/60"
              onClick={() =>
                setGemForm((f) => ({
                  ...f,
                  tipsForVisitors: [...f.tipsForVisitors, ""],
                }))
              }
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add tip
            </Button>
          </div>
        </FormField>
        <FormField label="Nearby Amenities">
          <ChipSelect
            options={NEARBY_OPTIONS}
            selected={gemForm.nearbyAmenities}
            onChange={(vals) => setGemForm((f) => ({ ...f, nearbyAmenities: vals }))}
          />
        </FormField>
        <FormField label="Safety Notes (optional)">
          <Textarea
            value={gemForm.safetyNotes}
            onChange={(e) => setGemForm((f) => ({ ...f, safetyNotes: e.target.value }))}
            placeholder="e.g. Slippery rocks after rain, wildlife in the area..."
            rows={2}
            className="rounded-xl border-border/60 resize-none"
          />
        </FormField>
      </div>
    );
  }

  function renderGemMedia() {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
        <SectionTitle icon={Image} title="Photos" subtitle="Show off this hidden gem" />
        <ImageUploader
          images={gemForm.images}
          onChange={(imgs) => setGemForm((f) => ({ ...f, images: imgs }))}
          error={errors.images}
        />
      </div>
    );
  }

  function renderGemReview() {
    const f = gemForm;
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-8">
        <SectionTitle icon={Eye} title="Review Your Gem Listing" subtitle="Double-check everything" />
        <div className="flex items-center gap-3 pb-6 border-b border-border/40">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Gem className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{f.name}</h3>
            <p className="text-sm text-muted-foreground">{f.location}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Location</h4>
            <div className="space-y-2 text-sm">
              <DetailRow icon={MapPin} label="Location" value={f.location} />
              <DetailRow icon={Car} label="Access" value={f.accessibility?.replace(/-/g, " ") || "—"} />
              <DetailRow icon={Sun} label="Best Time" value={f.bestTimeToVisit} />
              <DetailRow icon={DollarSign} label="Entry Fee" value={f.entryFee || "Free"} />
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Visit</h4>
            <div className="space-y-2 text-sm">
              <DetailRow icon={Timer} label="Duration" value={f.recommendedDuration} />
              <DetailRow icon={ShieldCheck} label="Difficulty" value={DIFFICULTY_LEVELS.find((dl) => dl.value === f.difficultyLevel)?.label || f.difficultyLevel} />
            </div>
          </div>
        </div>
        {f.tipsForVisitors.filter((t) => t.trim()).length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Tips</h4>
            <ul className="space-y-1">
              {f.tipsForVisitors.filter((t) => t.trim()).map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Star className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
        {f.nearbyAmenities.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Nearby</h4>
            <div className="flex flex-wrap gap-1.5">
              {f.nearbyAmenities.map((a) => (
                <Badge key={a} variant="secondary" className="rounded-full text-[10px]">{a.replace(/-/g, " ")}</Badge>
              ))}
            </div>
          </div>
        )}
        {f.safetyNotes && <div className="space-y-2">
          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Safety</h4>
          <p className="text-sm text-muted-foreground bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-3">
            {f.safetyNotes}
          </p>
        </div>}
        {renderDescription(f.description)}
        {renderImages(f.images)}
        {renderSubmit()}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  SHARED REVIEW HELPERS
  // ═══════════════════════════════════════════════════════════════════

  function renderDescription(desc: string) {
    return (
      <div className="space-y-2">
        <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Description</h4>
        <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 rounded-xl p-4 border border-border/40">
          {desc}
        </p>
      </div>
    );
  }

  function renderImages(images: string[]) {
    const validImages = images.filter((u) => u.trim());
    if (validImages.length === 0) return null;
    return (
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Images ({validImages.length})
        </h4>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {validImages.map((url, idx) => (
            <div
              key={idx}
              className="h-24 w-36 shrink-0 rounded-xl overflow-hidden bg-muted border border-border/50"
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderSubmit() {
    return (
      <div className="pt-4 border-t border-border/40">
        <p className="text-xs text-muted-foreground mb-4">
          By submitting, you confirm that all information provided is accurate and you agree to our{" "}
          <span className="text-primary underline underline-offset-2 cursor-pointer">Terms of Service</span>.
        </p>
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full h-13 rounded-xl font-black uppercase tracking-widest text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Publishing Listing...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" /> Publish Listing
            </>
          )}
        </Button>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  //  TYPE SELECTION (Step 0)
  // ═══════════════════════════════════════════════════════════════════

  const renderTypeSelection = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <SectionTitle
        icon={Hotel}
        title="What kind of listing are you creating?"
        subtitle="Choose the type that best describes what you're offering"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {LISTING_TYPE_CARDS.map((card) => {
          const selected = listingType === card.value;
          return (
            <button
              key={card.value}
              type="button"
              onClick={() => selectType(card.value)}
              className={cn(
                "relative flex flex-col items-center text-center p-5 rounded-xl border-2 transition-all duration-200",
                selected
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                  : "border-border/50 bg-card hover:border-border hover:shadow-sm",
              )}
            >
              {selected && (
                <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                </div>
              )}
              <div
                className={cn(
                  "h-14 w-14 rounded-2xl flex items-center justify-center mb-4 transition-colors",
                  selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                <card.icon className="h-7 w-7" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">{card.label}</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">{card.desc}</p>
              <p className="text-[10px] text-muted-foreground/60 italic">{card.examples}</p>
            </button>
          );
        })}
      </div>
      {errors.type && (
        <p className="text-sm font-medium text-destructive flex items-center gap-1.5 mb-4">
          <AlertCircle className="h-4 w-4" /> {errors.type}
        </p>
      )}
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════
  //  MAIN RENDER
  // ═══════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Top Banner */}
        <div className="bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent pb-8">
          <div className="mx-auto max-w-3xl px-4 md:px-6 pt-8 md:pt-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <Link
                  href="/host"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mb-3"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Back to Dashboard
                </Link>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                  Create New Listing
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {listingType
                    ? `${steps[step]?.label || ""} — step ${step + 1} of ${totalSteps}`
                    : "Select a listing type to get started"}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Verified</span>
              </div>
            </div>

            {/* Step Indicator (only when a type is selected) */}
            {listingType && <StepIndicator currentStep={step} steps={steps} />}
          </div>
        </div>

        {/* Wizard Content */}
        <div className="mx-auto max-w-3xl px-4 md:px-6 -mt-4 pb-20">
          <div className="bg-card border border-border/40 rounded-2xl shadow-sm p-6 md:p-8">
            {/* Type Selection */}
            {!listingType && renderTypeSelection()}

            {/* Stay Form */}
            {listingType === "stay" && renderStayStep()}

            {/* Transport Form */}
            {listingType === "transport" && renderTransportStep()}

            {/* Experience Form */}
            {listingType === "experience" && renderExperienceStep()}

            {/* Gem Form */}
            {listingType === "gem" && renderGemStep()}

            {/* Navigation Buttons (not on review step — those have their own submit) */}
            {listingType && step < totalSteps - 1 && (
              <div
                className={cn(
                  "flex items-center justify-between pt-8 mt-8 border-t border-border/40",
                  step === 0 ? "justify-end" : "",
                )}
              >
                {step > 0 && (
                  <Button
                    variant="outline"
                    onClick={goBack}
                    className="rounded-xl font-semibold text-sm border-border/60"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back
                  </Button>
                )}
                <Button
                  onClick={goNext}
                  className="rounded-xl font-black uppercase tracking-widest text-sm ml-auto shadow-md shadow-primary/10"
                >
                  Continue <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Helper Components ─────────────────────────────────────────────────

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="h-4 w-4 text-muted-foreground/60 shrink-0" />
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}
