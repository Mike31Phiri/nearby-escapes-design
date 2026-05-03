import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bus, Clock, MapPin, ArrowRight, Users } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Bus Booking — Nearby Escapes" };

const routes = [
  {
    id: "lsk-liv",
    from: "Lusaka",
    to: "Livingstone",
    duration: "6h 30m",
    price: 180,
    operator: "Mazhandu Family Bus",
    departures: ["06:00", "08:30", "12:00", "16:00"],
    seats: 14,
  },
  {
    id: "lsk-kit",
    from: "Lusaka",
    to: "Kitwe",
    duration: "7h",
    price: 200,
    operator: "Power Tools Bus",
    departures: ["07:00", "10:00", "15:00"],
    seats: 8,
  },
  {
    id: "lsk-chip",
    from: "Lusaka",
    to: "Chipata",
    duration: "5h 45m",
    price: 160,
    operator: "Jonda Bus Services",
    departures: ["06:30", "13:00"],
    seats: 22,
  },
  {
    id: "lsk-mfu",
    from: "Lusaka",
    to: "Mfuwe",
    duration: "8h",
    price: 250,
    operator: "Kobs Transport",
    departures: ["05:00"],
    seats: 5,
  },
  {
    id: "liv-lsk",
    from: "Livingstone",
    to: "Lusaka",
    duration: "6h 30m",
    price: 180,
    operator: "Mazhandu Family Bus",
    departures: ["07:00", "09:00", "13:00", "17:00"],
    seats: 19,
  },
  {
    id: "ndl-lsk",
    from: "Ndola",
    to: "Lusaka",
    duration: "4h",
    price: 140,
    operator: "Shalom Bus",
    departures: ["08:00", "11:00", "14:00"],
    seats: 31,
  },
];

export default function BusBookingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <div
          className="relative py-16 md:py-24 text-white text-center"
          style={{ backgroundColor: "oklch(0.30 0.14 295)" }}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative mx-auto max-w-4xl px-6">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Bus className="h-3 w-3 mr-1" /> Intercity Bus
            </Badge>
            <h1
              className="text-3xl md:text-5xl font-bold tracking-tight"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Book your bus in seconds
            </h1>
            <p className="mt-4 text-white/80 text-lg max-w-xl mx-auto">
              Trusted operators across Zambia. Compare routes, seats and departure times.
            </p>
          </div>
        </div>

        {/* Routes */}
        <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Available
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight">Popular routes</h2>
            </div>
            <span className="text-sm text-muted-foreground">{routes.length} routes found</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {routes.map((route) => (
              <Card
                key={route.id}
                className="border-border/60 hover:border-primary/40 hover:shadow-sm transition-all duration-200"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <p className="font-bold text-lg truncate">
                          {route.from} → {route.to}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{route.operator}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-bold">ZMW {route.price}</p>
                      <p className="text-xs text-muted-foreground">per seat</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {route.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {route.seats} seats left
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {route.departures.map((dep) => (
                      <Badge key={dep} variant="outline" className="text-[11px]">
                        {dep}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Button size="sm" className="flex-1 bg-[image:var(--gradient-hero)] hover:opacity-95">
                      Book seat
                    </Button>
                    <Button size="sm" variant="outline">
                      Details <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
