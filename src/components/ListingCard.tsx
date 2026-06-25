"use client";

import Link from "next/link";
import { Heart, Star } from "lucide-react";
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
  isExclusive?: boolean;
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
      className={cn("group block transition-all duration-300 hover:-translate-y-0.5", className)}
      aria-label={`View details for ${listing.name} in ${listing.location}, priced at ZMW ${listing.price} per night`}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] bg-[#F0EAE0] rounded-xl overflow-hidden transition-shadow duration-300 group-hover:shadow-sm">
        <img
          src={listing.image}
          alt={listing.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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

      {/* Info — Title, Price, Rating only */}
      <div className="pt-2.5 px-0.5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[14px] font-semibold text-[#334155] leading-snug line-clamp-1 flex-1">
            {listing.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37]" strokeWidth={1.5} />
            <span className="text-[12px] font-semibold text-[#6B6258]">
              {listing.rating.toFixed(1)}
            </span>
          </div>
        </div>
        <div className="flex items-baseline gap-0.5 mt-1.5">
          <span className="text-[14px] font-bold text-[#1A0B2E]">ZMW {listing.price}</span>
          <span className="text-[11px] text-[#64748B]">/ night</span>
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
