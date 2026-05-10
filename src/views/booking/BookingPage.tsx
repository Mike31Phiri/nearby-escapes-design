"use client";
import { useState, use } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Users,
  Star,
  MapPin,
  ShieldCheck,
  Clock,
  CreditCard,
  Loader as Loader2,
  Bus,
  Plus,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { getListing } from "@/lib/mock-data";
import { createBooking } from "@/api/bookings";
import { useBookingStore } from "@/store/bookingStore";
import type { CreateBookingDto } from "@/types/booking";

const transportOptions = [
  {
    id: "bus-lusaka-livingstone",
    route: "Lusaka → Livingstone",
    operator: "Mazhandu Family Bus",
    duration: "6h 30m",
    price: 180,
    departures: "4 daily",
  },
  {
    id: "shuttle-airport",
    route: "Airport shuttle to lodge",
    operator: "Nearby Escapes Transfer",
    duration: "30 min",
    price: 45,
    departures: "On demand",
  },
];

export default function BookingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const router = useRouter();
  const params = use(searchParams);
  const [proceeding, setProceeding] = useState(false);
  const [addTransport, setAddTransport] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState<string | null>(null);

  const { stayDetails, setStayDetails, setBookingConfirmed, guestInfo, setGuestInfo } = useBookingStore();

  const stayId = params.stayId || stayDetails?.listingId || "mosi-oa-tunya-lodge";
  
  // Use dates from store or params
  const checkInStr = params.checkIn || (stayDetails?.checkIn ? new Date(stayDetails.checkIn).toISOString() : "");
  const checkOutStr = params.checkOut || (stayDetails?.checkOut ? new Date(stayDetails.checkOut).toISOString() : "");
  const guests = Number(params.guests) || stayDetails?.guests || 2;

  const listing = getListing(stayId);

  // Initialize local guest state
  const [guestForm, setGuestForm] = useState({
    firstName: guestInfo?.firstName || "",
    lastName: guestInfo?.lastName || "",
    email: guestInfo?.email || "",
    phone: guestInfo?.phone || "",
  });
  
  const canProceed = !!guestForm.firstName && !!guestForm.email && !!guestForm.phone;
  const canProceed = !!guestInfo?.firstName && !!guestInfo?.email && !!guestInfo?.phone;

  const nights =
    checkInStr && checkOutStr
      ? Math.max(
          1,
          Math.ceil((new Date(checkOutStr).getTime() - new Date(checkInStr).getTime()) / 86_400_000),
        )
      : stayDetails?.nights || 3;

  const pricePerNight = listing?.price || 220;
  const subtotal = pricePerNight * nights;
  const serviceFee = Math.round(subtotal * 0.12);
  const transportCost =
    addTransport && selectedTransport
      ? transportOptions.find((t) => t.id === selectedTransport)?.price || 0
      : 0;
  const total = subtotal + serviceFee + transportCost;

  async function handleProceed() {
    if (!guestForm.firstName || !guestForm.email || !guestForm.phone) {
      toast.error("Please fill in your guest information first.");
      return;
    }

    setGuestInfo({ ...guestForm, specialRequests: "" });
    setProceeding(true);
    try {
      const dto: CreateBookingDto = {
        stayId,
        checkIn: checkInStr || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
        checkOut: checkOutStr || new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10),
        guests: guests,
        guestInfo: guestForm,
      };
      const booking = await createBooking(dto);
      setStayDetails({
        listingId: booking.stayId,
        listingName: booking.stayName,
        listingImage: booking.stayImage,
        guests: booking.guests,
        pricePerNight: booking.fees.pricePerNight,
        nights: booking.fees.nights,
        subtotal: booking.fees.subtotal,
        cleaningFee: booking.fees.cleaningFee,
        serviceFee: booking.fees.serviceFee,
        taxes: booking.fees.taxes,
        total: booking.fees.total,
      });
      setBookingConfirmed(true, booking.confirmationId);
      toast.success("Redirecting to secure payment...");
      router.push("/booking/payment");
    } catch {
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setProceeding(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Booking</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl font-display">
            Review your stay
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Confirm dates, guests and cancellation terms before payment.
          </p>
        </header>

        {/* Stay summary */}
        {listing && (
          <Card className="mt-8 border-border/60">
            <CardContent className="p-5">
              <div className="flex gap-4">
                <img
                  src={listing.image}
                  alt={listing.name}
                  className="h-24 w-24 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-lg truncate">{listing.name}</h2>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3.5 w-3.5" /> {listing.location}, Zambia
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-sm">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                    <span className="font-medium">{listing.rating}</span>
                    <span className="text-muted-foreground">({listing.reviews} reviews)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trip details */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Card className="border-border/60">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Dates</p>
                <p className="text-sm font-semibold">
                  {checkInStr && checkOutStr
                    ? `${formatShort(checkInStr)} — ${formatShort(checkOutStr)}`
                    : "Select dates"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {nights} night{nights !== 1 ? "s" : ""}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Guests</p>
                <p className="text-sm font-semibold">
                  {guests} guest{guests !== 1 ? "s" : ""}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Check-in</p>
                <p className="text-sm font-semibold">After 2:00 PM</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transport upsell */}
        <Card className="mt-6 border-primary/30 bg-primary-soft/20">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Bus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Need transport to your stay?</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Add a bus ticket or airport shuttle and travel stress-free.
                  </p>
                </div>
              </div>
              <Switch checked={addTransport} onCheckedChange={setAddTransport} />
            </div>

            {addTransport && (
              <div className="mt-4 space-y-2">
                {transportOptions.map((option) => {
                  const isSelected = selectedTransport === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedTransport(isSelected ? null : option.id)}
                      className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-[var(--transition-smooth)] ${
                        isSelected
                          ? "border-primary bg-primary-soft/40 ring-1 ring-primary/20"
                          : "border-border/60 hover:border-primary/40"
                      }`}
                    >
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold">{option.route}</p>
                          <p className="text-sm font-bold">ZMW {option.price}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {option.operator} &middot; {option.duration} &middot; {option.departures}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Price breakdown */}
        <Card className="mt-6 border-border/60">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-semibold">Price breakdown</h3>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                ${pricePerNight} x {nights} night{nights !== 1 ? "s" : ""}
              </span>
              <span className="font-medium">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service fee</span>
              <span className="font-medium">${serviceFee.toLocaleString()}</span>
            </div>
            {addTransport && selectedTransport && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Bus className="h-3 w-3" /> Transport
                </span>
                <span className="font-medium">ZMW {transportCost}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>
                ${total.toLocaleString()}
                {transportCost > 0 ? ` + ZMW ${transportCost}` : ""}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Cancellation policy */}
        <Card className="mt-4 border-border/60">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Cancellation policy</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Free cancellation up to 48 hours before check-in. After that, the first night is
                  non-refundable.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* House rules */}
        <Card className="mt-4 border-border/60">
          <CardContent className="p-5">
            <h3 className="font-semibold">House rules</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              <li>Check-in after 2:00 PM, checkout before 11:00 AM</li>
              <li>No smoking inside the property</li>
              <li>No parties or events</li>
              <li>Pets allowed on request</li>
            </ul>
          </CardContent>
        </Card>

        {/* Guest Information */}
        <Card className="mt-6 border-border/60">
          <CardContent className="p-5 space-y-4">
            <h3 className="font-semibold text-lg">Guest Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">First name</label>
                <input
                  type="text"
                  className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={guestForm.firstName}
                  onChange={(e) => setGuestForm({ ...guestForm, firstName: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Last name</label>
                <input
                  type="text"
                  className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={guestForm.lastName}
                  onChange={(e) => setGuestForm({ ...guestForm, lastName: e.target.value })}
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email address</label>
              <input
                type="email"
                className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={guestForm.email}
                onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Phone number</label>
              <input
                type="tel"
                className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={guestForm.phone}
                onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value })}
                placeholder="+260 97 123 4567"
              />
            </div>
          </CardContent>
        </Card>

        <Separator className="my-6" />

        <div className="flex items-center gap-3">
          <Button
            onClick={handleProceed}
            disabled={proceeding || !canProceed}
            className="bg-[image:var(--gradient-hero)] hover:opacity-95"
          >
            {proceeding ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" /> Proceed to payment
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground">Secure payment via DPO</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function formatShort(dateStr: string) {
  try {
    return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(
      new Date(dateStr),
    );
  } catch {
    return dateStr;
  }
}
