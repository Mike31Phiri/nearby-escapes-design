import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SearchBar } from "@/components/SearchBar";
import { ListingCard } from "@/components/ListingCard";
import { listings } from "@/lib/mock-data";
import heroImage from "@/assets/hero-zambia.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nearby Escapes — Discover Zambia's Best Stays & Travel" },
      {
        name: "description",
        content:
          "Book accommodations, buses, and curated travel packages across Zambia. From safari camps to city hotels.",
      },
      { property: "og:title", content: "Nearby Escapes — Discover Zambia" },
      {
        property: "og:description",
        content: "Book accommodations, buses, and packages across Zambia.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="relative">
        <div className="relative mx-auto max-w-7xl px-4 md:px-6 pt-8 md:pt-12">
          <div className="relative overflow-hidden rounded-3xl">
            <img
              src={heroImage}
              alt="Victoria Falls at sunset"
              width={1600}
              height={1024}
              className="h-[420px] md:h-[520px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-background">
              <h1 className="max-w-3xl text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
                Find your next escape, just nearby
              </h1>
              <p className="mt-4 max-w-xl text-base md:text-lg text-background/85">
                Stays, transport, hidden gems and curated packages — all in one place.
              </p>
            </div>
          </div>

          {/* Search bar overlapping */}
          <div className="-mt-10 md:-mt-12 relative z-10 px-2">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Popular */}
      <section className="mx-auto w-full max-w-7xl px-4 md:px-6 mt-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Popular
            </p>
            <h2 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">
              Stays travelers love
            </h2>
          </div>
          <a className="hidden sm:inline text-sm font-medium text-primary hover:underline" href="/accommodations">
            View all
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </section>

      <div className="flex-1" />
      <SiteFooter />
    </div>
  );
}
