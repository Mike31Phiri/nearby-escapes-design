"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  Bed,
  Bath,
  Maximize2,
  Wifi,
  Coffee,
  Tv,
  Wind,
  ShieldCheck,
  X,
  Check,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getListing, listings } from "@/lib/mock-data";
import { BOOKING_DRAFT_STORAGE_KEY } from "@/store/bookingStore";

const roomData: Record<
  string,
  { name: string; price: number; beds: string; sleeps: number; size: string; baths: number }
> = {
  deluxe: {
    name: "Deluxe river view",
    price: 220,
    beds: "1 king bed",
    sleeps: 2,
    size: "32 m²",
    baths: 1,
  },
  family: {
    name: "Family suite",
    price: 295,
    beds: "1 king + 2 single beds",
    sleeps: 4,
    size: "54 m²",
    baths: 2,
  },
  garden: {
    name: "Garden cabin",
    price: 175,
    beds: "1 queen bed",
    sleeps: 2,
    size: "26 m²",
    baths: 1,
  },
};

export function RoomDetailPage() {
  const params = useParams();
  const stayId = (params.stayId as string) ?? "";
  const roomId = (params.roomId as string) ?? "deluxe";
  const router = useRouter();
  const stay = getListing(stayId) ?? listings[0];
  const room = roomData[roomId] ?? roomData.deluxe;

  function reserve() {
    const draft = {
      stayId: stay.id,
      stayName: `${stay.name} · ${room.name}`,
      pricePerNight: room.price,
      checkIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      checkOut: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      guests: Math.min(2, room.sleeps),
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
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 md:px-6 md:py-10">
        <Link
          href={`/stays/${stayId}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {stay.name}
        </Link>

        <header className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Room</p>
            <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">{room.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {room.beds} · sleeps {room.sleeps} · {room.size}
            </p>
          </div>
          <Badge variant="secondary" className="text-[11px] self-start sm:self-auto">
            Free cancellation until 48h before
          </Badge>
        </header>

        <div className="mt-5 grid gap-2 sm:grid-cols-3 rounded-2xl overflow-hidden h-[240px] sm:h-[360px]">
          <img
            src={stay.image}
            alt={room.name}
            className="object-cover w-full h-full sm:col-span-2 sm:row-span-2"
          />
          <img
            src={listings[1].image}
            alt=""
            className="hidden sm:block w-full h-full object-cover"
          />
          <img
            src={listings[2].image}
            alt=""
            className="hidden sm:block w-full h-full object-cover"
          />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-8">
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Spec icon={Users} label="Guests" value={String(room.sleeps)} />
              <Spec icon={Bed} label="Beds" value={room.beds} />
              <Spec icon={Bath} label="Bathrooms" value={String(room.baths)} />
              <Spec icon={Maximize2} label="Size" value={room.size} />
            </section>

            <section>
              <h2 className="text-lg font-bold tracking-tight">In this room</h2>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { icon: Wifi, label: "Wi-Fi" },
                  { icon: Coffee, label: "Coffee station" },
                  { icon: Tv, label: '55" TV' },
                  { icon: Wind, label: "Air conditioning" },
                  { icon: ShieldCheck, label: "Safe" },
                ].map((a) => (
                  <div key={a.label} className="flex items-center gap-2 text-sm">
                    <a.icon className="h-4 w-4 text-primary" /> {a.label}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold tracking-tight">House rules</h2>
              <div className="mt-3 space-y-2 text-sm">
                <Rule allow label="Check-in 14:00 · Check-out 11:00" />
                <Rule allow label="Pets welcome on request" />
                <Rule label="No smoking inside" />
                <Rule label="No parties or events" />
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 self-start">
            <Card className="border-border/60 shadow-[var(--shadow-card)]">
              <CardContent className="p-5">
                <p className="text-2xl font-bold">
                  ${room.price}
                  <span className="text-sm font-normal text-muted-foreground"> / night</span>
                </p>
                <Separator className="my-4" />
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">${room.price} × 3 nights</span>
                    <span>${room.price * 3}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cleaning</span>
                    <span>$25</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service fee</span>
                    <span>${Math.round(room.price * 3 * 0.1)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${room.price * 3 + 25 + Math.round(room.price * 3 * 0.1)}</span>
                  </div>
                </div>
                <Button className="w-full mt-4" onClick={reserve}>
                  Reserve this room
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Spec({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

function Rule({ label, allow }: { label: string; allow?: boolean }) {
  return (
    <p className="flex items-center gap-2 text-muted-foreground">
      {allow ? (
        <Check className="h-4 w-4 text-primary" />
      ) : (
        <X className="h-4 w-4 text-destructive" />
      )}
      {label}
    </p>
  );
}
