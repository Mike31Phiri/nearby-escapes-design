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
      href={searchParams.toString() ? `/listings/stays/${listing.id}?${searchParams.toString()}` : `/listings/stays/${listing.id}`}
      className={cn("group block", className)}
      aria-label={`View details for ${listing.name} in ${listing.location}, priced at $${listing.price} per night`}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] mb-4 shadow-sm group-hover:shadow-xl transition-shadow duration-500">
        <img
          src={listing.image}
          alt={listing.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <button
          onClick={toggleFavorite}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-md transition-all active:scale-90 hover:bg-white/40 z-10"
          aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn("h-5 w-5 transition-colors", isFavorited ? "fill-primary text-primary" : "text-white")}
          />
        </button>
        {listing.rating >= 4.8 && (
          <div className="absolute top-4 left-4 rounded-full bg-primary text-white px-3 py-1 text-[9px] font-black uppercase tracking-widest shadow-lg">
            Guest Favorite
          </div>
        )}
      </div>
      
      <div className="flex flex-col px-1">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="font-black text-base tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">{listing.name}</h3>
          
          <div className="flex items-center gap-1.5 shrink-0 bg-primary/5 px-2 py-1 rounded-lg">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            <span className="font-black text-xs text-primary">
              {listing.rating.toFixed(1)}
            </span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground font-medium flex items-center gap-1 uppercase tracking-wider text-[10px] mb-3">
          <MapPin className="h-3 w-3 text-primary" /> {listing.location}
        </p>
        
        <div className="flex items-center justify-between border-t border-border/40 pt-3">
          <p className="text-lg font-black text-foreground">
            ${listing.price}
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1"> / night</span>
          </p>
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{listing.reviews} reviews</span>
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
