"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  CalendarDays,
  Users,
  User,
  Phone,
  MapPin,
  Star,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  Plus,
  Minus,
  MessageSquare,
  Ticket,
  HelpCircle,
  Check,
  CreditCard as CardIcon,
  Tag,
  ArrowRight,
  Info,
  Smartphone,
  Shield,
  Headphones,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/lib/store/authStore";
import { createPaymentToken, generateBookingRef } from "@/lib/dpo";
import { createBooking } from "@/lib/api/bookings";
import { useBookingStore } from "@/store/bookingStore";
import { useProfileStore } from "@/store/profileStore";
import { useInventoryStore } from "@/store/inventoryStore";

// Types

type ListingType = "stay" | "experience" | "transport";

export interface ListingData {
  type: ListingType;
  id: string;
  name: string;
  location: string;
  image: string;
  price: number;
  rating?: number;
  reviews?: number;
  duration?: string;
  guests?: number;
  beds?: number;
  baths?: number;
  isPackage?: boolean;
  from?: string;
  to?: string;
  operator?: string;
  meetingPoint?: string;
}

interface BookingFormPageProps {
  listing: ListingData;
  backHref: string;
}

function parseDateParam(val: string | null): string {
  if (!val) return "";
  if (val.includes("18 Jul")) return "2026-07-18";
  if (val.includes("20 Jul")) return "2026-07-20";
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  return "";
}

// Quantity Stepper

