"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./availability-calendar.css";
import { cn } from "@/lib/utils";
import { mockHostProfile } from "@/lib/mock-profile-data";
import { HostPageHeader } from "@/components/layout/HostPageHeader";
import { useAvailabilityStore } from "@/store/availabilityStore";
import { toast } from "sonner";

function toKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export function HostAvailabilityPage() {
  /* ── Responsive detection ─────────────────────────────────────────────── */
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* ── Calendar state ───────────────────────────────────────────────────── */
  // firstMonth = leftmost month shown.  Desktop: [first, first+1, first+2].  Mobile: [first].
  const [firstMonth, setFirstMonth] = useState(() => {
    const n = new Date();
    return { month: n.getMonth(), year: n.getFullYear() };
  });

  // When layout changes, DatePicker remounts to current month — keep firstMonth in sync.
  useEffect(() => {
    const n = new Date();
    setFirstMonth({ month: n.getMonth(), year: n.getFullYear() });
  }, [isDesktop]);

  const [rangeFrom, setRangeFrom] = useState("");
  const [rangeTo, setRangeTo] = useState("");

  const hostListings = mockHostProfile.listings;
  const [selectedId, setSelectedId] = useState(hostListings[0]?.id || "");

  /* ── Store ────────────────────────────────────────────────────────────── */
  const availability = useAvailabilityStore((s) => s.availability);
  const toggleDateBlock = useAvailabilityStore((s) => s.toggleDateBlock);
  const blockDateRange = useAvailabilityStore((s) => s.blockDateRange);
  const getSeasonalPricingForListing = useAvailabilityStore(
    (s) => s.getSeasonalPricingForListing,
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

  /* ── Helpers: is a date in the currently displayed months? ─────────────── */
  const isDateInDisplayedRange = useCallback(
    (date: Date) => {
      if (!isDesktop) {
        // Single month: date must match firstMonth exactly
        return date.getMonth() === firstMonth.month && date.getFullYear() === firstMonth.year;
      }
      // Desktop 2-month: check first, first+1
      for (let offset = 0; offset < 2; offset++) {
        const m = (firstMonth.month + offset) % 12;
        const y = firstMonth.month + offset >= 12 ? firstMonth.year + 1 : firstMonth.year;
        if (date.getMonth() === m && date.getFullYear() === y) return true;
      }
      return false;
    },
    [isDesktop, firstMonth],
  );

  /* ── Day class (status-based styling) ─────────────────────────────────── */
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

  /* ── Day render (number + status dot) ─────────────────────────────────── */
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

  /* ── Selectable filter ────────────────────────────────────────────────── */
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

  /* ── Month navigation tracking ────────────────────────────────────────── */
  const handleMonthChange = useCallback((d: Date) => {
    setFirstMonth({ month: d.getMonth(), year: d.getFullYear() });
  }, []);

  /* ── Day click → toggle ───────────────────────────────────────────────── */
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

  /* ── Block range ──────────────────────────────────────────────────────── */
  const handleBlockRange = useCallback(() => {
    if (!rangeFrom || !rangeTo) {
      toast.error("Select both dates");
      return;
    }
    blockDateRange(selectedId, rangeFrom, rangeTo);
    toast.success("Date range blocked");
    setRangeFrom("");
    setRangeTo("");
  }, [rangeFrom, rangeTo, selectedId, blockDateRange]);

  /* ── openToDate: first month of the displayed range ───────────────────── */
  const openToDate = useMemo(
    () => new Date(firstMonth.year, firstMonth.month, 1),
    [firstMonth],
  );

  return (
    <div className="min-h-screen bg-[#faf9f5] pb-12">
      <HostPageHeader
        title="Availability Calendar"
        description="Manage the availability of your properties across all dates."
      />
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-6 mt-4">
        <div className="px-4 pb-1 md:px-0">
          {/* Listing selector */}
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full h-9 rounded-lg bg-[#FAF7F2] border border-[#E0DBD0] px-3 text-[12px] font-medium text-[#1C1030] focus:outline-none focus:border-[#3D2463]/30 mb-3"
          >
            {hostListings.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} — K{l.price}/night
              </option>
            ))}
          </select>

          {/* Calendar */}
          <div className="bg-white border border-[#E0DBD0] rounded-xl overflow-hidden p-3 mb-4">
            <DatePicker
              key={`dp-${isDesktop ? "desk" : "mob"}-${firstMonth.year}-${firstMonth.month}`}
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
                "flex gap-2.5 mt-3 pt-2 border-t border-[#E0DBD0]",
                isDesktop && "justify-center",
              )}
            >
              <div className="flex items-center gap-1 text-[10px] text-[#64748B]">
                <div className="w-2.5 h-2.5 rounded-[3px] bg-[#DCFCE7] border border-[#86EFAC]"></div>Open
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#64748B]">
                <div className="w-2.5 h-2.5 rounded-[3px] bg-[#FBBF24]"></div>Booked
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#64748B]">
                <div className="w-2.5 h-2.5 rounded-[3px] bg-[#EF4444]"></div>Blocked
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#64748B]">
                <div className="w-2.5 h-2.5 rounded-[3px] bg-[#CCFBF1] border border-[#2DD4BF]"></div>
                Check-out
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#64748B]">
                <div className="w-2.5 h-2.5 rounded-[3px] bg-[#FEF3C7] border border-[#FBBF24]"></div>Check-in
              </div>
            </div>
          </div>

          {/* Block dates */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-medium text-[#1C1030]">Block dates</span>
          </div>
          <div className="bg-white border border-[#E0DBD0] rounded-xl p-3 mb-4">
            <div className="flex gap-2 mb-2.5">
              <div className="flex-1 bg-[#FAF7F2] rounded-lg px-3 py-2 border border-[#E0DBD0]">
                <div className="text-[10px] text-[#2a1b47] font-medium uppercase tracking-wide mb-0.5">
                  From
                </div>
                <input
                  type="date"
                  value={rangeFrom}
                  onChange={(e) => setRangeFrom(e.target.value)}
                  className="text-[13px] font-medium text-[#1C1030] bg-transparent border-none p-0 focus:outline-none w-full"
                />
              </div>
              <div className="flex-1 bg-[#FAF7F2] rounded-lg px-3 py-2 border border-[#E0DBD0]">
                <div className="text-[10px] text-[#2a1b47] font-medium uppercase tracking-wide mb-0.5">
                  To
                </div>
                <input
                  type="date"
                  value={rangeTo}
                  onChange={(e) => setRangeTo(e.target.value)}
                  className="text-[13px] font-medium text-[#1C1030] bg-transparent border-none p-0 focus:outline-none w-full"
                />
              </div>
            </div>
            <button
              onClick={handleBlockRange}
              className="w-full py-2.5 rounded-lg bg-[#3D2463] text-[13px] font-medium text-[#FAF7F2] hover:bg-[#3D2463]/90 transition-colors"
            >
              Block these dates
            </button>
          </div>

          {/* Pricing overrides */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-medium text-[#1C1030]">Pricing overrides</span>
          </div>
          <div className="bg-white border border-[#E0DBD0] rounded-xl overflow-hidden">
            <div className="divide-y divide-[#E0DBD0]">
              <div className="flex justify-between items-center px-3 py-[7px]">
                <span className="text-[12px] text-[#64748B]">Base nightly rate</span>
                <span className="text-[13px] font-medium text-[#1C1030]">K850</span>
              </div>
              <div className="flex justify-between items-center px-3 py-[7px]">
                <span className="text-[12px] text-[#64748B]">Weekend rate (Fri–Sat)</span>
                <span className="text-[13px] font-medium text-[#2a1b47]">K1,050</span>
              </div>
              <div className="flex justify-between items-center px-3 py-[7px]">
                <span className="text-[12px] text-[#64748B]">Min. stay (weekends)</span>
                <span className="text-[13px] font-medium text-[#1C1030]">2 nights</span>
              </div>
            </div>
            <div className="px-3 py-2.5 border-t border-[#E0DBD0]">
              <span
                className="text-[12px] text-[#2a1b47] font-medium cursor-pointer"
                onClick={() => toast.success("Opening pricing editor...")}
              >
                Edit pricing rules
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
