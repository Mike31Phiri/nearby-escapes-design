"use client";

import { useState, useMemo } from"react";
import Link from"next/link";
import { useRouter, useSearchParams } from"next/navigation";
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
 Check,
 Plus,
 Lock,
 Mail,
 Receipt,
 Truck,
 HelpCircle,
 Home,
} from"lucide-react";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import { Label } from"@/components/ui/label";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from"@/components/ui/select";
import { toast } from"sonner";
import { useAuth } from"@/lib/store/authStore";
import { createPaymentToken, generateBookingRef } from"@/lib/dpo";
import { useBookingStore } from"@/store/bookingStore";
import { useProfileStore } from"@/store/profileStore";

//Types ───────────────────────────────────────────────────────────────

type ListingType ="stay"|"experience"|"transport";

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

interface StayForm {
 name: string;
 email: string;
 phone: string;
 homeCity: string;
 checkIn: string;
 checkOut: string;
 adults: string;
 children: string;
 roomType: string;
 rooms: string;
}

interface ExperienceForm {
 name: string;
 email: string;
 phone: string;
 homeCity: string;
 date: string;
 timeSlot: string;
 groupType: string;
 adults: string;
 children: string;
}

interface TransportForm {
 name: string;
 email: string;
 phone: string;
 homeCity: string;
 travelDate: string;
 passengers: string;
 departureTime: string;
 travelClass: string;
}

interface BookingFormPageProps {
 listing: ListingData;
 backHref: string;
}

function parseDateParam(val: string | null): string {
 if (!val) return"";
 if (val.includes("18 Jul")) return"2026-07-18";
 if (val.includes("20 Jul")) return"2026-07-20";
 if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
 return"";
}

//Component ───────────────────────────────────────────────────────────

