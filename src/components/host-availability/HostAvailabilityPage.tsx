"use client";

import { useState, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { mockHostProfile } from "@/lib/mock-profile-data";
import { useAvailabilityStore } from "@/store/availabilityStore";
import { toast } from "sonner";

const DAY_NAMES = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}
function formatDate(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function isToday(d: string): boolean {
  return d === new Date().toISOString().split("T")[0];
}
function isPast(d: string): boolean {
  return d < new Date().toISOString().split("T")[0];
}

function adjustDay(d: number): number {
  return d === 0 ? 6 : d - 1;
} // Sun=0→6, Mon=1→0, etc.

export function HostAvailabilityPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [rangeFrom, setRangeFrom] = useState("");
  const [rangeTo, setRangeTo] = useState("");

  const hostListings = mockHostProfile.listings;
  const [selectedId, setSelectedId] = useState(hostListings[0]?.id || "");
  const { toggleDateBlock, blockDateRange, getAvailabilityForMonth, getSeasonalPricingForListing } =
    useAvailabilityStore();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = adjustDay(getFirstDayOfMonth(year, month));

  const entries = useMemo(
    () => (selectedId ? getAvailabilityForMonth(selectedId, year, month) : []),
    [selectedId, year, month, getAvailabilityForMonth],
  );
  const pricing = useMemo(
    () => getSeasonalPricingForListing(selectedId),
    [selectedId, getSeasonalPricingForListing],
  );

  const statusMap = useMemo(() => {
    const m: Record<string, "available" | "blocked" | "booked"> = {};
    for (const e of entries) m[e.date] = e.status;
    return m;
  }, [entries]);

  const goBack = useCallback(() => {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else setMonth((m) => m - 1);
  }, [month]);
  const goNext = useCallback(() => {
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else setMonth((m) => m + 1);
  }, [month]);

  const toggleDate = useCallback(
    (date: string) => {
      toggleDateBlock(selectedId, date);
      toast.success(statusMap[date] === "blocked" ? "Date unblocked" : "Date blocked");
    },
    [selectedId, toggleDateBlock, statusMap],
  );

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

  // Build calendar cells
  const cells = useMemo(() => {
    const c: { day: number; dateStr: string; isCurrent: boolean }[] = [];
    const prevM = month === 1 ? 12 : month - 1;
    const prevY = month === 1 ? year - 1 : year;
    const prevDays = getDaysInMonth(prevY, prevM);
    for (let i = firstDay - 1; i >= 0; i--)
      c.push({
        day: prevDays - i,
        dateStr: formatDate(prevY, prevM, prevDays - i),
        isCurrent: false,
      });
    for (let d = 1; d <= daysInMonth; d++)
      c.push({ day: d, dateStr: formatDate(year, month, d), isCurrent: true });
    const rem = 7 - (c.length % 7 === 0 ? 7 : c.length % 7);
    const nextM = month === 12 ? 1 : month + 1;
    const nextY = month === 12 ? year + 1 : year;
    for (let d = 1; d < (rem === 7 ? 0 : rem); d++)
      c.push({ day: d, dateStr: formatDate(nextY, nextM, d), isCurrent: false });
    while (c.length < 42) {
      const last = new Date(c[c.length - 1].dateStr);
      last.setDate(last.getDate() + 1);
      c.push({ day: last.getDate(), dateStr: last.toISOString().split("T")[0], isCurrent: false });
    }
    return c;
  }, [year, month, daysInMonth, firstDay]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-6">
        <div className="px-4 pt-4 pb-1">
          <h1 className="text-[15px] font-medium text-[#1C1030]">Availability calendar</h1>
        </div>

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

          {/* Month header */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-medium text-[#1C1030]">
              {MONTH_NAMES[month - 1]} {year}
            </span>
            <span className="flex items-center gap-1.5 text-[#C9A84C]">
              <ChevronLeft className="h-3.5 w-3.5 cursor-pointer" onClick={goBack} />
              <ChevronRight className="h-3.5 w-3.5 cursor-pointer" onClick={goNext} />
            </span>
          </div>

          {/* Calendar grid */}
          <div className="bg-white border border-[#E0DBD0] rounded-xl overflow-hidden p-3 mb-4">
            <div className="grid grid-cols-7 gap-1 mb-1">
              {DAY_NAMES.map((n) => (
                <div key={n} className="text-[9px] text-[#64748B] text-center py-1 font-medium">
                  {n}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((cell) => {
                const status = statusMap[cell.dateStr];
                const today = isToday(cell.dateStr);
                const past = isPast(cell.dateStr);
                let className =
                  "h-8 rounded-md flex items-center justify-center text-[11px] text-[#1C1030] relative";
                if (!cell.isCurrent) className += " opacity-20";
                else if (past) className += " opacity-40 cursor-default";
                else if (status === "booked")
                  className += " bg-[#3D2463] text-[#EDE8F5] font-medium cursor-default";
                else if (status === "blocked")
                  className += " bg-[#E8E3DC] text-[#64748B] cursor-pointer hover:opacity-80";
                else className += " bg-transparent cursor-pointer hover:bg-[#FAF7F2]";
                if (today) className += " border-[1.5px] border-[#C9A84C]";
                return (
                  <button
                    key={cell.dateStr}
                    onClick={() =>
                      cell.isCurrent && !past && status !== "booked" && toggleDate(cell.dateStr)
                    }
                    disabled={!cell.isCurrent || past || status === "booked" || !selectedId}
                    className={className}
                  >
                    {cell.day}
                    {status === "booked" && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-[3px] rounded-full bg-[#3D2463]" />
                    )}
                    {status === "blocked" && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-[3px] rounded-full bg-[#64748B]" />
                    )}
                  </button>
                );
              })}
            </div>
            {/* Legend */}
            <div className="flex gap-2.5 mt-2 pt-2 border-t border-[#E0DBD0]">
              <div className="flex items-center gap-1 text-[10px] text-[#64748B]">
                <div className="w-2.5 h-2.5 rounded-[3px] bg-[#3D2463]"></div>Booked
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#64748B]">
                <div className="w-2.5 h-2.5 rounded-[3px] bg-[#E8E3DC]"></div>Blocked
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#64748B]">
                <div className="w-2.5 h-2.5 rounded-[3px] bg-[#E6F4EE] border border-[#2A5C3F]"></div>
                Check-out
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#64748B]">
                <div className="w-2.5 h-2.5 rounded-[3px] bg-[#C9A84C]"></div>Check-in
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
                <div className="text-[10px] text-[#C9A84C] font-medium uppercase tracking-wide mb-0.5">
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
                <div className="text-[10px] text-[#C9A84C] font-medium uppercase tracking-wide mb-0.5">
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
                <span className="text-[13px] font-medium text-[#C9A84C]">K1,050</span>
              </div>
              <div className="flex justify-between items-center px-3 py-[7px]">
                <span className="text-[12px] text-[#64748B]">Min. stay (weekends)</span>
                <span className="text-[13px] font-medium text-[#1C1030]">2 nights</span>
              </div>
            </div>
            <div className="px-3 py-2.5 border-t border-[#E0DBD0]">
              <span
                className="text-[12px] text-[#C9A84C] font-medium cursor-pointer"
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
