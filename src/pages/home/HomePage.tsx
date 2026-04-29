import { Link } from "@tanstack/react-router";
import { Bus, ArrowRight, MapPin, Star, Clock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/explore/SearchBar";
import { ListingCard } from "@/components/ListingCard";
import { CategoryPills } from "@/components/CategoryPills";
import { listings } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-zambia.jpg";

const recommendedListings = listings.filter((l) =>
  ["mosi-oa-tunya-lodge", "luangwa-tented-camp", "kafue-eco-lodge"].includes(l.id)
);

const popularRoutes = [
  {
    id: "lusaka-livingstone",
    from: "Lusaka",
    to: "Livingstone",
    duration: "6h 30m",
    price: 180,
    operator: "Mazhandu Family Bus",
    departures: "4 daily",
    image: "https://images.pexels.com/photos/2166936/pexels-photo-2166936?auto=compress&fit=crop&w=400&h=250",
  },
  {
    id: "lusaka-kitwe",
    from: "Lusaka",
    to: "Kitwe",
    duration: "7h",
    price: 200,
    operator: "Power Tools",
    departures: "3 daily",
    image: "https://images.pexels.com/photos/2199357/pexels-photo-2199357?auto=compress&fit=crop&w=400&h=250",
  },
  {
    id: "lusaka-chipata",
    from: "Lusaka",
    to: "Chipata",
    duration: "5h 45m",
    price: 160,
    operator: "Jonda Bus",
    departures: "2 daily",
    image: "https://images.pexels.com/photos/2422533/pexels-photo-2422533?auto=compress&fit=crop&w=400&h=250",
  },
];

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="relative">
        <div className="relative mx-auto max-w-7xl px-4 md:px-6 pt-8 md:pt-12">
          <div className="relative overflow-hidden rounded-3xl">
            <img
              src={heroImage}
              alt="Victoria Falls at sunset, Zambia"
              width={1600}
              height={1024}
              fetchPriority="high"
              decoding="async"
              className="h-[420px] md:h-[520px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-foreground/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-background">
              <div className="mb-6" data-hero-pills>
                <CategoryPills variant="hero" />
              </div>
              <h1 className="max-w-3xl text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
                Find your next escape, just nearby
              </h1>
              <p className="mt-4 max-w-xl text-base md:text-lg text-background/85">
                Stays, transport, hidden gems and curated packages — all in one place.
              </p>
            </div>
          </div>

          <div className="-mt-10 md:-mt-12 relative z-10 px-2">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Popular stays */}
      <section className="mx-auto w-full max-w-7xl px-4 md:px-6 mt-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Popular</p>
            <h2 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">
              Stays travelers love
            </h2>
          </div>
          <Link className="hidden sm:inline text-sm font-medium text-primary hover:underline" to="/accommodations">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      {/* Recommended stays */}
      <section className="mx-auto w-full max-w-7xl px-4 md:px-6 mt-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Recommended</p>
            <h2 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">
              Stays we think you'll love
            </h2>
          </div>
          <Link className="hidden sm:inline text-sm font-medium text-primary hover:underline" to="/accommodations">
            See more
          </Link>
        </div>

        <div className="grid gap-4 md:gap-6 md:grid-cols-3">
          {recommendedListings.map((listing) => (
            <Link
              key={listing.id}
              to="/accommodations/$id"
              params={{ id: listing.id }}
              className="group block overflow-hidden rounded-2xl bg-card border border-border/60 transition-[var(--transition-smooth)] hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={listing.image}
                  alt={listing.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/35" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-lg font-bold text-background truncate">{listing.name}</h3>
                  <p className="text-xs text-background/80 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3" /> {listing.location}
                  </p>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                  <span className="font-medium">{listing.rating}</span>
                  <span className="text-muted-foreground">({listing.reviews})</span>
                </div>
                <p className="text-sm">
                  <span className="font-bold">${listing.price}</span>
                  <span className="text-muted-foreground"> / night</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Rides / Transport */}
      <section className="mx-auto w-full max-w-7xl px-4 md:px-6 mt-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Transport</p>
            <h2 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">
              Popular bus routes
            </h2>
          </div>
          <Link className="hidden sm:inline text-sm font-medium text-primary hover:underline" to="/bus-booking">
            All routes
          </Link>
        </div>

        <div className="grid gap-4 md:gap-6 md:grid-cols-3">
          {popularRoutes.map((route) => (
            <Link key={route.id} to="/bus-booking" className="group block">
              <Card className="border-border/60 overflow-hidden transition-[var(--transition-smooth)] hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={route.image}
                    alt={`${route.from} to ${route.to}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/35" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="text-background">
                      <p className="text-lg font-bold">{route.from} → {route.to}</p>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold backdrop-blur">
                      <Bus className="h-3.5 w-3.5" /> {route.operator}
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {route.duration}
                      </span>
                      <span>{route.departures}</span>
                    </div>
                    <p className="text-sm">
                      <span className="font-bold">ZMW {route.price}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Link to="/bus-booking">
            <Button variant="outline" size="sm">
              Browse all routes <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      <div className="flex-1" />
      <Footer />
    </div>
  );
}
