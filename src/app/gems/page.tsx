import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Compass, ArrowRight } from "lucide-react";

export const metadata = { title: "Hidden Gems — Nearby Escapes" };

const gems = [
  {
    id: "mutinondo",
    name: "Mutinondo Wilderness",
    location: "Mpika",
    tagline: "Granite domes, black water streams and zero crowds",
    category: "Nature Reserve",
    rating: 4.9,
    image:
      "https://images.pexels.com/photos/2166936/pexels-photo-2166936?auto=compress&fit=crop&w=600&h=400",
  },
  {
    id: "chisimba",
    name: "Chisimba Falls",
    location: "Kasama",
    tagline: "Three sacred waterfalls hidden in miombo woodland",
    category: "Waterfall",
    rating: 4.7,
    image:
      "https://images.pexels.com/photos/2199357/pexels-photo-2199357?auto=compress&fit=crop&w=600&h=400",
  },
  {
    id: "shiwa-ngandu",
    name: "Shiwa Ng'andu",
    location: "Mpika",
    tagline: "Africa's most romantic manor house, set in wild bush",
    category: "Heritage",
    rating: 4.8,
    image:
      "https://images.pexels.com/photos/2422533/pexels-photo-2422533?auto=compress&fit=crop&w=600&h=400",
  },
  {
    id: "ntumbachushi",
    name: "Ntumbachushi Falls",
    location: "Kawambwa",
    tagline: "Twin falls that few tourists ever find",
    category: "Waterfall",
    rating: 4.6,
    image:
      "https://images.pexels.com/photos/2166936/pexels-photo-2166936?auto=compress&fit=crop&w=600&h=400",
  },
  {
    id: "samfya-beach",
    name: "Samfya Beach",
    location: "Lake Bangweulu",
    tagline: "Freshwater beach with powder-white sand",
    category: "Beach",
    rating: 4.5,
    image:
      "https://images.pexels.com/photos/2199357/pexels-photo-2199357?auto=compress&fit=crop&w=600&h=400",
  },
  {
    id: "lavushi-manda",
    name: "Lavushi Manda NP",
    location: "Serenje",
    tagline: "Walking safaris through untouched miombo",
    category: "National Park",
    rating: 4.8,
    image:
      "https://images.pexels.com/photos/2422533/pexels-photo-2422533?auto=compress&fit=crop&w=600&h=400",
  },
];

export default function GemsPage() {
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
              <Compass className="h-3 w-3 mr-1" /> Hidden Gems
            </Badge>
            <h1
              className="text-3xl md:text-5xl font-bold tracking-tight"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Places most people never find
            </h1>
            <p className="mt-4 text-white/80 text-lg max-w-xl mx-auto">
              Offbeat Zambia — secret waterfalls, empty beaches and wilderness lodges only locals know.
            </p>
          </div>
        </div>

        {/* Gems grid */}
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Curated
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight">
                {gems.length} hidden gems
              </h2>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {gems.map((gem) => (
              <Card
                key={gem.id}
                className="group overflow-hidden border-border/60 hover:border-primary/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={gem.image}
                    alt={gem.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
                  <Badge className="absolute top-3 left-3 bg-white/90 text-foreground text-[11px]">
                    {gem.category}
                  </Badge>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-bold text-base">{gem.name}</h3>
                    <p className="text-white/80 text-xs flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" /> {gem.location}
                    </p>
                  </div>
                </div>

                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{gem.tagline}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                      <span className="font-medium">{gem.rating}</span>
                    </div>
                    <Button size="sm" variant="outline" className="hover:border-primary/40 hover:text-primary">
                      Explore <ArrowRight className="h-3.5 w-3.5 ml-1" />
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
