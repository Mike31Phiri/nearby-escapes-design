import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  MapPin,
  Heart,
  Share2,
  Wifi,
  Car,
  Coffee,
  Trees,
  Waves,
  ShieldCheck,
  Award,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getListing, listings } from "@/lib/mock-data";
import { BOOKING_DRAFT_STORAGE_KEY } from "@/store/bookingStore";

const amenities = [
  { icon: Wifi, label: "Fast Wi-Fi" },
  { icon: Car, label: "Free parking" },
  { icon: Coffee, label: "Breakfast included" },
  { icon: Trees, label: "Garden & deck" },
  { icon: Waves, label: "Plunge pool" },
  { icon: ShieldCheck, label: "24/7 security" },
];

const reviews = [
  {
    id: "r1",
    from: "Bwalya K.",
    rating: 5,
    text: "Spectacular setting. The host arranged a sunrise hike that made the trip.",
    date: "Mar 2026",
  },
  {
    id: "r2",
    from: "Joyce S.",
    rating: 5,
    text: "Quiet, comfortable and impeccably clean. We didn't want to leave.",
    date: "Feb 2026",
  },
  {
    id: "r3",
    from: "Mulenga P.",
    rating: 4,
    text: "Loved everything except the slow Wi-Fi in the back room.",
    date: "Jan 2026",
  },
];

const rooms = [
  { id: "deluxe", name: "Deluxe river view", beds: "1 king", price: 220, sleeps: 2 },
  { id: "family", name: "Family suite", beds: "1 king + 2 single", price: 295, sleeps: 4 },
  { id: "garden", name: "Garden cabin", beds: "1 queen", price: 175, sleeps: 2 },
];

export function StayDetailPage() {
  const params = useParams();
  const stayId = (params.stayId as string) ?? "";
  const router = useRouter();
  const stay = getListing(stayId) ?? listings[0];
  const similar = listings.filter((l) => l.id !== stay.id).slice(0, 3);
  const [saved, setSaved] = useState(false);

  function reserve() {
    const draft = {
      stayId: stay.id,
      stayName: stay.name,
      pricePerNight: stay.price,
      checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      checkOut: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      guests: 2,
    };
    try {
      localStorage.setItem(BOOKING_DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* noop */
    }
    router.push("/booking");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6 md:py-10">
        <Link
          href="/accommodations"
          className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          <ChevronRight className="h-3 w-3 rotate-180" /> Back to stays
        </Link>

        <header className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{stay.name}</h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" /> {stay.rating} · {stay.reviews}{" "}
                reviews
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {stay.location}, Zambia
              </span>
              <Badge variant="secondary" className="text-[11px]">
                <Award className="h-3 w-3 mr-1" /> Superhost
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button size="sm" variant="outline" onClick={() => setSaved((s) => !s)}>
              <Heart className={`h-4 w-4 mr-1 ${saved ? "fill-primary text-primary" : ""}`} />
              {saved ? "Saved" : "Save"}
            </Button>
          </div>
        </header>

        <div className="mt-5 grid gap-2 sm:grid-cols-4 sm:grid-rows-2 rounded-2xl overflow-hidden h-[260px] sm:h-[420px]">
          <img
            src={stay.image}
            alt={stay.name}
            className="object-cover w-full h-full sm:row-span-2 sm:col-span-2"
          />
          {[0, 1, 2, 3].map((i) => (
            <img
              key={i}
              src={listings[(listings.indexOf(stay) + i + 1) % listings.length].image}
              alt=""
              className="hidden sm:block w-full h-full object-cover"
            />
          ))}
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-10">
            <section>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                    CK
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Hosted by Chanda</p>
                  <p className="text-sm text-muted-foreground">Superhost · 4 years hosting</p>
                </div>
              </div>
              <Separator className="my-6" />
              <h2 className="text-lg font-bold tracking-tight">About this stay</h2>
              <p className="mt-2 text-muted-foreground leading-7">
                {stay.description} A small, owner-run property with thoughtful touches — fresh
                flowers, a stocked pantry and a host who knows the area like family.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold tracking-tight">What's included</h2>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenities.map((a) => (
                  <div
                    key={a.label}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
                  >
                    <a.icon className="h-4 w-4 text-primary" />
                    <span className="text-sm">{a.label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold tracking-tight">Rooms</h2>
              <div className="mt-4 space-y-3">
                {rooms.map((r) => (
                  <Link key={r.id} href={`/stays/${stay.id}/rooms/${r.id}`}>
                    <Card className="border-border/60 transition hover:border-primary/40">
                      <CardContent className="p-4 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold">{r.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {r.beds} · sleeps {r.sleeps}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            ${r.price}
                            <span className="text-xs font-normal text-muted-foreground">
                              {" "}
                              / night
                            </span>
                          </p>
                          <p className="text-xs text-primary">View room</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
                <Star className="h-5 w-5 fill-accent text-accent" /> {stay.rating} · {stay.reviews}{" "}
                reviews
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {reviews.map((r) => (
                  <Card key={r.id} className="border-border/60">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between text-sm">
                        <p className="font-semibold">{r.from}</p>
                        <span className="text-xs text-muted-foreground">{r.date}</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{r.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 self-start">
            <Card className="border-border/60 shadow-[var(--shadow-card)]">
              <CardContent className="p-5">
                <p className="text-2xl font-bold">
                  ${stay.price}
                  <span className="text-sm font-normal text-muted-foreground"> / night</span>
                </p>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      Check in
                    </p>
                    <p className="font-medium">May 02</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      Check out
                    </p>
                    <p className="font-medium">May 05</p>
                  </div>
                  <div className="rounded-lg border border-border p-3 col-span-2">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      Guests
                    </p>
                    <p className="font-medium">2 adults</p>
                  </div>
                </div>
                <Button className="w-full mt-4" onClick={reserve}>
                  Reserve
                </Button>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  You won't be charged yet
                </p>
                <Separator className="my-4" />
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">${stay.price} × 3 nights</span>
                    <span>${stay.price * 3}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service fee</span>
                    <span>${Math.round(stay.price * 3 * 0.1)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${stay.price * 3 + Math.round(stay.price * 3 * 0.1)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>

        <section className="mt-14">
          <h2 className="text-lg font-bold tracking-tight">Similar stays</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {similar.map((l) => (
              <Link key={l.id} href={`/stays/${l.id}`}>
                <Card className="overflow-hidden border-border/60 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
                  <div className="aspect-[4/3]">
                    <img src={l.image} alt={l.name} className="h-full w-full object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <p className="font-semibold">{l.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {l.location}
                    </p>
                    <p className="mt-2 text-sm">
                      <span className="font-bold">${l.price}</span>
                      <span className="text-muted-foreground"> / night</span>
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