export function BookingFormPage({ listing, backHref }: BookingFormPageProps) {
 const router = useRouter();
 const searchParams = useSearchParams();
 const { user } = useAuth();
 const { addBooking } = useBookingStore();
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [agreedToTerms, setAgreedToTerms] = useState(false);

 const isStay = listing.type ==="stay";
 const isExperience = listing.type ==="experience";
 const isTransport = listing.type ==="transport";

 // Parse query parameters from detail page redirect
 const paramGuests = searchParams.get("guests");
 const paramTransport = searchParams.get("transport");
 const paramCheckIn = searchParams.get("checkIn");
 const paramCheckOut = searchParams.get("checkOut");

 const parsedCheckIn = useMemo(() => parseDateParam(paramCheckIn), [paramCheckIn]);
 const parsedCheckOut = useMemo(() => parseDateParam(paramCheckOut), [paramCheckOut]);
 const parsedAdults = useMemo(() => {
 if (!paramGuests) return"2"; // Default to 2 adults as in mockup
 const g = parseInt(paramGuests);
 if (g <= 1) return"1";
 return String(g - 1); // 1 child, rest adults
 }, [paramGuests]);
 const parsedChildren = useMemo(() => {
 if (!paramGuests) return"1"; // Default to 1 child as in mockup
 return"1";
 }, [paramGuests]);

 const { saveCheckoutInfo, phone: savedPhone, homeCity: savedHomeCity } = useProfileStore();

 const [stayForm, setStayForm] = useState<StayForm>({
 name: user?.name ||"",
 email: user?.email ||"",
 phone: savedPhone ||"",
 homeCity: savedHomeCity ||"",
 checkIn: parsedCheckIn ||"2026-07-18",
 checkOut: parsedCheckOut ||"2026-07-20",
 adults: parsedAdults,
 children: parsedChildren,
 roomType:"standard",
 rooms:"1",
 });

 const [expForm, setExpForm] = useState<ExperienceForm>({
 name: user?.name ||"",
 email: user?.email ||"",
 phone: savedPhone ||"",
 homeCity: savedHomeCity ||"",
 date:"",
 timeSlot:"morning",
 groupType:"individual",
 adults:"1",
 children:"0",
 });

 const [transportForm, setTransportForm] = useState<TransportForm>({
 name: user?.name ||"",
 email: user?.email ||"",
 phone: savedPhone ||"",
 homeCity: savedHomeCity ||"",
 travelDate:"",
 passengers:"1",
 departureTime:"morning",
 travelClass:"standard",
 });

 // Stays Add-ons
 const [addTransport, setAddTransport] = useState(
 paramTransport ==="true"|| paramTransport === null,
 );
 const [addFarmTour, setAddFarmTour] = useState(true);
 const [addBushBraai, setAddBushBraai] = useState(true);

 // Promo code
 const [promoCode, setPromoCode] = useState("");
 const [promoDiscount, setPromoDiscount] = useState(0);

 const handleApplyPromo = () => {
 if (!promoCode) return;
 if (promoCode.toUpperCase() ==="ESCAPE10") {
 setPromoDiscount(10);
 toast.success("Promo code ESCAPE10 applied: 10% discount!");
 } else {
 toast.error("Invalid promo code");
 }
 };

 //Price Calculation ────────────────────────────────────────────────

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
 stayCost: number;
 transportCost: number;
 farmTourCost: number;
 bushBraaiCost: number;
 discount: number;
 }

 const priceBreakdown: PriceBreakdown = useMemo(() => {
 if (isStay) {
 const nights =
 stayForm.checkIn && stayForm.checkOut
 ? Math.max(
 0,
 Math.round(
 (new Date(stayForm.checkOut).getTime() - new Date(stayForm.checkIn).getTime()) /
 (1000 * 60 * 60 * 24),
 ),
 )
 : 0;
 const roomCount = parseInt(stayForm.rooms) || 1;
 const stayCost = listing.price * nights * roomCount;

 const transportCost = addTransport ? 280 : 0;
 const adultCount = parseInt(stayForm.adults) || 2;
 const childCount = parseInt(stayForm.children) || 0;
 const farmTourCost = addFarmTour ? 150 * adultCount : 0;
 const bushBraaiCost = addBushBraai ? 200 * (adultCount + childCount) : 0;

 // 10% Weekend discount on the stay rate
 const discount = Math.round(stayCost * 0.1);

 const subtotalBeforePromo =
 stayCost + transportCost + farmTourCost + bushBraaiCost - discount;
 const promoDeduction =
 promoDiscount > 0 ? Math.round(subtotalBeforePromo * (promoDiscount / 100)) : 0;
 const subtotal = subtotalBeforePromo - promoDeduction;

 const serviceFee = Math.round(stayCost * 0.05); // 5% of base stay
 return {
 subtotal,
 serviceFee,
 total: subtotal + serviceFee,
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
 discount: discount + promoDeduction,
 };
 }

 if (isExperience) {
 const adultCount = parseInt(expForm.adults) || 1;
 const childCount = parseInt(expForm.children) || 0;
 const baseCost = listing.price * adultCount;
 const childCost = Math.round(listing.price * 0.5 * childCount);

 const subtotalBeforePromo = baseCost + childCost;
 const promoDeduction =
 promoDiscount > 0 ? Math.round(subtotalBeforePromo * (promoDiscount / 100)) : 0;
 const subtotal = subtotalBeforePromo - promoDeduction;

 const tax = Math.round(subtotal * 0.05);
 return {
 subtotal,
 serviceFee: tax,
 total: subtotal + tax,
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
 discount: promoDeduction,
 };
 }

 if (isTransport) {
 const passengerCount = parseInt(transportForm.passengers) || 1;
 let classMarkup = 0;
 if (transportForm.travelClass ==="business") classMarkup = Math.round(listing.price * 0.4);
 else if (transportForm.travelClass ==="first") classMarkup = Math.round(listing.price * 0.8);

 const basePrice = listing.price * passengerCount;
 const additionalCost = classMarkup * passengerCount;

 const subtotalBeforePromo = basePrice + additionalCost;
 const promoDeduction =
 promoDiscount > 0 ? Math.round(subtotalBeforePromo * (promoDiscount / 100)) : 0;
 const subtotal = subtotalBeforePromo - promoDeduction;

 const serviceFee = Math.round(subtotal * 0.05);
 return {
 subtotal,
 serviceFee,
 total: subtotal + serviceFee,
 passengerCount,
 classMarkup,
 nights: 0,
 roomCount: 1,
 adultCount: 0,
 childCount: 0,
 stayCost: 0,
 transportCost: 0,
 farmTourCost: 0,
 bushBraaiCost: 0,
 discount: promoDeduction,
 };
 }

 return {
 subtotal: 0,
 serviceFee: 0,
 total: 0,
 nights: 0,
 roomCount: 1,
 adultCount: 0,
 childCount: 0,
 passengerCount: 0,
 classMarkup: 0,
 stayCost: 0,
 transportCost: 0,
 farmTourCost: 0,
 bushBraaiCost: 0,
 discount: 0,
 };
 }, [
 listing,
 stayForm,
 expForm,
 transportForm,
 isStay,
 isExperience,
 isTransport,
 addTransport,
 addFarmTour,
 addBushBraai,
 promoDiscount,
 ]);

 //Handle Submit ────────────────────────────────────────────────────

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();

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

 const extras: Record<string, string | number> = {};
 if (isStay) {
 extras.roomType = stayForm.roomType;
 extras.rooms = parseInt(stayForm.rooms);
 extras.nights = priceBreakdown.nights;
 extras.transportSelected = addTransport ?"Yes":"No";
 extras.farmTourSelected = addFarmTour ?"Yes":"No";
 extras.bushBraaiSelected = addBushBraai ?"Yes":"No";
 }
 if (isExperience) {
 extras.timeSlot = expForm.timeSlot;
 extras.groupType = expForm.groupType;
 extras.adultCount = priceBreakdown.adultCount;
 extras.childCount = priceBreakdown.childCount;
 }
 if (isTransport) {
 extras.travelClass = transportForm.travelClass;
 extras.departureTime = transportForm.departureTime;
 extras.passengerCount = priceBreakdown.passengerCount;
 }

 saveCheckoutInfo({
 phone: isStay ? stayForm.phone : isExperience ? expForm.phone : transportForm.phone,
 homeCity: isStay
 ? stayForm.homeCity
 : isExperience
 ? expForm.homeCity
 : transportForm.homeCity,
 });

 const profileStore = useProfileStore.getState();
 if (!profileStore.hasSeenTravelPrompt) {
 profileStore.triggerTravelPreferences();
 }

 const result = await createPaymentToken({
 bookingRef,
 amount: priceBreakdown.total,
 currency:"ZMW",
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
 toast.error(result.message ||"Payment processing failed. Please try again.");
 setIsSubmitting(false);
 return;
 }

 addBooking({
 id: bookingRef,
 bookingRef,
 type: listing.type,
 listingName: listing.name,
 listingId: listing.id,
 location: listing.location,
 image: listing.image,
 amount: priceBreakdown.total,
 currency:"ZMW",
 status:"confirmed",
 transToken: result.transToken,
 customerName: isStay ? stayForm.name : isExperience ? expForm.name : transportForm.name,
 customerPhone: isStay ? stayForm.phone : isExperience ? expForm.phone : transportForm.phone,
 customerEmail: isStay ? stayForm.email : isExperience ? expForm.email : transportForm.email,
 hostName:"Chanda Bwalya",
 hostEmail:"chanda.bwalya@nearbyescapes.com",
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
 createdAt: new Date().toISOString(),
 });

 window.location.href = result.paymentUrl;
 } catch (err) {
 toast.error("Something went wrong. Please try again.");
 setIsSubmitting(false);
 }
 };

 const setFormValue = (field: string, value: string) => {
 if (isStay) setStayForm((f) => ({ ...f, [field]: value }));
 else if (isExperience) setExpForm((f) => ({ ...f, [field]: value }));
 else setTransportForm((f) => ({ ...f, [field]: value }));
 };

 const getFormValue = (field: string): string => {
 if (isStay) return (stayForm as unknown as Record<string, string>)[field] ||"";
 if (isExperience) return (expForm as unknown as Record<string, string>)[field] ||"";
 return (transportForm as unknown as Record<string, string>)[field] ||"";
 };

 const minDate = new Date().toISOString().split("T")[0];

 return (
 <div className="min-h-screen flex flex-col bg-[#F9F7F2] font-sans pb-24 lg:pb-8">
 <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
 {/* Breadcrumb - ALWAYS added & visible on both mobile and desktop */}
 <div className="flex items-center gap-2 text-base text-muted-foreground mb-6">
 <Link
 href={backHref}
 className="hover:text-primary transition-colors font-medium flex items-center gap-1"
 >
 <ChevronLeft className="h-4 w-4"/> {listing.name}
 </Link>
 <span className="text-muted-foreground/30">/</span>
 <span className="text-foreground font-semibold">Review booking</span>
 </div>

 {/* Custom Progress Stepper */}
 {/* Desktop Stepper */}
 <div className="hidden lg:flex items-center justify-between bg-card border border-border/40 rounded-2xl p-5 mb-8 shadow-sm">
 <div className="flex items-center gap-2">
 <div className="w-6 h-6 rounded-full bg-[#f2ba0d] text-[#F9F7F2] text-sm font-bold flex items-center justify-center">
 <Check className="h-3.5 w-3.5"/>
 </div>
 <span className="text-sm font-semibold text-[#1f1433]">Choose your escape</span>
 </div>
 <div className="flex-1 h-0.5 bg-[#f2ba0d] mx-6"/>
 <div className="flex items-center gap-2">
 <div className="w-6 h-6 rounded-full bg-[#f2ba0d] text-[#334155] text-sm font-bold flex items-center justify-center">
 2
 </div>
 <span className="text-sm font-bold text-[#1f1433]">Review booking</span>
 </div>
 <div className="flex-1 h-0.5 bg-border/40 mx-6"/>
 <div className="flex items-center gap-2 opacity-65">
 <div className="w-6 h-6 rounded-full bg-[#E8E3DC] text-[#64748B] text-sm font-bold flex items-center justify-center">
 3
 </div>
 <span className="text-sm font-medium text-[#64748B]">Payment</span>
 </div>
 <div className="flex-1 h-0.5 bg-border/40 mx-6"/>
 <div className="flex items-center gap-2 opacity-65">
 <div className="w-6 h-6 rounded-full bg-[#E8E3DC] text-[#64748B] text-sm font-bold flex items-center justify-center">
 4
 </div>
 <span className="text-sm font-medium text-[#64748B]">Confirmation</span>
 </div>
 </div>

 {/* Mobile Stepper */}
 <div className="lg:hidden flex items-center justify-between bg-card border border-border/40 rounded-2xl p-4 mb-6 shadow-sm">
 <div className="flex flex-col items-center gap-1.5 flex-1">
 <div className="w-6 h-6 rounded-full bg-[#f2ba0d] text-[#F9F7F2] text-sm font-bold flex items-center justify-center">
 <Check className="h-3 w-3"/>
 </div>
 <span className="text-[10px] font-bold text-[#1f1433]">Choose</span>
 </div>
 <div className="w-6 h-0.5 bg-[#f2ba0d] mb-4 shrink-0"/>
 <div className="flex flex-col items-center gap-1.5 flex-1">
 <div className="w-6 h-6 rounded-full bg-[#f2ba0d] text-[#334155] text-sm font-bold flex items-center justify-center">
 2
 </div>
 <span className="text-[10px] font-bold text-[#1f1433]">Review</span>
 </div>
 <div className="w-6 h-0.5 bg-[#E8E3DC] mb-4 shrink-0"/>
 <div className="flex flex-col items-center gap-1.5 flex-1">
 <div className="w-6 h-6 rounded-full bg-[#E8E3DC] text-[#64748B] text-sm font-bold flex items-center justify-center">
 3
 </div>
 <span className="text-[10px] font-medium text-[#64748B]">Pay</span>
 </div>
 <div className="w-6 h-0.5 bg-[#E8E3DC] mb-4 shrink-0"/>
 <div className="flex flex-col items-center gap-1.5 flex-1">
 <div className="w-6 h-6 rounded-full bg-[#E8E3DC] text-[#64748B] text-sm font-bold flex items-center justify-center">
 4
 </div>
 <span className="text-[10px] font-medium text-[#64748B]">Confirm</span>
 </div>
 </div>

 {/* Single form wrapping the main workspace to allow native submit actions from sidebar or sticky bar */}
 <form
 onSubmit={handleSubmit}
 className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start"
 >
 {/* LEFT: Main Booking Content Stack */}
 <div className="space-y-6">
 {/* Mobile Only: Your Escape Card */}
 <div className="bg-card border border-border/40 rounded-2xl p-4 shadow-sm lg:hidden">
 <div className="flex items-center justify-between mb-3 border-b border-border/40 pb-2">
 <div className="flex items-center gap-2">
 <div className="w-7 h-7 rounded-lg bg-[#EDE8F5] flex items-center justify-center">
 <Home className="h-4 w-4 text-[#1f1433]"/>
 </div>
 <span className="font-bold text-sm text-[#334155]">Your escape</span>
 </div>
 <Link href={backHref} className="text-sm text-[#1f1433] font-bold hover:underline">
 Change
 </Link>
 </div>
 <div className="flex gap-3 items-center">
 <img
 src={listing.image}
 alt={listing.name}
 className="w-16 h-14 rounded-xl object-cover shrink-0"
 />
 <div className="min-w-0">
 <span className="text-[10px] font-bold text-[#1f1433] uppercase tracking-wider">
 {listing.type ==="stay"?"Farm stay": listing.type}
 </span>
 <h4 className="font-bold text-sm text-[#334155] truncate">{listing.name}</h4>
 <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
 <MapPin className="h-3 w-3 text-[#1f1433]"/>
 <span className="truncate">{listing.location}</span>
 </div>
 <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
 <Star className="h-3 w-3 fill-[#1f1433] text-[#1f1433]"/>
 <span>
 {listing.rating ? listing.rating.toFixed(1) :"4.8"} · (
 {listing.reviews ||"63"} reviews)
 </span>
 </div>
 </div>
 </div>
 </div>

 {/* Desktop Only: Your Escape Card */}
 <div className="bg-card border border-border/40 rounded-2xl p-5 shadow-sm hidden lg:block">
 <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 rounded-lg bg-[#EDE8F5] flex items-center justify-center">
 <Home className="h-4.5 w-4.5 text-[#1f1433]"/>
 </div>
 <span className="font-bold text-base text-[#334155]">Your escape</span>
 </div>
 <Link href={backHref} className="text-sm text-[#1f1433] font-bold hover:underline">
 Change
 </Link>
 </div>
 <div className="flex gap-4 items-center">
 <img
 src={listing.image}
 alt={listing.name}
 className="w-20 h-16 rounded-xl object-cover shrink-0"
 />
 <div className="min-w-0">
 <span className="text-sm font-bold text-[#1f1433] uppercase tracking-wider">
 {listing.type ==="stay"?"Farm stay": listing.type}
 </span>
 <h3 className="font-bold text-lg text-[#334155] truncate">{listing.name}</h3>
 <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
 <MapPin className="h-3.5 w-3.5 text-[#1f1433]"/>
 <span className="truncate">{listing.location} · 1.5 hrs from Lusaka</span>
 </div>
 <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
 <Star className="h-3 w-3 fill-[#1f1433] text-[#1f1433]"/>
 <span>
 {listing.rating ? listing.rating.toFixed(1) :"4.8"} ·{""}
 {listing.reviews ||"63"} reviews · Hosted by Beatrice M.
 </span>
 </div>
 </div>
 </div>
 </div>

 {/* Dates & Guests Inputs Card */}
 <section className="bg-card border border-border/40 rounded-2xl shadow-sm p-5 space-y-4">
 <div className="flex items-center gap-2 border-b border-border/40 pb-3">
 <div className="w-7 h-7 rounded-lg bg-[#FFF4DC] flex items-center justify-center">
 <CalendarDays className="h-4 w-4 text-[#1f1433]"/>
 </div>
 <h2 className="font-bold text-base text-[#334155]">Dates & guests</h2>
 </div>

 {isStay && (
 <div className="space-y-4">
 <div className="grid grid-cols-2 gap-3">
 <div className="space-y-1">
 <Label className="text-[10px] font-bold uppercase tracking-wider text-[#1f1433]">
 Check-In
 </Label>
 <Input
 type="date"
 value={stayForm.checkIn}
 min={minDate}
 onChange={(e) => setStayForm((f) => ({ ...f, checkIn: e.target.value }))}
 className="h-10 rounded-xl border-border/60 bg-[#F9F7F2] text-sm font-semibold"
 required
 />
 </div>
 <div className="space-y-1">
 <Label className="text-[10px] font-bold uppercase tracking-wider text-[#1f1433]">
 Check-Out
 </Label>
 <Input
 type="date"
 value={stayForm.checkOut}
 min={stayForm.checkIn || minDate}
 onChange={(e) => setStayForm((f) => ({ ...f, checkOut: e.target.value }))}
 className="h-10 rounded-xl border-border/60 bg-[#F9F7F2] text-sm font-semibold"
 required
 />
 </div>
 </div>

 <div className="grid grid-cols-3 gap-3 bg-[#F9F7F2] p-3.5 rounded-xl border border-border/40">
 <div className="text-center">
 <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
 Duration
 </div>
 <div className="text-sm font-bold text-foreground mt-0.5">
 {priceBreakdown.nights} night{priceBreakdown.nights !== 1 ?"s":""}
 </div>
 </div>
 <div className="border-x border-border/40 text-center">
 <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
 Adults
 </div>
 <div className="flex justify-center mt-1">
 <select
 value={stayForm.adults}
 onChange={(e) => setStayForm((f) => ({ ...f, adults: e.target.value }))}
 className="bg-transparent text-sm font-bold text-foreground focus:outline-none"
 >
 {[1, 2, 3, 4, 5, 6].map((n) => (
 <option key={n} value={String(n)}>
 {n}
 </option>
 ))}
 </select>
 </div>
 </div>
 <div className="text-center">
 <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
 Children
 </div>
 <div className="flex justify-center mt-1">
 <select
 value={stayForm.children}
 onChange={(e) => setStayForm((f) => ({ ...f, children: e.target.value }))}
 className="bg-transparent text-sm font-bold text-foreground focus:outline-none"
 >
 {[0, 1, 2, 3, 4].map((n) => (
 <option key={n} value={String(n)}>
 {n}
 </option>
 ))}
 </select>
 </div>
 </div>
 </div>
 </div>
 )}

 {isExperience && (
 <div className="space-y-4">
 <div className="space-y-1">
 <Label className="text-[10px] font-bold uppercase tracking-wider text-[#1f1433]">
 Preferred Date
 </Label>
 <Input
 type="date"
 value={expForm.date}
 min={minDate}
 onChange={(e) => setExpForm((f) => ({ ...f, date: e.target.value }))}
 className="h-10 rounded-xl border-border/60 bg-[#F9F7F2] text-sm font-semibold"
 required
 />
 </div>
 <div className="grid grid-cols-2 gap-3">
 <div className="space-y-1">
 <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
 Adults
 </Label>
 <Select
 value={expForm.adults}
 onValueChange={(v) => setExpForm((f) => ({ ...f, adults: v }))}
 >
 <SelectTrigger className="h-10 rounded-xl border-border/60 bg-[#F9F7F2] text-sm">
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
 <SelectItem key={n} value={String(n)}>
 {n} Adults
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 </div>
 <div className="space-y-1">
 <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
 Children
 </Label>
 <Select
 value={expForm.children}
 onValueChange={(v) => setExpForm((f) => ({ ...f, children: v }))}
 >
 <SelectTrigger className="h-10 rounded-xl border-border/60 bg-[#F9F7F2] text-sm">
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 {[0, 1, 2, 3, 4].map((n) => (
 <SelectItem key={n} value={String(n)}>
 {n} Children
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 </div>
 </div>
 </div>
 )}

 {isTransport && (
 <div className="space-y-4">
 <div className="space-y-1">
 <Label className="text-[10px] font-bold uppercase tracking-wider text-[#1f1433]">
 Travel Date
 </Label>
 <Input
 type="date"
 value={transportForm.travelDate}
 min={minDate}
 onChange={(e) =>
 setTransportForm((f) => ({ ...f, travelDate: e.target.value }))
 }
 className="h-10 rounded-xl border-border/60 bg-[#F9F7F2] text-sm font-semibold"
 required
 />
 </div>
 <div className="grid grid-cols-2 gap-3">
 <div className="space-y-1">
 <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
 Seats/Passengers
 </Label>
 <Select
 value={transportForm.passengers}
 onValueChange={(v) => setTransportForm((f) => ({ ...f, passengers: v }))}
 >
 <SelectTrigger className="h-10 rounded-xl border-border/60 bg-[#F9F7F2] text-sm">
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 {[1, 2, 3, 4, 5, 6].map((n) => (
 <SelectItem key={n} value={String(n)}>
 {n} Seats
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 </div>
 <div className="space-y-1">
 <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
 Travel Class
 </Label>
 <Select
 value={transportForm.travelClass}
 onValueChange={(v) => setTransportForm((f) => ({ ...f, travelClass: v }))}
 >
 <SelectTrigger className="h-10 rounded-xl border-border/60 bg-[#F9F7F2] text-sm">
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="standard">Standard</SelectItem>
 <SelectItem value="business">Business (+40%)</SelectItem>
 <SelectItem value="first">First (+80%)</SelectItem>
 </SelectContent>
 </Select>
 </div>
 </div>
 </div>
 )}
 </section>

 {/* Guest Personal Information Inputs Card */}
 <section className="bg-card border border-border/40 rounded-2xl shadow-sm p-5 space-y-4">
 <div className="flex items-center gap-2 border-b border-border/40 pb-3">
 <div className="w-7 h-7 rounded-lg bg-[#EDE8F5] flex items-center justify-center">
 <User className="h-4 w-4 text-[#1f1433]"/>
 </div>
 <h2 className="font-bold text-base text-[#334155]">Your Details</h2>
 </div>

 <div className="space-y-4">
 <div className="space-y-1">
 <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
 Full Name *
 </Label>
 <div className="relative">
 <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50"/>
 <Input
 placeholder="e.g. Mike Phiri"
 value={getFormValue("name")}
 onChange={(e) => setFormValue("name", e.target.value)}
 className="pl-9 h-10 rounded-xl border-border/60 bg-[#F9F7F2] text-sm"
 required
 />
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 <div className="space-y-1">
 <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
 Phone Number *
 </Label>
 <div className="relative">
 <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50"/>
 <Input
 type="tel"
 placeholder="+260 97 XXX XXXX"
 value={getFormValue("phone")}
 onChange={(e) => setFormValue("phone", e.target.value)}
 className="pl-9 h-10 rounded-xl border-border/60 bg-[#F9F7F2] text-sm"
 required
 />
 </div>
 </div>
 <div className="space-y-1">
 <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
 Email Address *
 </Label>
 <div className="relative">
 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50"/>
 <Input
 type="email"
 placeholder="guest@example.com"
 value={getFormValue("email")}
 onChange={(e) => setFormValue("email", e.target.value)}
 className="pl-9 h-10 rounded-xl border-border/60 bg-[#F9F7F2] text-sm"
 required
 />
 </div>
 </div>
 </div>
 <div className="space-y-1">
 <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
 Home City
 </Label>
 <div className="relative">
 <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50"/>
 <Input
 placeholder="e.g. Lusaka"
 value={getFormValue("homeCity")}
 onChange={(e) => setFormValue("homeCity", e.target.value)}
 className="pl-9 h-10 rounded-xl border-border/60 bg-[#F9F7F2] text-sm"
 />
 </div>
 </div>
 </div>
 </section>

 {/* Add-ons Selected Card (Stays Only) */}
 {isStay && (
 <section className="bg-card border border-border/40 rounded-2xl shadow-sm p-5 space-y-4">
 <div className="flex items-center gap-2 border-b border-border/40 pb-3">
 <div className="w-7 h-7 rounded-lg bg-[#E6F4EE] flex items-center justify-center">
 <Plus className="h-4 w-4 text-[#2A5C3F]"/>
 </div>
 <h2 className="font-bold text-base text-[#334155]">Add-ons selected</h2>
 </div>

 <div className="space-y-3">
 {/* Transport */}
 <div className="flex items-center justify-between p-3.5 bg-[#EDE8F5]/50 border border-[#1f1433]/10 rounded-xl hover:bg-[#EDE8F5]/85 transition-all">
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 rounded-lg bg-[#f2ba0d] flex items-center justify-center shrink-0">
 <Truck className="h-4.5 w-4.5 text-[#1f1433]"/>
 </div>
 <div>
 <div className="text-sm font-bold text-[#1f1433]">
 Return transport pickup
 </div>
 <div className="text-[10px] text-[#6A5A8A] mt-0.5">
 Lusaka CBD → Farm → Lusaka CBD
 </div>
 </div>
 </div>
 <div className="flex items-center gap-3 shrink-0">
 <span className="text-sm font-bold text-[#1f1433]">K280</span>
 <input
 type="checkbox"
 checked={addTransport}
 onChange={(e) => setAddTransport(e.target.checked)}
 className="h-4 w-4 rounded border-border text-[#1f1433] focus:ring-[#1f1433]"
 />
 </div>
 </div>

 {/* Farm Tour */}
 <div className="flex items-center justify-between p-3.5 bg-muted/40 border border-border/40 rounded-xl hover:bg-muted/65 transition-all">
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 rounded-lg bg-[#1C2A1A] flex items-center justify-center shrink-0">
 <Check className="h-4.5 w-4.5 text-[#5A8A40]"/>
 </div>
 <div>
 <div className="text-sm font-bold text-foreground">Farm tour & milking</div>
 <div className="text-[10px] text-muted-foreground mt-0.5">
 Sat 19 Jul · {stayForm.adults} adult
 {(parseInt(stayForm.adults) || 2) > 1 ?"s":""}
 </div>
 </div>
 </div>
 <div className="flex items-center gap-3 shrink-0">
 <span className="text-sm font-bold text-foreground">
 K{150 * (parseInt(stayForm.adults) || 2)}
 </span>
 <input
 type="checkbox"
 checked={addFarmTour}
 onChange={(e) => setAddFarmTour(e.target.checked)}
 className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
 />
 </div>
 </div>

 {/* Bush Braai */}
 <div className="flex items-center justify-between p-3.5 bg-muted/40 border border-border/40 rounded-xl hover:bg-muted/65 transition-all">
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 rounded-lg bg-[#2A1A08] flex items-center justify-center shrink-0">
 <Check className="h-4.5 w-4.5 text-[#C9703A]"/>
 </div>
 <div>
 <div className="text-sm font-bold text-foreground">Bush braai evening</div>
 <div className="text-[10px] text-muted-foreground mt-0.5">
 Sat 19 Jul · {parseInt(stayForm.adults) + parseInt(stayForm.children)}{""}
 guests
 </div>
 </div>
 </div>
 <div className="flex items-center gap-3 shrink-0">
 <span className="text-sm font-bold text-foreground">
 K
 {200 *
 ((parseInt(stayForm.adults) || 2) + (parseInt(stayForm.children) || 0))}
 </span>
 <input
 type="checkbox"
 checked={addBushBraai}
 onChange={(e) => setAddBushBraai(e.target.checked)}
 className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
 />
 </div>
 </div>
 </div>
 </section>
 )}

 {/* Mobile Only: Price breakdown card inline */}
 <div className="bg-card border border-border/40 rounded-2xl p-5 shadow-sm lg:hidden space-y-4">
 <div className="flex items-center gap-2 border-b border-border/40 pb-3">
 <div className="w-7 h-7 rounded-lg bg-[#FFF4DC] flex items-center justify-center">
 <Receipt className="h-4 w-4 text-[#1f1433]"/>
 </div>
 <h3 className="font-bold text-base text-[#334155]">Price breakdown</h3>
 </div>

 <div className="space-y-2 text-sm">
 {isStay && (
 <>
 <div className="flex justify-between text-muted-foreground">
 <span>
 K{listing.price} × {priceBreakdown.nights} nights
 </span>
 <span className="font-bold text-foreground">
 K{priceBreakdown.stayCost.toLocaleString()}
 </span>
 </div>
 {addTransport && (
 <div className="flex justify-between text-muted-foreground">
 <span>Return transport</span>
 <span className="font-bold text-foreground">K280</span>
 </div>
 )}
 {addFarmTour && (
 <div className="flex justify-between text-muted-foreground">
 <span>Farm tour (×{priceBreakdown.adultCount})</span>
 <span className="font-bold text-foreground">
 K{priceBreakdown.farmTourCost.toLocaleString()}
 </span>
 </div>
 )}
 {addBushBraai && (
 <div className="flex justify-between text-muted-foreground">
 <span>
 Bush braai (×{priceBreakdown.adultCount + priceBreakdown.childCount})
 </span>
 <span className="font-bold text-foreground">
 K{priceBreakdown.bushBraaiCost.toLocaleString()}
 </span>
 </div>
 )}
 <div className="flex justify-between text-emerald-600 font-medium">
 <span>Weekend deal (10% discount)</span>
 <span>− K{Math.round(priceBreakdown.stayCost * 0.1).toLocaleString()}</span>
 </div>
 </>
 )}

 {isExperience && (
 <>
 <div className="flex justify-between text-muted-foreground">
 <span>Base rate (×{priceBreakdown.adultCount})</span>
 <span className="font-bold text-foreground">
 K{priceBreakdown.subtotal.toLocaleString()}
 </span>
 </div>
 {priceBreakdown.childCount > 0 && (
 <div className="flex justify-between text-muted-foreground">
 <span>Children (×{priceBreakdown.childCount})</span>
 <span className="font-bold text-foreground">
 K
 {Math.round(
 listing.price * 0.5 * priceBreakdown.childCount,
 ).toLocaleString()}
 </span>
 </div>
 )}
 </>
 )}

 {isTransport && (
 <>
 <div className="flex justify-between text-muted-foreground">
 <span>
 K{listing.price} × {priceBreakdown.passengerCount} seat
 {priceBreakdown.passengerCount !== 1 ?"s":""}
 </span>
 <span className="font-bold text-foreground">
 K{(listing.price * priceBreakdown.passengerCount).toLocaleString()}
 </span>
 </div>
 {priceBreakdown.classMarkup > 0 && (
 <div className="flex justify-between text-muted-foreground">
 <span>Class upgrade</span>
 <span className="font-bold text-foreground">
 K
 {(
 priceBreakdown.classMarkup * priceBreakdown.passengerCount
 ).toLocaleString()}
 </span>
 </div>
 )}
 </>
 )}

 {promoDiscount > 0 && (
 <div className="flex justify-between text-emerald-600 font-medium">
 <span>Promo code discount</span>
 <span>
 − K
 {Math.round(
 priceBreakdown.discount - (isStay ? priceBreakdown.stayCost * 0.1 : 0),
 ).toLocaleString()}
 </span>
 </div>
 )}

 <div className="flex justify-between text-muted-foreground">
 <span>Service fee (5%)</span>
 <span className="font-bold text-foreground">
 K{priceBreakdown.serviceFee.toLocaleString()}
 </span>
 </div>

 <div className="border-t border-border/40 pt-2 flex justify-between font-black text-base text-foreground">
 <span>Total</span>
 <span className="text-[#1f1433] text-lg">
 K{priceBreakdown.total.toLocaleString()}
 </span>
 </div>
 </div>

 {/* Promo input inline */}
 <div className="pt-2 border-t border-border/40 flex gap-2">
 <input
 type="text"
 placeholder="Promo code"
 value={promoCode}
 onChange={(e) => setPromoCode(e.target.value)}
 className="flex-1 bg-[#F9F7F2] border border-border/60 rounded-xl px-3 py-2 text-sm focus:outline-none"
 />
 <button
 type="button"
 onClick={handleApplyPromo}
 className="bg-[#f2ba0d] text-white rounded-xl px-4 py-2 text-sm font-bold hover:bg-[#f2ba0d]/90 transition-colors"
 >
 Apply
 </button>
 </div>
 </div>

 {/* Booking Policies Card */}
 <section className="bg-card border border-border/40 rounded-2xl shadow-sm p-5 space-y-4">
 <div className="flex items-center gap-2 border-b border-border/40 pb-3">
 <div className="w-7 h-7 rounded-lg bg-[#EDE8F5] flex items-center justify-center">
 <ShieldCheck className="h-4 w-4 text-[#1f1433]"/>
 </div>
 <h2 className="font-bold text-base text-[#334155]">Booking policies</h2>
 </div>

 <div className="space-y-3.5">
 <div className="flex gap-3 items-start">
 <Clock className="h-4 w-4 text-[#1f1433] mt-0.5 shrink-0"/>
 <div>
 <h4 className="text-sm font-bold text-[#334155]">Free cancellation</h4>
 <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
 Cancel before 16 Jul 2026 for a full refund
 </p>
 </div>
 </div>
 <div className="flex gap-3 items-start border-t border-border/40 pt-3">
 <CheckCircle2 className="h-4 w-4 text-[#1f1433] mt-0.5 shrink-0"/>
 <div>
 <h4 className="text-sm font-bold text-[#334155]">Instant confirmation</h4>
 <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
 You will get a booking confirmation immediately after payment
 </p>
 </div>
 </div>
 <div className="flex gap-3 items-start border-t border-border/40 pt-3">
 <Lock className="h-4 w-4 text-[#1f1433] mt-0.5 shrink-0"/>
 <div>
 <h4 className="text-sm font-bold text-[#334155]">Secure payment</h4>
 <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
 Mobile Money, Visa, Mastercard, and Airtel Money accepted
 </p>
 </div>
 </div>
 </div>
 </section>

 {/* guest guarantee strip */}
 <div className="flex gap-3 p-4 bg-[#E6F4EE] border border-[#2A7A3A]/25 rounded-2xl items-start shadow-sm">
 <ShieldCheck className="h-5 w-5 text-[#2A7A3A] shrink-0 mt-0.5"/>
 <div className="text-[11px] text-[#2A4A30] leading-relaxed">
 <strong>You&apos;re protected.</strong> All Nearby Escapes bookings include our
 guest guarantee. If something is wrong on arrival, contact us within 24 hrs for a
 full resolution.
 </div>
 </div>

 {/* Terms checkbox inside the left column stack */}
 <div className="p-4 bg-muted/30 border border-border/40 rounded-2xl flex gap-3 items-start">
 <input
 type="checkbox"
 id="terms"
 checked={agreedToTerms}
 onChange={(e) => setAgreedToTerms(e.target.checked)}
 className="mt-1 h-4 w-4 rounded border-border text-[#1f1433] focus:ring-[#1f1433]"
 />
 <Label
 htmlFor="terms"
 className="text-sm text-muted-foreground font-normal leading-relaxed"
 >
 I agree to the{""}
 <Link href="#"className="text-primary underline underline-offset-2">
 Terms &amp; Conditions
 </Link>{""}
 and{""}
 <Link
 href="/legal/cancellation-policy"
 className="text-primary underline underline-offset-2"
 >
 Cancellation Policy
 </Link>
 . I understand that payment will be processed securely through DPO PayPage.
 </Label>
 </div>
 </div>

 {/* RIGHT: Sticky Sidebar Order Summary (Desktop Only) */}
 <aside className="hidden lg:block lg:sticky lg:top-24">
 <div className="bg-card border border-border/40 rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.08)] overflow-hidden">
 {/* Listing preview header */}
 <div className="relative h-36 overflow-hidden">
 <img
 src={listing.image}
 alt={listing.name}
 className="w-full h-full object-cover"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-[#1f1433]/90 to-transparent"/>
 <div className="absolute bottom-4 left-5 right-5 text-white">
 <span className="text-[10px] font-bold uppercase tracking-widest text-[#1f1433]">
 {isStay ?"Farm stay": isExperience ?"Experience":"Transport"}
 </span>
 <h3 className="font-bold text-base truncate mt-0.5">{listing.name}</h3>
 </div>
 </div>

 <div className="p-5 space-y-4">
 {/* Stay Quick summary */}
 <div className="space-y-2 text-sm">
 <div className="flex justify-between text-muted-foreground">
 <span>Location</span>
 <span className="font-bold text-foreground truncate max-w-[150px]">
 {listing.location}
 </span>
 </div>
 {isStay && (
 <div className="flex justify-between text-muted-foreground">
 <span>Guests</span>
 <span className="font-bold text-foreground">
 {stayForm.adults} Adults · {stayForm.children} Children
 </span>
 </div>
 )}
 </div>

 <div className="h-px bg-border/40"/>

 {/* Price Breakdown */}
 <div className="space-y-2.5">
 <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
 Price Breakdown
 </p>

 <div className="space-y-1.5 text-sm">
 {isStay && (
 <>
 <div className="flex justify-between text-muted-foreground">
 <span>
 K{listing.price} × {priceBreakdown.nights} nights
 </span>
 <span className="font-bold text-foreground">
 K{priceBreakdown.stayCost.toLocaleString()}
 </span>
 </div>
 {addTransport && (
 <div className="flex justify-between text-muted-foreground">
 <span>Return transport</span>
 <span className="font-bold text-foreground">K280</span>
 </div>
 )}
 {addFarmTour && (
 <div className="flex justify-between text-muted-foreground">
 <span>Farm tour (×{priceBreakdown.adultCount})</span>
 <span className="font-bold text-foreground">
 K{priceBreakdown.farmTourCost.toLocaleString()}
 </span>
 </div>
 )}
 {addBushBraai && (
 <div className="flex justify-between text-muted-foreground">
 <span>
 Bush braai (×{priceBreakdown.adultCount + priceBreakdown.childCount})
 </span>
 <span className="font-bold text-foreground">
 K{priceBreakdown.bushBraaiCost.toLocaleString()}
 </span>
 </div>
 )}
 <div className="flex justify-between text-emerald-600 font-medium">
 <span>Weekend deal (10%)</span>
 <span>
 − K{Math.round(priceBreakdown.stayCost * 0.1).toLocaleString()}
 </span>
 </div>
 </>
 )}

 {isExperience && (
 <>
 <div className="flex justify-between text-muted-foreground">
 <span>Base rate (×{priceBreakdown.adultCount})</span>
 <span className="font-bold text-foreground">
 K{priceBreakdown.subtotal.toLocaleString()}
 </span>
 </div>
 {priceBreakdown.childCount > 0 && (
 <div className="flex justify-between text-muted-foreground">
 <span>Children (×{priceBreakdown.childCount})</span>
 <span className="font-bold text-foreground">
 K
 {Math.round(
 listing.price * 0.5 * priceBreakdown.childCount,
 ).toLocaleString()}
 </span>
 </div>
 )}
 </>
 )}

 {isTransport && (
 <>
 <div className="flex justify-between text-muted-foreground">
 <span>
 K{listing.price} × {priceBreakdown.passengerCount} seat
 {priceBreakdown.passengerCount !== 1 ?"s":""}
 </span>
 <span className="font-bold text-foreground">
 K{(listing.price * priceBreakdown.passengerCount).toLocaleString()}
 </span>
 </div>
 {priceBreakdown.classMarkup > 0 && (
 <div className="flex justify-between text-muted-foreground">
 <span>Class upgrade</span>
 <span className="font-bold text-foreground">
 K
 {(
 priceBreakdown.classMarkup * priceBreakdown.passengerCount
 ).toLocaleString()}
 </span>
 </div>
 )}
 </>
 )}

 {promoDiscount > 0 && (
 <div className="flex justify-between text-emerald-600 font-medium">
 <span>Promo code discount</span>
 <span>
 − K
 {Math.round(
 priceBreakdown.discount - (isStay ? priceBreakdown.stayCost * 0.1 : 0),
 ).toLocaleString()}
 </span>
 </div>
 )}

 <div className="flex justify-between text-muted-foreground">
 <span>Service fee (5%)</span>
 <span className="font-bold text-foreground">
 K{priceBreakdown.serviceFee.toLocaleString()}
 </span>
 </div>

 <div className="border-t border-border/40 pt-2.5 flex justify-between font-black text-base text-foreground">
 <span>Total</span>
 <span className="text-[#1f1433] text-lg">
 K{priceBreakdown.total.toLocaleString()}
 </span>
 </div>
 </div>
 </div>

 {/* Promo Code apply */}
 <div className="flex gap-2 pt-1">
 <input
 type="text"
 placeholder="Promo code"
 value={promoCode}
 onChange={(e) => setPromoCode(e.target.value)}
 className="flex-1 bg-[#F9F7F2] border border-border/60 rounded-xl px-3 py-1.5 text-sm focus:outline-none"
 />
 <button
 type="button"
 onClick={handleApplyPromo}
 className="bg-[#f2ba0d] text-white rounded-xl px-3 py-1.5 text-sm font-bold hover:bg-[#f2ba0d]/90 transition-colors"
 >
 Apply
 </button>
 </div>

 <div className="h-px bg-border/40"/>

 {/* Trust info & main checkout button */}
 <div className="space-y-3 pt-1">
 <div className="flex gap-2 p-3 bg-[#E6F4EE] border border-[#2A7A3A]/10 rounded-xl items-start">
 <ShieldCheck className="h-4 w-4 text-[#2A7A3A] shrink-0 mt-0.5"/>
 <span className="text-[10px] text-[#2A4A30] leading-normal font-medium">
 <strong>You won&apos;t be charged yet.</strong> Payment happens on the secure
 gateway.
 </span>
 </div>

 <Button
 type="submit"
 disabled={isSubmitting || !agreedToTerms}
 className="w-full h-12 rounded-xl bg-[#f2ba0d] hover:bg-[#f2ba0d]/90 text-[#334155] font-black uppercase tracking-widest text-sm shadow-md shadow-[#1f1433]/10 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
 >
 {isSubmitting ? (
 <>
 <Loader2 className="h-4 w-4 animate-spin"/>
 Processing...
 </>
 ) : (
 <>
 <Lock className="h-3.5 w-3.5"/>
 Confirm &amp; pay — K{priceBreakdown.total.toLocaleString()}
 </>
 )}
 </Button>

 <p className="text-center text-[10px] text-muted-foreground leading-normal mt-2">
 By continuing you agree to the Nearby Escapes terms of service and cancellation
 policy.
 </p>
 </div>
 </div>
 </div>
 </aside>

 {/* MOBILE: Sticky bottom CTA bar */}
 <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#f2ba0d] border-t border-border/60 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden">
 <div className="px-4 py-3.5 flex items-center justify-between gap-4">
 <div>
 <div className="text-[10px] text-[#9B95A8] uppercase tracking-wider font-semibold">
 Total to pay
 </div>
 <div className="text-xl font-black text-[#F9F7F2] mt-0.5">
 K{priceBreakdown.total.toLocaleString()}
 </div>
 </div>
 <div className="flex-1 max-w-[200px]">
 <Button
 type="submit"
 disabled={isSubmitting || !agreedToTerms}
 className="w-full h-11 rounded-xl bg-[#f2ba0d] hover:bg-[#f2ba0d]/90 text-[#334155] font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 disabled:opacity-50"
 >
 {isSubmitting ? (
 <>
 <Loader2 className="h-3.5 w-3.5 animate-spin"/>
 Paying...
 </>
 ) : (
 <>
 <Lock className="h-3.5 w-3.5"/>
 Confirm &amp; pay
 </>
 )}
 </Button>
 </div>
 </div>
 </div>
 </form>
 </main>
 </div>
 );
}
