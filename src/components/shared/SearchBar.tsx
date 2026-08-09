"use client";

import { useState } from "react";
import { MagnifyingGlass as Search, MapPin, Users, CalendarBlank } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { DateRangePicker, serializeDates, type DateRange } from "@/components/ui/DateRangePicker";

interface SearchBarProps {
  className?: string;
  onSearch?: (term: string, dates: DateRange, guests: number) => void;
  activeCategory?: string;
}

export function SearchBar({ className, onSearch, activeCategory = "stays" }: SearchBarProps) {
  const [destination, setDestination] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ checkIn: null, checkOut: null });
  const [guests, setGuests] = useState(2);
  const router = useRouter();

  const showExtras = activeCategory === "stays";

  const getPlaceholder = () => {
    switch (activeCategory) {
      case "stays":        return "Search lodges, hotels...";
      case "experiences":  return "Search safaris, tours...";
      case "transport":    return "Search routes...";
      case "packages":     return "Search retreats...";
      case "destinations": return "Search province, city...";
      default:             return "Where to escape?";
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = destination.trim();
    if (onSearch) {
      onSearch(term, dateRange, guests);
      return;
    }
    const params = new URLSearchParams();
    if (term) params.set("q", term);
    const targetRoute = activeCategory === "destinations" ? "explore" : activeCategory;
    if (activeCategory === "stays") {
      const dates = serializeDates(dateRange);
      if (dates) params.set("dates", dates);
      params.set("guests", String(guests));
    }
    router.push(`/${targetRoute}?${params.toString()}`);
  };

  const dateLabel = dateRange.checkIn
    ? `${dateRange.checkIn.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}${
        dateRange.checkOut ? `–${dateRange.checkOut.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}` : ""
      }`
    : "Add dates";

  return (
    <form onSubmit={handleSearch} className={cn("mx-auto w-full transition-all duration-300 relative z-30", className)}>

      {/* ── MOBILE ───────────────────────────────────────────────────── */}
      <div className="md:hidden">
        {showExtras ? (
          /* Stays: compact two-row card */
          <div className="bg-white rounded-2xl shadow-md border border-purple-border/50 relative z-30">
            {/* Row 1 — Destination */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-purple-border/50">
              <MapPin className="h-3.5 w-3.5 text-black-soft shrink-0" strokeWidth={1.5} />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder={getPlaceholder()}
                className="flex-1 bg-transparent text-[13px] text-black-soft placeholder:text-black-faint focus:outline-none min-w-0"
              />
            </div>

            {/* Row 2 — Date | Guests | Search */}
            <div className="grid grid-cols-[1fr_auto_auto] items-center">
              {/* Date picker */}
              <div className="relative z-30 min-w-0 px-3 py-1.5 border-r border-purple-border/50">
                <p className="text-[9px] font-bold uppercase tracking-wider text-black-faint leading-none mb-0.5">When</p>
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="min-w-0 flex-1">
                    <DateRangePicker value={dateRange} onChange={setDateRange} variant="compact">
                      <span className="text-[12px] text-black-soft truncate block max-w-[110px] sm:max-w-none cursor-pointer font-medium">
                        {dateLabel}
                      </span>
                    </DateRangePicker>
                  </div>
                </div>
              </div>

              {/* Guests */}
              <div className="w-[105px] shrink-0 px-2 py-1.5 border-r border-purple-border/50">
                <p className="text-[9px] font-bold uppercase tracking-wider text-black-faint leading-none mb-0.5">Guests</p>
                <div className="flex items-center justify-between gap-1">
                  <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="h-4 w-4 rounded-full border border-purple-border flex items-center justify-center text-black-soft text-xs leading-none hover:bg-white-soft transition-colors">−</button>
                  <span className="text-[12px] font-semibold text-black-soft">{guests}</span>
                  <button type="button" onClick={() => setGuests((g) => g + 1)} className="h-4 w-4 rounded-full border border-purple-border flex items-center justify-center text-black-soft text-xs leading-none hover:bg-white-soft transition-colors">+</button>
                </div>
              </div>

              {/* Search button */}
              <div className="px-2 shrink-0">
                <button
                  type="submit"
                  className="flex items-center justify-center bg-purple-800 hover:bg-purple-hover text-white rounded-full h-8 w-8 transition-all duration-200 shadow-sm"
                  aria-label="Search"
                >
                  <Search className="h-3.5 w-3.5" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Other categories: compact single pill */
          <div className="bg-white rounded-full shadow-md border border-purple-border/50 px-1 py-0.5">
            <div className="flex items-center w-full gap-2">
              <MapPin className="h-3.5 w-3.5 text-black-soft shrink-0 ml-2.5" strokeWidth={1.5} />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder={getPlaceholder()}
                className="flex-1 bg-transparent text-[13px] text-black-soft placeholder:text-black-faint focus:outline-none py-1.5 min-w-0"
              />
              <button
                type="submit"
                className="shrink-0 flex items-center justify-center bg-purple-800 hover:bg-purple-hover text-white rounded-full h-8 w-8 transition-all duration-200 shadow-sm"
                aria-label="Search"
              >
                <Search className="h-3.5 w-3.5" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── DESKTOP ───────────────────────────────────────────────────── */}
      <div className="hidden md:block bg-white rounded-full overflow-visible shadow-[0_8px_32px_rgba(42,27,61,0.15)] border border-purple-border/40 p-1">
        <div className="flex items-center w-full">
          {/* Destination */}
          <div className="flex items-center gap-2 flex-[2.5] min-w-0 px-3 py-1 rounded-full transition-all duration-200 hover:bg-white-soft cursor-pointer">
            <MapPin className="h-4 w-4 text-black shrink-0" strokeWidth={1.5} />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-black-soft leading-tight">Where</p>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder={getPlaceholder()}
                className="w-full bg-transparent text-[12px] text-black-faint placeholder:text-black-faint focus:outline-none p-0 truncate"
              />
            </div>
          </div>

          <div className={cn("h-8 w-px bg-border shrink-0 transition-all duration-300", !showExtras && "invisible")} />

          {/* Date */}
          <div className={cn("relative z-30 flex-[2] min-w-0 px-3 py-1 transition-all duration-300", !showExtras && "invisible pointer-events-none")}>
            <p className="text-[10px] font-semibold text-black-soft leading-tight mb-0.5">Date</p>
            <div className="min-w-0">
              <DateRangePicker value={dateRange} onChange={setDateRange} variant="compact" />
            </div>
          </div>

          <div className={cn("h-8 w-px bg-border shrink-0 transition-all duration-300", !showExtras && "invisible")} />

          {/* Guests */}
          <div className={cn("flex items-center gap-2 flex-[1.2] min-w-[100px] px-3 py-1 rounded-full transition-all duration-200 hover:bg-white-soft", !showExtras && "invisible pointer-events-none")}>
            <Users className="h-4 w-4 text-black shrink-0" strokeWidth={1.5} />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-black-soft leading-tight">Guests</p>
              <input
                type="number"
                min={1}
                value={guests}
                onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))}
                className="w-full bg-transparent text-[12px] text-black-faint focus:outline-none p-0"
              />
            </div>
          </div>

          {/* Search button */}
          <button
            type="submit"
            className="mr-0.5 flex items-center gap-1.5 bg-purple-800 hover:bg-purple-hover text-white rounded-full px-4 py-2 text-[12px] font-bold transition-all duration-200 shadow-sm hover:shadow-md shrink-0"
          >
            <Search className="h-4 w-4" strokeWidth={2.5} />
            <span className="hidden lg:inline">Search</span>
          </button>
        </div>
      </div>
    </form>
  );
}