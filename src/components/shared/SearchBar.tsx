"use client";

import { useState } from "react";
import { MagnifyingGlass as Search, MapPin, Users, CalendarBlank as CalendarDays } from "@phosphor-icons/react";
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
  const [leavingFrom, setLeavingFrom] = useState("");
  const [goingTo, setGoingTo] = useState("");
  const [tripType, setTripType] = useState<"one_way" | "round_trip">("one_way");
  const [dateRange, setDateRange] = useState<DateRange>({ checkIn: null, checkOut: null });
  const [guests, setGuests] = useState(2);
  const router = useRouter();

  const isStays = activeCategory === "stays";
  const isTransport = activeCategory === "transport";

  const getPlaceholder = () => {
    switch (activeCategory) {
      case "stays":        return "Search lodges, hotels...";
      case "experiences":  return "Search safaris, tours...";
      case "transport":    return "Destination city, e.g. Livingstone";
      case "packages":     return "Search retreats...";
      default:             return "Where to escape?";
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (isTransport) {
      const params = new URLSearchParams();
      if (leavingFrom.trim()) params.set("from", leavingFrom.trim());
      if (goingTo.trim()) params.set("to", goingTo.trim());
      params.set("trip", tripType);
      const dates = serializeDates(dateRange);
      if (dates) params.set("dates", dates);
      router.push(`/transport?${params.toString()}`);
      return;
    }

    const term = destination.trim();
    if (onSearch) {
      onSearch(term, dateRange, guests);
      return;
    }
    const params = new URLSearchParams();
    if (term) params.set("q", term);
    const targetRoute = activeCategory || "stays";
    if (isStays) {
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
      
      {/* ── TRANSPORT TRIP TYPE PILLS ─────────────────────────────────── */}
      {isTransport && (
        <div className="flex items-center justify-center gap-2 mt-2.5 md:mt-3 mb-3">
          <button
            type="button"
            onClick={() => setTripType("one_way")}
            className={cn(
              "px-3.5 py-1 text-xs font-extrabold rounded-full transition-all duration-150 border cursor-pointer select-none shadow-xs",
              tripType === "one_way"
                ? "bg-purple text-white border-purple"
                : "bg-white/90 border-neutral-300 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
            )}
          >
            One way
          </button>
          <button
            type="button"
            onClick={() => setTripType("round_trip")}
            className={cn(
              "px-3.5 py-1 text-xs font-extrabold rounded-full transition-all duration-150 border cursor-pointer select-none shadow-xs",
              tripType === "round_trip"
                ? "bg-purple text-white border-purple"
                : "bg-white/90 border-neutral-300 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
            )}
          >
            Round trip
          </button>
        </div>
      )}

      {/* ── MOBILE ───────────────────────────────────────────────────── */}
      <div className="md:hidden">
        {isTransport ? (
          /* Transport mobile card */
          <div className="bg-white rounded-2xl shadow-md border border-purple-border/50 relative z-30">
            {/* Leaving from */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-purple-border/50">
              <MapPin className="h-3.5 w-3.5 text-purple shrink-0" strokeWidth={1.5} />
              <div className="flex-1 min-w-0">
                <p className="text-[8px] font-extrabold uppercase tracking-wider text-purple leading-none mb-0.5">Leaving from</p>
                <input
                  type="text"
                  value={leavingFrom}
                  onChange={(e) => setLeavingFrom(e.target.value)}
                  placeholder="Origin city (e.g. Lusaka)"
                  className="w-full bg-transparent text-[12px] font-semibold text-black-soft placeholder:text-black-faint focus:outline-none truncate"
                />
              </div>
            </div>

            {/* To? */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-purple-border/50">
              <MapPin className="h-3.5 w-3.5 text-purple shrink-0" strokeWidth={1.5} />
              <div className="flex-1 min-w-0">
                <p className="text-[8px] font-extrabold uppercase tracking-wider text-purple leading-none mb-0.5">To?</p>
                <input
                  type="text"
                  value={goingTo}
                  onChange={(e) => setGoingTo(e.target.value)}
                  placeholder="Destination city (e.g. Livingstone)"
                  className="w-full bg-transparent text-[12px] font-semibold text-black-soft placeholder:text-black-faint focus:outline-none truncate"
                />
              </div>
            </div>

            {/* When | Search button */}
            <div className="grid grid-cols-[1fr_auto] items-center px-3 py-1.5 gap-2">
              <div className="relative z-30 min-w-0">
                <p className="text-[8px] font-extrabold uppercase tracking-wider text-purple leading-none mb-0.5">When</p>
                <DateRangePicker value={dateRange} onChange={setDateRange} variant="compact">
                  <span className="text-[12px] text-black-soft truncate block cursor-pointer font-medium">
                    {dateLabel}
                  </span>
                </DateRangePicker>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center bg-purple-800 hover:bg-purple-hover text-white rounded-full h-8 px-4 text-xs font-bold transition-all duration-200 shadow-sm shrink-0 gap-1.5 cursor-pointer"
              >
                <Search className="h-3.5 w-3.5" strokeWidth={2.5} />
                Search
              </button>
            </div>
          </div>
        ) : (
          /* Stays & Other categories: compact single inline pill row (Where | When | Search button) */
          <div className="bg-white rounded-full shadow-[0_4px_20px_rgba(31,20,51,0.08)] border border-neutral-200 pl-3.5 pr-1.5 py-1.5 min-h-[48px] grid grid-cols-[1fr_auto_1fr_auto] items-center gap-1.5">
            {/* Where (1fr equal column) */}
            <div className="flex items-center gap-1.5 min-w-0 px-1">
              <MapPin className="h-4 w-4 text-neutral-400 shrink-0" strokeWidth={1.8} />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Where to?"
                className="w-full bg-transparent text-xs font-medium text-neutral-700 placeholder:text-neutral-400 focus:outline-none truncate"
              />
            </div>

            {/* Vertical Divider */}
            <div className="h-5 w-px bg-neutral-200 shrink-0" />

            {/* When (1fr equal column) */}
            <div className="flex items-center gap-1.5 min-w-0 px-1">
              <CalendarDays className="h-4 w-4 text-neutral-400 shrink-0" strokeWidth={1.8} />
              <div className="relative z-30 min-w-0 flex-1">
                <DateRangePicker value={dateRange} onChange={setDateRange} variant="compact">
                  <span className={cn(
                    "text-xs truncate block cursor-pointer transition-colors",
                    dateLabel === "Add dates" ? "text-neutral-400 font-medium" : "text-neutral-700 font-semibold"
                  )}>
                    {dateLabel === "Add dates" ? "When?" : dateLabel}
                  </span>
                </DateRangePicker>
              </div>
            </div>

            {/* Search button */}
            <button
              type="submit"
              className="shrink-0 flex items-center justify-center bg-purple text-white rounded-full h-9 w-9 hover:bg-purple-hover transition-all duration-200 shadow-xs cursor-pointer active:scale-95 ml-0.5"
              aria-label="Search"
            >
              <Search className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>

      {/* ── DESKTOP ───────────────────────────────────────────────────── */}
      <div className="hidden md:block bg-white rounded-full overflow-visible shadow-[0_8px_32px_rgba(42,27,61,0.15)] border border-purple-border/40 p-1">
        {isTransport ? (
          /* Desktop Transport Layout: Leaving from | To? | When | Search */
          <div className="flex items-center w-full">
            {/* Leaving from */}
            <div className="flex items-center gap-2 flex-[2] min-w-0 px-3 py-1 rounded-full transition-all duration-200 hover:bg-white-soft cursor-pointer">
              <MapPin className="h-4 w-4 text-purple shrink-0" strokeWidth={1.5} />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-purple leading-tight">Leaving from</p>
                <input
                  type="text"
                  value={leavingFrom}
                  onChange={(e) => setLeavingFrom(e.target.value)}
                  placeholder="Origin city (e.g. Lusaka)"
                  className="w-full bg-transparent text-[12px] font-semibold text-black-soft placeholder:text-black-faint focus:outline-none p-0 truncate"
                />
              </div>
            </div>

            <div className="h-8 w-px bg-border shrink-0" />

            {/* To? */}
            <div className="flex items-center gap-2 flex-[2] min-w-0 px-3 py-1 rounded-full transition-all duration-200 hover:bg-white-soft cursor-pointer">
              <MapPin className="h-4 w-4 text-purple shrink-0" strokeWidth={1.5} />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-purple leading-tight">To?</p>
                <input
                  type="text"
                  value={goingTo}
                  onChange={(e) => setGoingTo(e.target.value)}
                  placeholder="Destination city (e.g. Livingstone)"
                  className="w-full bg-transparent text-[12px] font-semibold text-black-soft placeholder:text-black-faint focus:outline-none p-0 truncate"
                />
              </div>
            </div>

            <div className="h-8 w-px bg-border shrink-0" />

            {/* Date */}
            <div className="relative z-30 flex-[1.8] min-w-0 px-3 py-1 transition-all duration-300">
              <p className="text-[10px] font-bold uppercase tracking-wider text-purple leading-tight mb-0.5">When</p>
              <div className="min-w-0">
                <DateRangePicker value={dateRange} onChange={setDateRange} variant="compact" />
              </div>
            </div>

            {/* Search button */}
            <button
              type="submit"
              className="mr-0.5 flex items-center gap-1.5 bg-purple-800 hover:bg-purple-hover text-white rounded-full px-5 py-2 text-[12px] font-bold transition-all duration-200 shadow-sm hover:shadow-md shrink-0 cursor-pointer"
            >
              <Search className="h-4 w-4" strokeWidth={2.5} />
              <span>Search</span>
            </button>
          </div>
        ) : (
          /* Desktop Stays / Experiences / Destinations Layout */
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

            <div className={cn("h-8 w-px bg-border shrink-0 transition-all duration-300", !isStays && "invisible")} />

            {/* Date */}
            <div className={cn("relative z-30 flex-[2] min-w-0 px-3 py-1 transition-all duration-300", !isStays && "invisible pointer-events-none")}>
              <p className="text-[10px] font-semibold text-black-soft leading-tight mb-0.5">Date</p>
              <div className="min-w-0">
                <DateRangePicker value={dateRange} onChange={setDateRange} variant="compact" />
              </div>
            </div>

            <div className={cn("h-8 w-px bg-border shrink-0 transition-all duration-300", !isStays && "invisible")} />

            {/* Guests */}
            <div className={cn("flex items-center gap-2 flex-[1.2] min-w-[100px] px-3 py-1 rounded-full transition-all duration-200 hover:bg-white-soft", !isStays && "invisible pointer-events-none")}>
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
        )}
      </div>
    </form>
  );
}