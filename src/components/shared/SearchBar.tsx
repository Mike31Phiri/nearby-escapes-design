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
      case "stays":        return "Search lodges, hotels, camps...";
      case "experiences":  return "Search safaris, tours, activities...";
      case "transport":    return "Search routes (e.g. Lusaka to Livingstone)...";
      case "packages":     return "Search weekend escapes, retreats...";
      case "destinations": return "Search by province, city, or attraction...";
      case "local-tours":  return "Search local guided tours...";
      default:             return "Where do you want to escape?";
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
    ? `${dateRange.checkIn.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}${dateRange.checkOut ? ` – ${dateRange.checkOut.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}` : ""}`
    : "Add dates";

  return (
    <form onSubmit={handleSearch} className={cn("mx-auto w-full transition-all duration-300", className)}>

      {/* ── MOBILE ───────────────────────────────────────────────────── */}
      <div className="md:hidden">
        {showExtras ? (
          /* Stays: two-row card */
          <div className="bg-white rounded-3xl shadow-[0_8px_32px_rgba(42,27,61,0.18)] overflow-hidden">
            {/* Row 1 — Destination */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-purple-border">
              <MapPin className="h-4 w-4 text-black-soft shrink-0" strokeWidth={1.5} />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder={getPlaceholder()}
                className="flex-1 bg-transparent text-[14px] text-black-soft placeholder:text-black-faint focus:outline-none min-w-0"
              />
            </div>
            {/* Row 2 — Date | Guests | Search */}
            <div className="flex items-center">
              {/* Date picker */}
              <div className="flex items-center gap-2 flex-1 px-4 py-3 border-r border-purple-border">
                <CalendarBlank className="h-4 w-4 text-black-faint shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-black-faint leading-none mb-0.5">When</p>
                  <DateRangePicker value={dateRange} onChange={setDateRange} variant="compact">
                    <span className="text-[13px] text-black-soft truncate block">{dateLabel}</span>
                  </DateRangePicker>
                </div>
              </div>
              {/* Guests */}
              <div className="flex items-center gap-2 px-4 py-3 border-r border-purple-border">
                <Users className="h-4 w-4 text-black-faint shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-black-faint leading-none mb-0.5">Guests</p>
                  <div className="flex items-center gap-1.5">
                    <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="h-5 w-5 rounded-full border border-purple-border flex items-center justify-center text-black-soft text-sm leading-none hover:bg-white-soft transition-colors">−</button>
                    <span className="text-[13px] font-semibold text-black-soft w-4 text-center">{guests}</span>
                    <button type="button" onClick={() => setGuests((g) => g + 1)} className="h-5 w-5 rounded-full border border-purple-border flex items-center justify-center text-black-soft text-sm leading-none hover:bg-white-soft transition-colors">+</button>
                  </div>
                </div>
              </div>
              {/* Search btn */}
              <button
                type="submit"
                className="flex items-center justify-center bg-gold hover:bg-gold-hover text-black rounded-full h-9 w-9 mx-3 shrink-0 transition-all duration-200 shadow-sm"
                aria-label="Search"
              >
                <Search className="h-[16px] w-[16px]" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        ) : (
          /* Other categories: compact single pill */
          <div className="bg-white rounded-full shadow-[0_8px_32px_rgba(42,27,61,0.18)] px-1 py-1">
            <div className="flex items-center w-full gap-2">
              <MapPin className="h-4 w-4 text-black-soft shrink-0 ml-3" strokeWidth={1.5} />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder={getPlaceholder()}
                className="flex-1 bg-transparent text-[14px] text-black-soft placeholder:text-black-faint focus:outline-none py-2.5 min-w-0"
              />
              <button
                type="submit"
                className="shrink-0 flex items-center justify-center bg-gold hover:bg-gold-hover text-black rounded-full h-9 w-9 transition-all duration-200 shadow-sm"
                aria-label="Search"
              >
                <Search className="h-[16px] w-[16px]" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── DESKTOP ───────────────────────────────────────────────────── */}
      <div className="hidden md:block bg-white rounded-full overflow-visible shadow-[0_12px_48px_rgba(42,27,61,0.25)] px-1 py-1">
        <div className="flex items-center w-full">
          {/* Destination */}
          <div className="flex items-center gap-2.5 flex-[3] px-4 py-2 rounded-full transition-all duration-200 hover:bg-white-soft cursor-pointer">
            <MapPin className="h-5 w-5 text-black shrink-0" strokeWidth={1.5} />
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-black-soft leading-tight">Where</p>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder={getPlaceholder()}
                className="w-full bg-transparent text-[13px] text-black-faint placeholder:text-black-faint focus:outline-none p-0"
              />
            </div>
          </div>

          <div className={cn("h-10 w-px bg-border shrink-0 transition-all duration-300", !showExtras && "invisible")} />

          {/* Date */}
          <div className={cn("flex-1 px-4 py-2 transition-all duration-300", !showExtras && "invisible pointer-events-none")}>
            <p className="text-[11px] font-semibold text-black-soft leading-tight mb-0.5">Date</p>
            <DateRangePicker value={dateRange} onChange={setDateRange} variant="compact" />
          </div>

          <div className={cn("h-10 w-px bg-border shrink-0 transition-all duration-300", !showExtras && "invisible")} />

          {/* Guests */}
          <div className={cn("flex items-center gap-2.5 flex-1 px-4 py-2 rounded-full transition-all duration-200 hover:bg-white-soft", !showExtras && "invisible pointer-events-none")}>
            <Users className="h-5 w-5 text-black shrink-0" strokeWidth={1.5} />
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-black-soft leading-tight">Guests</p>
              <input
                type="number"
                min={1}
                value={guests}
                onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))}
                className="w-full bg-transparent text-[13px] text-black-faint focus:outline-none p-0"
              />
            </div>
          </div>

          {/* Search button */}
          <button
            type="submit"
            className="mr-0.5 flex items-center gap-2 bg-gold hover:bg-gold-hover text-black rounded-full px-5 py-3 text-[13px] font-bold transition-all duration-200 shadow-sm hover:shadow-md shrink-0"
          >
            <Search className="h-[18px] w-[18px]" strokeWidth={2.5} />
            <span className="hidden lg:inline">Search</span>
          </button>
        </div>
      </div>
    </form>
  );
}


