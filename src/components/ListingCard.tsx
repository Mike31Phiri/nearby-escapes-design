"use client";

import Link from "next/link";
import { Heart, Star, MapPin } from "lucide-react";
import type { Stay } from "@/types/stay";
import { cn } from "@/lib/utils";
import { memo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { AuthGuardDialog } from "@/components/auth/AuthGuardDialog";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useWishlistStore } from "@/store/wishlistStore";

interface ListingCardProps {
  listing: Stay;
  className?: string;
}

export const ListingCard = memo(function ListingCard({ listing, className }: ListingCardProps) {
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { isSaved, addItem, removeItem } = useWishlistStore();
  const isFavorited = isSaved(listing.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }

    if (isFavorited) {
      removeItem(listing.id);
      toast.success(`Removed ${listing.name} from your collections`);
    } else {
      addItem(listing);
      toast.success(`Added ${listing.name} to your collections`, {
        icon: <Heart className="h-4 w-4 fill-primary text-primary" />,
      });
    }
  };

  return (
    <Link
      href={
        searchParams.toString()
          ? `/listings/stays/${listing.id}?${searchParams.toString()}`
          : `/listings/stays/${listing.id}`
      }
      className={cn("group block", className)}
      aria-label={`View details for ${listing.name} in ${listing.location}, priced at $${listing.price} per night`}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-md mb-2 bg-muted">
        <img
          src={listing.image}
          alt={listing.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
        />
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/10 transition-colors hover:bg-black/20 z-10"
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

      <div className="flex flex-col py-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-sm tracking-tight text-foreground line-clamp-1">
            {listing.name}
          </h3>

          <div className="flex items-center gap-1 shrink-0">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="font-semibold text-xs text-foreground">
              {listing.rating.toFixed(1)}
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-1 line-clamp-1">{listing.location}</p>

        <div className="flex items-center">
          <p className="text-sm font-semibold text-foreground">
            ${listing.price}
            <span className="text-xs font-normal text-muted-foreground ml-1">night</span>
          </p>
        </div>
      </div>
      <AuthGuardDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        title="Save to your collections"
        description="Sign in to save this property and access it from any device."
      />
    </Link>
  );
});
