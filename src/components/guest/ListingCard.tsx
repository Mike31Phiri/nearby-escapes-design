"use client";

import Link from "next/link";
import { Heart, Star, MapPin } from "lucide-react";
import type { Stay } from "@/types/stay";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { toast } from "sonner";
import { useWishlistStore } from "@/store/wishlistStore";

interface ListingCardProps {
  listing: Stay;
  className?: string;
  isExclusive?: boolean;
}

export const ListingCard = memo(function ListingCard({ listing, className }: ListingCardProps) {
  const { isSaved, addItem, removeItem } = useWishlistStore();
  const isFavorited = isSaved(listing.id);
  const query = typeof window !== "undefined" ? window.location.search : "";

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isFavorited) {
        await removeItem(listing.id);
        toast.success(`Removed ${listing.name} from your collections`);
      } else {
        await addItem({
          id: listing.id,
          name: listing.name,
          image: listing.image,
          price: listing.price,
          location: listing.location,
          rating: listing.rating,
          type: "stay",
        });
        toast.success(`Added ${listing.name} to your collections`, {
          icon: <Heart className="h-4 w-4 fill-primary text-primary" />,
        });
      }
    } catch {
      toast.error("Could not update your saved collection. Please try again.");
    }
  };

  return (
    <Link
      href={
        query
          ? `/listings/stays/${listing.id}${query}`
          : `/listings/stays/${listing.id}`
      }
      className={cn("group block", className)}
      aria-label={`View details for ${listing.name} in ${listing.location}, priced at ZMW ${listing.price} per night`}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] bg-white-bone rounded-xl overflow-hidden">
        <img
          src={listing.image}
          alt={listing.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />

        {/* Wishlist Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/20 backdrop-blur-md transition-colors hover:bg-black/40 z-10"
          aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              isFavorited ? "fill-primary text-primary" : "text-white",
            )}
          />
        </button>
      </div>

      {/* Info */}
      <div className="pt-2.5 px-0.5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="card-title line-clamp-1 flex-1">
            {listing.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0 pt-0.5">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" strokeWidth={1.5} />
            <span className="card-rating font-semibold">
              {listing.rating.toFixed(1)}
            </span>
          </div>
        </div>
        <p className="card-location flex items-center gap-1 mt-1">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-black-muted" />
          <span className="truncate">{listing.location}</span>
        </p>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="card-price">ZMW {listing.price}</span>
          <span className="card-price-modifier">/ night</span>
        </div>
      </div>
    </Link>
  );
});
