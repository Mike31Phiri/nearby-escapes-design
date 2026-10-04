"use client";

import { useState, useRef, useEffect } from "react";
import { CalendarBlank as CalendarDays, CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type DateRange = { checkIn: Date | null; checkOut: Date | null };

interface Props {
  value: DateRange;
  onChange: (range: DateRange) => void;
  /** Label shown on the trigger button when nothing is selected */
  placeholder?: string;
  className?: string;
  /** compact = icon + short label, used inside the desktop search bar */
  variant?: "default" | "compact";
  /** Optional custom label content — replaces the default compact label when provided */
  children?: React.ReactNode;
  /** Popover horizontal alignment */
  align?: "left" | "center" | "right";
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
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

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function formatShort(d: Date | null) {
  if (!d) return "";
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
}

/** Serialize range → URL string */
export function serializeDates(range: DateRange): string {
  if (!range.checkIn) return "";
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return range.checkOut ? `${fmt(range.checkIn)}_${fmt(range.checkOut)}` : fmt(range.checkIn);
}

/** Deserialize URL string → range */
export function deserializeDates(s: string): DateRange {
  if (!s) return { checkIn: null, checkOut: null };
  const parts = s.split("_");
  const parse = (str: string) => {
    const d = new Date(str);
    return isNaN(d.getTime()) ? null : d;
  };
  return { checkIn: parse(parts[0]), checkOut: parts[1] ? parse(parts[1]) : null };
}

function MonthGrid({
  year,
  month,
  checkIn,
  checkOut,
  hovered,
  onDayClick,
  onDayHover,
}: {
  year: number;
  month: number;
  checkIn: Date | null;
  checkOut: Date | null;
  hovered: Date | null;
  onDayClick: (d: Date) => void;
  onDayHover: (d: Date | null) => void;
}) {
  const today = startOfDay(new Date());
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const rangeEnd =
    checkIn && !checkOut && hovered ? (hovered > checkIn ? hovered : null) : checkOut;

  const cells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  return (
    <div className="w-full select-none">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1.5">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-bold text-neutral-400 py-1 uppercase tracking-wider"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid - balanced compact cells to guarantee no shrinkage */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((date, idx) => {
          if (!date) return <div key={`e-${idx}`} className="h-7 sm:h-7.5" />;
          const isToday = isSameDay(date, today);
          const isPast = date < today;
          const isCheckIn = checkIn && isSameDay(date, checkIn);
          const isCheckOut = rangeEnd && isSameDay(date, rangeEnd);
          const inRange = checkIn && rangeEnd && date > checkIn && date < rangeEnd;

          return (
            <div
              key={date.toISOString()}
              className={cn(
                "relative flex items-center justify-center py-0.5",
                inRange && "bg-purple/10",
                isCheckIn && rangeEnd && "rounded-l-full bg-purple/10",
                isCheckOut && "rounded-r-full bg-purple/10",
              )}
            >
              <button
                type="button"
                disabled={isPast}
                onClick={() => !isPast && onDayClick(date)}
                onMouseEnter={() => onDayHover(date)}
                onMouseLeave={() => onDayHover(null)}
                className={cn(
                  "w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full text-[11px] sm:text-xs font-semibold transition-colors flex items-center justify-center select-none",
                  isPast && "text-neutral-300 cursor-not-allowed",
                  !isPast && !isCheckIn && !isCheckOut &&
                    "text-neutral-700 hover:bg-purple/15 hover:text-purple cursor-pointer",
                  isToday && !isCheckIn && !isCheckOut &&
                    "font-bold text-purple underline underline-offset-2",
                  (isCheckIn || isCheckOut) && "bg-purple text-white shadow-xs font-bold",
                )}
              >
                {date.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Dates",
  className,
  variant = "default",
  children,
  align = "center",
}: Props) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<Date | null>(null);
  const today = new Date();
  const [viewYear, setViewYear] = useState(() =>
    value.checkIn ? value.checkIn.getFullYear() : today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(() =>
    value.checkIn ? value.checkIn.getMonth() : today.getMonth(),
  );
  const ref = useRef<HTMLDivElement>(null);

  // Sync view when checkIn changes
  useEffect(() => {
    if (value.checkIn) {
      setViewYear(value.checkIn.getFullYear());
      setViewMonth(value.checkIn.getMonth());
    }
  }, [value.checkIn]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDayClick = (date: Date) => {
    const { checkIn, checkOut } = value;
    if (!checkIn || (checkIn && checkOut)) {
      onChange({ checkIn: date, checkOut: null });
    } else {
      if (date <= checkIn) {
        onChange({ checkIn: date, checkOut: null });
      } else {
        onChange({ checkIn, checkOut: date });
        setOpen(false);
      }
    }
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ checkIn: null, checkOut: null });
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Second month for desktop (this month + next month)
  const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
  const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;

  const label = value.checkIn
    ? value.checkOut
      ? `${formatShort(value.checkIn)} – ${formatShort(value.checkOut)}`
      : formatShort(value.checkIn)
    : placeholder;

  const hasValue = !!value.checkIn;

  const alignClasses =
    align === "right"
      ? "right-0"
      : align === "left"
        ? "left-0"
        : "left-1/2 -translate-x-1/2";

  return (
    <div ref={ref} className={cn("relative", className)}>
      {/* Trigger */}
      {variant === "compact" ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1.5 w-full focus:outline-none cursor-pointer"
        >
          {!children && (
            <CalendarDays className="h-4 w-4 text-purple shrink-0" strokeWidth={1.8} />
          )}
          {children ?? (
            <span
              className={cn(
                "text-[13px] truncate select-none",
                hasValue ? "text-neutral-900 font-semibold" : "text-neutral-400 font-medium",
              )}
            >
              {label}
            </span>
          )}
          {hasValue && (
            <span onClick={clear} className="ml-auto text-neutral-400 hover:text-neutral-700">
              <X className="h-3 w-3" strokeWidth={2.5} />
            </span>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2.5 w-full focus:outline-none cursor-pointer"
        >
          <CalendarDays className="h-[18px] w-[18px] text-purple shrink-0" strokeWidth={1.8} />
          <div className="text-left flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 leading-none mb-0.5">
              Dates
            </p>
            <p
              className={cn(
                "text-[13px] truncate leading-tight",
                hasValue ? "text-neutral-900 font-semibold" : "text-neutral-400 font-medium",
              )}
            >
              {label}
            </p>
          </div>
          {hasValue && (
            <span onClick={clear} className="text-neutral-400 hover:text-neutral-700 shrink-0">
              <X className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
          )}
        </button>
      )}

      {/* Popover */}
      {open && (
        <div
          className={cn(
            "absolute z-50 mt-2 bg-white rounded-2xl shadow-[0_12px_44px_rgba(42,27,61,0.18)] border border-neutral-200/90 p-4 sm:p-5 w-[310px] md:w-[540px] lg:w-[560px] max-w-[calc(100vw-24px)]",
            alignClasses,
          )}
        >
          {/* Calendar 2-Month Grid (Equal 50/50 columns on desktop, no shrinking) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 md:divide-x md:divide-neutral-100">
            {/* Month 1: This Month */}
            <div className="min-w-0">
              <div className="flex items-center justify-between mb-2.5 px-0.5">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer"
                  aria-label="Previous month"
                >
                  <CaretLeft className="h-4 w-4" />
                </button>
                <h4 className="text-[13px] font-bold text-neutral-900">
                  {MONTHS[viewMonth]} {viewYear}
                </h4>
                {/* On mobile only: show Next button here since Month 2 is hidden */}
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="w-7 h-7 rounded-full flex md:hidden items-center justify-center hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer"
                  aria-label="Next month"
                >
                  <CaretRight className="h-4 w-4" />
                </button>
                {/* Spacer on desktop to keep title centered */}
                <div className="hidden md:block w-7 h-7" />
              </div>

              <MonthGrid
                year={viewYear}
                month={viewMonth}
                checkIn={value.checkIn}
                checkOut={value.checkOut}
                hovered={hovered}
                onDayClick={handleDayClick}
                onDayHover={setHovered}
              />
            </div>

            {/* Month 2: Next Month */}
            <div className="hidden md:block min-w-0 md:pl-6">
              <div className="flex items-center justify-between mb-2.5 px-0.5">
                <div className="w-7 h-7" />
                <h4 className="text-[13px] font-bold text-neutral-900">
                  {MONTHS[nextMonth]} {nextYear}
                </h4>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer"
                  aria-label="Next month"
                >
                  <CaretRight className="h-4 w-4" />
                </button>
              </div>

              <MonthGrid
                year={nextYear}
                month={nextMonth}
                checkIn={value.checkIn}
                checkOut={value.checkOut}
                hovered={hovered}
                onDayClick={handleDayClick}
                onDayHover={setHovered}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-100">
            <span className="text-xs text-neutral-500 font-medium">
              {!value.checkIn
                ? "Select check-in date"
                : !value.checkOut
                  ? "Select check-out date"
                  : `${Math.round((value.checkOut.getTime() - value.checkIn.getTime()) / 86400000)} night${Math.round((value.checkOut.getTime() - value.checkIn.getTime()) / 86400000) !== 1 ? "s" : ""}`}
            </span>
            <div className="flex items-center gap-2.5">
              {hasValue && (
                <button
                  type="button"
                  onClick={() => onChange({ checkIn: null, checkOut: null })}
                  className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 hover:underline cursor-pointer px-1 py-1"
                >
                  Clear dates
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="bg-purple hover:bg-purple-hover text-white text-xs font-bold px-3.5 py-1.5 rounded-full transition-colors cursor-pointer active:scale-95 shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
