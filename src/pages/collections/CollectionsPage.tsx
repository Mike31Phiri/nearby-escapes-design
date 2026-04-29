import { Link } from "@tanstack/react-router";
import { Plus, Heart, Users, MapPin, Globe2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import lodge from "@/assets/listing-lodge.jpg";
import camp from "@/assets/listing-camp.jpg";
import hotel from "@/assets/listing-hotel.jpg";
import guesthouse from "@/assets/listing-guesthouse.jpg";

const collections = [
  { id: "weekend", title: "Weekend escapes", count: 6, shared: false, cover: lodge },
  { id: "safari", title: "Safari season", count: 4, shared: true, cover: camp },
  { id: "city", title: "City breaks", count: 3, shared: false, cover: hotel },
  { id: "family", title: "Family-friendly", count: 5, shared: true, cover: guesthouse },
];

export function CollectionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <header className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Collections</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Saved places</h1>
            <p className="mt-2 text-sm text-muted-foreground">Group stays into collections for trips, ideas and people you travel with.</p>
          </div>
          <Button><Plus className="h-4 w-4 mr-1" /> New collection</Button>
        </header>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Stat label="Saved" value="18" icon={Heart} />
          <Stat label="Collections" value="4" icon={MapPin} />
          <Stat label="Shared" value="2" icon={Users} />
        </div>

        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <Link
              key={c.id}
              to="/collections/$collectionId"
              params={{ collectionId: c.id }}
              className="group block overflow-hidden rounded-2xl border border-border/60 bg-card transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={c.cover} alt={c.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-foreground/30" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-background">
                  <div>
                    <h2 className="text-lg font-bold tracking-tight">{c.title}</h2>
                    <p className="text-xs text-background/85">{c.count} stays</p>
                  </div>
                  {c.shared && <Badge variant="secondary" className="text-[11px]"><Globe2 className="h-3 w-3 mr-1" />Shared</Badge>}
                </div>
              </div>
            </Link>
          ))}
          <Link to="/collections" className="rounded-2xl border-2 border-dashed border-border bg-card p-8 flex flex-col items-center justify-center text-center text-muted-foreground transition hover:border-primary hover:text-primary">
            <Plus className="h-7 w-7" />
            <p className="mt-2 text-sm font-medium">Create new collection</p>
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-5 flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary"><Icon className="h-5 w-5" /></div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
