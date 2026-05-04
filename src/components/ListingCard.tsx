"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import type { Listing } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { memo, useState } from "react";

interface ListingCardProps {
  listing: Listing;
  className?: string;
}

export const ListingCard = memo(function ListingCard({ listing, className }: ListingCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorited(!isFavorited);
  };

  return (
    <Link
      href={`/accommodations/${listing.id}`}
      className={cn("group block", className)}
      aria-label={`View details for ${listing.name} in ${listing.location}, priced at $${listing.price} per night`}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-3">
        <img
          src={listing.image}
          alt={listing.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 p-1 transition-transform active:scale-95 z-10"
          aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn("h-6 w-6 transition-colors", isFavorited ? "fill-primary text-primary" : "fill-black/30 text-white")}
          />
        </button>
        {listing.rating >= 4.8 && (
          <div className="absolute top-3 left-3 rounded bg-background px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground shadow-sm">
            Top Rated
          </div>
        )}
      </div>
      
      <div className="flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-[15px] leading-snug text-foreground line-clamp-1">{listing.name}</h3>
          
          <div className="flex items-center gap-1 shrink-0">
            <div className="flex flex-col items-end mr-1 hidden sm:flex">
              <span className="text-[10px] font-bold uppercase text-primary leading-none">Exceptional</span>
              <span className="text-[10px] text-muted-foreground leading-none mt-0.5">{listing.reviews} reviews</span>
            </div>
            <div className="flex items-center justify-center bg-primary text-primary-foreground font-bold text-xs rounded px-1.5 py-1 min-w-[28px]">
              {listing.rating.toFixed(1)}
            </div>
          </div>
        </div>
        
        <p className="text-[15px] text-muted-foreground truncate">{listing.location}</p>
        <p className="text-[15px] text-muted-foreground truncate">Distance or views here</p>
        
        <div className="mt-1 flex items-center gap-1 text-[15px]">
          <span className="font-semibold text-foreground">${listing.price}</span>
          <span className="text-foreground">night</span>
        </div>
      </div>
    </Link>
  );
});
