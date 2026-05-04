import Link from "next/link";
import { Bus, ArrowRight, Clock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/explore/SearchBar";
import { ListingCard } from "@/components/ListingCard";
import { CategoryPills } from "@/components/CategoryPills";
import { listings } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const heroImage = "/images/hero-zambia.jpg";

const popularRoutes = [
  {
    id: "lusaka-livingstone",
    from: "Lusaka",
    to: "Livingstone",
    duration: "6h 30m",
    price: 180,
    operator: "Mazhandu Family Bus",
    departures: "4 daily",
    image:
      "https://images.pexels.com/photos/2166936/pexels-photo-2166936?auto=compress&fit=crop&w=400&h=250",
  },
  {
    id: "lusaka-kitwe",
    from: "Lusaka",
    to: "Kitwe",
    duration: "7h",
    price: 200,
    operator: "Power Tools",
    departures: "3 daily",
    image:
      "https://images.pexels.com/photos/2199357/pexels-photo-2199357?auto=compress&fit=crop&w=400&h=250",
  },
  {
    id: "lusaka-chipata",
    from: "Lusaka",
    to: "Chipata",
    duration: "5h 45m",
    price: 160,
    operator: "Jonda Bus",
    departures: "2 daily",
    image:
      "https://images.pexels.com/photos/2422533/pexels-photo-2422533?auto=compress&fit=crop&w=400&h=250",
  },
];

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-black">
        {/* Hero image with text overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Victoria Falls at sunset, Zambia"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-black/20 to-black/60" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 pt-16 md:pt-24 pb-8 md:pb-16 flex flex-col items-center">
          <h1
            className="font-sans max-w-4xl text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] drop-shadow-xl text-center text-white mb-4"
            style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
          >
            Find your next escape, just nearby
          </h1>
          <p
            className="font-sans max-w-xl text-base md:text-xl text-white/90 drop-shadow-md font-medium text-center mb-10"
            style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}
          >
            Stays, transport, hidden gems and curated packages — all in one place.
          </p>

          {/* Search bar — sits prominently over the image */}
          <div className="w-full px-2 mt-4 md:mt-8 transform translate-y-4 md:translate-y-8">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="sticky top-20 z-40 bg-background border-b border-border/50 pt-6 pb-2 shadow-sm">
        <div className="mx-auto max-w-7xl">
          <CategoryPills />
        </div>
      </section>

      {/* Main Listings Grid */}
      <section
        className="mx-auto w-full max-w-7xl px-4 md:px-6 mt-8 md:mt-12"
        aria-labelledby="all-stays-heading"
      >
        <h2 id="all-stays-heading" className="sr-only">
          Available Accommodations
        </h2>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10"
          role="list"
          aria-label="Accommodations"
        >
          {/* We duplicate listings slightly to mock a large infinite grid for the visual effect */}
          {[...listings, ...listings].map((listing, index) => (
            <ListingCard key={`${listing.id}-${index}`} listing={listing} />
          ))}
        </div>
      </section>

      {/* Rides / Transport */}
      <section className="mx-auto w-full max-w-7xl px-4 md:px-6 mt-20 md:mt-24 mb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">
              Popular bus routes
            </h2>
            <p className="text-muted-foreground mt-1">Get to your destination comfortably</p>
          </div>
          <Link
            className="hidden sm:inline text-sm font-semibold text-primary hover:underline"
            href="/bus-booking"
          >
            All routes
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {popularRoutes.map((route) => (
            <Link key={route.id} href="/bus-booking" className="group block">
              <Card className="border border-border/60 overflow-hidden transition-[var(--transition-smooth)] hover:shadow-lg rounded-2xl">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={route.image}
                    alt={`${route.from} to ${route.to}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="text-white">
                      <p className="text-lg font-bold drop-shadow-md">
                        {route.from} → {route.to}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-bold text-foreground backdrop-blur-sm shadow-sm">
                      <Bus className="h-3.5 w-3.5" /> {route.operator}
                    </div>
                  </div>
                </div>
                <CardContent className="p-4 bg-background">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" /> {route.duration}
                      </span>
                      <span>{route.departures}</span>
                    </div>
                    <p className="text-[15px]">
                      <span className="font-bold text-foreground">ZMW {route.price}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/bus-booking">
            <Button variant="outline" size="lg" className="w-full rounded-xl font-semibold border-2">
              Browse all routes
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 md:px-6 mt-16 mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Why Book With Us</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: "fa-shield-alt", title: "Secure Booking", desc: "Your bookings are safe with our secure payment system", bg: "bg-blue-50 dark:bg-blue-950/40", iconBg: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400" },
            { icon: "fa-headset", title: "24/7 Support", desc: "Our customer service team is always ready to help", bg: "bg-violet-50 dark:bg-violet-950/40", iconBg: "bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-400" },
            { icon: "fa-tags", title: "Best Prices", desc: "We guarantee the best prices for your stays and travels", bg: "bg-emerald-50 dark:bg-emerald-950/40", iconBg: "bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400" },
            { icon: "fa-map-marked-alt", title: "Wide Coverage", desc: "Covering all major Zambian cities and tourist attractions", bg: "bg-amber-50 dark:bg-amber-950/40", iconBg: "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400" },
          ].map(({ icon, title, desc, bg, iconBg }) => (
            <div
              key={title}
              className={`flex flex-col items-center text-center gap-4 rounded-2xl border border-border/60 ${bg} p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]`}
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-full ${iconBg} text-2xl`}>
                <i className={`fas ${icon}`} aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex-1" />
      <Footer />
    </div>
  );
}
