import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Star, Wifi, Car, Coffee, Waves, CalendarDays, Users } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { ReportListingDialog } from "@/components/ReportListingDialog";
import { getListing, listings } from "@/lib/mock-data";

const SITE = "https://nearbyescapes.com";

export const Route = createFileRoute("/accommodations/$id")({
  head: ({ params }) => {
    const listing = getListing(params.id);
    const canonical = `${SITE}/accommodations/${params.id}`;
    const meta = [
      { title: listing ? `${listing.name} — Nearby Escapes` : "Stay — Nearby Escapes" },
      {
        name: "description",
        content: listing?.description ?? "Book your perfect stay in Zambia.",
      },
      { property: "og:title", content: listing?.name ?? "Stay" },
      { property: "og:description", content: listing?.description ?? "" },
      { property: "og:type", content: "product" },
      { property: "og:url", content: canonical },
      ...(listing ? [{ property: "og:image", content: listing.image }] : []),
      ...(listing ? [{ name: "twitter:image", content: listing.image }] : []),
    ];

    const links = [{ rel: "canonical", href: canonical }];

    const scripts = listing
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LodgingBusiness",
              name: listing.name,
              description: listing.description,
              image: listing.image,
              address: {
                "@type": "PostalAddress",
                addressLocality: listing.location,
                addressCountry: "ZM",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: listing.rating,
                reviewCount: listing.reviews,
              },
              priceRange: `$${listing.price}`,
              url: canonical,
            }),
          },
        ]
      : [];

    return { meta, links, scripts };
  },
  component: ListingDetail,
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p>Listing not found.</p>
      <Link to="/" className="text-primary underline">Go home</Link>
    </div>
  ),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p>Something went wrong: {error.message}</p>
        <Button onClick={() => { router.invalidate(); reset(); }}>Retry</Button>
      </div>
    );
  },
});

const amenities = [
  { label: "Wi-Fi", icon: Wifi },
  { label: "Parking", icon: Car },
  { label: "Breakfast", icon: Coffee },
  { label: "Pool", icon: Waves },
];

function ListingDetail() {
  const { id } = Route.useParams();
  const listing = getListing(id);

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <p>Not found.</p>
        </div>
      </div>
    );
  }

  const related = listings.filter((l) => l.id !== listing.id).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </div>

      {/* Hero image */}
      <section className="mx-auto w-full max-w-6xl px-4 md:px-6 mt-4">
        <div className="relative overflow-hidden rounded-3xl">
          <img
            src={listing.image}
            alt={`${listing.name} in ${listing.location}, Zambia`}
            width={1200}
            height={700}
            fetchPriority="high"
            decoding="async"
            className="h-[320px] md:h-[460px] w-full object-cover"
          />
          <div className="absolute top-4 left-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold backdrop-blur">
            {listing.category}
          </div>
        </div>
      </section>

      {/* Title row */}
      <section className="mx-auto w-full max-w-6xl px-4 md:px-6 mt-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{listing.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {listing.location}, Zambia
              </span>
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" /> {listing.rating}
                <span className="text-muted-foreground/70">({listing.reviews} reviews)</span>
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">${listing.price}</div>
            <div className="text-xs text-muted-foreground">per night</div>
          </div>
        </div>

        <p className="mt-6 max-w-3xl text-base text-muted-foreground leading-relaxed">
          {listing.description} Enjoy thoughtful service, local cuisine and easy access to
          nearby attractions. Whether you're here for adventure or relaxation, every detail
          has been designed to give you the perfect Zambian experience.
        </p>

        {/* Action tiles */}
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {amenities.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-[var(--transition-smooth)] hover:border-primary/40 hover:shadow-[var(--shadow-card)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>

        {/* Booking bar */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
            <Field icon={CalendarDays} label="Check-in" type="date" />
            <Field icon={CalendarDays} label="Check-out" type="date" />
            <Field icon={Users} label="Guests" placeholder="2 guests" />
            <Button
              size="lg"
              className="h-14 rounded-xl bg-[image:var(--gradient-hero)] hover:opacity-95 shadow-[var(--shadow-glow)]"
            >
              Reserve
            </Button>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="mx-auto w-full max-w-6xl px-4 md:px-6 mt-14">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-5">You might also like</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {related.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 md:px-6 mt-10 flex justify-end">
        <ReportListingDialog listingId={listing.id} listingName={listing.name} />
      </section>

      <div className="flex-1" />
      <SiteFooter />
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  placeholder,
  type = "text",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="flex cursor-text items-center gap-3 rounded-xl border border-border px-4 py-2.5 hover:bg-muted">
      <Icon className="h-5 w-5 text-primary shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm font-medium outline-none"
        />
      </div>
    </label>
  );
}
