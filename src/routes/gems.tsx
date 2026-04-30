import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPin, Search, Star, Clock, Users } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import camp from "@/assets/listing-camp.jpg";
import lodge from "@/assets/listing-lodge.jpg";
import guesthouse from "@/assets/listing-guesthouse.jpg";
import hero from "@/assets/hero-zambia.jpg";

type Gem = {
  id: string;
  name: string;
  location: string;
  province: string;
  category: string;
  duration: string;
  groupSize: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
};

const gems: Gem[] = [
  {
    id: "zambezi-sunset-cruise",
    name: "Sunset cruise on the Zambezi",
    location: "Livingstone",
    province: "Southern",
    category: "Water experience",
    duration: "3 hours",
    groupSize: "Up to 30",
    price: 55,
    rating: 4.9,
    reviews: 218,
    image: hero,
    description: "Glide along the Zambezi at golden hour with drinks and live music as elephants drink at the banks.",
  },
  {
    id: "devils-pool-livingstone",
    name: "Devil's Pool swim, Victoria Falls",
    location: "Livingstone",
    province: "Southern",
    category: "Adventure activity",
    duration: "Half day",
    groupSize: "Up to 8",
    price: 110,
    rating: 4.95,
    reviews: 412,
    image: lodge,
    description: "The world's most thrilling natural infinity pool — sit on the edge of Victoria Falls with a guide.",
  },
  {
    id: "south-luangwa-walking-safari",
    name: "Walking safari, South Luangwa",
    location: "South Luangwa",
    province: "Eastern",
    category: "Safari & wildlife",
    duration: "Full day",
    groupSize: "Up to 6",
    price: 145,
    rating: 4.92,
    reviews: 167,
    image: camp,
    description: "Track lions, leopards and giraffes on foot in the birthplace of the African walking safari.",
  },
  {
    id: "kuomboka-ceremony",
    name: "Kuomboka traditional ceremony",
    location: "Mongu",
    province: "Western",
    category: "Cultural tour",
    duration: "Full day",
    groupSize: "Up to 20",
    price: 75,
    rating: 4.8,
    reviews: 64,
    image: guesthouse,
    description: "Witness the Lozi king's annual move from the floodplains aboard the royal Nalikwanda barge.",
  },
  {
    id: "lusaka-food-market-tour",
    name: "Lusaka street food & market tour",
    location: "Lusaka",
    province: "Lusaka",
    category: "Food & market tour",
    duration: "4 hours",
    groupSize: "Up to 10",
    price: 35,
    rating: 4.7,
    reviews: 142,
    image: hero,
    description: "Taste nshima, kapenta and fritters with a local chef across Soweto Market and city stalls.",
  },
  {
    id: "kafue-canoe-safari",
    name: "Kafue canoe safari",
    location: "Kafue",
    province: "Central",
    category: "Water experience",
    duration: "Full day",
    groupSize: "Up to 8",
    price: 95,
    rating: 4.85,
    reviews: 89,
    image: lodge,
    description: "Paddle through the Kafue River channels for hippo, croc and antelope sightings on the water.",
  },
  {
    id: "chimfunshi-chimps",
    name: "Chimfunshi chimpanzee sanctuary",
    location: "Chingola",
    province: "Copperbelt",
    category: "Safari & wildlife",
    duration: "Half day",
    groupSize: "Up to 12",
    price: 65,
    rating: 4.88,
    reviews: 96,
    image: camp,
    description: "Africa's largest chimp orphanage — meet the rangers and learn about rescue and rewilding.",
  },
  {
    id: "kasanka-bat-migration",
    name: "Kasanka bat migration evening",
    location: "Kasanka",
    province: "Central",
    category: "Photography experience",
    duration: "Evening",
    groupSize: "Up to 15",
    price: 50,
    rating: 4.9,
    reviews: 73,
    image: guesthouse,
    description: "10 million fruit bats fill the Kasanka sky at dusk between October and December — unmissable.",
  },
];

const categories = ["All", "Safari & wildlife", "Cultural tour", "Adventure activity", "Water experience", "Food & market tour", "Photography experience"];

export const Route = createFileRoute("/gems")({
  head: () => ({
    meta: [
      { title: "Hidden Gems — Nearby Escapes" },
      { name: "description", content: "Discover Zambia's hidden attractions and local favorites." },
      { property: "og:title", content: "Hidden Gems — Nearby Escapes" },
      { property: "og:description", content: "Discover Zambia's hidden attractions and local favorites." },
    ],
  }),
  component: GemsPage,
});

function GemsPage() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return gems.filter((g) => {
      if (activeCat !== "All" && g.category !== activeCat) return false;
      if (!q) return true;
      return (
        g.name.toLowerCase().includes(q) ||
        g.location.toLowerCase().includes(q) ||
        g.province.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q)
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
              <MapPin className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Hidden gems</p>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-display">Local experiences across Zambia</h1>
          <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-2xl">
            Curated tours, ceremonies and adventures that travelers actually love — booked direct from local hosts.
          </p>
        </header>

        <div className="mb-6 space-y-4">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search gems, places or activities…"
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
            <p className="text-sm text-muted-foreground">No gems match your search yet. Try a different keyword.</p>
            <Button variant="outline" className="mt-4" onClick={() => { setQuery(""); setActiveCat("All"); }}>
              Reset filters
            </Button>
          </div>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((g) => (
              <li key={g.id}>
                <Link
                  to="/gems"
                  className="group block overflow-hidden rounded-2xl bg-card transition-[var(--transition-smooth)] hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                    <img
                      src={g.image}
                      alt={g.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold backdrop-blur">
                      {g.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm leading-tight">{g.name}</h3>
                      <div className="flex items-center gap-1 text-xs font-medium shrink-0">
                        <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                        {g.rating}
                        <span className="text-muted-foreground font-normal">({g.reviews})</span>
                      </div>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {g.location}, {g.province}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{g.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {g.duration}</span>
                        <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {g.groupSize}</span>
                      </div>
                      <p className="text-sm">
                        <span className="font-bold">${g.price}</span>
                        <span className="text-muted-foreground"> / person</span>
                      </p>
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
