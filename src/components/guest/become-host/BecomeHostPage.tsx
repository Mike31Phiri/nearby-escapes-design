"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  User,
  Mail,
  Phone,
  ShieldCheck,
  Building2,
  Bed,
  Ticket,
  Bus,
  CreditCard,
  Banknote,
  Loader2,
  AlertCircle,
  TrendingUp,
  DollarSign,
  MapPin,
  Users,
  Star,
  Award,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/store/authStore";
import { toast } from "sonner";

//Types ────────────────────────────────────────────────────────────────

type ListingInterest = "stay" | "experience" | "transport";

interface OnboardingForm {
  // Step 1 — Personal Info
  fullName: string;
  email: string;
  phone: string;
  idType: string;
  idNumber: string;
  agreedToTerms: boolean;

  // Step 2 — Hosting Preferences
  interestedTypes: ListingInterest[];
  propertyLocation: string;
  hostingExperience: string;

  // Step 3 — Payout
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchCode: string;
}

interface ValidationErrors {
  [key: string]: string;
}

//Constants ────────────────────────────────────────────────────────────

const STEPS = [
  { id: "welcome", label: "Welcome", icon: Sparkles, short: "Start" },
  { id: "verify", label: "Verification", icon: ShieldCheck, short: "Verify" },
  { id: "preferences", label: "Preferences", icon: Building2, short: "Prefs" },
  { id: "payout", label: "Payout", icon: Banknote, short: "Payout" },
  { id: "confirm", label: "Confirm", icon: Eye, short: "Done" },
] as const;

const HOSTING_BENEFITS = [
  {
    icon: TrendingUp,
    title: "Earn Extra Income",
    desc: "Set your own prices and earn money from your property, tours, or transport services.",
  },
  {
    icon: Users,
    title: "Reach Travelers",
    desc: "Connect with thousands of travelers exploring Zambia, looking for authentic experiences.",
  },
  {
    icon: Star,
    title: "Build Your Reputation",
    desc: "Earn reviews, become a Superhost, and grow your hospitality business on your terms.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Supported",
    desc: "We handle payments, provide 24/7 support, and offer host protection guarantees.",
  },
];

const ID_TYPES = [
  { value: "passport", label: "Passport" },
  { value: "national-id", label: "National ID Card" },
  { value: "drivers-license", label: "Driver's License" },
];

const INTEREST_TYPE_CARDS: {
  value: ListingInterest;
  icon: React.ElementType;
  label: string;
  examples: string;
}[] = [
  {
    value: "stay",
    icon: Bed,
    label: "Stays / Accommodation",
    examples: "Lodges, hotels, camps, guesthouses",
  },
  {
    value: "experience",
    icon: Ticket,
    label: "Experiences / Activities",
    examples: "Tours, safaris, cultural activities",
  },
  {
    value: "transport",
    icon: Bus,
    label: "Transport / Routes",
    examples: "Bus routes, transfers, shuttles",
  },
];

const EXPERIENCE_OPTIONS = [
  { value: "0-3", label: "Less than 3 months" },
  { value: "3-12", label: "3–12 months" },
  { value: "1-3", label: "1–3 years" },
  { value: "3+", label: "3+ years" },
];

const INITIAL_FORM: OnboardingForm = {
  fullName: "",
  email: "",
  phone: "",
  idType: "passport",
  idNumber: "",
  agreedToTerms: false,
  interestedTypes: [],
  propertyLocation: "",
  hostingExperience: "",
  bankName: "",
  accountName: "",
  accountNumber: "",
  branchCode: "",
};

//Sub-Components ───────────────────────────────────────────────────────

function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
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

//Main Component ───────────────────────────────────────────────────────

