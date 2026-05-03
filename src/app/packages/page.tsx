import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Star, MapPin, Clock, Users, ArrowRight, Sparkles } from "lucide-react";

export const metadata = { title: "Packages — Nearby Escapes" };

const packages = [
  {
    id: "victoria-falls-3",
    title: "Victoria Falls Weekend",
    location: "Livingstone",
    nights: 3,
    includes: ["Accommodation", "Transport", "Falls tour", "Breakfast"],
    price: 1850,
    originalPrice: 2200,
    rating: 4.9,
    reviews: 48,
    image:
      "https://images.pexels.com/photos/2422533/pexels-photo-2422533?auto=compress&fit=crop&w=600&h=400",
    tag: "Best Seller",
  },
  {
    id: "south-luangwa-5",
    title: "South Luangwa Safari",
    location: "Mfuwe",
    nights: 5,
    includes: ["Tented camp", "Game drives", "All meals", "Return flights"],
    price: 4200,
    originalPrice: 5100,
    rating: 4.8,
    reviews: 32,
    image:
      "https://images.pexels.com/photos/2166936/pexels-photo-2166936?auto=compress&fit=crop&w=600&h=400",
    tag: "Premium",
  },
  {
    id: "kafue-4",
    title: "Kafue River Retreat",
    location: "Kafue NP",
    nights: 4,
    includes: ["Eco-lodge", "Boat safari", "Sunset cruise", "Meals"],
    price: 2900,
    originalPrice: 3400,
    rating: 4.7,
    reviews: 21,
    image:
      "https://images.pexels.com/photos/2199357/pexels-photo-2199357?auto=compress&fit=crop&w=600&h=400",
    tag: "Eco Pick",
  },
  {
    id: "lower-zambezi-6",
    title: "Lower Zambezi Explorer",
    location: "Chirundu",
    nights: 6,
    includes: ["Lodge", "Canoe safari", "Fishing", "All inclusive"],
    price: 5600,
    originalPrice: 6500,
    rating: 5.0,
    reviews: 14,
    image:
      "https://images.pexels.com/photos/2422533/pexels-photo-2422533?auto=compress&fit=crop&w=600&h=400",
    tag: "Luxury",
  },
  {
    id: "lusaka-weekend",
    title: "Lusaka City Break",
    location: "Lusaka",
    nights: 2,
    includes: ["Boutique hotel", "City tour", "Restaurant credits"],
    price: 780,
    originalPrice: 950,
    rating: 4.5,
    reviews: 67,
    image:
      "https://images.pexels.com/photos/2166936/pexels-photo-2166936?auto=compress&fit=crop&w=600&h=400",
    tag: "City Escape",
  },
  {
    id: "northern-circuit",
    title: "Northern Circuit Discovery",
    location: "Kasama & Sumbu",
    nights: 7,
    includes: ["3 lodges", "Private transfers", "Guided tours", "Full board"],
    price: 6800,
    originalPrice: 8000,
    rating: 4.9,
    reviews: 9,
    image:
      "https://images.pexels.com/photos/2199357/pexels-photo-2199357?auto=compress&fit=crop&w=600&h=400",
    tag: "Off the Beaten Path",
  },
];

export default function PackagesPage() {
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
              <Sparkles className="h-3 w-3 mr-1" /> Curated Packages
            </Badge>
            <h1
              className="text-3xl md:text-5xl font-bold tracking-tight"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Everything in one booking
            </h1>
            <p className="mt-4 text-white/80 text-lg max-w-xl mx-auto">
              Stays, transport, tours and meals — hand-crafted packages for every budget.
            </p>
          </div>
        </div>

        {/* Packages grid */}
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Available packages
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight">
                {packages.length} packages found
              </h2>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className="group overflow-hidden border-border/60 hover:border-primary/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                  <Badge className="absolute top-3 left-3 bg-white/95 text-foreground text-[11px] font-semibold">
                    {pkg.tag}
                  </Badge>
                  <div className="absolute bottom-3 right-3">
                    <div className="flex items-center gap-1 rounded-full bg-black/50 backdrop-blur px-2 py-1 text-white text-xs">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {pkg.rating} ({pkg.reviews})
                    </div>
                  </div>
                </div>

                <CardContent className="p-5">
                  <h3 className="font-bold text-base leading-tight">{pkg.title}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" /> {pkg.location}
                  </p>

                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {pkg.nights} nights
                    </span>
                    <span className="flex items-center gap-1">
                      <Package className="h-3 w-3" /> {pkg.includes.length} included
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {pkg.includes.map((item) => (
                      <Badge key={item} variant="secondary" className="text-[10px]">
                        {item}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-xl font-bold">
                        ZMW {pkg.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground line-through">
                        ZMW {pkg.originalPrice.toLocaleString()}
                      </p>
                    </div>
                    <Button size="sm" className="bg-[image:var(--gradient-hero)] hover:opacity-95">
                      View <ArrowRight className="h-3.5 w-3.5 ml-1" />
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
