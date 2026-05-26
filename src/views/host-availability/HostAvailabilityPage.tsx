"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Ban,
  CheckCircle2,
  DollarSign,
  Plus,
  Trash2,
  ArrowLeft,
  Info,
  Sun,
  Moon,
  AlertTriangle,
  Lock,
  Unlock,
  Percent,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { mockHostProfile } from "@/lib/mock-profile-data";
import type { HostListing } from "@/lib/mock-profile-data";
import { useAvailabilityStore } from "@/store/availabilityStore";
import type { SeasonalPricingEntry } from "@/store/availabilityStore";
import { toast } from "sonner";

// ─── Constants ────────────────────────────────────────────────────────────

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ─── Helpers ──────────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function isToday(dateStr: string): boolean {
  const today = new Date();
  return dateStr === today.toISOString().split("T")[0];
}

function isPast(dateStr: string): boolean {
  return dateStr < new Date().toISOString().split("T")[0];
}

function formatCurrency(amount: number): string {
  return `K${amount.toLocaleString()}`;
}

// ─── Calendar Day Cell ────────────────────────────────────────────────────

function DayCell({
  day,
  dateStr,
  status,
  isCurrentMonth,
  isSelectable,
  onToggle,
}: {
  day: number;
  dateStr: string;
  status: "available" | "blocked" | "booked" | undefined;
  isCurrentMonth: boolean;
  isSelectable: boolean;
  onToggle: (date: string) => void;
}) {
  const today = isToday(dateStr);
  const past = isPast(dateStr);

  const statusColor = status === "available"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800"
    : status === "blocked"
    ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-800"
    : status === "booked"
    ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800"
    : "bg-transparent text-muted-foreground/30 border-transparent";

  return (
    <button
      onClick={() => isSelectable && !past && status !== "booked" && onToggle(dateStr)}
      disabled={!isCurrentMonth || past || status === "booked" || !isSelectable}
      title={
        past
          ? "Past date"
          : status === "booked"
          ? "Has a booking"
          : status === "blocked"
          ? "Blocked — click to unblock"
          : "Available — click to block"
      }
      className={cn(
        "relative flex items-center justify-center h-10 md:h-11 w-full rounded-lg text-sm font-medium border transition-all duration-150",
        statusColor,
        !isCurrentMonth && "opacity-20 cursor-default",
        past && "cursor-not-allowed opacity-50",
        status === "booked" && "cursor-not-allowed",
        today && "ring-2 ring-primary ring-offset-1",
        isSelectable && !past && status !== "booked" && "cursor-pointer",
      )}
    >
      <span className={cn(
        "text-xs md:text-sm",
        today && "font-black",
      )}>
        {day}
      </span>
      {/* Status indicator dot */}
      {status === "booked" && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-blue-500" />
      )}
      {status === "blocked" && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-rose-500" />
      )}
    </button>
  );
}

// ─── Listing Selector ─────────────────────────────────────────────────────

function ListingSelector({
  listings,
  selectedId,
  onSelect,
}: {
  listings: HostListing[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const selected = listings.find((l) => l.id === selectedId);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <CalendarDays className="h-4 w-4 text-primary shrink-0" />
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Listing:
      </span>
      <div className="flex flex-wrap gap-1.5">
        {listings.map((l) => (
          <button
            key={l.id}
            onClick={() => onSelect(l.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold border transition-all text-left",
              l.id === selectedId
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border/60 hover:border-primary/30 hover:text-foreground",
            )}
          >
            <span className="truncate max-w-[120px] md:max-w-[180px] inline-block">{l.name}</span>
          </button>
        ))}
      </div>
      {selected && (
        <Badge
          variant="outline"
          className="rounded-full text-[9px] font-bold uppercase tracking-wider border-primary/20 text-primary"
        >
          {selected.type === "stay" ? "Stay" : selected.type === "experience" ? "Experience" : "Transport"}
        </Badge>
      )}
    </div>
  );
}

// ─── Legend ────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs">
      <span className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-sm bg-emerald-100 border border-emerald-300" />
        Available
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-sm bg-rose-100 border border-rose-300" />
        Blocked
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-sm bg-blue-100 border border-blue-300" />
        Booked
      </span>
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <Info className="h-3 w-3" />
        Click a date to toggle available/blocked
      </span>
    </div>
  );
}

// ─── Seasonal Pricing Card ────────────────────────────────────────────────

