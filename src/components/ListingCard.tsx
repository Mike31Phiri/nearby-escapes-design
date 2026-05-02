import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import type { Listing } from "@/lib/mock-data";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      to="/accommodations/$id"
      params={{ id: listing.id }}
      className="group block overflow-hidden rounded-2xl bg-card transition-[var(--transition-smooth)] hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
        <img
          src={listing.image}
          alt={listing.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold backdrop-blur">
          {listing.category}
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-tight truncate">{listing.name}</h3>
          <div className="flex items-center gap-1 text-xs font-medium shrink-0">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            {listing.rating}
          </div>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{listing.location}</p>
        <p className="mt-2 text-sm">
          <span className="font-bold">${listing.price}</span>
          <span className="text-muted-foreground"> / night</span>
        </p>
      </div>
    </Link>
  );
}
