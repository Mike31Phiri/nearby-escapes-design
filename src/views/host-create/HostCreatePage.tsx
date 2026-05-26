"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bed,
  Ticket,
  Bus,
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
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────

type ListingType = "stay" | "experience" | "transport";

interface ListingForm {
  // Step 1
  type: ListingType | null;

  // Step 2 — Basic Info
  name: string;
  location: string;
  description: string;
  // Stay-specific
  beds: number;
  baths: number;
  sqft: number;
  guests: number;
  // Transport-specific
  from: string;
  to: string;
  operator: string;
  duration: string;
  // Experience-specific
  typeLabel: string;

  // Step 2 — Pricing
  price: number;
}

interface ValidationErrors {
  [key: string]: string;
}

// ─── Constants ────────────────────────────────────────────────────────────

const STEPS = [
  { id: "type", label: "Type", icon: Hotel, short: "Type" },
  { id: "info", label: "Basic Info", icon: FileText, short: "Info" },
  { id: "media", label: "Media & Pricing", icon: DollarSign, short: "Pricing" },
  { id: "details", label: "Details & Amenities", icon: Sparkles, short: "Details" },
  { id: "review", label: "Review", icon: Eye, short: "Review" },
] as const;

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
];

const AMENITIES = [
  { value: "wifi", label: "WiFi", icon: Wifi },
  { value: "pool", label: "Pool", icon: Waves },
  { value: "breakfast", label: "Breakfast", icon: Coffee },
  { value: "meals", label: "Meals Included", icon: UtensilsCrossed },
  { value: "spa", label: "Spa", icon: Sparkles },
  { value: "gym", label: "Gym", icon: Dumbbell },
  { value: "guided-tours", label: "Guided Tours", icon: Compass },
  { value: "water-sports", label: "Water Sports", icon: Waves },
  { value: "bird-watching", label: "Bird Watching", icon: Compass },
  { value: "city-views", label: "City Views", icon: Maximize2 },
  { value: "fishing", label: "Fishing", icon: Compass },
  { value: "bar", label: "Bar", icon: Coffee },
] as const;

const EXPERIENCE_AMENITIES = [
  { value: "equipment", label: "Equipment Provided", icon: ShieldCheck },
  { value: "guide", label: "Professional Guide", icon: Compass },
  { value: "transport", label: "Pickup/Dropoff", icon: Bus },
  { value: "meals", label: "Meals Included", icon: UtensilsCrossed },
  { value: "photos", label: "Photos Included", icon: Image },
] as const;

const INITIAL_FORM: ListingForm = {
  type: null,
  name: "",
  location: "",
  description: "",
  beds: 1,
  baths: 1,
  sqft: 0,
  guests: 2,
  from: "",
  to: "",
  operator: "",
  duration: "",
  typeLabel: "Lodge",
  price: 0,
};

// ─── Step Components ──────────────────────────────────────────────────────