function SeasonalPricingCard({
  entry,
  onRemove,
}: {
  entry: SeasonalPricingEntry;
  onRemove: (id: string) => void;
}) {
  const startDate = new Date(entry.from).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endDate = new Date(entry.to).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const isActive = entry.label?.toLowerCase().includes("peak");
  const colorClass = isActive
    ? "border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20"
    : "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20";
  const icon = isActive ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-blue-500" />;

  return (
    <div className={cn("flex items-center justify-between rounded-xl border p-4 transition-all", colorClass)}>
      <div className="flex items-center gap-3 min-w-0">
        <div className={cn(
          "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
          isActive ? "bg-amber-100 dark:bg-amber-900/30" : "bg-blue-100 dark:bg-blue-900/30",
        )}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground">{entry.label ?? "Custom Range"}</p>
          <p className="text-xs text-muted-foreground">
            {startDate} — {endDate}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {entry.price > 0 ? (
          <span className="text-sm font-bold text-foreground">{formatCurrency(entry.price)}</span>
        ) : (
          <span className="text-xs text-muted-foreground font-medium">
            {isActive ? "+30%" : "-20%"}
          </span>
        )}
        <button
          onClick={() => onRemove(entry.id)}
          className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
          aria-label={`Remove ${entry.label}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────

function formatMonthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function HostAvailabilityPage() {
  const router = useRouter();

  // Current date state
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth() + 1);

  // Selected listing
  const hostListings = mockHostProfile.listings;
  const [selectedListingId, setSelectedListingId] = useState(
    hostListings.length > 0 ? hostListings[0].id : "",
  );

  // Range block form
  const [showRangeForm, setShowRangeForm] = useState(false);
  const [rangeFrom, setRangeFrom] = useState("");
  const [rangeTo, setRangeTo] = useState("");

  // Seasonal pricing form
  const [showPricingForm, setShowPricingForm] = useState(false);
  const [pricingFrom, setPricingFrom] = useState("");
  const [pricingTo, setPricingTo] = useState("");
  const [pricingPrice, setPricingPrice] = useState("");
  const [pricingLabel, setPricingLabel] = useState("");

  // Store
  const {
    toggleDateBlock,
    blockDateRange,
    unblockDateRange,
    getAvailabilityForMonth,
    getSeasonalPricingForListing,
    addSeasonalPricing,
    removeSeasonalPricing,
  } = useAvailabilityStore();

  // Derived
  const selectedListing = hostListings.find((l) => l.id === selectedListingId);
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const monthEntries = useMemo(
    () => {
      if (!selectedListingId) return [];
      return getAvailabilityForMonth(selectedListingId, currentYear, currentMonth);
    },
    [selectedListingId, currentYear, currentMonth, getAvailabilityForMonth],
  );

  const seasonalPricing = useMemo(
    () => getSeasonalPricingForListing(selectedListingId),
    [selectedListingId, getSeasonalPricingForListing],
  );

  const statusMap = useMemo(() => {
    const map: Record<string, "available" | "blocked" | "booked"> = {};
    for (const entry of monthEntries) {
      map[entry.date] = entry.status;
    }
    return map;
  }, [monthEntries]);

  // Navigation
  const goToPrevMonth = useCallback(() => {
    if (currentMonth === 1) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }, [currentMonth]);

  const goToNextMonth = useCallback(() => {
    if (currentMonth === 12) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }, [currentMonth]);

  const goToToday = useCallback(() => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth() + 1);
  }, []);

  // Toggle date
  const handleToggleDate = useCallback(
    (date: string) => {
      toggleDateBlock(selectedListingId, date);
      const isBlocked = statusMap[date] === "blocked";
      toast.success(isBlocked ? "Date unblocked" : "Date blocked");
    },
    [selectedListingId, toggleDateBlock, statusMap],
  );

  // Block range
  const handleBlockRange = useCallback(() => {
    if (!rangeFrom || !rangeTo) {
      toast.error("Please select both start and end dates");
      return;
    }
    if (rangeFrom > rangeTo) {
      toast.error("End date must be after start date");
      return;
    }
    blockDateRange(selectedListingId, rangeFrom, rangeTo);
    toast.success("Date range blocked");
    setRangeFrom("");
    setRangeTo("");
    setShowRangeForm(false);
  }, [rangeFrom, rangeTo, selectedListingId, blockDateRange]);

  // Unblock range
  const handleUnblockRange = useCallback(() => {
    if (!rangeFrom || !rangeTo) {
      toast.error("Please select both start and end dates");
      return;
    }
    unblockDateRange(selectedListingId, rangeFrom, rangeTo);
    toast.success("Date range unblocked");
    setRangeFrom("");
    setRangeTo("");
    setShowRangeForm(false);
  }, [rangeFrom, rangeTo, selectedListingId, unblockDateRange]);

  // Seasonal pricing
  const handleAddPricing = useCallback(() => {
    if (!pricingFrom || !pricingTo) {
      toast.error("Please select a date range");
      return;
    }
    if (pricingFrom > pricingTo) {
      toast.error("End date must be after start date");
      return;
    }
    addSeasonalPricing({
      listingId: selectedListingId,
      from: pricingFrom,
      to: pricingTo,
      price: pricingPrice ? Number(pricingPrice) : 0,
      label: pricingLabel || undefined,
    });
    toast.success("Seasonal pricing added");
    setPricingFrom("");
    setPricingTo("");
    setPricingPrice("");
    setPricingLabel("");
    setShowPricingForm(false);
  }, [pricingFrom, pricingTo, pricingPrice, pricingLabel, selectedListingId, addSeasonalPricing]);

  const handleRemovePricing = useCallback(
    (id: string) => {
      removeSeasonalPricing(id);
      toast.success("Pricing rule removed");
    },
    [removeSeasonalPricing],
  );

  // Calendar grid
  const calendarDays = useMemo(() => {
    const cells: { day: number; dateStr: string; isCurrentMonth: boolean }[] = [];

    // Previous month's trailing days
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const prevMonthDays = getDaysInMonth(prevYear, prevMonth);
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      cells.push({
        day,
        dateStr: formatDate(prevYear, prevMonth, day),
        isCurrentMonth: false,
      });
    }

    // Current month's days
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        day: d,
        dateStr: formatDate(currentYear, currentMonth, d),
        isCurrentMonth: true,
      });
    }

    // Next month's leading days
    const totalCells = cells.length;
    const remaining = 7 - (totalCells % 7 === 0 ? 7 : totalCells % 7);
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
    for (let d = 1; d < (remaining === 7 ? 0 : remaining); d++) {
      cells.push({
        day: d,
        dateStr: formatDate(nextYear, nextMonth, d),
        isCurrentMonth: false,
      });
    }

    // Ensure we always have 6 rows (42 cells)
    while (cells.length < 42) {
      const lastCell = cells[cells.length - 1];
      const nextD = lastCell.day + 1;
      let nextM = lastCell.dateStr.split("-")[1];
      let nextY = lastCell.dateStr.split("-")[0];
      const dObj = new Date(lastCell.dateStr);
      dObj.setDate(dObj.getDate() + 1);
      cells.push({
        day: dObj.getDate(),
        dateStr: dObj.toISOString().split("T")[0],
        isCurrentMonth: false,
      });
    }

    return cells;
  }, [currentYear, currentMonth, daysInMonth, firstDay]);

  if (!selectedListingId) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fafafa] font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <CalendarDays className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-foreground">No listings yet</h2>
            <p className="text-sm text-muted-foreground mt-1">Create a listing to manage its calendar.</p>
            <Button className="mt-6 rounded-full" asChild>
              <Link href="/host/create">Create Listing</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] font-sans">
      <Navbar />

      <main className="flex-1">
        {/* ─── Header ──────────────────────────────────────────────── */}
        <div className="relative bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent pb-8">
          <div className="mx-auto max-w-6xl px-4 md:px-6 pt-8 md:pt-12">
            <Link
              href="/host"
              className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mb-6"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Dashboard
            </Link>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                  Calendar & Availability
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage availability, block dates, and set seasonal pricing for your listings
                </p>
              </div>
            </div>

            {/* Listing Selector */}
            <ListingSelector
              listings={hostListings}
              selectedId={selectedListingId}
              onSelect={setSelectedListingId}
            />
          </div>
        </div>

        {/* ─── Main Content ────────────────────────────────────────── */}
        <div className="mx-auto max-w-6xl px-4 md:px-6 -mt-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {/* ═══ Calendar ═══ */}
            <div className="lg:col-span-2 space-y-4">
              {/* Month Navigator */}
              <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToPrevMonth}
                    className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="h-4.5 w-4.5" />
                  </button>
                  <h2 className="text-lg font-bold tracking-tight text-foreground min-w-[180px] text-center">
                    {MONTH_NAMES[currentMonth - 1]} {currentYear}
                  </h2>
                  <button
                    onClick={goToNextMonth}
                    className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                    aria-label="Next month"
                  >
                    <ChevronRight className="h-4.5 w-4.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-lg text-xs font-semibold border-border/60"
                    onClick={goToToday}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8 rounded-lg text-xs font-semibold",
                      showRangeForm ? "bg-primary/10 border-primary/30 text-primary" : "border-border/60",
                    )}
                    onClick={() => setShowRangeForm(!showRangeForm)}
                  >
                    <Ban className="h-3.5 w-3.5 mr-1" />
                    Block Range
                  </Button>
                </div>
              </div>

              {/* Legend */}
              <div className="rounded-xl border border-border/40 bg-card px-4 py-2.5 shadow-sm">
                <Legend />
              </div>

              {/* Range Block Form */}
              {showRangeForm && (
                <div className="rounded-xl border border-rose-200 bg-rose-50/50 dark:border-rose-800 dark:bg-rose-950/10 p-4 shadow-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <Ban className="h-4 w-4 text-rose-500" />
                    <span className="text-sm font-bold text-foreground">Block or Unblock Date Range</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">From</Label>
                      <Input
                        type="date"
                        value={rangeFrom}
                        onChange={(e) => setRangeFrom(e.target.value)}
                        className="h-9 rounded-xl text-sm border-border/60"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">To</Label>
                      <Input
                        type="date"
                        value={rangeTo}
                        onChange={(e) => setRangeTo(e.target.value)}
                        className="h-9 rounded-xl text-sm border-border/60"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      size="sm"
                      className="rounded-full text-xs font-bold h-8 bg-rose-500 hover:bg-rose-600"
                      onClick={handleBlockRange}
                    >
                      <Lock className="h-3.5 w-3.5 mr-1" />
                      Block Dates
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full text-xs font-semibold h-8 border-border/60"
                      onClick={handleUnblockRange}
                    >
                      <Unlock className="h-3.5 w-3.5 mr-1" />
                      Unblock Dates
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-full text-xs h-8 ml-auto"
                      onClick={() => setShowRangeForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Calendar Grid */}
              <div className="rounded-xl border border-border/50 bg-card p-4 md:p-6 shadow-sm">
                {/* Day names header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAY_NAMES.map((name) => (
                    <div
                      key={name}
                      className="text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 py-1"
                    >
                      {name}
                    </div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((cell) => (
                    <DayCell
                      key={cell.dateStr}
                      day={cell.day}
                      dateStr={cell.dateStr}
                      status={statusMap[cell.dateStr]}
                      isCurrentMonth={cell.isCurrentMonth}
                      isSelectable={!!selectedListingId}
                      onToggle={handleToggleDate}
                    />
                  ))}
                </div>
              </div>

              {/* Quick Stats for this listing */}
              {selectedListing && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-border/40 bg-card p-3 shadow-sm text-center">
                    <p className="text-lg font-bold text-foreground">
                      {Object.values(statusMap).filter((s) => s === "available").length}
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Available</p>
                  </div>
                  <div className="rounded-xl border border-border/40 bg-card p-3 shadow-sm text-center">
                    <p className="text-lg font-bold text-foreground">
                      {Object.values(statusMap).filter((s) => s === "blocked").length}
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Blocked</p>
                  </div>
                  <div className="rounded-xl border border-border/40 bg-card p-3 shadow-sm text-center">
                    <p className="text-lg font-bold text-foreground">
                      {Object.values(statusMap).filter((s) => s === "booked").length}
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Booked</p>
                  </div>
                </div>
              )}
            </div>

            {/* ═══ Seasonal Pricing Sidebar ═══ */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border/50 bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
                      Seasonal Pricing
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 rounded-lg text-xs font-semibold"
                    onClick={() => setShowPricingForm(!showPricingForm)}
                  >
                    <Plus className="h-3.5 w-3.5 mr-0.5" />
                    Add
                  </Button>
                </div>

                {/* Active pricing rules */}
                {seasonalPricing.length === 0 && !showPricingForm && (
                  <div className="flex flex-col items-center py-8 text-center">
                    <Percent className="h-8 w-8 text-muted-foreground/30 mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">No pricing rules</p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">
                      Set higher prices for peak season or discounts for slow periods.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  {seasonalPricing.map((entry) => (
                    <SeasonalPricingCard
                      key={entry.id}
                      entry={entry}
                      onRemove={handleRemovePricing}
                    />
                  ))}
                </div>

                {/* Add pricing form */}
                {showPricingForm && (
                  <div className="mt-4 pt-4 border-t border-border/40 space-y-3">
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Label (optional)</Label>
                      <Input
                        value={pricingLabel}
                        onChange={(e) => setPricingLabel(e.target.value)}
                        placeholder='e.g. "Christmas Special", "Peak"'
                        className="h-9 rounded-xl text-sm border-border/60"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">From</Label>
                        <Input
                          type="date"
                          value={pricingFrom}
                          onChange={(e) => setPricingFrom(e.target.value)}
                          className="h-9 rounded-xl text-sm border-border/60"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">To</Label>
                        <Input
                          type="date"
                          value={pricingTo}
                          onChange={(e) => setPricingTo(e.target.value)}
                          className="h-9 rounded-xl text-sm border-border/60"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Price override (optional — leave blank for auto % adjustment)
                      </Label>
                      <Input
                        type="number"
                        value={pricingPrice}
                        onChange={(e) => setPricingPrice(e.target.value)}
                        placeholder="Leave blank for auto pricing"
                        className="h-9 rounded-xl text-sm border-border/60"
                      />
                      <p className="text-[9px] text-muted-foreground/60">
                        Labels containing &quot;peak&quot; get +30%, &quot;green&quot; or &quot;off&quot; get -20%.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        size="sm"
                        className="rounded-full text-xs font-bold h-8"
                        onClick={handleAddPricing}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add Rule
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-full text-xs h-8"
                        onClick={() => setShowPricingForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Info about pricing */}

                <div className="mt-4 rounded-lg bg-primary/[0.03] border border-primary/10 p-3">
                  <div className="flex items-start gap-2">
                    <Info className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <div className="text-[10px] text-muted-foreground leading-relaxed">
                      <p className="font-semibold text-foreground mb-0.5">How pricing works</p>
                      <p>
                        Peak season (Jun–Aug): +30%. Green season (Dec–Feb): -20%.
                        Set a specific price override to lock in a custom rate.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected listing summary */}
              {selectedListing && (
                <div className="rounded-xl border border-border/50 bg-card p-5 shadow-sm">
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-3">
                    Listing Info
                  </h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={selectedListing.image}
                        alt={selectedListing.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{selectedListing.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedListing.location}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Base price</span>
                      <span className="font-bold text-foreground">{formatCurrency(selectedListing.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full text-[8px] font-bold uppercase tracking-wider px-2 py-0",
                          selectedListing.status === "active"
                            ? "border-emerald-200 text-emerald-700 bg-emerald-50"
                            : "border-amber-200 text-amber-700 bg-amber-50",
                        )}
                      >
                        {selectedListing.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Total bookings</span>
                      <span className="font-bold text-foreground">{selectedListing.bookings}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4 rounded-full text-xs font-semibold border-border/60"
                    asChild
                  >
                    <Link href={`/host/listings/${selectedListing.id}`}>
                      View Listing Details
                    </Link>
                  </Button>
                </div>
              )}

              {/* Quick Actions */}
              <div className="rounded-xl border border-border/50 bg-card p-5 shadow-sm">
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start rounded-lg text-xs font-semibold border-border/60 h-9"
                    onClick={() => {
                      // Block next weekend
                      const today = new Date();
                      const nextSat = new Date(today);
                      nextSat.setDate(today.getDate() + (6 - today.getDay() + 7) % 7 + 7);
                      const nextSun = new Date(nextSat);
                      nextSun.setDate(nextSat.getDate() + 1);
                      const fmt = (d: Date) => d.toISOString().split("T")[0];
                      blockDateRange(selectedListingId, fmt(nextSat), fmt(nextSun));
                      toast.success("Next weekend blocked");
                    }}
                  >
                    <Ban className="h-3.5 w-3.5 mr-2 text-rose-400" />
                    Block Next Weekend
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start rounded-lg text-xs font-semibold border-border/60 h-9"
                    onClick={() => {
                      // Block the following month
                      const nextMonth = new Date(currentYear, currentMonth, 1);
                      const lastDay = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0);
                      const fmt = (d: Date) => d.toISOString().split("T")[0];
                      blockDateRange(
                        selectedListingId,
                        fmt(nextMonth),
                        fmt(lastDay),
                      );
                      toast.success("All of next month blocked");
                    }}
                  >
                    <Ban className="h-3.5 w-3.5 mr-2 text-rose-400" />
                    Block Full Month
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start rounded-lg text-xs font-semibold border-border/60 h-9"
                    onClick={() => goToToday()}
                  >
                    <CalendarDays className="h-3.5 w-3.5 mr-2 text-primary" />
                    Jump to Today
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
