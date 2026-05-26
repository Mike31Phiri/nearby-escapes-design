"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Users,
  User,
  Phone,
  MapPin,
  Star,
  Clock,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Loader2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
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
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { createPaymentToken, generateBookingRef } from "@/lib/dpo";
import type { Stay, Transport, Experience, Package } from "@/lib/mock-data";
import { useBookingStore } from "@/store/bookingStore";

// ─── Types ───────────────────────────────────────────────────────────────

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
}

// ─── Form State ──────────────────────────────────────────────────────────

interface StayForm {
  name: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  adults: string;
  children: string;
  roomType: string;
  rooms: string;
}

interface ExperienceForm {
  name: string;
  phone: string;
  date: string;
  timeSlot: string;
  adults: string;
  children: string;
}

interface TransportForm {
  name: string;
  phone: string;
  travelDate: string;
  passengers: string;
  departureTime: string;
  travelClass: string;
}

type BookingForm = StayForm | ExperienceForm | TransportForm;

// ─── Props ───────────────────────────────────────────────────────────────

interface BookingFormPageProps {
  listing: ListingData;
  backHref: string;
}

// ─── Component ───────────────────────────────────────────────────────────

export function BookingFormPage({ listing, backHref }: BookingFormPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { addBooking } = useBookingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const isStay = listing.type === "stay";
  const isExperience = listing.type === "experience";
  const isTransport = listing.type === "transport";

  // ─── Initialize form based on listing type ───────────────────────────

  const [stayForm, setStayForm] = useState<StayForm>({
    name: user?.name || "",
    phone: "",
    checkIn: "",
    checkOut: "",
    adults: "1",
    children: "0",
    roomType: "standard",
    rooms: "1",
  });

  const [expForm, setExpForm] = useState<ExperienceForm>({
    name: user?.name || "",
    phone: "",
    date: "",
    timeSlot: "morning",
    adults: "1",
    children: "0",
  });

  const [transportForm, setTransportForm] = useState<TransportForm>({
    name: user?.name || "",
    phone: "",
    travelDate: "",
    passengers: "1",
    departureTime: "morning",
    travelClass: "standard",
  });

  // ─── Price Calculation ────────────────────────────────────────────────

  interface PriceBreakdown {
    subtotal: number;
    serviceFee: number;
    total: number;
    nights: number;
    roomCount: number;
    adultCount: number;
    childCount: number;
    passengerCount: number;
    classMarkup: number;
  }

  const priceBreakdown: PriceBreakdown = useMemo(() => {
    if (isStay) {
      const nights =
        stayForm.checkIn && stayForm.checkOut
          ? Math.max(
              0,
              Math.round(
                (new Date(stayForm.checkOut).getTime() -
                  new Date(stayForm.checkIn).getTime()) /
                  (1000 * 60 * 60 * 24),
              ),
            )
          : 0;
      const roomCount = parseInt(stayForm.rooms) || 1;
      const subtotal = listing.price * nights * roomCount;
      const serviceFee = Math.round(subtotal * 0.05);
      return { subtotal, serviceFee, total: subtotal + serviceFee, nights, roomCount, adultCount: 0, childCount: 0, passengerCount: 0, classMarkup: 0 };
    }

    if (isExperience) {
      const adultCount = parseInt(expForm.adults) || 1;
      const childCount = parseInt(expForm.children) || 0;
      const baseCost = listing.price * adultCount;
      const childCost = Math.round(listing.price * 0.5 * childCount);
      const tax = Math.round((baseCost + childCost) * 0.05);
      return {
        subtotal: baseCost + childCost,
        serviceFee: tax,
        total: baseCost + childCost + tax,
        adultCount,
        childCount,
        nights: 0,
        roomCount: 1,
        passengerCount: 0,
        classMarkup: 0,
      };
    }

    if (isTransport) {
      const passengerCount = parseInt(transportForm.passengers) || 1;
      let classMarkup = 0;
      if (transportForm.travelClass === "business") classMarkup = Math.round(listing.price * 0.4);
      else if (transportForm.travelClass === "first") classMarkup = Math.round(listing.price * 0.8);

      const basePrice = listing.price * passengerCount;
      const additionalCost = classMarkup * passengerCount;
      const serviceFee = Math.round((basePrice + additionalCost) * 0.05);
      return {
        subtotal: basePrice + additionalCost,
        serviceFee,
        total: basePrice + additionalCost + serviceFee,
        passengerCount,
        classMarkup,
        nights: 0,
        roomCount: 1,
        adultCount: 0,
        childCount: 0,
      };
    }

    return { subtotal: 0, serviceFee: 0, total: 0, nights: 0, roomCount: 1, adultCount: 0, childCount: 0, passengerCount: 0, classMarkup: 0 };
  }, [listing, stayForm, expForm, transportForm, isStay, isExperience, isTransport]);

  // ─── Handle Submit ────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (isStay) {
      if (!stayForm.checkIn || !stayForm.checkOut) {
        toast.error("Please select your check-in and check-out dates");
        return;
      }
      if (priceBreakdown.nights <= 0) {
        toast.error("Check-out date must be after check-in date");
        return;
      }
      if (!stayForm.name) {
        toast.error("Please enter your name");
        return;
      }
      if (!stayForm.phone) {
        toast.error("Please enter your phone number");
        return;
      }
    }

    if (isExperience) {
      if (!expForm.date) {
        toast.error("Please select your preferred date");
        return;
      }
      if (!expForm.name || !expForm.phone) {
        toast.error("Please fill in your name and phone number");
        return;
      }
    }

    if (isTransport) {
      if (!transportForm.travelDate) {
        toast.error("Please select your travel date");
        return;
      }
      if (!transportForm.name || !transportForm.phone) {
        toast.error("Please fill in your name and phone number");
        return;
      }
    }

    if (!agreedToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingRef = generateBookingRef();

      // Build extras from form selections
      const extras: Record<string, string | number> = {};
      if (isStay) {
        extras.roomType = stayForm.roomType;
        extras.rooms = parseInt(stayForm.rooms);
        extras.nights = priceBreakdown.nights;
      }
      if (isExperience) {
        extras.timeSlot = expForm.timeSlot;
        extras.adultCount = priceBreakdown.adultCount;
        extras.childCount = priceBreakdown.childCount;
      }
      if (isTransport) {
        extras.travelClass = transportForm.travelClass;
        extras.departureTime = transportForm.departureTime;
        extras.passengerCount = priceBreakdown.passengerCount;
      }

      // Create DPO payment token
      const result = await createPaymentToken({
        bookingRef,
        amount: priceBreakdown.total,
        currency: "ZMW",
        customer: {
          name: isStay ? stayForm.name : isExperience ? expForm.name : transportForm.name,
          phone: isStay ? stayForm.phone : isExperience ? expForm.phone : transportForm.phone,
          email: user?.email,
        },
        listing: {
          id: listing.id,
          name: listing.name,
          type: listing.type,
        },
        details: {
          checkIn: isStay ? stayForm.checkIn : undefined,
          checkOut: isStay ? stayForm.checkOut : undefined,
          date: isExperience ? expForm.date : isTransport ? transportForm.travelDate : undefined,
          guests: isStay
            ? parseInt(stayForm.adults) + parseInt(stayForm.children)
            : isExperience
              ? parseInt(expForm.adults) + parseInt(expForm.children)
              : parseInt(transportForm.passengers),
          extras,
        },
        callbackUrl: `${window.location.origin}/checkout/confirmation?ref=${bookingRef}`,
      });

      if (!result.success) {
        toast.error(result.message || "Payment processing failed. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Save booking to store
      addBooking({
        id: bookingRef,
        bookingRef,
        type: listing.type,
        listingName: listing.name,
        listingId: listing.id,
        location: listing.location,
        image: listing.image,
        amount: priceBreakdown.total,
        currency: "ZMW",
        status: "confirmed",
        transToken: result.transToken,
        customerName: isStay ? stayForm.name : isExperience ? expForm.name : transportForm.name,
        customerPhone: isStay
          ? stayForm.phone
          : isExperience
            ? expForm.phone
            : transportForm.phone,
        details: {
          checkIn: isStay ? stayForm.checkIn : undefined,
          checkOut: isStay ? stayForm.checkOut : undefined,
          date: isExperience
            ? expForm.date
            : isTransport
              ? transportForm.travelDate
              : undefined,
          guests: isStay
            ? parseInt(stayForm.adults) + parseInt(stayForm.children)
            : isExperience
              ? parseInt(expForm.adults) + parseInt(expForm.children)
              : parseInt(transportForm.passengers),
          extras,
        },
        createdAt: new Date().toISOString(),
      });

      // Redirect to DPO PayPage (or mock page in dev mode)
      window.location.href = result.paymentUrl;
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  // ─── Helpers ──────────────────────────────────────────────────────────

  const setFormValue = (field: string, value: string) => {
    if (isStay) setStayForm((f) => ({ ...f, [field]: value }));
    else if (isExperience) setExpForm((f) => ({ ...f, [field]: value }));
    else setTransportForm((f) => ({ ...f, [field]: value }));
  };

  const getFormValue = (field: string): string => {
    if (isStay) return (stayForm as unknown as Record<string, string>)[field] || "";
    if (isExperience) return (expForm as unknown as Record<string, string>)[field] || "";
    return (transportForm as unknown as Record<string, string>)[field] || "";
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link
            href={backHref}
            className="hover:text-primary transition-colors font-medium flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> {listing.name}
          </Link>
          <span>/</span>
          <span className="text-foreground font-semibold">Complete Booking</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-start">
          {/* ─── LEFT: Booking Form ─────────────────────────────────────── */}
          <div>
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground mb-2">
                Complete Your Booking
              </h1>
              <p className="text-muted-foreground">
                Fill in the details below to proceed with your reservation.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Info */}
              <section className="bg-card border border-border/40 rounded-2xl p-6 space-y-5">
                <h2 className="font-black text-base tracking-tight flex items-center gap-2">
                  <User className="h-4.5 w-4.5 text-primary" />
                  Your Details
                </h2>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input
                      placeholder="Ex. John Phiri"
                      value={getFormValue("name")}
                      onChange={(e) => setFormValue("name", e.target.value)}
                      className="pl-9 h-11 rounded-xl border-border/60"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input
                      type="tel"
                      placeholder="+260 97 XXX XXXX"
                      value={getFormValue("phone")}
                      onChange={(e) => setFormValue("phone", e.target.value)}
                      className="pl-9 h-11 rounded-xl border-border/60"
                      required
                    />
                  </div>
                </div>
              </section>

              {/* ─── STAY: Dates & Rooms ──────────────────────────────── */}
              {isStay && (
                <section className="bg-card border border-border/40 rounded-2xl p-6 space-y-5">
                  <h2 className="font-black text-base tracking-tight flex items-center gap-2">
                    <CalendarDays className="h-4.5 w-4.5 text-primary" />
                    Stay Dates & Guests
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Check-In <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        type="date"
                        value={stayForm.checkIn}
                        min={minDate}
                        onChange={(e) =>
                          setStayForm((f) => ({ ...f, checkIn: e.target.value }))
                        }
                        className="h-11 rounded-xl border-border/60 text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Check-Out <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        type="date"
                        value={stayForm.checkOut}
                        min={stayForm.checkIn || minDate}
                        onChange={(e) =>
                          setStayForm((f) => ({ ...f, checkOut: e.target.value }))
                        }
                        className="h-11 rounded-xl border-border/60 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Adults <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={stayForm.adults}
                        onValueChange={(v) => setStayForm((f) => ({ ...f, adults: v }))}
                      >
                        <SelectTrigger className="h-11 rounded-xl border-border/60 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n} Adult{n > 1 ? "s" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Children
                      </Label>
                      <Select
                        value={stayForm.children}
                        onValueChange={(v) => setStayForm((f) => ({ ...f, children: v }))}
                      >
                        <SelectTrigger className="h-11 rounded-xl border-border/60 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, 1, 2, 3, 4].map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n === 0 ? "None" : `${n} Child${n > 1 ? "ren" : ""}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Extras: Room Type & Rooms */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Room Type <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={stayForm.roomType}
                        onValueChange={(v) => setStayForm((f) => ({ ...f, roomType: v }))}
                      >
                        <SelectTrigger className="h-11 rounded-xl border-border/60 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="deluxe">Deluxe</SelectItem>
                          <SelectItem value="suite">Suite</SelectItem>
                          <SelectItem value="family">Family</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Rooms <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={stayForm.rooms}
                        onValueChange={(v) => setStayForm((f) => ({ ...f, rooms: v }))}
                      >
                        <SelectTrigger className="h-11 rounded-xl border-border/60 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n} Room{n > 1 ? "s" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </section>
              )}

              {/* ─── EXPERIENCE: Date & Time ───────────────────────────── */}
              {isExperience && (
                <section className="bg-card border border-border/40 rounded-2xl p-6 space-y-5">
                  <h2 className="font-black text-base tracking-tight flex items-center gap-2">
                    <CalendarDays className="h-4.5 w-4.5 text-primary" />
                    Experience Details
                  </h2>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Preferred Date <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="date"
                      value={expForm.date}
                      min={minDate}
                      onChange={(e) => setExpForm((f) => ({ ...f, date: e.target.value }))}
                      className="h-11 rounded-xl border-border/60 text-sm"
                      required
                    />
                  </div>

                  {!listing.isPackage && (
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Preferred Time Slot <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={expForm.timeSlot}
                        onValueChange={(v) => setExpForm((f) => ({ ...f, timeSlot: v }))}
                      >
                        <SelectTrigger className="h-11 rounded-xl border-border/60 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning Tour (08:30)</SelectItem>
                          <SelectItem value="afternoon">Afternoon Tour (13:30)</SelectItem>
                          <SelectItem value="evening">Sunset Tour (16:30)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Adults <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={expForm.adults}
                        onValueChange={(v) => setExpForm((f) => ({ ...f, adults: v }))}
                      >
                        <SelectTrigger className="h-11 rounded-xl border-border/60 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n} Adult{n > 1 ? "s" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Children
                      </Label>
                      <Select
                        value={expForm.children}
                        onValueChange={(v) => setExpForm((f) => ({ ...f, children: v }))}
                      >
                        <SelectTrigger className="h-11 rounded-xl border-border/60 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, 1, 2, 3, 4].map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n === 0 ? "None" : `${n} Child${n > 1 ? "ren" : ""}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </section>
              )}

              {/* ─── TRANSPORT: Date, Passengers, Class ────────────────── */}
              {isTransport && (
                <section className="bg-card border border-border/40 rounded-2xl p-6 space-y-5">
                  <h2 className="font-black text-base tracking-tight flex items-center gap-2">
                    <CalendarDays className="h-4.5 w-4.5 text-primary" />
                    Travel Details
                  </h2>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Travel Date <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      type="date"
                      value={transportForm.travelDate}
                      min={minDate}
                      onChange={(e) =>
                        setTransportForm((f) => ({ ...f, travelDate: e.target.value }))
                      }
                      className="h-11 rounded-xl border-border/60 text-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Passengers <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={transportForm.passengers}
                        onValueChange={(v) => setTransportForm((f) => ({ ...f, passengers: v }))}
                      >
                        <SelectTrigger className="h-11 rounded-xl border-border/60 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n} Seat{n > 1 ? "s" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Departure <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={transportForm.departureTime}
                        onValueChange={(v) =>
                          setTransportForm((f) => ({ ...f, departureTime: v }))
                        }
                      >
                        <SelectTrigger className="h-11 rounded-xl border-border/60 text-sm uppercase">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning (07:00)</SelectItem>
                          <SelectItem value="midday">Noon (12:00)</SelectItem>
                          <SelectItem value="evening">Evening (17:00)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Class Category <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={transportForm.travelClass}
                      onValueChange={(v) => setTransportForm((f) => ({ ...f, travelClass: v }))}
                    >
                      <SelectTrigger className="h-11 rounded-xl border-border/60 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard Class (+K0)</SelectItem>
                        <SelectItem value="business">
                          Business Class (+K{Math.round(listing.price * 0.4)})
                        </SelectItem>
                        <SelectItem value="first">
                          First Class (+K{Math.round(listing.price * 0.8)})
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </section>
              )}

              {/* ─── Terms & Submit ────────────────────────────────────── */}
              <section className="bg-card border border-border/40 rounded-2xl p-6 space-y-5">
                <h2 className="font-black text-base tracking-tight flex items-center gap-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-primary" />
                  Payment & Confirmation
                </h2>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground font-normal">
                    I agree to the{" "}
                    <Link href="#" className="text-primary underline underline-offset-2">
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-primary underline underline-offset-2">
                      Cancellation Policy
                    </Link>
                    . I understand that payment will be processed securely through DPO PayPage.
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !agreedToTerms}
                  className="w-full h-13 rounded-xl font-black uppercase tracking-widest text-sm shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing Payment...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Proceed to Pay K{priceBreakdown.total.toLocaleString()}
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  You will be redirected to DPO PayPage for secure payment.
                  <br />
                  We accept Mobile Money, Visa, and Mastercard.
                </p>
              </section>
            </form>
          </div>

          {/* ─── RIGHT: Order Summary (Sticky) ─────────────────────────── */}
          <aside className="lg:sticky lg:top-24">
            <div className="bg-card border border-border/40 rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.08)] overflow-hidden">
              {/* Listing Preview */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={listing.image}
                  alt={listing.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                    {listing.type === "stay"
                      ? "Accommodation"
                      : listing.type === "experience"
                        ? "Experience"
                        : "Transport"}
                  </p>
                  <h3 className="font-bold text-white text-sm truncate">{listing.name}</h3>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Quick Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">{listing.location}</span>
                  </div>
                  {listing.rating && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                      <span>
                        {listing.rating.toFixed(1)}
                        {listing.reviews ? ` (${listing.reviews} reviews)` : ""}
                      </span>
                    </div>
                  )}
                  {listing.duration && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{listing.duration}</span>
                    </div>
                  )}
                </div>

                <div className="h-px bg-border/40" />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Price Breakdown
                  </p>

                  {isStay && priceBreakdown.nights > 0 && (
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>
                          K{listing.price} × {priceBreakdown.nights} night
                          {priceBreakdown.nights > 1 ? "s" : ""} × {priceBreakdown.roomCount} room
                          {priceBreakdown.roomCount > 1 ? "s" : ""}
                        </span>
                        <span className="font-semibold text-foreground">
                          K{priceBreakdown.subtotal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Service fee (5%)</span>
                        <span className="font-semibold text-foreground">
                          K{priceBreakdown.serviceFee.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {isExperience && (
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>
                          {listing.isPackage
                            ? "Package rate"
                            : `K${listing.price} × ${priceBreakdown.adultCount} adult${priceBreakdown.adultCount > 1 ? "s" : ""}`}
                        </span>
                        <span className="font-semibold text-foreground">
                          K{priceBreakdown.subtotal.toLocaleString()}
                        </span>
                      </div>
                      {priceBreakdown.childCount > 0 && (
                        <div className="flex justify-between text-muted-foreground">
                          <span>
                            Children (× {priceBreakdown.childCount})
                          </span>
                          <span className="font-semibold text-foreground">
                            K{Math.round(listing.price * 0.5 * priceBreakdown.childCount)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-muted-foreground">
                        <span>Tourism levy (5%)</span>
                        <span className="font-semibold text-foreground">
                          K{priceBreakdown.serviceFee.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {isTransport && transportForm.travelDate && (
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>
                          K{listing.price} × {priceBreakdown.passengerCount} seat
                          {priceBreakdown.passengerCount > 1 ? "s" : ""}
                        </span>
                        <span className="font-semibold text-foreground">
                          K{(listing.price * priceBreakdown.passengerCount).toLocaleString()}
                        </span>
                      </div>
                      {priceBreakdown.classMarkup > 0 && (
                        <div className="flex justify-between text-muted-foreground">
                          <span>Class upgrade</span>
                          <span className="font-semibold text-foreground">
                            K
                            {(priceBreakdown.classMarkup * priceBreakdown.passengerCount).toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-muted-foreground">
                        <span>Booking fee (5%)</span>
                        <span className="font-semibold text-foreground">
                          K{priceBreakdown.serviceFee.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between font-black text-foreground border-t border-border/40 pt-2 mt-1 text-base">
                    <span>Total</span>
                    <span className="text-primary">
                      K{priceBreakdown.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-border/40" />

                {/* Trust Badges */}
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Secure payment via DPO PayPage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Mobile Money, Visa, Mastercard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Free cancellation per policy</span>
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
