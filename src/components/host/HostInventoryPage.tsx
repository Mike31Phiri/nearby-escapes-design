"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bed,
  Ticket,
  Bus,
  Boxes,
  CalendarX,
  CalendarCheck,
  PencilLine,
  Lock,
  CircleCheck,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HostPageHeader } from "@/components/layout/HostPageHeader";
import { mockHostProfile } from "@/lib/mock-profile-data";
import { getInventoryForListing, inventoryCounts } from "@/lib/mock-inventory";
import type { InventoryUnitStatus } from "@/lib/mock-inventory";
import { useAvailabilityStore } from "@/store/availabilityStore";
import { toast } from "sonner";

const typeIcons: Record<string, React.ElementType> = {
  stay: Bed,
  experience: Ticket,
  transport: Bus,
  gem: Bed,
};

const STATUS_META: Record<InventoryUnitStatus, { label: string; chip: string; dot: string }> = {
  available: {
    label: "Available",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  occupied: {
    label: "Occupied",
    chip: "bg-purple/10 text-purple border-purple/30",
    dot: "bg-purple",
  },
  blocked: {
    label: "Blocked",
    chip: "bg-zinc-100 text-zinc-600 border-zinc-200",
    dot: "bg-zinc-400",
  },
};

export function HostInventoryPage() {
  const listings = mockHostProfile.listings;
  const [selectedId, setSelectedId] = useState(listings[0]?.id || "");
  const inventory = useMemo(() => getInventoryForListing(selectedId), [selectedId]);

  // Local unit status (open/close toggling is simulated per session)
  const [units, setUnits] = useState(() => inventory?.units ?? []);

  // Unit highlighted when arriving via a deep link like
  // /host/inventory?listing=<id>&unit=<unitId>
  const [highlightUnitId, setHighlightUnitId] = useState<string | null>(null);

  // Deep link support: preselect the listing and flash the target unit.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const listingId = params.get("listing");
    const unitId = params.get("unit");
    if (listingId && getInventoryForListing(listingId)) {
      switchListing(listingId);
    }
    if (unitId) {
      setHighlightUnitId(unitId);
    }
  }, []);

  // Scroll to the highlighted unit once the target listing's units are rendered,
  // then clear the highlight after a few seconds.
  useEffect(() => {
    if (!highlightUnitId) return;
    const raf = requestAnimationFrame(() => {
      document
        .getElementById(`unit-${highlightUnitId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    const t = setTimeout(() => setHighlightUnitId(null), 4000);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [highlightUnitId, selectedId, units]);

  const { blockDateRange, unblockDateRange } = useAvailabilityStore();
  const [rangeFrom, setRangeFrom] = useState("");
  const [rangeTo, setRangeTo] = useState("");

  const counts = inventory ? inventoryCounts({ ...inventory, units }) : null;
  const selectedListing = listings.find((l) => l.id === selectedId);
  const TypeIcon = selectedListing ? (typeIcons[selectedListing.type] ?? Bed) : Bed;

  const switchListing = (id: string) => {
    setSelectedId(id);
    const inv = getInventoryForListing(id);
    setUnits(inv?.units ?? []);
    setRangeFrom("");
    setRangeTo("");
  };

  const toggleUnit = (unitId: string) => {
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id !== unitId) return u;
        if (u.status === "occupied") return u; // can't open/close a booked unit
        const next: InventoryUnitStatus = u.status === "available" ? "blocked" : "available";
        toast.success(
          next === "blocked" ? `"${u.label}" closed for bookings` : `"${u.label}" is now open`,
        );
        return { ...u, status: next, note: next === "blocked" ? "Closed manually" : undefined };
      }),
    );
  };

  const handleBlockRange = () => {
    if (!rangeFrom || !rangeTo) {
      toast.error("Select both dates first");
      return;
    }
    blockDateRange(selectedId, rangeFrom, rangeTo);
    toast.success(`Dates blocked for ${selectedListing?.name ?? "listing"}`);
    setRangeFrom("");
    setRangeTo("");
  };

  const handleOpenRange = () => {
    if (!rangeFrom || !rangeTo) {
      toast.error("Select both dates first");
      return;
    }
    unblockDateRange(selectedId, rangeFrom, rangeTo);
    toast.success(`Dates opened for ${selectedListing?.name ?? "listing"}`);
    setRangeFrom("");
    setRangeTo("");
  };

  const utilPct =
    counts && counts.total > 0 ? Math.round((counts.available / counts.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-background pb-16 font-sans">
      <HostPageHeader
        title="Rooms, Seats & Slots"
        description="See what's available today — open or close units, and block dates per listing."
        actions={
          selectedListing ? (
            <Link
              href={`/host/listings/${selectedListing.id}`}
              className="inline-flex items-center gap-2 bg-purple hover:bg-purple-hover text-white text-xs font-bold uppercase tracking-wider h-10 px-4 rounded-xl shadow-xs transition-all duration-200"
            >
              <PencilLine className="h-4 w-4" />
              Update Listing
            </Link>
          ) : null
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8 space-y-8">
        {/* Listing tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {listings.map((l) => {
            const active = l.id === selectedId;
            const Icon = typeIcons[l.type] ?? Bed;
            return (
              <button
                key={l.id}
                onClick={() => switchListing(l.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-all outline-none",
                  active
                    ? "bg-purple text-white border-purple shadow-xs"
                    : "bg-white text-neutral-600 border-neutral-200/80 hover:border-purple/40 hover:text-neutral-900",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {l.name}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Units grid */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary strip */}
            {inventory && counts && (
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="h-12 w-12 rounded-xl bg-purple/10 text-purple flex items-center justify-center shrink-0 border border-purple/15">
                      <Boxes className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-neutral-900">
                        {selectedListing?.name}
                      </h2>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {inventory.unitLabelPlural} · {inventory.total} total units
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-neutral-900">
                      {counts.available}
                      <span className="text-sm font-bold text-neutral-500">
                        {" "}
                        / {counts.total} open
                      </span>
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {counts.occupied} occupied · {counts.blocked} blocked
                    </p>
                  </div>
                </div>

                {/* Utilization bar */}
                <div className="flex h-2 rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className="bg-emerald-500 transition-all"
                    style={{ width: `${(counts.available / counts.total) * 100}%` }}
                  />
                  <div
                    className="bg-purple transition-all"
                    style={{ width: `${(counts.occupied / counts.total) * 100}%` }}
                  />
                  <div
                    className="bg-neutral-400 transition-all"
                    style={{ width: `${(counts.blocked / counts.total) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  {utilPct}% of {inventory.unitLabelPlural.toLowerCase()} open today
                </p>
              </div>
            )}

            {/* Units grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-neutral-900">
                  {inventory?.unitLabelPlural ?? "Units"}
                </h2>
                <div className="flex items-center gap-3 text-xs font-semibold text-neutral-500">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Available
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-purple" /> Occupied
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-neutral-400" /> Blocked
                  </span>
                </div>
              </div>

              {units.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-neutral-200/80 rounded-2xl shadow-2xs">
                  <div className="h-14 w-14 rounded-2xl bg-purple/10 text-purple flex items-center justify-center mb-4">
                    <Boxes className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900">No inventory units yet</h3>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs leading-relaxed">
                    Add rooms, seats or slots when updating this listing, then manage them here.
                  </p>
                  <Link
                    href={`/host/listings/${selectedId}`}
                    className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple text-white text-xs font-bold hover:bg-purple-hover transition-colors shadow-xs"
                  >
                    <PencilLine className="h-3.5 w-3.5" />
                    Update listing
                  </Link>
                </div>
              )}

              {units.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {units.map((unit) => {
                    const meta = STATUS_META[unit.status];
                    return (
                      <div
                        key={unit.id}
                        id={`unit-${unit.id}`}
                        className={cn(
                          "bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-2xs flex items-start justify-between gap-3 transition-all hover:shadow-md",
                          highlightUnitId === unit.id &&
                            "ring-2 ring-purple/60 border-purple shadow-md",
                        )}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-neutral-900 truncate">
                              {unit.label}
                            </h3>
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider shrink-0",
                                meta.chip,
                              )}
                            >
                              <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
                              {meta.label}
                            </span>
                          </div>
                          {unit.note && (
                            <p className="text-xs text-neutral-500 mt-1">{unit.note}</p>
                          )}
                          {unit.price && (
                            <p className="text-xs font-bold text-neutral-900 mt-1.5">
                              K{unit.price}
                              <span className="text-[10px] font-normal text-neutral-400">
                                {" "}
                                / {inventory?.unitLabel.toLowerCase()}
                              </span>
                            </p>
                          )}
                        </div>

                        {unit.status !== "occupied" ? (
                          <button
                            onClick={() => toggleUnit(unit.id)}
                            className={cn(
                              "flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-all outline-none shrink-0",
                              unit.status === "available"
                                ? "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
                            )}
                          >
                            {unit.status === "available" ? (
                              <>
                                <Lock className="h-3 w-3" /> Close
                              </>
                            ) : (
                              <>
                                <CircleCheck className="h-3 w-3" /> Open
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 shrink-0">
                            Booked
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Date blocking tools */}
          <div className="space-y-6">
            {/* Block / open dates */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="h-9 w-9 rounded-xl bg-purple/10 text-purple flex items-center justify-center">
                  <CalendarX className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-neutral-900">Block / Open Dates</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Hold dates for maintenance, or release them.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-neutral-50/80 rounded-xl px-3.5 py-2.5 border border-neutral-200/80">
                  <div className="text-[10px] text-purple font-bold uppercase tracking-wide mb-0.5">
                    From
                  </div>
                  <input
                    type="date"
                    value={rangeFrom}
                    onChange={(e) => setRangeFrom(e.target.value)}
                    className="text-xs font-semibold text-neutral-900 bg-transparent border-none p-0 focus:outline-none w-full"
                  />
                </div>
                <div className="bg-neutral-50/80 rounded-xl px-3.5 py-2.5 border border-neutral-200/80">
                  <div className="text-[10px] text-purple font-bold uppercase tracking-wide mb-0.5">
                    To
                  </div>
                  <input
                    type="date"
                    value={rangeTo}
                    onChange={(e) => setRangeTo(e.target.value)}
                    className="text-xs font-semibold text-neutral-900 bg-transparent border-none p-0 focus:outline-none w-full"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleBlockRange}
                  className="flex-1 py-2.5 rounded-xl bg-purple text-xs font-bold text-white hover:bg-purple-hover transition-colors shadow-xs"
                >
                  Block dates
                </button>
                <button
                  onClick={handleOpenRange}
                  className="flex-1 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
                >
                  Open dates
                </button>
              </div>

              <p className="text-[11px] text-neutral-400 mt-3 leading-relaxed">
                Booked dates cannot be blocked. Seasonal pricing rules are managed from the
                availability calendar.
              </p>
            </div>

            {/* Quick links card */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="h-9 w-9 rounded-xl bg-purple/10 text-purple flex items-center justify-center">
                  <PencilLine className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-neutral-900">Manage Listing</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Edit details, pricing, photos & calendar.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  href={`/host/listings/${selectedId}`}
                  className="flex items-center justify-between rounded-xl border border-neutral-200/80 px-4 py-3 text-xs font-bold text-neutral-900 hover:border-purple/40 hover:bg-neutral-50 transition-all group"
                >
                  <span className="flex items-center gap-2.5">
                    <TypeIcon className="h-4 w-4 text-purple" />
                    View & update listing
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/host/listings"
                  className="flex items-center justify-between rounded-xl border border-neutral-200/80 px-4 py-3 text-xs font-bold text-neutral-900 hover:border-purple/40 hover:bg-neutral-50 transition-all group"
                >
                  <span className="flex items-center gap-2.5">
                    <Boxes className="h-4 w-4 text-purple" />
                    All my listings
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/host/availability"
                  className="flex items-center justify-between rounded-xl border border-neutral-200/80 px-4 py-3 text-xs font-bold text-neutral-900 hover:border-purple/40 hover:bg-neutral-50 transition-all group"
                >
                  <span className="flex items-center gap-2.5">
                    <CalendarCheck className="h-4 w-4 text-purple" />
                    Full availability calendar
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
