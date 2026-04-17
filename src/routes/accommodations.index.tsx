import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ListingCard } from "@/components/ListingCard";
import { listings } from "@/lib/mock-data";

export const Route = createFileRoute("/accommodations/")({
  head: () => ({
    meta: [
      { title: "Accommodations — Nearby Escapes" },
      { name: "description", content: "Browse lodges, hotels, camps and guesthouses across Zambia." },
      { property: "og:title", content: "Accommodations — Nearby Escapes" },
      { property: "og:description", content: "Browse lodges, hotels, camps and guesthouses across Zambia." },
    ],
  }),
  component: AccommodationsPage,
});

function AccommodationsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="mx-auto w-full max-w-7xl px-4 md:px-6 mt-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Stay</p>
        <h1 className="mt-1 text-3xl md:text-4xl font-bold tracking-tight">All accommodations</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Hand-picked places to rest your head across Zambia.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
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