export function BecomeHostPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();

  // Redirect unauthenticated users to login
  // Redirect hosts/admins away from the onboarding flow
  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
    } else if (user.roles?.includes("host") || user.roles?.includes("admin")) {
      router.replace("/host");
    }
  }, [user, router]);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<OnboardingForm>(() => ({
    ...INITIAL_FORM,
    fullName: user?.name ?? "",
    email: user?.email ?? "",
  }));
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const totalSteps = STEPS.length;

  const updateField = useCallback(
    <K extends keyof OnboardingForm>(key: K, value: OnboardingForm[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
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

  const validateStep = useCallback((): boolean => {
    const errs: ValidationErrors = {};

    switch (step) {
      case 0: {
        // Welcome — no validation needed
        break;
      }
      case 1: {
        if (!form.fullName.trim()) errs.fullName = "Full name is required";
        if (!form.email.trim()) errs.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
          errs.email = "Invalid email address";
        if (!form.phone.trim()) errs.phone = "Phone number is required";
        if (!form.idNumber.trim()) errs.idNumber = "ID number is required";
        if (!form.agreedToTerms) errs.agreedToTerms = "You must agree to the terms";
        break;
      }
      case 2: {
        if (form.interestedTypes.length === 0) errs.interestedTypes = "Select at least one type";
        break;
      }
      case 3: {
        if (!form.bankName.trim()) errs.bankName = "Bank name is required";
        if (!form.accountName.trim()) errs.accountName = "Account name is required";
        if (!form.accountNumber.trim()) errs.accountNumber = "Account number is required";
        break;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [step, form]);

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
    await new Promise((r) => setTimeout(r, 2000));

    // Update user role to host
    if (user) {
      setUser({
        ...user,
        roles: [...(user.roles || []), "host"],
        name: form.fullName,
        email: form.email,
      });
    }

    toast.success("Welcome to the host community! 🎉", {
      description:
        "Your host profile is ready. Start creating listings and sharing Zambia with travelers.",
    });

    setSubmitting(false);
    router.push("/host");
  }, [router, user, setUser, form]);

  //Render step content ────────────────────────────────────────────

  const renderStepContent = () => {
    switch (step) {
      //Step 0: Welcome ─────────────────────────────────────────
      case 0:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-center mb-10">
              <div className="inline-flex h-20 w-20 rounded-2xl bg-primary/10 items-center justify-center mb-6">
                <Award className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-3">
                Become a Host
              </h1>
              <p className="text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
                Turn your property, expertise, or transport into income. Join{" "}
                <span className="font-bold text-foreground">Nearby Escapes</span> and start hosting
                travelers from around the world.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {HOSTING_BENEFITS.map((benefit) => (
                <div
                  key={benefit.title}
                  className="group flex items-start gap-4 rounded-xl border border-border/50 bg-card p-5 shadow-sm card-shadow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                    <benefit.icon className="h-5.5 w-5.5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-foreground">{benefit.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/[0.02] p-5 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-foreground mb-1">Here&apos;s what happens next:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Verify your identity and contact info</li>
                    <li>Tell us what you&apos;d like to host</li>
                    <li>Set up your payout method</li>
                    <li>Start creating listings and earning!</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        );

      //Step 1: Verification ──────────────────────────────────────
      case 1:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
            <SectionTitle
              icon={ShieldCheck}
              title="Verify Your Identity"
              subtitle="We need a few details to set up your host account"
            />

            <div className="space-y-4">
              <FormField label="Full Name (as on ID)" error={errors.fullName}>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="e.g. Chanda Bwalya"
                    className="pl-9 h-11 rounded-xl border-border/60"
                  />
                </div>
              </FormField>

              <FormField label="Email Address" error={errors.email}>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="you@example.com"
                    type="email"
                    className="pl-9 h-11 rounded-xl border-border/60"
                  />
                </div>
              </FormField>

              <FormField label="Phone Number" error={errors.phone}>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+260 97 123 4567"
                    className="pl-9 h-11 rounded-xl border-border/60"
                  />
                </div>
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="ID Type">
                  <div className="relative">
                    <select
                      value={form.idType}
                      onChange={(e) => updateField("idType", e.target.value)}
                      className="flex h-11 w-full rounded-xl border border-border/60 bg-transparent px-4 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary appearance-none"
                    >
                      {ID_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rotate-90 pointer-events-none" />
                  </div>
                </FormField>

                <FormField label="ID Number" error={errors.idNumber}>
                  <Input
                    value={form.idNumber}
                    onChange={(e) => updateField("idNumber", e.target.value)}
                    placeholder="e.g. 123456/78/1"
                    className="h-11 rounded-xl border-border/60"
                  />
                </FormField>
              </div>
            </div>

            {/* Terms agreement */}
            <label className="flex items-start gap-3 rounded-xl border border-border/50 bg-card p-4 card-shadow cursor-pointer transition-colors hover:bg-muted/50">
              <input
                type="checkbox"
                checked={form.agreedToTerms}
                onChange={(e) => updateField("agreedToTerms", e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  I agree to the Host Terms of Service
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  By becoming a host, you agree to our{" "}
                  <span className="text-primary underline underline-offset-2">
                    Host Terms & Conditions
                  </span>{" "}
                  and{" "}
                  <span className="text-primary underline underline-offset-2">Privacy Policy</span>.
                  You confirm that all information provided is accurate.
                </p>
              </div>
            </label>
            {errors.agreedToTerms && (
              <p className="text-[11px] font-medium text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.agreedToTerms}
              </p>
            )}
          </div>
        );

      //Step 2: Preferences ────────────────────────────────────────
      case 2:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
            <SectionTitle
              icon={Building2}
              title="Your Hosting Preferences"
              subtitle="What kind of listings are you planning to offer?"
            />

            <FormField label="What types will you host?" error={errors.interestedTypes}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {INTEREST_TYPE_CARDS.map((card) => {
                  const selected = form.interestedTypes.includes(card.value);
                  return (
                    <button
                      key={card.value}
                      type="button"
                      onClick={() => {
                        const next = selected
                          ? form.interestedTypes.filter((t) => t !== card.value)
                          : [...form.interestedTypes, card.value];
                        updateField("interestedTypes", next);
                      }}
                      className={cn(
                        "relative flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all duration-200",
                        selected
                          ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                          : "border-border/50 bg-card card-shadow hover:border-border hover:shadow-sm",
                      )}
                    >
                      {selected && (
                        <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "h-12 w-12 rounded-xl flex items-center justify-center mb-3 transition-colors",
                          selected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        <card.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xs font-bold text-foreground mb-1">{card.label}</h3>
                      <p className="text-[10px] text-muted-foreground/60">{card.examples}</p>
                    </button>
                  );
                })}
              </div>
            </FormField>

            <FormField label="Where are you based?">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={form.propertyLocation}
                  onChange={(e) => updateField("propertyLocation", e.target.value)}
                  placeholder="e.g. Lusaka, Livingstone, Kafue..."
                  className="pl-9 h-11 rounded-xl border-border/60"
                />
              </div>
            </FormField>

            <FormField label="How long have you been hosting?">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateField("hostingExperience", opt.value)}
                    className={cn(
                      "py-3 px-4 rounded-xl border text-xs font-semibold transition-all duration-200",
                      form.hostingExperience === opt.value
                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                        : "border-border/50 bg-card text-muted-foreground hover:border-border hover:text-foreground",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </FormField>
          </div>
        );

      //Step 3: Payout ─────────────────────────────────────────────
      case 3:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
            <SectionTitle
              icon={Banknote}
              title="Payout Setup"
              subtitle="Where would you like to receive your earnings?"
            />

            <div className="rounded-xl border border-primary/20 bg-primary/[0.02] p-4 mb-2">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your payment information is encrypted and secure. Payouts are processed within 48
                  hours after a guest&apos;s stay begins.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <FormField label="Bank Name" error={errors.bankName}>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={form.bankName}
                    onChange={(e) => updateField("bankName", e.target.value)}
                    placeholder="e.g. Zambia National Bank"
                    className="pl-9 h-11 rounded-xl border-border/60"
                  />
                </div>
              </FormField>

              <FormField label="Account Holder Name" error={errors.accountName}>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={form.accountName}
                    onChange={(e) => updateField("accountName", e.target.value)}
                    placeholder="Full name as on bank account"
                    className="pl-9 h-11 rounded-xl border-border/60"
                  />
                </div>
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Account Number" error={errors.accountNumber}>
                  <Input
                    value={form.accountNumber}
                    onChange={(e) => updateField("accountNumber", e.target.value)}
                    placeholder="e.g. 1234567890"
                    className="h-11 rounded-xl border-border/60"
                  />
                </FormField>

                <FormField label="Branch Code">
                  <Input
                    value={form.branchCode}
                    onChange={(e) => updateField("branchCode", e.target.value)}
                    placeholder="e.g. 1234"
                    className="h-11 rounded-xl border-border/60"
                  />
                </FormField>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-card card-shadow p-4">
                <CreditCard className="h-5 w-5 text-muted-foreground shrink-0" />
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Mobile Money</span> also
                  supported. You can update your payout method anytime from your host settings.
                </p>
              </div>
            </div>
          </div>
        );

      //Step 4: Confirmation ────────────────────────────────────────
      case 4:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
            <SectionTitle
              icon={Eye}
              title="Review & Confirm"
              subtitle="Double-check everything before becoming a host"
            />

            <div className="space-y-6">
              {/* Personal Info Summary */}
              <div className="rounded-xl border border-border/40 bg-card p-5 shadow-sm card-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-foreground">
                    Identity & Contact
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                  <div>
                    <span className="text-muted-foreground text-xs">Name</span>
                    <p className="font-semibold text-foreground">{form.fullName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Email</span>
                    <p className="font-semibold text-foreground">{form.email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Phone</span>
                    <p className="font-semibold text-foreground">{form.phone}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">ID</span>
                    <p className="font-semibold text-foreground capitalize">
                      {ID_TYPES.find((t) => t.value === form.idType)?.label ?? form.idType} ·{" "}
                      {form.idNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Preferences Summary */}
              <div className="rounded-xl border border-border/40 bg-card p-5 shadow-sm card-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-4 w-4 text-primary" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-foreground">
                    Hosting Interests
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {form.interestedTypes.map((type) => {
                    const card = INTEREST_TYPE_CARDS.find((c) => c.value === type);
                    return (
                      <Badge
                        key={type}
                        variant="secondary"
                        className="rounded-full text-[10px] font-semibold capitalize"
                      >
                        {card?.label ?? type}
                      </Badge>
                    );
                  })}
                </div>
                {form.propertyLocation && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    Based in{" "}
                    <span className="font-semibold text-foreground">{form.propertyLocation}</span>
                  </p>
                )}
              </div>

              {/* Payout Summary */}
              <div className="rounded-xl border border-border/40 bg-card p-5 shadow-sm card-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <Banknote className="h-4 w-4 text-primary" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-foreground">
                    Payout Method
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                  <div>
                    <span className="text-muted-foreground text-xs">Bank</span>
                    <p className="font-semibold text-foreground">{form.bankName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Account</span>
                    <p className="font-semibold text-foreground">
                      {form.accountName} · {form.accountNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-border/40">
                <p className="text-xs text-muted-foreground mb-4">
                  By becoming a host, you agree to the{" "}
                  <span className="text-primary underline underline-offset-2 cursor-pointer">
                    Host Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-primary underline underline-offset-2 cursor-pointer">
                    Privacy Policy
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
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Setting up your host profile...
                    </>
                  ) : (
                    <>
                      <Award className="h-5 w-5 mr-2" />
                      Become a Host
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };

  //Render ────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col bg-muted font-sans">
      <main className="flex-1">
        {/* Top Banner */}
        <div className="bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent pb-8">
          <div className="mx-auto max-w-3xl px-4 md:px-6 pt-8 md:pt-12">
            <div className="mb-8">
              <Link
                href="/account/dashboard"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mb-3"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Back to Profile
              </Link>
              {step > 0 && (
                <p className="text-sm text-muted-foreground">
                  Step {step + 1} of {totalSteps} — {STEPS[step].label}
                </p>
              )}
            </div>

            {/* Step Indicator (only show after step 0) */}
            {step > 0 && <StepIndicator currentStep={step - 1} totalSteps={totalSteps - 1} />}
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-3xl px-4 md:px-6 -mt-4 pb-20">
          <div className="bg-card border border-border/40 rounded-2xl shadow-sm p-6 md:p-8">
            {renderStepContent()}

            {/* Navigation Buttons (not on step 4 which has submit) */}
            {step < totalSteps - 1 && (
              <div
                className={cn(
                  "flex items-center justify-between pt-8 mt-8 border-t border-border/40",
                  step === 0 ? "justify-center" : "",
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
                  className={cn(
                    "rounded-xl font-black uppercase tracking-widest text-sm shadow-md shadow-primary/10",
                    step === 0 ? "px-10 py-6 text-base" : "",
                  )}
                >
                  {step === 0 ? (
                    <>
                      Get Started
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </>
                  ) : (
                    <>
                      Continue
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
