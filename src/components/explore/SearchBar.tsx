"use client";

import { useState } from "react";
import { MagnifyingGlass as Search, MapPin, Users, ArrowRight } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { DateRangePicker, serializeDates, type DateRange } from "@/components/ui/DateRangePicker";

interface SearchBarProps {
  className?: string;
  onSearch?: (term: string, dates: DateRange, guests: number) => void;
}

export function SearchBar({ className, onSearch }: SearchBarProps) {
  const [destination, setDestination] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ checkIn: null, checkOut: null });
  const [guests, setGuests] = useState(2);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = destination.trim();
    if (onSearch) {
      onSearch(term, dateRange, guests);
      return;
    }

    const params = new URLSearchParams();
    if (term) params.set("tag", term);
    params.set("category", "all");
    const dates = serializeDates(dateRange);
    if (dates) params.set("dates", dates);
    params.set("guests", String(guests));
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={cn("mx-auto w-full transition-all duration-300", className)}
    >
      {/*  MOBILE: Vertical stacked layout  */}
      <div className="md:hidden bg-white rounded-2xl p-5 shadow-[0_12px_48px_rgba(42,27,61,0.25)]">
        <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-[1.2px] mb-3">
          Where do you want to escape?
        </p>

        <div className="flex items-center gap-3 bg-[#F9F7F2] rounded-xl px-4 py-3.5 mb-3 transition-all duration-200 focus-within:ring-2 focus-within:ring-[#D4AF37]/40">
          <MapPin className="h-5 w-5 text-[#1A0B2E] shrink-0" strokeWidth={1.5} />
          <div className="flex-1">
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Destination or type"
              className="w-full bg-transparent text-[15px] font-medium text-[#334155] placeholder:text-[#64748B] focus:outline-none p-0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <div className="flex items-center gap-2.5 bg-[#F9F7F2] rounded-xl px-3.5 py-3">
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>
          <div className="flex items-center gap-2.5 bg-[#F9F7F2] rounded-xl px-3.5 py-3">
            <Users className="h-[18px] w-[18px] text-[#1A0B2E] shrink-0" strokeWidth={1.5} />
            <div className="text-left flex-1">
              <p className="text-[10px] text-[#64748B]">Guests</p>
              <input
                type="number"
                min={1}
                value={guests}
                onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))}
                className="w-full bg-transparent text-[13px] font-medium text-[#334155] focus:outline-none p-0 leading-tight"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="group w-full bg-gradient-to-br from-[#D4AF37] to-[#B89430] hover:from-[#D4B45A] hover:to-[#D4AF37] text-[#334155] rounded-xl py-3.5 text-[15px] font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_4px_16px_rgba(197,160,89,0.35)]"
        >
          <Search className="h-[18px] w-[18px]" strokeWidth={2.5} />
          Find My Escape
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            strokeWidth={2.5}
          />
        </button>
      </div>

      {/*  DESKTOP: Horizontal bar layout  */}
      <div className="hidden md:block bg-white rounded-full overflow-visible shadow-[0_12px_48px_rgba(42,27,61,0.25)] px-1 py-1">
        <div className="flex items-center">
          {/* Destination */}
          <div className="flex items-center gap-2.5 flex-[2] px-4 py-2 rounded-full transition-all duration-200 hover:bg-[#F9F7F2]/60 cursor-pointer">
            <MapPin className="h-5 w-5 text-[#1A0B2E] shrink-0" strokeWidth={1.5} />
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-[#334155] leading-tight">Where</p>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Destination or experience type"
                className="w-full bg-transparent text-[13px] text-[#64748B] placeholder:text-[#64748B] focus:outline-none p-0"
              />
            </div>
          </div>

          <div className="h-10 w-px bg-[#E0DBD0]" />

          {/* Date */}
          <div className="flex-1 px-4 py-2">
            <p className="text-[11px] font-semibold text-[#334155] leading-tight mb-0.5">Date</p>
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
              variant="compact"
            />
          </div>

          <div className="h-10 w-px bg-[#E0DBD0]" />

          {/* Guests */}
          <div className="flex items-center gap-2.5 flex-1 px-4 py-2 rounded-full transition-all duration-200 hover:bg-[#F9F7F2]/60">
            <Users className="h-5 w-5 text-[#1A0B2E] shrink-0" strokeWidth={1.5} />
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-[#334155] leading-tight">Guests</p>
              <input
                type="number"
                min={1}
                value={guests}
                onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))}
                className="w-full bg-transparent text-[13px] text-[#64748B] focus:outline-none p-0"
              />
            </div>
          </div>

          {/* Search button */}
          <button
            type="submit"
            className="mr-0.5 flex items-center gap-2 bg-[#D4AF37] hover:bg-[#d5b069] text-[#111111] rounded-full px-5 py-3 text-[13px] font-bold transition-all duration-200 shadow-[0_2px_12px_rgba(197,160,89,0.3)] hover:shadow-[0_4px_16px_rgba(197,160,89,0.4)] shrink-0"
          >
            <Search className="h-[18px] w-[18px]" strokeWidth={2.5} />
            <span className="hidden lg:inline">Search</span>
          </button>
        </div>
      </div>
    </form>
  );
}
