import { useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Users, Star, MapPin, ShieldCheck, Clock, CreditCard, Loader as Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getListing } from "@/lib/mock-data";

export function BookingPage() {
  const navigate = useNavigate();
  const [proceeding, setProceeding] = useState(false);

  const search = useSearch({ strict: false }) as Record<string, string>;
  const stayId = search.stayId || "mosi-oa-tunya-lodge";
  const checkIn = search.checkIn || "";
  const checkOut = search.checkOut || "";
  const guests = search.guests || "2";

  const listing = getListing(stayId);

  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000))
    : 3;

  const pricePerNight = listing?.price || 220;
  const subtotal = pricePerNight * nights;
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + serviceFee;

  async function handleProceed() {
    setProceeding(true);
    await new Promise((r) => setTimeout(r, 800));
    setProceeding(false);
    toast.success("Proceeding to payment...");
    navigate({ to: "/booking/payment" });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Booking</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Review your stay</h1>
          <p className="mt-3 text-base text-muted-foreground">
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
                  {checkIn && checkOut
                    ? `${formatShort(checkIn)} — ${formatShort(checkOut)}`
                    : "Select dates"}
                </p>
                <p className="text-xs text-muted-foreground">{nights} night{nights !== 1 ? "s" : ""}</p>
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
                <p className="text-sm font-semibold">{guests} guest{guests !== "1" ? "s" : ""}</p>
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

        {/* Price breakdown */}
        <Card className="mt-6 border-border/60">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-semibold">Price breakdown</h3>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">${pricePerNight} x {nights} night{nights !== 1 ? "s" : ""}</span>
              <span className="font-medium">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service fee</span>
              <span className="font-medium">${serviceFee.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
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
                  non-refundable. Review the full policy on the listing page.
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

        <Separator className="my-6" />

        <div className="flex items-center gap-3">
          <Button
            onClick={handleProceed}
            disabled={proceeding}
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
          <p className="text-xs text-muted-foreground">You won't be charged yet</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function formatShort(dateStr: string) {
  try {
    return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}
