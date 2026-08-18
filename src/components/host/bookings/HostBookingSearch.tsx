"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { useHostBookingsStore } from "@/store/hostBookingsStore";
import { formatDayLabel, formatTime12h } from "@/lib/utils/calendar";
import { ROUTES } from "@/lib/constants/routes";

export function HostBookingSearch() {
  const router = useRouter();
  const bookings = useHostBookingsStore((s) => s.bookings);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const trimmed = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!trimmed) return [];
    return bookings
      .filter(
        (b) =>
          b.ref.toLowerCase().includes(trimmed) ||
          b.guestName.toLowerCase().includes(trimmed) ||
          b.listingName.toLowerCase().includes(trimmed),
      )
      .slice(0, 6);
  }, [bookings, trimmed]);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (ref: string) => {
    setOpen(false);
    setQuery("");
    router.push(ROUTES.host.booking(ref));
  };

  const submit = () => {
    if (results.length === 0) return;
    go(results[0].ref);
  };

  const input = (
    <input
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        setOpen(true);
      }}
      onFocus={() => setOpen(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter") submit();
        if (e.key === "Escape") setOpen(false);
      }}
      placeholder="Search booking ref…"
      aria-label="Search bookings by reference"
      className="w-full bg-transparent text-[12px] font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
    />
  );

  const resultsPanel = open && (
    <div className="absolute left-0 right-0 top-full mt-2 rounded-xl bg-white border border-neutral-200 shadow-lg overflow-hidden z-50">
      {trimmed === "" ? (
        <p className="px-4 py-3 text-[11px] text-neutral-400">
          Type a booking reference (e.g. NE-4821), guest name, or tour.
        </p>
      ) : results.length === 0 ? (
        <p className="px-4 py-3 text-[11px] text-neutral-400">No bookings match “{query}”.</p>
      ) : (
        <ul>
          {results.map((b) => (
            <li key={b.ref}>
              <button
                onClick={() => go(b.ref)}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left hover:bg-neutral-50 transition-colors"
              >
                <span className="text-base leading-none">{b.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12px] font-bold text-neutral-900 truncate">
                    {b.ref} · {b.guestName}
                  </span>
                  <span className="block text-[10px] text-neutral-400 truncate">
                    {b.listingName} · {formatDayLabel(b.date)} {formatTime12h(b.time)}
                  </span>
                </span>
                <span className="text-[10px] text-neutral-300">↵</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop inline search */}
      <div ref={rootRef} className="relative hidden md:block">
        <div className="flex items-center gap-2 h-9 w-56 lg:w-64 rounded-full border border-neutral-200 bg-neutral-50 px-3 hover:border-purple/40 focus-within:border-purple/40 focus-within:bg-white transition-colors">
          <MagnifyingGlass className="h-3.5 w-3.5 text-neutral-400" />
          {input}
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setOpen(false);
              }}
              aria-label="Clear search"
              className="text-neutral-300 hover:text-neutral-500"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        {resultsPanel}
      </div>

      {/* Mobile search toggle */}
      <div className="md:hidden">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Search bookings"
          className="h-9 w-9 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:border-purple/40 hover:text-purple transition-colors bg-white"
        >
          <MagnifyingGlass className="h-4 w-4" />
        </button>

        {open && (
          <div className="fixed inset-x-3 top-14 z-50 rounded-xl bg-white border border-neutral-200 shadow-xl overflow-hidden">
            <div className="flex items-center gap-2 border-b border-neutral-100 px-3 h-11">
              <MagnifyingGlass className="h-4 w-4 text-neutral-400" />
              {input}
              <button
                onClick={() => setOpen(false)}
                aria-label="Close search"
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="relative">
              {trimmed === "" ? (
                <p className="px-4 py-3 text-[11px] text-neutral-400">
                  Type a booking reference (e.g. NE-4821), guest name, or tour.
                </p>
              ) : results.length === 0 ? (
                <p className="px-4 py-3 text-[11px] text-neutral-400">
                  No bookings match “{query}”.
                </p>
              ) : (
                <ul>
                  {results.map((b) => (
                    <li key={b.ref}>
                      <button
                        onClick={() => go(b.ref)}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left hover:bg-neutral-50 transition-colors"
                      >
                        <span className="text-base leading-none">{b.emoji}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[12px] font-bold text-neutral-900 truncate">
                            {b.ref} · {b.guestName}
                          </span>
                          <span className="block text-[10px] text-neutral-400 truncate">
                            {b.listingName} · {formatDayLabel(b.date)} {formatTime12h(b.time)}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
