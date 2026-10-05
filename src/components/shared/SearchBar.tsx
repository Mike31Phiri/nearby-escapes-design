"use client";

import { useState, useEffect } from "react";
import {
  MagnifyingGlass as Search,
  MapPin,
  Users,
  CalendarBlank as CalendarDays,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { DateRangePicker, serializeDates, type DateRange } from "@/components/ui/DateRangePicker";

export interface SearchBarState {
  destination: string;
  dates: DateRange;
  guests: number;
  leavingFrom?: string;
  goingTo?: string;
  tripType?: "one_way" | "round_trip";
}

export interface SearchBarProps {
  className?: string;
  onSearch?: (
    term: string,
    dates: DateRange,
    guests: number,
    extra?: { leavingFrom?: string; goingTo?: string; tripType?: "one_way" | "round_trip" },
  ) => void;
  onChange?: (state: SearchBarState) => void;
  activeCategory?: string;
  initialDestination?: string;
  initialDates?: DateRange;
  initialGuests?: number;
  initialLeavingFrom?: string;
  initialGoingTo?: string;
  initialTripType?: "one_way" | "round_trip";
}

const DEFAULT_DATES: DateRange = { checkIn: null, checkOut: null };

export function SearchBar({
  className,
  onSearch,
  onChange,
  activeCategory = "stays",
  initialDestination = "",
  initialDates = DEFAULT_DATES,
  initialGuests = 2,
  initialLeavingFrom = "",
  initialGoingTo = "",
  initialTripType = "one_way",
}: SearchBarProps) {
  const [destination, setDestination] = useState(initialDestination);
  const [leavingFrom, setLeavingFrom] = useState(initialLeavingFrom);
  const [goingTo, setGoingTo] = useState(initialGoingTo);
  const [tripType, setTripType] = useState<"one_way" | "round_trip">(initialTripType);
  const [dateRange, setDateRange] = useState<DateRange>(initialDates);
  const [guests, setGuests] = useState(initialGuests);
  const router = useRouter();

  // Sync internal state when initial props update (e.g. URL query param changes)
  useEffect(() => {
    if (initialDestination !== undefined) setDestination(initialDestination);
  }, [initialDestination]);

  useEffect(() => {
    if (initialDates !== undefined) {
      setDateRange((prev) => {
        const prevIn = prev?.checkIn ? new Date(prev.checkIn).getTime() : null;
        const nextIn = initialDates?.checkIn ? new Date(initialDates.checkIn).getTime() : null;
        const prevOut = prev?.checkOut ? new Date(prev.checkOut).getTime() : null;
        const nextOut = initialDates?.checkOut ? new Date(initialDates.checkOut).getTime() : null;
        if (prevIn === nextIn && prevOut === nextOut) {
          return prev;
        }
        return initialDates;
      });
    }
  }, [initialDates?.checkIn, initialDates?.checkOut]);

  useEffect(() => {
    if (initialGuests !== undefined) setGuests(initialGuests);
  }, [initialGuests]);

  useEffect(() => {
    if (initialLeavingFrom !== undefined) setLeavingFrom(initialLeavingFrom);
  }, [initialLeavingFrom]);

  useEffect(() => {
    if (initialGoingTo !== undefined) setGoingTo(initialGoingTo);
  }, [initialGoingTo]);

  useEffect(() => {
    if (initialTripType !== undefined) setTripType(initialTripType);
  }, [initialTripType]);

  const isStays = activeCategory === "stays";
  const isExperiences = activeCategory === "experiences";
  const isTransport = activeCategory === "transport";

  const getPlaceholder = () => {
    switch (activeCategory) {
      case "stays":
        return "Search lodges, hotels, locations...";
      case "experiences":
        return "Search safaris, tours, activities...";
      case "transport":
        return "Destination city, e.g. Livingstone";
      case "packages":
        return "Search retreats & getaways...";
      default:
        return "Where to escape?";
    }
  };

  const notifyChange = (updated: Partial<SearchBarState>) => {
    if (!onChange) return;
    onChange({
      destination: updated.destination !== undefined ? updated.destination : destination,
      dates: updated.dates !== undefined ? updated.dates : dateRange,
      guests: updated.guests !== undefined ? updated.guests : guests,
      leavingFrom: updated.leavingFrom !== undefined ? updated.leavingFrom : leavingFrom,
      goingTo: updated.goingTo !== undefined ? updated.goingTo : goingTo,
      tripType: updated.tripType !== undefined ? updated.tripType : tripType,
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (isTransport) {
      if (onSearch) {
        onSearch(destination.trim(), dateRange, guests, {
          leavingFrom: leavingFrom.trim(),
          goingTo: goingTo.trim(),
          tripType,
        });
        return;
      }
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
    if (isStays || isExperiences) {
      const dates = serializeDates(dateRange);
      if (dates) params.set("dates", dates);
      params.set("guests", String(guests));
    }
    router.push(`/${targetRoute}?${params.toString()}`);
  };

  const dateLabel = dateRange.checkIn
    ? `${dateRange.checkIn.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}${
        dateRange.checkOut
          ? `–${dateRange.checkOut.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`
          : ""
      }`
    : "Dates";

  return (
    <form
      onSubmit={handleSearch}
      className={cn("mx-auto w-full transition-all duration-300 relative z-30", className)}
    >
      {/* TRANSPORT TRIP TYPE PILLS */}
      {isTransport && (
        <div className="flex items-center justify-center gap-2 mt-1 mb-2.5">
          <button
            type="button"
            onClick={() => {
              setTripType("one_way");
              notifyChange({ tripType: "one_way" });
            }}
            className={cn(
              "px-3.5 py-1 text-xs font-semibold rounded-full transition-all duration-150 border cursor-pointer select-none shadow-2xs",
              tripType === "one_way"
                ? "bg-purple text-white border-purple"
                : "bg-white/90 border-neutral-300 text-neutral-600 hover:border-purple/50 hover:text-purple",
            )}
          >
            One way
          </button>
          <button
            type="button"
            onClick={() => {
              setTripType("round_trip");
              notifyChange({ tripType: "round_trip" });
            }}
            className={cn(
              "px-3.5 py-1 text-xs font-semibold rounded-full transition-all duration-150 border cursor-pointer select-none shadow-2xs",
              tripType === "round_trip"
                ? "bg-purple text-white border-purple"
                : "bg-white/90 border-neutral-300 text-neutral-600 hover:border-purple/50 hover:text-purple",
            )}
          >
            Round trip
          </button>
        </div>
      )}

      {/* MOBILE */}
      <div className="md:hidden">
        {isTransport ? (
          /* Transport mobile card */
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(31,20,51,0.08)] border border-purple-border/50 relative z-30 overflow-hidden">
            {/* Leaving from */}
            <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-neutral-100">
              <MapPin className="h-4 w-4 text-purple shrink-0" strokeWidth={1.8} />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 leading-none mb-0.5">
                  Leaving from
                </p>
                <input
                  type="text"
                  value={leavingFrom}
                  onChange={(e) => {
                    setLeavingFrom(e.target.value);
                    notifyChange({ leavingFrom: e.target.value });
                  }}
                  placeholder="Origin city (e.g. Lusaka)"
                  className="w-full bg-transparent text-[13px] font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none truncate"
                />
              </div>
            </div>

            {/* To? */}
            <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-neutral-100">
              <MapPin className="h-4 w-4 text-purple shrink-0" strokeWidth={1.8} />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 leading-none mb-0.5">
                  To?
                </p>
                <input
                  type="text"
                  value={goingTo}
                  onChange={(e) => {
                    setGoingTo(e.target.value);
                    notifyChange({ goingTo: e.target.value });
                  }}
                  placeholder="Destination city (e.g. Livingstone)"
                  className="w-full bg-transparent text-[13px] font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none truncate"
                />
              </div>
            </div>

            {/* When | Search button */}
            <div className="grid grid-cols-[1fr_auto] items-center px-3.5 py-2 gap-2 bg-neutral-50/50">
              <div className="relative z-30 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 leading-none mb-0.5">
                  When
                </p>
                <DateRangePicker
                  value={dateRange}
                  onChange={(r) => {
                    setDateRange(r);
                    notifyChange({ dates: r });
                  }}
                  placeholder="Dates"
                  variant="compact"
                >
                  <span
                    className={cn(
                      "text-[13px] truncate block cursor-pointer select-none",
                      dateLabel === "Dates"
                        ? "text-neutral-400 font-medium"
                        : "text-neutral-900 font-semibold",
                    )}
                  >
                    {dateLabel}
                  </span>
                </DateRangePicker>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center bg-purple hover:bg-purple-hover text-white rounded-full h-8 px-4 text-xs font-bold transition-all duration-200 shadow-sm shrink-0 gap-1.5 cursor-pointer active:scale-95"
              >
                <Search className="h-3.5 w-3.5" strokeWidth={2.5} />
                Search
              </button>
            </div>
          </div>
        ) : (
          /* Stays & Other categories: compact single inline pill row (Where | When | Search button) */
          <div className="bg-white rounded-full shadow-[0_4px_20px_rgba(31,20,51,0.08)] border border-neutral-200/90 pl-3.5 pr-1.5 py-1.5 min-h-[48px] grid grid-cols-[1fr_auto_1fr_auto] items-center gap-1.5">
            {/* Where (1fr equal column) */}
            <div className="flex items-center gap-1.5 min-w-0 px-1">
              <MapPin className="h-4 w-4 text-neutral-500 shrink-0" strokeWidth={1.8} />
              <input
                type="text"
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  notifyChange({ destination: e.target.value });
                }}
                placeholder="Where to?"
                className="w-full bg-transparent text-xs font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none truncate"
              />
            </div>

            {/* Vertical Divider */}
            <div className="h-5 w-px bg-neutral-200 shrink-0" />

            {/* When (1fr equal column) */}
            <div className="flex items-center gap-1.5 min-w-0 px-1">
              <CalendarDays className="h-4 w-4 text-neutral-500 shrink-0" strokeWidth={1.8} />
              <div className="relative z-30 min-w-0 flex-1">
                <DateRangePicker
                  value={dateRange}
                  onChange={(r) => {
                    setDateRange(r);
                    notifyChange({ dates: r });
                  }}
                  placeholder="Dates"
                  variant="compact"
                >
                  <span
                    className={cn(
                      "text-xs truncate block cursor-pointer transition-colors select-none",
                      dateLabel === "Dates"
                        ? "text-neutral-400 font-medium"
                        : "text-neutral-900 font-semibold",
                    )}
                  >
                    {dateLabel}
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

      {/* DESKTOP (Floating Pill Capsule design matching Home Page) */}
      <div className="hidden md:block bg-white rounded-full overflow-visible shadow-[0_8px_32px_rgba(42,27,61,0.12)] border border-purple-border/40 p-1">
        {isTransport ? (
          /* Desktop Transport Layout: Leaving from | To? | When | Search */
          <div className="flex items-center w-full">
            {/* Leaving from */}
            <div className="flex items-center gap-2.5 flex-[2] min-w-0 px-3.5 py-1.5 rounded-full transition-all duration-200 hover:bg-neutral-50 cursor-pointer">
              <MapPin className="h-4 w-4 text-purple shrink-0" strokeWidth={1.8} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 leading-tight">
                  Leaving from
                </p>
                <input
                  type="text"
                  value={leavingFrom}
                  onChange={(e) => {
                    setLeavingFrom(e.target.value);
                    notifyChange({ leavingFrom: e.target.value });
                  }}
                  placeholder="Origin city (e.g. Lusaka)"
                  className="w-full bg-transparent text-[13px] font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none p-0 truncate"
                />
              </div>
            </div>

            <div className="h-8 w-px bg-neutral-200 shrink-0" />

            {/* To? */}
            <div className="flex items-center gap-2.5 flex-[2] min-w-0 px-3.5 py-1.5 rounded-full transition-all duration-200 hover:bg-neutral-50 cursor-pointer">
              <MapPin className="h-4 w-4 text-purple shrink-0" strokeWidth={1.8} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 leading-tight">
                  To?
                </p>
                <input
                  type="text"
                  value={goingTo}
                  onChange={(e) => {
                    setGoingTo(e.target.value);
                    notifyChange({ goingTo: e.target.value });
                  }}
                  placeholder="Destination city (e.g. Livingstone)"
                  className="w-full bg-transparent text-[13px] font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none p-0 truncate"
                />
              </div>
            </div>

            <div className="h-8 w-px bg-neutral-200 shrink-0" />

            {/* Date */}
            <div className="relative z-30 flex-[1.8] min-w-0 px-3.5 py-1.5 transition-all duration-300">
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 leading-tight mb-0.5">
                When
              </p>
              <div className="min-w-0">
                <DateRangePicker
                  value={dateRange}
                  onChange={(r) => {
                    setDateRange(r);
                    notifyChange({ dates: r });
                  }}
                  placeholder="Dates"
                  variant="compact"
                />
              </div>
            </div>

            {/* Search button */}
            <button
              type="submit"
              className="mr-0.5 flex items-center gap-1.5 bg-purple hover:bg-purple-hover text-white rounded-full px-5 py-2.5 text-xs font-bold transition-all duration-200 shadow-sm hover:shadow-md shrink-0 cursor-pointer active:scale-95"
            >
              <Search className="h-4 w-4" strokeWidth={2.5} />
              <span>Search</span>
            </button>
          </div>
        ) : (
          /* Desktop Stays / Experiences / Packages Layout */
          <div className="flex items-center w-full">
            {/* Destination */}
            <div className="flex items-center gap-2.5 flex-[2.5] min-w-0 px-3.5 py-1.5 rounded-full transition-all duration-200 hover:bg-neutral-50 cursor-pointer">
              <MapPin className="h-4 w-4 text-purple shrink-0" strokeWidth={1.8} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 leading-tight">
                  Where
                </p>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    notifyChange({ destination: e.target.value });
                  }}
                  placeholder={getPlaceholder()}
                  className="w-full bg-transparent text-[13px] font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none p-0 truncate"
                />
              </div>
            </div>

            <div
              className={cn(
                "h-8 w-px bg-neutral-200 shrink-0 transition-all duration-300",
                !isStays && !isExperiences && "invisible",
              )}
            />

            {/* Date */}
            <div
              className={cn(
                "relative z-30 flex-[2] min-w-0 px-3.5 py-1.5 transition-all duration-300",
                !isStays && !isExperiences && "invisible pointer-events-none",
              )}
            >
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 leading-tight mb-0.5">
                When
              </p>
              <div className="min-w-0">
                <DateRangePicker
                  value={dateRange}
                  onChange={(r) => {
                    setDateRange(r);
                    notifyChange({ dates: r });
                  }}
                  placeholder="Dates"
                  variant="compact"
                />
              </div>
            </div>

            <div
              className={cn(
                "h-8 w-px bg-neutral-200 shrink-0 transition-all duration-300",
                !isStays && !isExperiences && "invisible",
              )}
            />

            {/* Guests */}
            <div
              className={cn(
                "flex items-center gap-2.5 flex-[1.2] min-w-[110px] px-3.5 py-1.5 rounded-full transition-all duration-200 hover:bg-neutral-50",
                !isStays && !isExperiences && "invisible pointer-events-none",
              )}
            >
              <Users className="h-4 w-4 text-purple shrink-0" strokeWidth={1.8} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 leading-tight">
                  {isExperiences ? "People" : "Guests"}
                </p>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={guests}
                  onChange={(e) => {
                    const g = Math.max(1, Number(e.target.value) || 1);
                    setGuests(g);
                    notifyChange({ guests: g });
                  }}
                  className="w-full bg-transparent text-[13px] font-semibold text-neutral-900 focus:outline-none p-0"
                />
              </div>
            </div>

            {/* Search button */}
            <button
              type="submit"
              className="mr-0.5 flex items-center gap-1.5 bg-purple hover:bg-purple-hover text-white rounded-full px-5 py-2.5 text-xs font-bold transition-all duration-200 shadow-sm hover:shadow-md shrink-0 cursor-pointer active:scale-95"
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
