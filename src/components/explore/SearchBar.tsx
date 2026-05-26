"use client";

import { useState } from "react";
import { CalendarDays, MapPin, Search, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function SearchBar({ className }: { className?: string }) {
  const [destination, setDestination] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = destination.trim();
    if (!term) return;
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={cn(
        "mx-auto w-full max-w-3xl",
        /* ── card container: solid white, floating on hero ── */
        "rounded-2xl bg-white shadow-[0_12px_40px_-8px_rgba(0,0,0,0.25)]",
        "border border-gray-200/60",
        /* ── active: brighter ring ── */
        "focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/40",
        /* ── smooth transitions ── */
        "transition-all duration-300",
        className,
      )}
    >
      {/* ── Main search row ── */}
      <div className="flex flex-col md:flex-row items-stretch gap-0">
        {/* Destination */}
        <div className="flex flex-1 items-center gap-3 px-4 md:px-5 py-3 md:py-0">
          <MapPin
            className="h-4 w-4 shrink-0 text-primary/60 md:h-5 md:w-5"
            strokeWidth={2}
          />
          <div className="flex flex-col flex-1 min-w-0">
            <label
              htmlFor="search-destination"
              className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 leading-none mb-0.5"
            >
              Destination
            </label>
            <input
              id="search-destination"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where are you going?"
              className="w-full bg-transparent py-1 text-sm text-gray-900 placeholder-gray-400 outline-none md:text-base"
            />
          </div>
        </div>

        {/* Divider (desktop) */}
        <div className="hidden md:block w-px self-stretch my-3 bg-gray-200" />
        <div className="block md:hidden h-px mx-4 bg-gray-100" />

        {/* Date picker trigger */}
        <button
          type="button"
          className="flex flex-1 items-center gap-3 px-4 md:px-5 py-3 md:py-0 hover:bg-gray-50/50 transition-colors text-left cursor-default"
        >
          <CalendarDays
            className="h-4 w-4 shrink-0 text-primary/60 md:h-5 md:w-5"
            strokeWidth={2}
          />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 leading-none mb-0.5">
              Check in — Check out
            </span>
            <span className="py-1 text-sm text-gray-400 md:text-base">Add dates</span>
          </div>
        </button>

        {/* Divider (desktop) */}
        <div className="hidden md:block w-px self-stretch my-3 bg-gray-200" />
        <div className="block md:hidden h-px mx-4 bg-gray-100" />

        {/* Guest picker trigger */}
        <button
          type="button"
          className="flex flex-1 items-center gap-3 px-4 md:px-5 py-3 md:py-0 hover:bg-gray-50/50 transition-colors text-left cursor-default"
        >
          <Users
            className="h-4 w-4 shrink-0 text-primary/60 md:h-5 md:w-5"
            strokeWidth={2}
          />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 leading-none mb-0.5">
              Guests
            </span>
            <span className="py-1 text-sm text-gray-400 md:text-base">Add guests</span>
          </div>
        </button>

        {/* Search button */}
        <div className="flex items-center p-2 md:p-2.5">
          <button
            type="submit"
            className={cn(
              "flex w-full md:w-auto items-center justify-center gap-2",
              "rounded-xl bg-primary px-5 md:px-6 py-3 md:py-3.5",
              "text-sm font-semibold text-white",
              "transition-all duration-200 hover:bg-primary/90 active:scale-[0.97]",
              "shadow-lg shadow-primary/25",
            )}
            aria-label="Search"
          >
            <Search className="h-4 w-4" strokeWidth={2.5} />
            <span>Search</span>
          </button>
        </div>
      </div>
    </form>
  );
}
