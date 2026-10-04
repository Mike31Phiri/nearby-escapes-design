"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Heart, MapPin, Star, Trash2, ArrowRight, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useWishlistStore, type WishlistItem } from "@/store/wishlistStore";
import { BACKDROP_CLASS } from "@/lib/utils";

const MAX_VISIBLE = 5;

export function WishlistPopover() {
  const { items, removeItem } = useWishlistStore();
  const [open, setOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 640px)");

  const visible = useMemo(() => items.slice(0, MAX_VISIBLE), [items]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative flex items-center justify-center h-9 w-9 rounded-full border border-neutral-200 bg-white text-neutral-600 hover:text-purple hover:border-purple/40 transition-colors outline-none"
          aria-label="Saved items"
        >
          <Heart className={`h-[18px] w-[18px] transition-colors ${items.length > 0 ? "fill-rose-500 text-rose-500" : ""}`} />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white">
              {items.length}
            </span>
          )}
        </button>
      </PopoverTrigger>

      {/* Full-screen dimmed backdrop */}
      {open &&
        createPortal(
          <div
            aria-hidden="true"
            className={`fixed inset-0 z-50 ${BACKDROP_CLASS} animate-in fade-in duration-200`}
          />,
          document.body,
        )}

      <PopoverContent
        align={isDesktop ? "end" : "center"}
        sideOffset={12}
        collisionPadding={16}
        className="w-[min(96vw,560px)] rounded-2xl border border-neutral-100 bg-white p-0 shadow-[0_24px_64px_rgba(31,20,51,0.16)] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <Heart className="h-4 w-4 text-purple fill-purple" />
            <h3 className="text-sm font-semibold text-neutral-900 tracking-[-0.01em]">Saved</h3>
            {items.length > 0 && (
              <span className="bg-neutral-100 text-neutral-500 text-[10px] font-medium px-1.5 py-0.5 rounded-full tabular-nums">
                {items.length}
              </span>
            )}
          </div>
          {items.length > 0 && (
            <Link
              href="/wishlist"
              onClick={() => setOpen(false)}
              className="text-[12px] font-medium text-purple hover:text-purple/80 transition-colors flex items-center gap-1 outline-none"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {/* Body */}
        <div className="max-h-[min(72vh,600px)] overflow-y-auto scrollbar-hide">
          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
              <div className="h-12 w-12 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-4">
                <Heart className="h-5 w-5 text-neutral-300" />
              </div>
              <p className="text-sm font-medium text-neutral-700">Nothing saved yet</p>
              <p className="text-[13px] text-neutral-400 mt-1.5 leading-relaxed max-w-[220px]">
                Tap the heart on any listing to save it here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {visible.map((item: WishlistItem) => (
                <li key={item.id}>
                  <div className="flex items-center gap-4 px-5 py-4 hover:bg-neutral-50/70 transition-colors sm:gap-5 sm:px-6 sm:py-5">
                    {/* Thumbnail */}
                    <Link
                      href={`/listings/stays/${item.id}`}
                      onClick={() => setOpen(false)}
                      className="shrink-0 h-[72px] w-[72px] sm:h-[84px] sm:w-[84px] rounded-xl overflow-hidden bg-neutral-100"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/listings/stays/${item.id}`}
                        onClick={() => setOpen(false)}
                        className="text-[14px] sm:text-[15px] font-medium text-neutral-900 line-clamp-1 hover:text-purple transition-colors"
                      >
                        {item.name}
                      </Link>
                      {/* Location — tight proximity to title */}
                      <p className="flex items-center gap-1 text-[12px] text-neutral-400 mt-0.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </p>
                      {/* Metrics */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-[12px] sm:text-[13px] font-medium text-neutral-700">
                            {item.rating}
                          </span>
                        </span>
                        <span className="h-3 w-px bg-neutral-200" />
                        <span className="text-[12px] sm:text-[13px] text-neutral-500">
                          <span className="font-medium text-neutral-700">K{item.price}</span>
                          <span className="text-neutral-400"> /night</span>
                        </span>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="h-8 w-8 shrink-0 rounded-lg flex items-center justify-center text-neutral-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                      aria-label={`Remove ${item.name} from saved`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer — overflow count */}
        {items.length > MAX_VISIBLE && (
          <div className="flex items-center justify-center px-5 py-3 border-t border-neutral-100 bg-neutral-50/60">
            <Link
              href="/wishlist"
              onClick={() => setOpen(false)}
              className="text-[12px] font-medium text-neutral-500 hover:text-purple transition-colors flex items-center gap-1"
            >
              +{items.length - MAX_VISIBLE} more saved items
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
