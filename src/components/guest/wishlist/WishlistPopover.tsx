"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  Heart,
  MapPin,
  Star,
  Trash2,
  ArrowRight,
  X,
} from "lucide-react";
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
          <Heart className="h-[18px] w-[18px]" />
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
        sideOffset={10}
        collisionPadding={12}
        className="w-[min(92vw,380px)] rounded-2xl border border-neutral-200 bg-white p-0 shadow-[0_16px_48px_rgba(31,20,51,0.16)] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-purple fill-purple" />
            <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">
              Saved
            </h3>
            {items.length > 0 && (
              <span className="bg-purple text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </div>
          {items.length > 0 && (
            <Link
              href="/wishlist"
              onClick={() => setOpen(false)}
              className="text-[11px] font-bold text-purple hover:text-purple transition-colors flex items-center gap-1 outline-none"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {/* Body */}
        <div className="max-h-[min(60vh,420px)] overflow-y-auto scrollbar-hide">
          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center px-6">
              <div className="h-12 w-12 rounded-full bg-[#f3eafb] flex items-center justify-center mb-3">
                <Heart className="h-5 w-5 text-purple" />
              </div>
              <p className="text-sm font-bold text-neutral-900">No saved items yet</p>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Tap the heart icon on any listing to save it here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-200">
              {visible.map((item: WishlistItem) => (
                <li key={item.id}>
                  <div className="flex gap-3 px-4 py-3 transition-colors hover:bg-neutral-50">
                    {/* Thumbnail */}
                    <Link
                      href={`/listings/stays/${item.id}`}
                      onClick={() => setOpen(false)}
                      className="shrink-0 h-14 w-14 rounded-xl overflow-hidden bg-neutral-100"
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
                        className="text-[13px] font-bold text-neutral-900 line-clamp-1 hover:text-purple transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="flex items-center gap-1 text-[11px] text-neutral-500 mt-0.5">
                        <MapPin className="h-3 w-3 shrink-0 text-neutral-400" />
                        <span className="truncate">{item.location}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-[11px] font-bold text-neutral-800">{item.rating}</span>
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          K{item.price}/night
                        </span>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="h-7 w-7 shrink-0 rounded-lg flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors self-center"
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

        {/* Footer hint */}
        {visible.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 px-4 py-2.5 border-t border-neutral-200 bg-neutral-50 text-[10px] text-neutral-400">
            <X className="h-3 w-3" />
            Tap an item to open it
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