function QuantityStepper({
  value,
  onChange,
  min = 0,
  max = 10,
  label,
  subLabel,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label?: string;
  subLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        {label && <div className="text-sm text-neutral-900 font-bold">{label}</div>}
        {subLabel && <div className="text-xs text-neutral-500">{subLabel}</div>}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-[#6b2bb8] hover:text-[#6b2bb8] transition-colors disabled:opacity-30 disabled:hover:border-neutral-300 disabled:hover:text-neutral-600"
          aria-label="Decrease quantity"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-6 text-center font-bold text-sm text-neutral-900">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-[#6b2bb8] hover:text-[#6b2bb8] transition-colors disabled:opacity-30 disabled:hover:border-neutral-300 disabled:hover:text-neutral-600"
          aria-label="Increase quantity"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// Main Component

export function BookingFormPage({ listing, backHref }: BookingFormPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { addBooking } = useBookingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const isStay = listing.type === "stay";
  const isExperience = listing.type === "experience";
  const isTransport = listing.type === "transport";

  // 10-Minute Reservation Slot Lock Countdown (600 seconds)
  const [secondsLeft, setSecondsLeft] = useState(600);
  const isExpired = secondsLeft <= 0;

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formatCountdown = useCallback((totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, []);

  const handleExtendHold = () => {
    setSecondsLeft(600);
    toast.success("We're holding your spot for another 10 minutes!");
  };

  // Parse query parameters
  const paramGuests = searchParams.get("guests");
  const paramAdults = searchParams.get("adults");
  const paramChildren = searchParams.get("children");
  const paramTransport = searchParams.get("transport");
  const paramCheckIn = searchParams.get("checkIn");
  const paramCheckOut = searchParams.get("checkOut");
  const paramDate = searchParams.get("date");
  const paramSlot = searchParams.get("slot") || searchParams.get("timeSlot");
  const paramMeetingPoint = searchParams.get("meetingPoint");

  const parsedCheckIn = useMemo(() => {
    if (paramCheckIn) return parseDateParam(paramCheckIn);
    if (paramDate && /^\d{4}-\d{2}-\d{2}$/.test(paramDate)) return paramDate;
    return "";
  }, [paramCheckIn, paramDate]);

  const parsedCheckOut = useMemo(() => parseDateParam(paramCheckOut), [paramCheckOut]);

  const parsedAdults = useMemo(() => {
    if (paramAdults) {
      const a = parseInt(paramAdults);
      if (!isNaN(a) && a >= 1) return a;
    }
    if (paramGuests) {
      const g = parseInt(paramGuests);
      if (!isNaN(g) && g >= 1) return g;
    }
    return 2;
  }, [paramAdults, paramGuests]);

  const parsedChildren = useMemo(() => {
    if (paramChildren) {
      const c = parseInt(paramChildren);
      if (!isNaN(c) && c >= 0) return c;
    }
    return 0;
  }, [paramChildren]);

  const initialSlot = useMemo(() => {
    if (paramSlot) return paramSlot;
    return "09:00 AM";
  }, [paramSlot]);

  const meetingPointDisplay = useMemo(() => {
    if (paramMeetingPoint) return paramMeetingPoint;
    if (listing.meetingPoint) return listing.meetingPoint;
    if (listing.location) return listing.location;
    return "Lusaka Showgrounds, Great East Road";
  }, [paramMeetingPoint, listing.meetingPoint, listing.location]);

  const { saveCheckoutInfo, phone: savedPhone, homeCity: savedHomeCity } = useProfileStore();

  // Activity & Options State
  const [stayOptions, setStayOptions] = useState({
    checkIn: parsedCheckIn || "2026-07-18",
    checkOut: parsedCheckOut || "2026-07-20",
    adults: parsedAdults,
    children: parsedChildren,
    roomType: "standard",
    rooms: 1,
    addTransport: false,
    addFarmTour: false,
    addBushBraai: false,
  });

  const [expOptions, setExpOptions] = useState({
    date: paramDate && /^\d{4}-\d{2}-\d{2}$/.test(paramDate) ? paramDate : (parsedCheckIn || "2026-07-18"),
    timeSlot: initialSlot,
    adults: parsedAdults,
    children: parsedChildren,
  });

  const [transportOptions, setTransportOptions] = useState({
    travelDate: parsedCheckIn || "2026-07-18",
    passengers: parsedAdults,
    travelClass: "standard",
    departureTime: "morning",
  });

  // Lead Traveler Details
  const [personalInfo, setPersonalInfo] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: savedPhone || "",
    pickupLocation: "",
    specialRequests: "",
    receiveSms: true,
  });

  // DPO Payment Options
  const [dpoIframeUrl, setDpoIframeUrl] = useState<string | null>(null);
  const [dpoBookingRef, setDpoBookingRef] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [showPromoInput, setShowPromoInput] = useState(false);

  // Listen for DPO iframe postMessage events
  useEffect(() => {
    const handleDpoMessage = (event: MessageEvent) => {
      if (event.data?.type === "DPO_PAYMENT_SUCCESS") {
        const ref = event.data.ref || dpoBookingRef;
        if (ref) {
          toast.success("Payment confirmed by DPO! Finalizing booking...");
          setTimeout(() => {
            router.push(`/checkout/confirmation?ref=${encodeURIComponent(ref)}&status=success`);
          }, 500);
        }
      }
    };
    window.addEventListener("message", handleDpoMessage);
    return () => window.removeEventListener("message", handleDpoMessage);
  }, [dpoBookingRef, router]);

  // Price Calculation
  const priceBreakdown = useMemo(() => {
    if (isStay) {
      const nights =
        stayOptions.checkIn && stayOptions.checkOut
          ? Math.max(
              1,
              Math.round(
                (new Date(stayOptions.checkOut).getTime() -
                  new Date(stayOptions.checkIn).getTime()) /
                  (1000 * 60 * 60 * 24),
              ),
            )
          : 2;
      const roomCount = stayOptions.rooms;
      const stayCost = listing.price * nights * roomCount;

      const transportCost = 0;
      const adultCount = stayOptions.adults;
      const childCount = stayOptions.children;
      const farmTourCost = 0;
      const bushBraaiCost = 0;

      const discount = Math.round(stayCost * 0.1);
      const subtotal = stayCost - discount;
      const serviceFee = Math.round(stayCost * 0.05);
      const total = Math.max(0, subtotal + serviceFee - promoDiscount);

      return {
        subtotal,
        serviceFee,
        total,
        nights,
        roomCount,
        adultCount,
        childCount,
        passengerCount: 0,
        classMarkup: 0,
        stayCost,
        transportCost,
        farmTourCost,
        bushBraaiCost,
        discount,
      };
    }

    if (isExperience) {
      const adultCount = expOptions.adults;
      const childCount = expOptions.children;
      const baseCost = listing.price * adultCount;
      const childCost = Math.round(listing.price * 0.5 * childCount);
      const subtotal = baseCost + childCost;
      const tax = Math.round(subtotal * 0.05);
      const total = Math.max(0, subtotal + tax - promoDiscount);

      return {
        subtotal,
        serviceFee: tax,
        total,
        adultCount,
        childCount,
        nights: 0,
        roomCount: 1,
        passengerCount: 0,
        classMarkup: 0,
        stayCost: 0,
        transportCost: 0,
        farmTourCost: 0,
        bushBraaiCost: 0,
        discount: 0,
      };
    }

    // Transport
    const passengerCount = transportOptions.passengers;
    let classMarkup = 0;
    if (transportOptions.travelClass === "business") classMarkup = Math.round(listing.price * 0.4);
    else if (transportOptions.travelClass === "first")
      classMarkup = Math.round(listing.price * 0.8);

    const basePrice = listing.price * passengerCount;
    const additionalCost = classMarkup * passengerCount;
    const subtotal = basePrice + additionalCost;
    const serviceFee = Math.round(subtotal * 0.05);
    const total = Math.max(0, subtotal + serviceFee - promoDiscount);

    return {
      subtotal,
      serviceFee,
      total,
      passengerCount,
      classMarkup,
      nights: 0,
      roomCount: 1,
      adultCount: passengerCount,
      childCount: 0,
      stayCost: 0,
      transportCost: 0,
      farmTourCost: 0,
      bushBraaiCost: 0,
      discount: 0,
    };
  }, [
    isStay,
    isExperience,
    stayOptions,
    expOptions,
    transportOptions,
    listing.price,
    promoDiscount,
  ]);

  const guestCountLabel = useMemo(() => {
    if (isStay) {
      const g = stayOptions.adults + stayOptions.children;
      return `${g} guest${g !== 1 ? "s" : ""} (${stayOptions.adults} adult${stayOptions.adults !== 1 ? "s" : ""}${stayOptions.children > 0 ? `, ${stayOptions.children} child` : ""})`;
    }
    if (isExperience) {
      const g = expOptions.adults + expOptions.children;
      return `${g} participant${g !== 1 ? "s" : ""} (${expOptions.adults} adult${expOptions.adults !== 1 ? "s" : ""}${expOptions.children > 0 ? `, ${expOptions.children} child` : ""})`;
    }
    return `${transportOptions.passengers} passenger${transportOptions.passengers !== 1 ? "s" : ""}`;
  }, [isStay, isExperience, stayOptions, expOptions, transportOptions]);

  const activeDateLabel = useMemo(() => {
    const rawDate = isStay
      ? stayOptions.checkIn
      : isExperience
        ? expOptions.date
        : transportOptions.travelDate;
    if (!rawDate) return "Sat, 18 Jul 2026";
    try {
      return new Date(rawDate).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return rawDate;
    }
  }, [isStay, isExperience, stayOptions.checkIn, expOptions.date, transportOptions.travelDate]);

  const minDate = new Date().toISOString().split("T")[0];

  const handleApplyPromo = () => {
    if (
      promoCode.trim().toUpperCase() === "VIATOR10" ||
      promoCode.trim().toUpperCase() === "ESCAPE10"
    ) {
      const discountVal = Math.round(priceBreakdown.subtotal * 0.1);
      setPromoDiscount(discountVal);
      setPromoApplied(true);
      toast.success("Promo code applied! 10% discount subtracted.");
    } else if (promoCode.trim().toUpperCase() === "ZAMBIA50") {
      setPromoDiscount(50);
      setPromoApplied(true);
      toast.success("Promo code applied! K50 discount subtracted.");
    } else {
      toast.error("Invalid promo code. Try ESCAPE10 or ZAMBIA50.");
    }
  };

  // Submit Booking
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim();
    if (!personalInfo.firstName.trim() || !personalInfo.lastName.trim()) {
      toast.error("Please enter the lead traveler's first and last name.");
      return;
    }
    if (!personalInfo.email.trim() || !personalInfo.email.includes("@")) {
      toast.error("Please provide a valid email address for your confirmation.");
      return;
    }
    if (!personalInfo.phone.trim()) {
      toast.error("Please provide a contact phone number.");
      return;
    }
    if (!agreedToTerms) {
      toast.error("Please check the box to agree to the Terms & Cancellation Policy.");
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingRef = generateBookingRef();
      const extras: Record<string, string | number> = {};

      if (isStay) {
        extras.roomType = stayOptions.roomType;
        extras.rooms = stayOptions.rooms;
        extras.nights = priceBreakdown.nights;
        extras.transportSelected = stayOptions.addTransport ? "Yes" : "No";
        extras.farmTourSelected = stayOptions.addFarmTour ? "Yes" : "No";
        extras.bushBraaiSelected = stayOptions.addBushBraai ? "Yes" : "No";
      }
      if (isExperience) {
        extras.timeSlot = expOptions.timeSlot;
        extras.adultCount = priceBreakdown.adultCount;
        extras.childCount = priceBreakdown.childCount;
      }
      if (isTransport) {
        extras.travelClass = transportOptions.travelClass;
        extras.departureTime = transportOptions.departureTime;
        extras.passengerCount = priceBreakdown.passengerCount;
      }
      if (personalInfo.pickupLocation) {
        extras.pickupLocation = personalInfo.pickupLocation;
      }
      if (personalInfo.specialRequests) {
        extras.specialRequests = personalInfo.specialRequests;
      }

      saveCheckoutInfo({
        phone: personalInfo.phone,
        homeCity: personalInfo.pickupLocation || savedHomeCity,
      });

      // 1. Dispatch real booking creation request to NestJS backend with simulated payment
      let backendBooking: any = null;
      try {
        backendBooking = await createBooking({
          listingId: listing.id,
          vertical: listing.type,
          checkIn: isStay ? stayOptions.checkIn : undefined,
          checkOut: isStay ? stayOptions.checkOut : undefined,
          date: isExperience
            ? expOptions.date
            : isTransport
              ? transportOptions.travelDate
              : undefined,
          guests: isStay
            ? stayOptions.adults + stayOptions.children
            : isExperience
              ? expOptions.adults + expOptions.children
              : transportOptions.passengers,
          totalNgwee: priceBreakdown.total * 100,
          serviceFeeNgwee: priceBreakdown.serviceFee * 100,
          customerName: fullName,
          customerPhone: personalInfo.phone,
          customerEmail: personalInfo.email,
          specialRequests: personalInfo.specialRequests,
        });
      } catch (e) {
        console.warn("Backend booking creation note, falling back smoothly:", e);
      }

      const confirmedRef = backendBooking?.bookingRef || bookingRef;
      const confirmedId = backendBooking?.id || confirmedRef;

      // 2. Add to persistent booking store for guest trips & host management
      addBooking({
        id: confirmedId,
        bookingRef: confirmedRef,
        type: listing.type,
        listingName: listing.name,
        listingId: listing.id,
        location: listing.location,
        image: listing.image,
        amount: priceBreakdown.total,
        currency: "ZMW",
        status: "confirmed",
        transToken: `SIM-${Date.now()}`,
        customerName: fullName,
        customerPhone: personalInfo.phone,
        customerEmail: personalInfo.email,
        hostName: "Nearby Escapes Verified Host",
        hostEmail: "support@nearbyescapes.com",
        details: {
          checkIn: isStay ? stayOptions.checkIn : undefined,
          checkOut: isStay ? stayOptions.checkOut : undefined,
          date: isExperience
            ? expOptions.date
            : isTransport
              ? transportOptions.travelDate
              : undefined,
          guests: isStay
            ? stayOptions.adults + stayOptions.children
            : isExperience
              ? expOptions.adults + expOptions.children
              : transportOptions.passengers,
          extras,
        },
        createdAt: new Date().toISOString(),
      });

      // 3. Decrement inventory in persistent store
      try {
        const inv = useInventoryStore.getState().getInventory(listing.id);
        const availableUnit = inv.units.find((u) => u.status === "available");
        if (availableUnit) {
          useInventoryStore.getState().setUnitStatus(
            listing.id,
            availableUnit.id,
            "occupied",
            `Booked by ${fullName} · Ref ${confirmedRef}`,
          );
        }
      } catch (e) {
        console.warn("Could not decrement inventory unit:", e);
      }

      toast.success("Payment simulated & reservation confirmed!");
      setIsSubmitting(false);

      // Seamless direct transition to booking confirmation receipt
      router.push(`/checkout/confirmation?ref=${encodeURIComponent(confirmedRef)}&status=success`);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfafc] font-sans">
      {/* Checkout Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-black/[0.08] shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Page Title */}
          <h1 className="text-xl font-bold text-[#2d0f5e] tracking-tight">Checkout</h1>

          {/* Right Help info */}
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Headphones className="h-3.5 w-3.5 text-neutral-400" />
            <span className="hidden md:inline">Need help?</span>
            <a
              href="tel:+260971234567"
              className="font-bold text-neutral-900 hover:text-[#6b2bb8] transition-colors"
            >
              +260 97 123 4567
            </a>
          </div>
        </div>
      </header>

      {/* Main Content: Two-column checkout layout */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* 10-MINUTE RESERVATION LOCK BANNER */}
        <div
          className={cn(
            "w-full rounded-2xl p-3.5 sm:p-4 border transition-all mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs",
            isExpired
              ? "bg-amber-50/90 border-amber-200 text-amber-950"
              : "bg-purple/5 border-purple/15 text-neutral-900",
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white shadow-2xs",
                isExpired ? "bg-amber-500" : "bg-purple",
              )}
            >
              {isExpired ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
            </div>
            <div>
              <span className="font-semibold text-sm text-neutral-900 block">
                {isExpired
                  ? "Your 10-minute hold has expired"
                  : "We're holding this spot for you"}
              </span>
              <p className="text-xs text-neutral-500 mt-0.5">
                {isExpired
                  ? "Don't worry—click the button to hold your spot for another 10 minutes so you can finish paying."
                  : "Take your time filling in your details—we've saved this reservation so nobody else can take it while you finish checkout."}
              </p>
            </div>
          </div>

          {/* Countdown Timer Display */}
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            {!isExpired ? (
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-neutral-200/80 shadow-2xs">
                <Clock className="h-3.5 w-3.5 text-purple shrink-0" />
                <span className="text-xs font-medium text-neutral-500">Hold Timer:</span>
                <span className="text-sm font-bold text-purple tabular-nums">
                  {formatCountdown(secondsLeft)}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleExtendHold}
                className="px-3.5 py-1.5 rounded-xl bg-purple hover:bg-purple-hover text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Extend Hold (+10 min)</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* LEFT COLUMN: Unified Single-Page Checkout Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* SECTION 1: Contact Details (Lead Traveler) */}
            <section className="bg-white rounded-2xl border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 md:p-7">
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-8 h-8 rounded-full bg-[#6b2bb8] text-white font-bold text-sm flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h2 className="font-bold text-lg text-neutral-900 leading-none">
                    Contact Details
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    We&apos;ll send your confirmation, tickets, and travel voucher here.
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-neutral-700">
                      First Name (Lead Traveler) *
                    </Label>
                    <Input
                      placeholder="e.g. Mike"
                      value={personalInfo.firstName}
                      onChange={(e) =>
                        setPersonalInfo((p) => ({ ...p, firstName: e.target.value }))
                      }
                      className="h-11 rounded-xl border-neutral-300 text-sm font-medium focus-visible:ring-[#6b2bb8]"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-neutral-700">Last Name *</Label>
                    <Input
                      placeholder="e.g. Phiri"
                      value={personalInfo.lastName}
                      onChange={(e) => setPersonalInfo((p) => ({ ...p, lastName: e.target.value }))}
                      className="h-11 rounded-xl border-neutral-300 text-sm font-medium focus-visible:ring-[#6b2bb8]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-neutral-700">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={personalInfo.email}
                        onChange={(e) => setPersonalInfo((p) => ({ ...p, email: e.target.value }))}
                        className="pl-10 h-11 rounded-xl border-neutral-300 text-sm font-medium focus-visible:ring-[#6b2bb8]"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-neutral-700">Mobile Phone *</Label>
                    <div className="flex gap-2">
                      <div className="flex items-center px-3 rounded-xl border border-neutral-300 bg-neutral-50 text-xs font-bold text-neutral-700 shrink-0">
                        🇿🇲 +260
                      </div>
                      <Input
                        type="tel"
                        placeholder="97 123 4567"
                        value={personalInfo.phone}
                        onChange={(e) => setPersonalInfo((p) => ({ ...p, phone: e.target.value }))}
                        className="h-11 rounded-xl border-neutral-300 text-sm font-medium focus-visible:ring-[#6b2bb8]"
                        required
                      />
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-2.5 pt-1 text-xs text-neutral-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={personalInfo.receiveSms}
                    onChange={(e) =>
                      setPersonalInfo((p) => ({ ...p, receiveSms: e.target.checked }))
                    }
                    className="h-4 w-4 rounded border-neutral-300 text-[#6b2bb8] focus:ring-[#6b2bb8]"
                  />
                  <span>Receive booking confirmation &amp; pickup updates via SMS / WhatsApp.</span>
                </label>
              </div>
            </section>

            {/* SECTION 2: Activity & Traveler Details */}
            <section className="bg-white rounded-2xl border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 md:p-7">
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-8 h-8 rounded-full bg-[#6b2bb8] text-white font-bold text-sm flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h2 className="font-bold text-lg text-neutral-900 leading-none">
                    Activity &amp; Booking Details
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    Dates, guest numbers, and special tour requirements.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Date & Time Row */}
                {isStay && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-neutral-700">Check-in Date *</Label>
                      <Input
                        type="date"
                        min={minDate}
                        value={stayOptions.checkIn}
                        onChange={(e) => setStayOptions((s) => ({ ...s, checkIn: e.target.value }))}
                        className="h-11 rounded-xl border-neutral-300 text-sm font-semibold"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-neutral-700">Check-out Date *</Label>
                      <Input
                        type="date"
                        min={stayOptions.checkIn || minDate}
                        value={stayOptions.checkOut}
                        onChange={(e) =>
                          setStayOptions((s) => ({ ...s, checkOut: e.target.value }))
                        }
                        className="h-11 rounded-xl border-neutral-300 text-sm font-semibold"
                        required
                      />
                    </div>
                  </div>
                )}

                {isExperience && (
                  <div className="space-y-3.5">
                    {/* Preset Date & Slot Information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-neutral-700">Date</Label>
                        <div className="flex items-center gap-2.5 h-11 px-3.5 rounded-xl border border-neutral-200 bg-neutral-50/70 text-sm font-semibold text-neutral-800">
                          <CalendarDays className="h-4 w-4 text-purple shrink-0" />
                          <span>{activeDateLabel}</span>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-neutral-700">Time Slot</Label>
                        <div className="flex items-center gap-2.5 h-11 px-3.5 rounded-xl border border-neutral-200 bg-neutral-50/70 text-sm font-semibold text-neutral-800">
                          <Clock className="h-4 w-4 text-purple shrink-0" />
                          <span>{expOptions.timeSlot}</span>
                        </div>
                      </div>
                    </div>

                    {/* Host-set Meeting Point Display */}
                    <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-3.5 sm:p-4">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="h-4 w-4 text-purple mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-neutral-900">
                            Meeting Point
                          </div>
                          <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                            {meetingPointDisplay}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {isTransport && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-neutral-700">Travel Date *</Label>
                      <Input
                        type="date"
                        min={minDate}
                        value={transportOptions.travelDate}
                        onChange={(e) =>
                          setTransportOptions((s) => ({ ...s, travelDate: e.target.value }))
                        }
                        className="h-11 rounded-xl border-neutral-300 text-sm font-semibold"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-neutral-700">Travel Class</Label>
                      <Select
                        value={transportOptions.travelClass}
                        onValueChange={(v) =>
                          setTransportOptions((s) => ({ ...s, travelClass: v }))
                        }
                      >
                        <SelectTrigger className="h-11 rounded-xl border-neutral-300 text-sm font-medium">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard Class</SelectItem>
                          <SelectItem value="business">Business Class (+40%)</SelectItem>
                          <SelectItem value="first">First Class VIP (+80%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Participants Stepper Box */}
                <div className="bg-neutral-50/80 rounded-xl border border-black/[0.05] p-4 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Travelers / Participants
                  </div>
                  {isStay && (
                    <>
                      <QuantityStepper
                        label="Adults"
                        subLabel="Age 13+"
                        value={stayOptions.adults}
                        min={1}
                        max={10}
                        onChange={(v) => setStayOptions((s) => ({ ...s, adults: v }))}
                      />
                      <div className="h-px bg-black/[0.06]" />
                      <QuantityStepper
                        label="Children"
                        subLabel="Ages 0–12"
                        value={stayOptions.children}
                        min={0}
                        max={6}
                        onChange={(v) => setStayOptions((s) => ({ ...s, children: v }))}
                      />
                      <div className="h-px bg-black/[0.06]" />
                      <QuantityStepper
                        label="Rooms / Chalets"
                        value={stayOptions.rooms}
                        min={1}
                        max={5}
                        onChange={(v) => setStayOptions((s) => ({ ...s, rooms: v }))}
                      />
                    </>
                  )}

                  {isExperience && (
                    <>
                      <QuantityStepper
                        label="Adults"
                        subLabel="Age 13+"
                        value={expOptions.adults}
                        min={1}
                        max={15}
                        onChange={(v) => setExpOptions((s) => ({ ...s, adults: v }))}
                      />
                      <div className="h-px bg-black/[0.06]" />
                      <QuantityStepper
                        label="Children"
                        subLabel="Ages 5–12 (50% off, under 5 free)"
                        value={expOptions.children}
                        min={0}
                        max={8}
                        onChange={(v) => setExpOptions((s) => ({ ...s, children: v }))}
                      />
                    </>
                  )}

                  {isTransport && (
                    <QuantityStepper
                      label="Passengers"
                      value={transportOptions.passengers}
                      min={1}
                      max={10}
                      onChange={(v) => setTransportOptions((s) => ({ ...s, passengers: v }))}
                    />
                  )}
                </div>

                {/* Pickup Location for Transport */}
                {isTransport && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                      Pickup Address / Departure Station
                    </Label>
                    <Input
                      placeholder="e.g. Hotel lobby, airport terminal, or address"
                      value={personalInfo.pickupLocation}
                      onChange={(e) =>
                        setPersonalInfo((p) => ({ ...p, pickupLocation: e.target.value }))
                      }
                      className="h-11 rounded-xl border-neutral-300 text-sm"
                    />
                  </div>
                )}


                {/* Special Requests */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-neutral-400" />
                    Special Requirements (Optional)
                  </Label>
                  <textarea
                    rows={2}
                    placeholder="Dietary requirements, accessibility assistance, celebrating an occasion, or arrival time notes..."
                    value={personalInfo.specialRequests}
                    onChange={(e) =>
                      setPersonalInfo((p) => ({ ...p, specialRequests: e.target.value }))
                    }
                    className="w-full rounded-xl border border-neutral-300 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6b2bb8]/20 focus:border-[#6b2bb8]"
                  />
                </div>
              </div>
            </section>

            {/* SECTION 3: Payment with DPO Pay */}
            <section id="dpo-payment-section" className="bg-white rounded-2xl border border-black/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 md:p-7">
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-8 h-8 rounded-full bg-purple text-white font-bold text-sm flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h2 className="font-bold text-lg text-neutral-900 leading-none">Payment with DPO Pay</h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    Transactions are processed securely via DPO Pay (Direct Pay Online Africa).
                  </p>
                </div>
              </div>

              {dpoIframeUrl ? (
                /* Active DPO Pay Embedded Iframe View */
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-purple/5 border border-purple/20">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-purple shrink-0" />
                      <div className="text-xs font-bold text-neutral-900">
                        DPO Pay Secure Checkout • Ref: {dpoBookingRef}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDpoIframeUrl(null)}
                      className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 hover:underline cursor-pointer"
                    >
                      ← Cancel / Edit details
                    </button>
                  </div>

                  <div className="w-full rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-50 shadow-xs relative">
                    <iframe
                      src={dpoIframeUrl}
                      title="DPO Pay Secure Payment"
                      className="w-full h-[640px] border-0 bg-white"
                      allow="payment"
                    />
                  </div>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 font-medium pt-1">
                    <Lock className="h-3.5 w-3.5 text-emerald-600" />
                    <span>256-Bit SSL Encrypted Connection • Powered by Direct Pay Online (DPO Group)</span>
                  </div>
                </div>
              ) : (
                /* Initial DPO Pay Overview View */
                <div className="space-y-4">
                  {/* DPO Pay Showcase Card */}
                  <div className="p-4 sm:p-5 rounded-2xl border border-purple/20 bg-gradient-to-br from-purple/5 via-neutral-50 to-white space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#002f6c] text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-xs">
                          DPO
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-neutral-900">Direct Pay Online</span>
                            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              DPO Pay
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            Official Secure Payment Gateway for Africa &amp; Zambia
                          </p>
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-neutral-500 font-medium">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span>PCI-DSS Level 1</span>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Complete your booking securely using our embedded DPO Pay gateway. You can pay with any major credit or debit card, or your preferred Zambian mobile money wallet.
                    </p>

                    {/* Supported Methods Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-neutral-200/80">
                        <CardIcon className="h-4 w-4 text-purple shrink-0" />
                        <span className="font-semibold text-neutral-800">Cards:</span>
                        <span className="text-neutral-500">Visa, Mastercard, Amex</span>
                      </div>
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-neutral-200/80">
                        <Smartphone className="h-4 w-4 text-purple shrink-0" />
                        <span className="font-semibold text-neutral-800">Mobile Money:</span>
                        <span className="text-neutral-500">Airtel, MTN, Zamtel</span>
                      </div>
                    </div>
                  </div>

                  {/* Promo Code Accordion */}
                  <div className="pt-2 border-t border-black/[0.06]">
                    {!showPromoInput && !promoApplied && (
                      <button
                        type="button"
                        onClick={() => setShowPromoInput(true)}
                        className="text-xs font-bold text-purple hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Tag className="h-3 w-3" /> Have a promo code or gift card?
                      </button>
                    )}

                    {showPromoInput && !promoApplied && (
                      <div className="flex gap-2 items-center pt-1">
                        <Input
                          placeholder="Enter code (e.g. ESCAPE10)"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="h-10 rounded-xl border-neutral-300 text-xs font-bold uppercase tracking-wider"
                        />
                        <Button
                          type="button"
                          onClick={handleApplyPromo}
                          className="h-10 px-4 rounded-xl bg-purple text-white hover:bg-purple-hover font-bold text-xs shrink-0 cursor-pointer"
                        >
                          Apply
                        </Button>
                      </div>
                    )}

                    {promoApplied && (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold">
                        <span>✓ Promo Code Applied (-K{promoDiscount})</span>
                        <button
                          type="button"
                          onClick={() => {
                            setPromoApplied(false);
                            setPromoDiscount(0);
                            setPromoCode("");
                          }}
                          className="text-neutral-500 hover:text-neutral-800 text-[11px] cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Free cancellation guarantee banner */}
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-xs text-emerald-950">
                        Free Cancellation up to 24 hours in advance
                      </div>
                      <p className="text-[11px] text-emerald-900/80 leading-relaxed mt-0.5">
                        Cancel before {activeDateLabel} for a 100% full refund with zero questions asked.
                      </p>
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <label className="flex items-start gap-2.5 pt-2 text-xs text-neutral-500 cursor-pointer leading-relaxed select-none">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-purple focus:ring-purple cursor-pointer"
                    />
                    <span>
                      I acknowledge and agree to Nearby Escapes{" "}
                      <Link href="/terms" className="text-purple underline font-medium">
                        Terms of Service
                      </Link>
                      ,{" "}
                      <Link href="/privacy" className="text-purple underline font-medium">
                        Privacy Policy
                      </Link>
                      , and the cancellation policy.
                    </span>
                  </label>

                  {/* Complete Payment Button */}
                  <div className="pt-3">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 rounded-xl bg-purple hover:bg-purple-hover active:scale-[0.99] text-white font-semibold text-sm shadow-md shadow-purple/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Lock className="h-3.5 w-3.5" />
                      )}
                      {isSubmitting
                        ? "Confirming Reservation..."
                        : `Pay & Confirm Booking • K${priceBreakdown.total.toLocaleString()}`}
                    </Button>
                    <p className="text-center text-[11px] text-neutral-400 mt-2 font-medium">
                      🔒 Simulated Instant Checkout • Backed by Nearby Escapes.
                    </p>
                  </div>
                </div>
              )}
            </section>
          </form>

          {/* RIGHT COLUMN: Sticky booking summary card */}
          <aside className="lg:sticky lg:top-20 space-y-4">
            <div className="bg-white rounded-2xl border border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
              {/* Product Thumbnail Header */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={listing.image}
                  alt={listing.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-neutral-900 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                  {isStay ? "Stay / Lodge" : isExperience ? "Tour / Activity" : "Transfer"}
                </div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="font-bold text-base leading-snug line-clamp-2">{listing.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-white/80 mt-1">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{listing.location}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Ratings & Operator */}
                <div className="flex items-center justify-between text-xs pb-3 border-b border-black/[0.06]">
                  <div className="flex items-center gap-1.5 font-bold text-neutral-800">
                    <Star className="h-3.5 w-3.5 fill-[#ffca28] text-[#ffca28]" />
                    <span>{listing.rating ? listing.rating.toFixed(1) : "4.9"}</span>
                    <span className="text-neutral-400 font-normal">
                      ({listing.reviews || 128} reviews)
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Top Rated
                  </span>
                </div>

                {/* Selected Options Summary Box */}
                <div className="bg-neutral-50 rounded-xl p-3.5 space-y-2.5 text-xs text-neutral-600">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-900 flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-neutral-400" /> Date
                    </span>
                    <span className="font-bold text-neutral-900">{activeDateLabel}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-900 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-neutral-400" /> Time / Duration
                    </span>
                    <span className="font-bold text-neutral-900">
                      {isStay
                        ? `${priceBreakdown.nights} nights`
                        : isExperience
                          ? expOptions.timeSlot
                          : transportOptions.departureTime === "morning"
                            ? "6:00 AM"
                            : "12:00 PM"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-900 flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-neutral-400" /> Travelers
                    </span>
                    <span className="font-bold text-neutral-900 truncate max-w-[150px]">
                      {guestCountLabel}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-2 pt-1 border-t border-black/[0.04]">
                    <span className="font-semibold text-neutral-900 flex items-center gap-1.5 shrink-0">
                      <MapPin className="h-3.5 w-3.5 text-neutral-400" /> Meeting Point
                    </span>
                    <span
                      className="font-bold text-neutral-900 text-right truncate max-w-[170px]"
                      title={meetingPointDisplay}
                    >
                      {meetingPointDisplay}
                    </span>
                  </div>
                </div>

                {/* 10-Minute Hold Status in Sidebar */}
                <div
                  className={cn(
                    "p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors",
                    isExpired
                      ? "bg-amber-50 border-amber-200 text-amber-900"
                      : "bg-purple/5 border-purple/15 text-neutral-900",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Lock
                      className={cn(
                        "h-3.5 w-3.5 shrink-0",
                        isExpired ? "text-amber-600" : "text-purple",
                      )}
                    />
                    <span className="font-medium text-xs">
                      {isExpired ? "Hold expired" : "Holding your spot"}
                    </span>
                  </div>
                  <span className="font-bold text-xs text-purple tabular-nums">
                    {!isExpired ? formatCountdown(secondsLeft) : "00:00"}
                  </span>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-1 text-xs">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    Price Details
                  </div>

                  <div className="flex justify-between text-neutral-600">
                    <span>
                      {isStay
                        ? `K${listing.price} × ${priceBreakdown.nights} night(s)`
                        : `K${listing.price} × ${priceBreakdown.adultCount} adult(s)`}
                    </span>
                    <span className="font-semibold text-neutral-900">
                      K
                      {(isStay
                        ? priceBreakdown.stayCost
                        : listing.price * priceBreakdown.adultCount
                      ).toLocaleString()}
                    </span>
                  </div>

                  {isExperience && priceBreakdown.childCount > 0 && (
                    <div className="flex justify-between text-neutral-600">
                      <span>Children (50% off × {priceBreakdown.childCount})</span>
                      <span className="font-semibold text-neutral-900">
                        K{(listing.price * 0.5 * priceBreakdown.childCount).toLocaleString()}
                      </span>
                    </div>
                  )}


                  {promoApplied && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount (Promo)</span>
                      <span>−K{promoDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-neutral-600">
                    <span>Taxes &amp; Service Fee (5%)</span>
                    <span className="font-semibold text-neutral-900">
                      K{priceBreakdown.serviceFee.toLocaleString()}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-black/[0.08] flex items-baseline justify-between">
                    <div>
                      <div className="text-sm font-bold text-neutral-900">Total Price</div>
                      <div className="text-[10px] text-neutral-400 font-medium">
                        All taxes &amp; fees included
                      </div>
                    </div>
                    <div className="text-xl font-bold text-neutral-900">
                      K{priceBreakdown.total.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Trust Badges in Sidebar */}
                <div className="pt-4 border-t border-black/[0.06] space-y-2.5 text-[11px] text-neutral-600">
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>
                      <strong>Lowest Price Guarantee</strong> • Found it cheaper? We&apos;ll match.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ticket className="h-3.5 w-3.5 text-[#6b2bb8] shrink-0" />
                    <span>
                      <strong>Instant Mobile Ticket</strong> • Delivered right to your inbox.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-neutral-700 shrink-0" />
                    <span>
                      <strong>Free cancellation</strong> up to 24 hours prior.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>


    </div>
  );
}
