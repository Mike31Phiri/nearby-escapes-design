"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./availability-calendar.css";
import { cn } from "@/lib/utils";
import { mockHostProfile } from "@/lib/mock-profile-data";
import { HostPageHeader } from "@/components/layout/HostPageHeader";
import { useAvailabilityStore } from "@/store/availabilityStore";
import { PricingRulesModal } from "@/components/host/availability/PricingRulesModal";
import { toast } from "sonner";
import { Lock, Boxes, CircleCheck, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getInventoryForListing, inventoryCounts } from "@/lib/mock-inventory";

function toKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export function HostAvailabilityPage() {
  // Responsive detection
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Calendar state
  const [firstMonth, setFirstMonth] = useState(() => {
    const n = new Date();
    return { month: n.getMonth(), year: n.getFullYear() };
  });

  useEffect(() => {
    const n = new Date();
    setFirstMonth({ month: n.getMonth(), year: n.getFullYear() });
  }, [isDesktop]);

  const [rangeFrom, setRangeFrom] = useState("");
  const [rangeTo, setRangeTo] = useState("");

  const hostListings = mockHostProfile.listings;
  const [selectedId, setSelectedId] = useState(hostListings[0]?.id || "");
  const [pricingModalOpen, setPricingModalOpen] = useState(false);

  // Store
  const availability = useAvailabilityStore((s) => s.availability);
  const toggleDateBlock = useAvailabilityStore((s) => s.toggleDateBlock);
  const blockDateRange = useAvailabilityStore((s) => s.blockDateRange);
  const getSeasonalPricingForListing = useAvailabilityStore((s) => s.getSeasonalPricingForListing);
  const getPricingRulesForListing = useAvailabilityStore((s) => s.getPricingRulesForListing);
  const updatePricingRulesForListing = useAvailabilityStore((s) => s.updatePricingRulesForListing);
  const pricingRulesMap = useAvailabilityStore((s) => s.pricingRules);

  const inventory = useMemo(() => getInventoryForListing(selectedId), [selectedId]);
  const inventoryStats = useMemo(() => (inventory ? inventoryCounts(inventory) : null), [inventory]);

  const currentListing = useMemo(
    () => hostListings.find((l) => l.id === selectedId) || hostListings[0],
    [hostListings, selectedId],
  );

  const currentRules = useMemo(
    () => getPricingRulesForListing(selectedId, currentListing?.price || 850),
    [selectedId, currentListing?.price, pricingRulesMap, getPricingRulesForListing],
  );

  const pricing = useMemo(
    () => getSeasonalPricingForListing(selectedId),
    [selectedId, getSeasonalPricingForListing],
  );

  const todayStr = useMemo(() => toKey(new Date()), []);

  const statusMap = useMemo(() => {
    const m: Record<string, "available" | "blocked" | "booked"> = {};
    for (const e of availability[selectedId] ?? []) m[e.date] = e.status;
    return m;
  }, [availability, selectedId]);

  // Helpers: is a date in the currently displayed months?
  const isDateInDisplayedRange = useCallback(
    (date: Date) => {
      if (!isDesktop) {
        return date.getMonth() === firstMonth.month && date.getFullYear() === firstMonth.year;
      }
      for (let offset = 0; offset < 2; offset++) {
        const m = (firstMonth.month + offset) % 12;
        const y = firstMonth.month + offset >= 12 ? firstMonth.year + 1 : firstMonth.year;
        if (date.getMonth() === m && date.getFullYear() === y) return true;
      }
      return false;
    },
    [isDesktop, firstMonth],
  );

  // Day class (status-based styling)
  const dayClass = useCallback(
    (date: Date) => {
      const key = toKey(date);
      const status = statusMap[key];
      const isToday = key === todayStr;
      let cls = "";
      if (key < todayStr) cls = "rdp-past";
      else if (status === "booked") cls = "rdp-booked";
      else if (status === "blocked") cls = "rdp-blocked";
      else cls = "rdp-open";
      if (isToday) cls = cn(cls, "rdp-today");
      return cls;
    },
    [todayStr, statusMap],
  );

  // Day render (number + status dot)
  const renderDay = useCallback(
    (day: number, date: Date) => {
      const status = statusMap[toKey(date)];
      return (
        <span className="rdp-cell">
          <span className={cn(status === "blocked" && "rdp-num-blocked")}>{day}</span>
          {status === "booked" && <span className="rdp-dot rdp-dot-booked" />}
          {status === "blocked" && <span className="rdp-dot rdp-dot-blocked" />}
        </span>
      );
    },
    [statusMap],
  );

  // Selectable filter
  const isDaySelectable = useCallback(
    (date: Date) => {
      const key = toKey(date);
      if (key < todayStr) return false;
      if (statusMap[key] === "booked") return false;
      if (!isDateInDisplayedRange(date)) return false;
      return true;
    },
    [todayStr, statusMap, isDateInDisplayedRange],
  );

  // Month navigation tracking
  const handleMonthChange = useCallback((d: Date) => {
    setFirstMonth({ month: d.getMonth(), year: d.getFullYear() });
  }, []);

  // Day click → toggle
  const handleDayChange = useCallback(
    (date: Date | null) => {
      if (!date) return;
      const key = toKey(date);
      if (!isDaySelectable(date)) return;
      toggleDateBlock(selectedId, key);
      toast.success(statusMap[key] === "blocked" ? "Date unblocked" : "Date blocked");
    },
    [isDaySelectable, selectedId, statusMap, toggleDateBlock],
  );

  // Block range
  const handleBlockRange = useCallback(() => {
    if (!rangeFrom || !rangeTo) {
      toast.error("Select both start and end dates");
      return;
    }
    blockDateRange(selectedId, rangeFrom, rangeTo);
    toast.success("Date range blocked");
    setRangeFrom("");
    setRangeTo("");
  }, [rangeFrom, rangeTo, selectedId, blockDateRange]);

  const openToDate = useMemo(() => new Date(firstMonth.year, firstMonth.month, 1), [firstMonth]);

  return (
    <div className="min-h-screen bg-background pb-16 font-sans">
      <HostPageHeader
        title="Availability Calendar"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8 space-y-8">
        {/* Listing selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="w-full sm:max-w-md">
            <label className="block text-xs font-semibold uppercase tracking-wide text-black-muted mb-1.5">
              Select Listing
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full h-11 rounded-xl bg-white border border-neutral-200/80 px-3.5 text-sm font-semibold text-neutral-900 focus:outline-none focus:border-purple shadow-2xs transition-colors"
            >
              {hostListings.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} — K{l.price}/night
                </option>
              ))}
            </select>
          </div>

          <Link
            href={`/host/inventory?listing=${selectedId}`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-purple hover:text-purple-hover transition-colors self-start sm:self-end pb-1"
          >
            <span>Manage detailed units</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Inventory Breakdown Section */}
        <section className="space-y-3">

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
            {/* Total Units */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl border border-purple/20 bg-purple/10 text-purple flex items-center justify-center shrink-0">
                <Boxes className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold tracking-tight leading-none text-black">
                  {inventoryStats ? inventoryStats.total : 0}
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-black-muted mt-1 truncate">
                  Total {inventory?.unitLabelPlural || "Units"}
                </p>
              </div>
            </div>

            {/* Available Units */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <CircleCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold tracking-tight leading-none text-emerald-700">
                  {inventoryStats ? inventoryStats.available : 0}
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-black-muted mt-1 truncate">
                  Available
                </p>
              </div>
            </div>

            {/* Booked / Occupied Units */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl border border-purple/25 bg-purple/10 text-purple flex items-center justify-center shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold tracking-tight leading-none text-purple">
                  {inventoryStats ? inventoryStats.occupied : 0}
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-black-muted mt-1 truncate">
                  Occupied
                </p>
              </div>
            </div>

            {/* Blocked Units */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl border border-neutral-200 bg-neutral-100 text-neutral-600 flex items-center justify-center shrink-0">
                <Lock className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold tracking-tight leading-none text-black">
                  {inventoryStats ? inventoryStats.blocked : 0}
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-black-muted mt-1 truncate">
                  Blocked
                </p>
              </div>
            </div>
          </div>

          {/* Unit Chips Breakdown */}
          {inventory && inventory.units.length > 0 && (
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-3.5 sm:p-4 shadow-2xs">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold text-black uppercase tracking-wider">
                  {inventory.unitLabel} Inventory Status
                </span>
                <span className="text-xs text-black-muted">
                  {inventoryStats?.available ?? 0} of {inventory.units.length} ready to book
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {inventory.units.map((unit) => {
                  const isAvail = unit.status === "available";
                  const isOcc = unit.status === "occupied";
                  return (
                    <div
                      key={unit.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border border-neutral-200/80 bg-neutral-50/60"
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isAvail
                            ? "bg-emerald-500"
                            : isOcc
                              ? "bg-purple"
                              : "bg-neutral-400"
                        }`}
                      />
                      <span className="text-black font-medium">{unit.label}</span>
                      <span
                        className={`text-[11px] font-semibold tracking-wide uppercase px-1.5 py-0.2 rounded-md ${
                          isAvail
                            ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                            : isOcc
                              ? "text-purple bg-purple/10 border border-purple/20"
                              : "text-neutral-600 bg-neutral-100 border border-neutral-200"
                        }`}
                      >
                        {unit.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Box */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden p-5 sm:p-6 shadow-2xs">
              <DatePicker
                key={`dp-${isDesktop ? "desk" : "mob"}`}
                inline
                calendarClassName="availability-calendar"
                calendarStartDay={1}
                fixedHeight
                monthsShown={isDesktop ? 2 : 1}
                openToDate={openToDate}
                onChange={handleDayChange}
                filterDate={isDaySelectable}
                dayClassName={dayClass}
                renderDayContents={renderDay}
                onMonthChange={handleMonthChange}
                previousMonthButtonLabel="Previous month"
                nextMonthButtonLabel="Next month"
              />

              {/* Legend */}
              <div
                className={cn(
                  "flex flex-wrap items-center gap-4 mt-6 pt-5 border-t border-neutral-100",
                  isDesktop && "justify-center",
                )}
              >
                <div className="flex items-center gap-2 text-xs text-neutral-600 font-medium">
                  <span className="w-3.5 h-3.5 rounded-md bg-emerald-50 border border-emerald-300"></span>
                  Available
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-600 font-medium">
                  <span className="w-3.5 h-3.5 rounded-md bg-amber-100 border border-amber-300"></span>
                  Booked
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-600 font-medium">
                  <span className="w-3.5 h-3.5 rounded-md bg-rose-50 border border-rose-300"></span>
                  Blocked
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-600 font-medium">
                  <span className="w-3.5 h-3.5 rounded-md bg-neutral-100 border border-neutral-200 opacity-60"></span>
                  Past
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-600 font-medium">
                  <span className="w-3.5 h-3.5 rounded-md bg-white border-2 border-purple"></span>
                  Today
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar: Block dates & pricing */}
          <div className="space-y-6">
            {/* Block dates card */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Block Dates</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Temporarily prevent guests from booking specific dates.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-50/80 rounded-xl p-3 border border-neutral-200/80">
                  <span className="text-[11px] text-black-muted font-semibold uppercase tracking-wide block mb-1">
                    From
                  </span>
                  <input
                    type="date"
                    value={rangeFrom}
                    onChange={(e) => setRangeFrom(e.target.value)}
                    className="text-xs font-semibold text-neutral-900 bg-transparent border-none p-0 focus:outline-none w-full"
                  />
                </div>
                <div className="bg-neutral-50/80 rounded-xl p-3 border border-neutral-200/80">
                  <span className="text-[11px] text-black-muted font-semibold uppercase tracking-wide block mb-1">
                    To
                  </span>
                  <input
                    type="date"
                    value={rangeTo}
                    onChange={(e) => setRangeTo(e.target.value)}
                    className="text-xs font-semibold text-neutral-900 bg-transparent border-none p-0 focus:outline-none w-full"
                  />
                </div>
              </div>

              <button
                onClick={handleBlockRange}
                className="w-full h-11 rounded-xl bg-purple hover:bg-purple-hover text-white text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <Lock className="h-3.5 w-3.5" />
                Block these dates
              </button>
            </div>

            {/* Pricing rules overview */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden shadow-2xs">
              <div className="p-5 pb-3">
                <h3 className="text-base font-semibold text-neutral-900">Pricing Overview</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Rates configured for this listing</p>
              </div>

              <div className="divide-y divide-neutral-100 px-5">
                <div className="flex justify-between items-center py-3">
                  <span className="text-xs text-neutral-500">Base nightly rate</span>
                  <span className="text-xs font-semibold text-neutral-900">
                    K{currentRules.basePrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-xs text-neutral-500">Weekend rate (Fri–Sat)</span>
                  <span className="text-xs font-semibold text-purple">
                    K{currentRules.weekendPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-xs text-neutral-500">Min. stay (weekends)</span>
                  <span className="text-xs font-semibold text-neutral-900">
                    {currentRules.minStayWeekends} {currentRules.minStayWeekends === 1 ? "night" : "nights"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-xs text-neutral-500">Min. stay (weekdays)</span>
                  <span className="text-xs font-semibold text-neutral-900">
                    {currentRules.minStayWeekdays} {currentRules.minStayWeekdays === 1 ? "night" : "nights"}
                  </span>
                </div>
                {currentRules.weeklyDiscount > 0 && (
                  <div className="flex justify-between items-center py-3">
                    <span className="text-xs text-neutral-500">Weekly discount (7+ nights)</span>
                    <span className="text-xs font-semibold text-emerald-700">
                      {currentRules.weeklyDiscount}% off
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 bg-neutral-50/50 border-t border-neutral-100 text-center">
                <button
                  type="button"
                  onClick={() => setPricingModalOpen(true)}
                  className="text-xs font-semibold text-purple hover:text-purple-hover transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  Edit pricing rules →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Rules Editor Modal */}
      {currentListing && (
        <PricingRulesModal
          open={pricingModalOpen}
          onOpenChange={setPricingModalOpen}
          listingId={selectedId}
          listingName={currentListing.name}
          rules={currentRules}
          onSave={(newRules) => updatePricingRulesForListing(selectedId, newRules)}
        />
      )}
    </div>
  );
}
