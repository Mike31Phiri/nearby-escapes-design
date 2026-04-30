import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Package, Search, Star, MapPin, CalendarDays, Bed, Bus, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import camp from "@/assets/listing-camp.jpg";
import lodge from "@/assets/listing-lodge.jpg";
import hotel from "@/assets/listing-hotel.jpg";
import guesthouse from "@/assets/listing-guesthouse.jpg";
import hero from "@/assets/hero-zambia.jpg";

type Pkg = {
  id: string;
  name: string;
  region: string;
  duration: string;
  nights: number;
  price: number;
  perNight: number;
  rating: number;
  reviews: number;
  image: string;
  highlights: string[];
  includes: { stays: number; transport: number; experiences: number };
  description: string;
  category: "Safari" | "Adventure" | "Cultural" | "City" | "Family";
};

const packages: Pkg[] = [
  {
    id: "victoria-falls-3-day",
    name: "Victoria Falls weekend escape",
    region: "Livingstone & Lower Zambezi",
    duration: "3 days, 2 nights",
    nights: 2,
    price: 540,
    perNight: 270,
    rating: 4.92,
    reviews: 318,
    image: hero,
    highlights: ["Falls guided tour", "Sunset Zambezi cruise", "Devil's Pool swim"],
    includes: { stays: 1, transport: 2, experiences: 3 },
    description: "Two nights riverside, all transfers and the headline Falls experiences in one easy bundle.",
    category: "Adventure",
  },
  {
    id: "south-luangwa-5-day",
    name: "Classic South Luangwa safari",
    region: "South Luangwa National Park",
    duration: "5 days, 4 nights",
    nights: 4,
    price: 1480,
    perNight: 370,
    rating: 4.96,
    reviews: 211,
    image: camp,
    highlights: ["Day & night game drives", "Walking safari", "Bush dinner"],
    includes: { stays: 1, transport: 1, experiences: 4 },
    description: "Tented camp on the Luangwa River with twice-daily drives, walking safari and a private bush dinner.",
    category: "Safari",
  },
  {
    id: "kafue-7-day",
    name: "Kafue wilderness explorer",
    region: "Kafue National Park",
    duration: "7 days, 6 nights",
    nights: 6,
    price: 1980,
    perNight: 330,
    rating: 4.88,
    reviews: 142,
    image: lodge,
    highlights: ["Canoe safari", "Eco lodge stay", "Birding & wildlife"],
    includes: { stays: 2, transport: 2, experiences: 5 },
    description: "Two contrasting eco lodges, river safaris and full-day game drives across Zambia's biggest park.",
    category: "Safari",
  },
  {
    id: "lusaka-city-break",
    name: "Lusaka city break",
    region: "Lusaka",
    duration: "3 days, 2 nights",
    nights: 2,
    price: 320,
    perNight: 160,
    rating: 4.7,
    reviews: 96,
    image: hotel,
    highlights: ["Boutique hotel", "Food & market tour", "Munda Wanga sanctuary"],
    includes: { stays: 1, transport: 2, experiences: 2 },
    description: "Two nights in central Lusaka, airport transfers, a chef-led food tour and a wildlife sanctuary visit.",
    category: "City",
  },
  {
    id: "kuomboka-cultural-4-day",
    name: "Kuomboka cultural journey",
    region: "Mongu & Barotse floodplain",
    duration: "4 days, 3 nights",
    nights: 3,
    price: 720,
    perNight: 240,
    rating: 4.85,
    reviews: 58,
    image: guesthouse,
    highlights: ["Kuomboka ceremony", "Local homestay", "Lealui village visit"],
    includes: { stays: 2, transport: 3, experiences: 3 },
    description: "Witness the Lozi king's annual ceremony with local hosts, transfers and curated village stops.",
    category: "Cultural",
  },
  {
    id: "family-zambezi-5-day",
    name: "Family Zambezi adventure",
    region: "Lower Zambezi",
    duration: "5 days, 4 nights",
    nights: 4,
    price: 1640,
    perNight: 410,
    rating: 4.9,
    reviews: 78,
    image: lodge,
    highlights: ["Family lodge", "Kid-safe game drives", "Fishing morning"],
    includes: { stays: 1, transport: 2, experiences: 4 },
    description: "A family-friendly lodge with a pool, kid-safe wildlife activities and a morning of catch-and-release fishing.",
    category: "Family",
  },
];

const categories = ["All", "Safari", "Adventure", "Cultural", "City", "Family"];

export const Route = createFileRoute("/packages")({
  head: () => ({
    meta: [
      { title: "Travel Packages — Nearby Escapes" },
      { name: "description", content: "Curated multi-day travel packages across Zambia." },
      { property: "og:title", content: "Travel Packages — Nearby Escapes" },
      { property: "og:description", content: "Curated multi-day travel packages across Zambia." },
    ],
  }),
  component: PackagesPage,
});

function PackagesPage() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return packages.filter((p) => {
      if (activeCat !== "All" && p.category !== activeCat) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.highlights.some((h) => h.toLowerCase().includes(q))
      );
    });
  }, [query, activeCat]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 md:px-6 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Package className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Travel packages</p>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-display">
            Stay, transport and experiences — bundled
          </h1>
          <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-2xl">
            Multi-day curated trips across Zambia. One price covers stays, transfers and the headline activities.
          </p>
        </header>

        <div className="mb-6 space-y-4">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by region, theme or activity…"
              className="h-11 pl-9"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-4 px-4 md:mx-0 md:px-0 pb-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeCat === c
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
            <p className="text-sm text-muted-foreground">No packages match your search yet.</p>
            <Button variant="outline" className="mt-4" onClick={() => { setQuery(""); setActiveCat("All"); }}>
              Reset filters
            </Button>
          </div>
        ) : (
          <ul className="grid gap-5 md:grid-cols-2">
            {filtered.map((p) => (
              <li key={p.id}>
                <Link
                  to="/packages"
                  className="group flex flex-col h-full overflow-hidden rounded-2xl border border-border bg-card transition-[var(--transition-smooth)] hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold backdrop-blur">
                      {p.category}
                    </div>
                    <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold backdrop-blur">
                      <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                      {p.rating}
                      <span className="text-muted-foreground font-normal">({p.reviews})</span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <div>
                      <h3 className="font-semibold leading-tight">{p.name}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {p.region}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>

                    <div className="flex flex-wrap gap-1.5">
                      {p.highlights.map((h) => (
                        <span
                          key={h}
                          className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-primary"
                        >
                          <Sparkles className="h-3 w-3" /> {h}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto flex items-end justify-between gap-3 pt-3 border-t border-border/60">
                      <div className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3 w-3" /> {p.duration}</span>
                        <span className="inline-flex items-center gap-3">
                          <span className="inline-flex items-center gap-1"><Bed className="h-3 w-3" /> {p.includes.stays} stay{p.includes.stays > 1 ? "s" : ""}</span>
                          <span className="inline-flex items-center gap-1"><Bus className="h-3 w-3" /> {p.includes.transport} ride{p.includes.transport > 1 ? "s" : ""}</span>
                          <span className="inline-flex items-center gap-1"><Sparkles className="h-3 w-3" /> {p.includes.experiences}</span>
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold leading-none">${p.price}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">${p.perNight}/night · per person</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
