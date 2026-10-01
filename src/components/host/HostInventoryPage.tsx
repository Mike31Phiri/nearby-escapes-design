"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bed,
  Ticket,
  Bus,
  CarFront,
  Boxes,
  CalendarX,
  CalendarCheck,
  PencilLine,
  Lock,
  CircleCheck,
  ArrowRight,
  Plus,
  Clock,
  Car,
  AlertCircle,
  X,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HostPageHeader } from "@/components/layout/HostPageHeader";
import { mockHostProfile, HostListing } from "@/lib/mock-profile-data";
import { inventoryCounts } from "@/lib/mock-inventory";
import type { InventoryUnitStatus } from "@/lib/mock-inventory";
import { useInventoryStore } from "@/store/inventoryStore";
import { useAvailabilityStore } from "@/store/availabilityStore";
import { useListingDraftStore } from "@/store/listingDraftStore";
import { toast } from "sonner";

const typeIcons: Record<string, React.ElementType> = {
  stay: Bed,
  experience: Ticket,
  transport: CarFront,
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
    label: "Inactive / Offline",
    chip: "bg-zinc-100 text-zinc-600 border-zinc-200",
    dot: "bg-zinc-400",
  },
};

export function HostInventoryPage() {
  const draftMap = useListingDraftStore((s) => s.drafts);

  const listings: HostListing[] = useMemo(() => {
    const customListings: HostListing[] = Object.values(draftMap).map((d) => ({
      id: d.id,
      name:
        d.title ||
        (d.form?.title as string) ||
        (d.form?.name as string) ||
        `${d.type.charAt(0).toUpperCase() + d.type.slice(1)} Listing`,
      type: d.type as "stay" | "experience" | "transport" | "gem",
      location: (d.form?.city as string) || (d.form?.province as string) || "Zambia",
      status: (d.status === "live" ? "active" : d.status) as "active" | "draft" | "pending",
      image: ((d.form?.images as string[])?.[0]) || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      price: (d.form?.basePrice as number) || 1200,
      bookings: 0,
      rating: 5.0,
      revenue: 0,
    }));

    const ids = new Set(mockHostProfile.listings.map((l) => l.id));
    const uniqueCustom = customListings.filter((l) => !ids.has(l.id));
    return [...mockHostProfile.listings, ...uniqueCustom];
  }, [draftMap]);

  const [selectedId, setSelectedId] = useState(listings[0]?.id || "");

  // Use persistent store for reactive inventory changes
  const inventories = useInventoryStore((s) => s.inventories);
  const getInventory = useInventoryStore((s) => s.getInventory);
  const toggleUnitAction = useInventoryStore((s) => s.toggleUnit);
  const addUnitAction = useInventoryStore((s) => s.addUnit);
  const removeUnitAction = useInventoryStore((s) => s.removeUnit);
  const adjustInventoryCount = useInventoryStore((s) => s.adjustInventoryCount);

  const inventory = useMemo(() => getInventory(selectedId), [selectedId, inventories, getInventory]);
  const units = inventory?.units ?? [];

  // Filter state: "all" | "active" | "inactive" | InventoryUnitStatus
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | InventoryUnitStatus>("all");

  // Modal state for adding a new inventory unit
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUnitLabel, setNewUnitLabel] = useState("");
  const [newUnitPlate, setNewUnitPlate] = useState("");
  const [newUnitTime, setNewUnitTime] = useState("");
  const [newUnitCapacity, setNewUnitCapacity] = useState(4);
  const [newUnitNote, setNewUnitNote] = useState("");

  // Unit highlighted when arriving via a deep link
  const [highlightUnitId, setHighlightUnitId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const listingId = params.get("listing");
    const unitId = params.get("unit");
    if (listingId && listings.some((l) => l.id === listingId)) {
      setSelectedId(listingId);
    }
    if (unitId) {
      setHighlightUnitId(unitId);
    }
  }, [listings]);

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

  const counts = inventory ? inventoryCounts(inventory) : null;
  const selectedListing = listings.find((l) => l.id === selectedId);
  const TypeIcon = selectedListing ? (typeIcons[selectedListing.type] ?? Bed) : Bed;

  const activeCount = useMemo(
    () => units.filter((u) => u.status === "available" || u.status === "occupied").length,
    [units],
  );
  const inactiveCount = useMemo(
    () => units.filter((u) => u.status === "blocked").length,
    [units],
  );

  const switchListing = (id: string) => {
    setSelectedId(id);
    setStatusFilter("all");
    setRangeFrom("");
    setRangeTo("");
  };

  const handleDecreaseActiveCount = () => {
    if (activeCount <= 0) return;
    const res = adjustInventoryCount(selectedId, { operation: "decrease", amount: 1 });
    toast.success(`Active inventory reduced to ${res.activeUnitsCount}. Deactivated 1 unit.`);
  };

  const handleIncreaseActiveCount = () => {
    const res = adjustInventoryCount(selectedId, { operation: "increase", amount: 1 });
    toast.success(`Active inventory increased to ${res.activeUnitsCount}. Unit activated.`);
  };

  const toggleUnit = (unitId: string) => {
    const unit = units.find((u) => u.id === unitId);
    if (!unit) return;
    if (unit.status === "occupied") {
      toast.info(`"${unit.label}" is currently occupied / on hire`);
      return;
    }

    const next = toggleUnitAction(selectedId, unitId);
    if (next) {
      toast.success(
        next === "blocked" ? `"${unit.label}" marked as inactive/closed` : `"${unit.label}" is now active and open`,
      );
    }
  };

  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitLabel.trim()) {
      toast.error("Please provide a name or label");
      return;
    }

    const unitType = inventory?.unitType || "room";
    addUnitAction(selectedId, {
      label: newUnitLabel.trim(),
      status: "available",
      price: selectedListing?.price,
      plateNumber: unitType === "vehicle" ? newUnitPlate.trim() || undefined : undefined,
      timeSlot: unitType === "slot" ? newUnitTime.trim() || undefined : undefined,
      capacity: unitType === "slot" ? Number(newUnitCapacity) || 4 : undefined,
      note: newUnitNote.trim() || (unitType === "vehicle" ? "Ready for departure" : "Open for booking"),
    });

    toast.success(`Added "${newUnitLabel}" to listing inventory`);
    setNewUnitLabel("");
    setNewUnitPlate("");
    setNewUnitTime("");
    setNewUnitNote("");
    setShowAddModal(false);
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

  const filteredUnits = useMemo(() => {
    if (statusFilter === "all") return units;
    if (statusFilter === "active") return units.filter((u) => u.status === "available" || u.status === "occupied");
    if (statusFilter === "inactive") return units.filter((u) => u.status === "blocked");
    return units.filter((u) => u.status === statusFilter);
  }, [units, statusFilter]);

  const utilPct =
    counts && counts.total > 0 ? Math.round((counts.available / counts.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-background pb-16 font-sans">
      <HostPageHeader
        title="Units, Vehicles & Time Slots"
        description="Manage the inventory for each listing. Listings remain bookable as long as at least 1 unit is available."
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

        {/* Informational Banner */}
        <div className="bg-purple/5 border border-purple/15 rounded-2xl p-4 flex items-start gap-3.5">
          <Layers className="h-5 w-5 text-purple shrink-0 mt-0.5" />
          <div className="text-xs text-neutral-700 leading-relaxed">
            <span className="font-bold text-neutral-900">Single Listing Fleet & Units: </span>
            This single listing covers multiple identical items (such as 2–3 identical vehicles in your fleet, rooms of a lodge, or daily tour time slots). It stays live and bookable on search and explore for guests as long as available inventory is not zero.
          </div>
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
                      {inventory.unitType === "vehicle" ? (
                        <CarFront className="h-6 w-6" />
                      ) : inventory.unitType === "slot" ? (
                        <Ticket className="h-6 w-6" />
                      ) : (
                        <Bed className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-neutral-900">
                          {selectedListing?.name}
                        </h2>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple/10 text-purple border border-purple/20">
                          {inventory.unitType === "vehicle"
                            ? "Vehicle Fleet"
                            : inventory.unitType === "slot"
                              ? "Time Slots"
                              : "Rooms / Lodging"}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {inventory.unitLabelPlural} · {inventory.total} total units under this single listing
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-neutral-900">
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
                <div className="flex h-2.5 rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className="bg-emerald-500 transition-all"
                    style={{ width: `${(counts.available / (counts.total || 1)) * 100}%` }}
                    title={`Available: ${counts.available}`}
                  />
                  <div
                    className="bg-purple transition-all"
                    style={{ width: `${(counts.occupied / (counts.total || 1)) * 100}%` }}
                    title={`Occupied: ${counts.occupied}`}
                  />
                  <div
                    className="bg-neutral-400 transition-all"
                    style={{ width: `${(counts.blocked / (counts.total || 1)) * 100}%` }}
                    title={`Blocked: ${counts.blocked}`}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-500 mt-2">
                  <span>
                    {utilPct}% of {inventory.unitLabelPlural.toLowerCase()} currently available
                  </span>
                  <span className={cn("font-bold text-xs", counts.available > 0 ? "text-emerald-600" : "text-amber-600")}>
                    {counts.available > 0 ? "● Listing Live & Bookable" : "○ Sold Out (Unavailable)"}
                  </span>
                </div>

                {/* Active Inventory Count Controller (Deactivate / Activate without deleting records) */}
                <div className="mt-5 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-50/80 p-4 rounded-xl border border-neutral-200/70">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                        Active Inventory Count
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {activeCount} Active Units
                      </span>
                      {inactiveCount > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
                          {inactiveCount} Deactivated / Offline
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-1 max-w-md leading-relaxed">
                      To deactivate or reactivate units (e.g., taking 1 unit offline), adjust the count. Excess units are marked inactive without deleting records.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <button
                      type="button"
                      disabled={activeCount <= 0}
                      onClick={handleDecreaseActiveCount}
                      className="h-9 px-3 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold text-neutral-700 flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                      title="Deactivate 1 unit (reduces active inventoryCount)"
                    >
                      <span>- Deactivate 1</span>
                    </button>

                    <div className="px-3 py-1 bg-white border border-neutral-200 rounded-lg text-center min-w-[54px]">
                      <span className="text-base font-bold text-neutral-900">{activeCount}</span>
                      <span className="text-[9px] text-neutral-400 font-bold block uppercase -mt-1">active</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleIncreaseActiveCount}
                      className="h-9 px-3 rounded-lg bg-purple hover:bg-purple-hover text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                      title="Activate 1 unit (increases active inventoryCount)"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Activate 1</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Filter pills & Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer",
                    statusFilter === "all"
                      ? "bg-neutral-900 text-white border-neutral-900"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300",
                  )}
                >
                  All ({units.length})
                </button>
                <button
                  onClick={() => setStatusFilter("active")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer",
                    statusFilter === "active"
                      ? "bg-purple text-white border-purple"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-purple/30",
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-purple" />
                  Active ({activeCount})
                </button>
                <button
                  onClick={() => setStatusFilter("inactive")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer",
                    statusFilter === "inactive"
                      ? "bg-neutral-700 text-white border-neutral-700"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300",
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                  Inactive ({inactiveCount})
                </button>
                <button
                  onClick={() => setStatusFilter("available")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer",
                    statusFilter === "available"
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-emerald-200",
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Available ({counts?.available ?? 0})
                </button>
                <button
                  onClick={() => setStatusFilter("occupied")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer",
                    statusFilter === "occupied"
                      ? "bg-purple text-white border-purple"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-purple/30",
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-purple" />
                  Occupied ({counts?.occupied ?? 0})
                </button>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple text-white text-xs font-bold hover:bg-purple-hover transition-colors shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Add {inventory?.unitLabel || "Unit"}
              </button>
            </div>

            {/* Units grid */}
            <div className="space-y-4">
              {filteredUnits.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-white border border-neutral-200/80 rounded-2xl shadow-2xs">
                  <div className="h-12 w-12 rounded-2xl bg-purple/10 text-purple flex items-center justify-center mb-3">
                    <Boxes className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    No {statusFilter === "all" ? "" : statusFilter} {inventory?.unitLabelPlural.toLowerCase() || "units"} found
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs leading-relaxed">
                    Click &ldquo;Add {inventory?.unitLabel || "Unit"}&rdquo; above to incorporate more inventory into this listing.
                  </p>
                </div>
              )}

              {filteredUnits.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {filteredUnits.map((unit) => {
                    const meta = STATUS_META[unit.status];
                    return (
                      <div
                        key={unit.id}
                        id={`unit-${unit.id}`}
                        className={cn(
                          "bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-2xs flex flex-col justify-between gap-3 transition-all hover:shadow-md",
                          highlightUnitId === unit.id &&
                            "ring-2 ring-purple/60 border-purple shadow-md",
                        )}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="text-sm font-bold text-neutral-900 truncate">
                                {unit.label}
                              </h3>
                              {unit.plateNumber && (
                                <div className="inline-flex items-center gap-1 mt-1 font-mono text-[11px] font-bold text-neutral-700 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-md">
                                  <Car className="h-3 w-3 text-purple" />
                                  Reg: {unit.plateNumber}
                                </div>
                              )}
                              {unit.timeSlot && (
                                <div className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-purple bg-purple/10 border border-purple/15 px-2 py-0.5 rounded-md">
                                  <Clock className="h-3 w-3" />
                                  {unit.timeSlot}
                                  {unit.capacity !== undefined && (
                                    <span className="text-neutral-500 font-normal"> · {unit.capacity} spots</span>
                                  )}
                                </div>
                              )}
                            </div>

                            <span
                              className={cn(
                                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide shrink-0",
                                meta.chip,
                              )}
                            >
                              <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
                              {meta.label}
                            </span>
                          </div>

                          {unit.note && (
                            <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                              {unit.note}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2 mt-auto">
                          {unit.price ? (
                            <p className="text-xs font-bold text-neutral-900">
                              K{unit.price.toLocaleString()}
                              <span className="text-[11px] text-neutral-400 font-normal">
                                {" "}
                                / {inventory?.unitLabel.toLowerCase()}
                              </span>
                            </p>
                          ) : (
                            <span className="text-xs text-neutral-400">Included in listing</span>
                          )}

                          <div className="flex items-center gap-1.5">
                            {unit.status !== "occupied" ? (
                              <button
                                onClick={() => toggleUnit(unit.id)}
                                className={cn(
                                  "flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide border transition-all outline-none shrink-0",
                                  unit.status === "available"
                                    ? "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100"
                                    : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
                                )}
                                title={unit.status === "available" ? "Deactivate unit (take offline)" : "Activate unit (bring online)"}
                              >
                                {unit.status === "available" ? (
                                  <>
                                    <Lock className="h-3 w-3" /> Deactivate
                                  </>
                                ) : (
                                  <>
                                    <CircleCheck className="h-3 w-3" /> Activate
                                  </>
                                )}
                              </button>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-400 shrink-0 px-2 py-1">
                                Booked / On Hire
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Date blocking & Quick Navigation */}
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
                    Hold dates across all units, or reopen them.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-neutral-50/80 rounded-xl px-3.5 py-2.5 border border-neutral-200/80">
                  <div className="text-[11px] text-purple font-semibold uppercase tracking-wide mb-0.5">
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
                  <div className="text-[11px] text-purple font-semibold uppercase tracking-wide mb-0.5">
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
                Block dates when your fleet or lodge is undergoing scheduled maintenance or private buyout.
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

      {/* Add Unit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-neutral-900">
              Add {inventory?.unitLabel || "Unit"} to Listing
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Incorporate an additional {inventory?.unitLabel.toLowerCase() || "unit"} under this single listing.
            </p>

            <form onSubmit={handleAddUnit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  {inventory?.unitType === "vehicle"
                    ? "Vehicle Name / Model"
                    : inventory?.unitType === "slot"
                      ? "Time Slot Name"
                      : "Room / Chalet Name"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    inventory?.unitType === "vehicle"
                      ? "e.g. Vehicle 4 — Safari Land Cruiser Prado"
                      : inventory?.unitType === "slot"
                        ? "e.g. Sunset Scenic Flight"
                        : "e.g. Chalet 7 — River Suite"
                  }
                  value={newUnitLabel}
                  onChange={(e) => setNewUnitLabel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple"
                />
              </div>

              {inventory?.unitType === "vehicle" && (
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Registration Plate Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BCZ 8912"
                    value={newUnitPlate}
                    onChange={(e) => setNewUnitPlate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple font-mono"
                  />
                </div>
              )}

              {inventory?.unitType === "slot" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Departure Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 17:30 PM"
                      value={newUnitTime}
                      onChange={(e) => setNewUnitTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Max Capacity / Spots
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={newUnitCapacity}
                      onChange={(e) => setNewUnitCapacity(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Initial Operational Note
                </label>
                <input
                  type="text"
                  placeholder={
                    inventory?.unitType === "vehicle"
                      ? "e.g. Cleaned & inspected · Ready for hire"
                      : "e.g. Open for reservations"
                  }
                  value={newUnitNote}
                  onChange={(e) => setNewUnitNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple text-xs font-bold text-white hover:bg-purple-hover transition-colors shadow-xs"
                >
                  Save & Add Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