function StepIndicator({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      {/* Step labels */}
      <div className="flex items-center justify-between mb-3">
        {STEPS.map((step, idx) => {
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

      {/* Progress bar */}
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

// ─── Main Component ───────────────────────────────────────────────────────

export function HostCreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ListingForm>(INITIAL_FORM);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const totalSteps = STEPS.length;

  const listingType = form.type;

  // Update a form field
  const updateField = useCallback(
    <K extends keyof ListingForm>(key: K, value: ListingForm[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      // Clear error for this field
      if (errors[key as string]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[key as string];
          return next;
        });
      }
    },
    [errors],
  );

  // Validate current step
  const validateStep = useCallback((): boolean => {
    const errs: ValidationErrors = {};

    switch (step) {
      case 0: {
        if (!form.type) errs.type = "Please select a listing type";
        break;
      }
      case 1: {
        if (!form.name.trim()) errs.name = "Listing name is required";
        if (!form.location.trim()) errs.location = "Location is required";
        if (!form.description.trim()) errs.description = "Description is required";
        if (listingType === "stay") {
          if (form.guests < 1) errs.guests = "At least 1 guest";
          if (form.beds < 1) errs.beds = "At least 1 bed";
          if (form.baths < 1) errs.baths = "At least 1 bath";
        }
        if (listingType === "transport") {
          if (!form.from.trim()) errs.from = "Departure location is required";
          if (!form.to.trim()) errs.to = "Destination is required";
          if (!form.operator.trim()) errs.operator = "Operator name is required";
          if (!form.duration.trim()) errs.duration = "Duration is required";
        }
        if (listingType === "experience") {
          if (!form.typeLabel.trim()) errs.typeLabel = "Activity type is required";
          if (form.guests < 1) errs.guests = "At least 1 guest";
        }
        break;
      }
      case 2: {
        const validUrls = imageUrls.filter((u) => u.trim());
        if (validUrls.length === 0) errs.images = "At least one image URL is required";
        if (form.type && (!form.price || form.price <= 0)) errs.price = "Price is required";
        break;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [step, form, listingType, imageUrls]);

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

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));

    toast.success("Listing created successfully!", {
      description: "Your listing is now live and visible to travelers.",
    });

    setSubmitting(false);
    router.push("/host");
  }, [router]);

  // ─── Derived data ──────────────────────────────────────────────────

  // ─── Render helpers ────────────────────────────────────────────────

  const renderImageField = () => (
    <div className="space-y-3">
      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Image URLs
      </Label>
      {imageUrls.map((url, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Image className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={url}
              onChange={(e) => {
                const next = [...imageUrls];
                next[idx] = e.target.value;
                setImageUrls(next);
              }}
              placeholder="https://images.unsplash.com/..."
              className="pl-9 h-11 rounded-xl border-border/60"
            />
          </div>
          {imageUrls.length > 1 && (
            <button
              type="button"
              onClick={() => setImageUrls((prev) => prev.filter((_, i) => i !== idx))}
              className="h-11 w-11 rounded-xl border border-border/60 flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-full text-xs font-semibold border-border/60"
        onClick={() => setImageUrls((prev) => [...prev, ""])}
      >
        <Plus className="h-3.5 w-3.5 mr-1" />
        Add another image
      </Button>
      {errors.images && (
        <p className="text-[11px] font-medium text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {errors.images}
        </p>
      )}

      {/* Preview */}
      {imageUrls.filter((u) => u.trim()).length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {imageUrls
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

  const renderStayFields = () => (
    <>
      <div className="grid grid-cols-3 gap-4">
        <FormField label="Beds" error={errors.beds}>
          <div className="relative">
            <Bed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              min={1}
              value={form.beds}
              onChange={(e) => updateField("beds", Math.max(1, Number(e.target.value)))}
              className="pl-9 h-11 rounded-xl border-border/60"
            />
          </div>
        </FormField>
        <FormField label="Baths" error={errors.baths}>
          <div className="relative">
            <Bath className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              min={1}
              value={form.baths}
              onChange={(e) => updateField("baths", Math.max(1, Number(e.target.value)))}
              className="pl-9 h-11 rounded-xl border-border/60"
            />
          </div>
        </FormField>
        <FormField label="Max Guests" error={errors.guests}>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              min={1}
              value={form.guests}
              onChange={(e) => updateField("guests", Math.max(1, Number(e.target.value)))}
              className="pl-9 h-11 rounded-xl border-border/60"
            />
          </div>
        </FormField>
      </div>
      <FormField label="Size (sq ft)">
        <div className="relative">
          <Maximize2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="number"
            min={0}
            value={form.sqft || ""}
            onChange={(e) => updateField("sqft", Number(e.target.value) || 0)}
            placeholder="e.g. 420"
            className="pl-9 h-11 rounded-xl border-border/60"
          />
        </div>
      </FormField>
    </>
  );

  const renderExperienceFields = () => (
    <div className="grid grid-cols-2 gap-4">
      <FormField label="Activity Type" error={errors.typeLabel}>
        <Input
          value={form.typeLabel}
          onChange={(e) => updateField("typeLabel", e.target.value)}
          placeholder="e.g. Helicopter Tour, Safari, Snorkeling"
          className="h-11 rounded-xl border-border/60"
        />
      </FormField>
      <FormField label="Max Participants" error={errors.guests}>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="number"
            min={1}
            value={form.guests}
            onChange={(e) => updateField("guests", Math.max(1, Number(e.target.value)))}
            className="pl-9 h-11 rounded-xl border-border/60"
          />
        </div>
      </FormField>
    </div>
  );

  const renderTransportFields = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField label="Departure Location" error={errors.from}>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={form.from}
            onChange={(e) => updateField("from", e.target.value)}
            placeholder="e.g. Lusaka"
            className="pl-9 h-11 rounded-xl border-border/60"
          />
        </div>
      </FormField>
      <FormField label="Destination" error={errors.to}>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={form.to}
            onChange={(e) => updateField("to", e.target.value)}
            placeholder="e.g. Livingstone"
            className="pl-9 h-11 rounded-xl border-border/60"
          />
        </div>
      </FormField>
      <FormField label="Operator" error={errors.operator}>
        <Input
          value={form.operator}
          onChange={(e) => updateField("operator", e.target.value)}
          placeholder="e.g. Zambia Bus Lines"
          className="h-11 rounded-xl border-border/60"
        />
      </FormField>
      <FormField label="Duration" error={errors.duration}>
        <Input
          value={form.duration}
          onChange={(e) => updateField("duration", e.target.value)}
          placeholder="e.g. 6h 30m"
          className="h-11 rounded-xl border-border/60"
        />
      </FormField>
    </div>
  );

  const renderAmenities = () => {
    const amenityList = listingType === "experience" ? EXPERIENCE_AMENITIES : AMENITIES;

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {amenityList.map((amenity) => {
          const selected = amenities.includes(amenity.value);
          return (
            <button
              key={amenity.value}
              type="button"
              onClick={() =>
                setAmenities((prev) =>
                  selected ? prev.filter((a) => a !== amenity.value) : [...prev, amenity.value],
                )
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
    );
  };

  const renderReviewSection = () => (
    <div className="space-y-8">
      {/* Listing Type Badge */}
      <div className="flex items-center gap-3 pb-6 border-b border-border/40">
        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          {listingType === "stay" && <Bed className="h-7 w-7 text-primary" />}
          {listingType === "experience" && <Ticket className="h-7 w-7 text-primary" />}
          {listingType === "transport" && <Bus className="h-7 w-7 text-primary" />}
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">{form.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">
            {listingType} · {form.location}
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            Details
          </h4>
          <div className="space-y-2 text-sm">
            <DetailRow icon={MapPin} label="Location" value={form.location} />
            <DetailRow icon={Users} label={`Max ${listingType === "experience" ? "Participants" : "Guests"}`} value={String(listingType !== "transport" ? form.guests : "—")} />
            {listingType === "stay" && (
              <>
                <DetailRow icon={Bed} label="Beds" value={String(form.beds)} />
                <DetailRow icon={Bath} label="Baths" value={String(form.baths)} />
                <DetailRow icon={Maximize2} label="Size" value={form.sqft > 0 ? `${form.sqft} sq ft` : "—"} />
              </>
            )}
            {listingType === "transport" && (
              <>
                <DetailRow icon={MapPin} label="Route" value={`${form.from} → ${form.to}`} />
                <DetailRow icon={Compass} label="Operator" value={form.operator} />
                <DetailRow icon={Clock} label="Duration" value={form.duration} />
              </>
            )}
            {listingType === "experience" && (
              <DetailRow icon={Ticket} label="Activity Type" value={form.typeLabel} />
            )}
          </div>
        </div>

        <div className="space-y-4">
          {amenities.length > 0 && (
            <>
              <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Amenities & Features
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {amenities.map((a) => (
                  <Badge
                    key={a}
                    variant="secondary"
                    className="rounded-full text-[10px] font-semibold capitalize"
                  >
                    {a.replace(/-/g, " ")}
                  </Badge>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Images Preview */}
      {imageUrls.filter((u) => u.trim()).length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            Images ({imageUrls.filter((u) => u.trim()).length})
          </h4>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {imageUrls
              .filter((u) => u.trim())
              .map((url, idx) => (
                <div
                  key={idx}
                  className="h-24 w-36 shrink-0 rounded-xl overflow-hidden bg-muted border border-border/50"
                >
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="space-y-2">
        <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Description
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 rounded-xl p-4 border border-border/40">
          {form.description}
        </p>
      </div>

      {/* Submit CTA */}
      <div className="pt-4 border-t border-border/40">
        <p className="text-xs text-muted-foreground mb-4">
          By submitting, you confirm that all information provided is accurate and you agree to our{" "}
          <span className="text-primary underline underline-offset-2 cursor-pointer">
            Terms of Service
          </span>
          .
        </p>
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full h-13 rounded-xl font-black uppercase tracking-widest text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Publishing Listing...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Publish Listing
            </>
          )}
        </Button>
      </div>
    </div>
  );

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
                  {STEPS[step].label} step {step + 1} of {totalSteps}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  Verified
                </span>
              </div>
            </div>

            {/* Step Indicator */}
            <StepIndicator currentStep={step} totalSteps={totalSteps} />
          </div>
        </div>

        {/* Wizard Content */}
        <div className="mx-auto max-w-3xl px-4 md:px-6 -mt-4 pb-20">
          <div className="bg-card border border-border/40 rounded-2xl shadow-sm p-6 md:p-8">
            {/* Step 0: Choose Type */}
            {step === 0 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <SectionTitle
                  icon={Hotel}
                  title="What kind of listing are you creating?"
                  subtitle="Choose the type that best describes what you're offering"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                  {LISTING_TYPE_CARDS.map((card) => {
                    const selected = listingType === card.value;
                    return (
                      <button
                        key={card.value}
                        type="button"
                        onClick={() => {
                          updateField("type", card.value);
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.type;
                            return next;
                          });
                        }}
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
                        <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                          {card.desc}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 italic">{card.examples}</p>
                      </button>
                    );
                  })}
                </div>

                {errors.type && (
                  <p className="text-sm font-medium text-destructive flex items-center gap-1.5 mb-4">
                    <AlertCircle className="h-4 w-4" />
                    {errors.type}
                  </p>
                )}
              </div>
            )}

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
                <SectionTitle
                  icon={FileText}
                  title="Basic Information"
                  subtitle={
                    listingType === "stay"
                      ? "Tell guests about your accommodation"
                      : listingType === "experience"
                        ? "Describe the experience you're offering"
                        : "Provide the route and transport details"
                  }
                />

                <FormField label="Listing Name" error={errors.name}>
                  <Input
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder={
                      listingType === "stay"
                        ? "e.g. Luxury Safari Lodge"
                        : listingType === "experience"
                          ? "e.g. Victoria Falls Helicopter Tour"
                          : "e.g. Lusaka to Livingstone Bus Route"
                    }
                    className="h-11 rounded-xl border-border/60"
                  />
                </FormField>

                <FormField label="Location" error={errors.location}>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={form.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      placeholder="e.g. Lower Zambezi, Livingstone, Lusaka"
                      className="pl-9 h-11 rounded-xl border-border/60"
                    />
                  </div>
                </FormField>

                <FormField label="Description" error={errors.description}>
                  <Textarea
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Describe your listing in detail — what makes it special, what guests can expect, and nearby attractions..."
                    rows={4}
                    className="rounded-xl border-border/60 resize-none"
                  />
                </FormField>

                {/* Type-specific fields */}
                {listingType === "stay" && renderStayFields()}
                {listingType === "experience" && renderExperienceFields()}
                {listingType === "transport" && renderTransportFields()}
              </div>
            )}

            {/* Step 2: Media & Pricing */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
                <SectionTitle
                  icon={DollarSign}
                  title="Media & Pricing"
                  subtitle="Add photos and set your pricing"
                />

                {/* Image URLs */}
                {renderImageField()}

                <div className="h-px bg-border/40" />

                {/* Pricing */}
                <FormField
                  label={`Base ${listingType === "stay" ? "Price per Night" : listingType === "transport" ? "Price per Seat" : "Price per Person"} (K)`}
                  error={errors.price}
                >
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min={1}
                      value={form.price || ""}
                      onChange={(e) => updateField("price", Number(e.target.value) || 0)}
                      placeholder="e.g. 450"
                      className="pl-9 h-11 rounded-xl border-border/60"
                    />
                  </div>
                </FormField>
              </div>
            )}

            {/* Step 3: Details & Amenities */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
                <SectionTitle
                  icon={Sparkles}
                  title="Details & Amenities"
                  subtitle={
                    listingType === "experience"
                      ? "What's included in your experience?"
                      : "Select the amenities your listing offers"
                  }
                />

                {renderAmenities()}
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <SectionTitle
                  icon={Eye}
                  title="Review Your Listing"
                  subtitle="Double-check everything before publishing"
                />
                {renderReviewSection()}
              </div>
            )}

            {/* Navigation Buttons */}
            {step < totalSteps - 1 && (
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
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                )}
                <Button
                  onClick={goNext}
                  className="rounded-xl font-black uppercase tracking-widest text-sm ml-auto shadow-md shadow-primary/10"
                >
                  Continue
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}

            {/* Step 5 has its own submit button in renderReviewSection */}
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Helper Components ─────────────────────────────────────────────────────

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
