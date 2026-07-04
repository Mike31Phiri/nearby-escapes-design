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
    <div className="w-full">
      <div className="text-[13px] font-semibold text-[#1f1433] text-center mb-3">
        {MONTHS[month]} {year}
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-[#64748B] py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((date, idx) => {
          if (!date) return <div key={`e-${idx}`} />;
          const isToday = isSameDay(date, today);
          const isPast = date < today;
          const isCheckIn = checkIn && isSameDay(date, checkIn);
          const isCheckOut = rangeEnd && isSameDay(date, rangeEnd);
          const inRange = checkIn && rangeEnd && date > checkIn && date < rangeEnd;

          return (
            <div
              key={date.toISOString()}
              className={cn(
                "relative flex items-center justify-center",
                inRange && "bg-[#f2ba0d]/10",
                isCheckIn && rangeEnd && "rounded-l-full bg-[#f2ba0d]/10",
                isCheckOut && "rounded-r-full bg-[#f2ba0d]/10",
              )}
            >
              <button
                type="button"
                disabled={isPast}
                onClick={() => !isPast && onDayClick(date)}
                onMouseEnter={() => onDayHover(date)}
                onMouseLeave={() => onDayHover(null)}
                className={cn(
                  "w-8 h-8 rounded-full text-[12px] font-medium transition-colors",
                  isPast && "text-[#C8C3BC] cursor-default",
                  !isPast && !isCheckIn && !isCheckOut && "text-[#334155] hover:bg-[#f2ba0d]/15",
                  isToday && !isCheckIn && !isCheckOut && "font-bold text-[#1f1433]",
                  (isCheckIn || isCheckOut) && "bg-[#f2ba0d] text-white",
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
  placeholder = "Any weekend",
  className,
  variant = "default",
}: Props) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<Date | null>(null);
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const ref = useRef<HTMLDivElement>(null);

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

  // Second month for desktop
  const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
  const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;

  const label = value.checkIn
    ? value.checkOut
      ? `${formatShort(value.checkIn)} – ${formatShort(value.checkOut)}`
      : formatShort(value.checkIn)
    : placeholder;

  const hasValue = !!value.checkIn;

  return (
    <div ref={ref} className={cn("relative", className)}>
      {/* Trigger */}
      {variant === "compact" ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1.5 w-full focus:outline-none"
        >
          <CalendarDays className="h-4 w-4 text-[#1f1433] shrink-0" strokeWidth={1.5} />
          <span
            className={cn("text-[13px] truncate", hasValue ? "text-[#334155]" : "text-[#64748B]")}
          >
            {label}
          </span>
          {hasValue && (
            <span onClick={clear} className="ml-auto text-[#64748B] hover:text-[#1f1433]">
              <X className="h-3 w-3" strokeWidth={2.5} />
            </span>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2.5 w-full focus:outline-none"
        >
          <CalendarDays className="h-[18px] w-[18px] text-[#1f1433] shrink-0" strokeWidth={1.5} />
          <div className="text-left flex-1 min-w-0">
            <p className="text-[10px] text-[#64748B]">Pick dates</p>
            <p
              className={cn(
                "text-[13px] font-medium truncate leading-tight",
                hasValue ? "text-[#334155]" : "text-[#64748B]",
              )}
            >
              {label}
            </p>
          </div>
          {hasValue && (
            <span onClick={clear} className="text-[#64748B] hover:text-[#1f1433] shrink-0">
              <X className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
          )}
        </button>
      )}

      {/* Popover */}
      {open && (
        <div className="absolute z-50 mt-2 bg-white rounded-[16px] shadow-[0_8px_40px_rgba(42,27,61,0.18)] border border-[#E0DBD0] p-4 left-1/2 -translate-x-1/2 w-[320px] md:w-[620px]">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => {
                if (viewMonth === 0) {
                  setViewMonth(11);
                  setViewYear((y) => y - 1);
                } else setViewMonth((m) => m - 1);
              }}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#F0EAE0] transition-colors"
            >
              <CaretLeft className="h-4 w-4 text-[#1f1433]" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (viewMonth === 11) {
                  setViewMonth(0);
                  setViewYear((y) => y + 1);
                } else setViewMonth((m) => m + 1);
              }}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#F0EAE0] transition-colors"
            >
              <CaretRight className="h-4 w-4 text-[#1f1433]" />
            </button>
          </div>

          {/* Calendar grids */}
          <div className="flex gap-6">
            <MonthGrid
              year={viewYear}
              month={viewMonth}
              checkIn={value.checkIn}
              checkOut={value.checkOut}
              hovered={hovered}
              onDayClick={handleDayClick}
              onDayHover={setHovered}
            />
            {/* Second month — hidden on mobile */}
            <div className="hidden md:block w-px bg-[#E0DBD0] shrink-0" />
            <div className="hidden md:block flex-1">
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
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E0DBD0]">
            <span className="text-[12px] text-[#64748B]">
              {!value.checkIn
                ? "Select check-in date"
                : !value.checkOut
                  ? "Now select check-out"
                  : `${Math.round((value.checkOut.getTime() - value.checkIn.getTime()) / 86400000)} night${Math.round((value.checkOut.getTime() - value.checkIn.getTime()) / 86400000) !== 1 ? "s" : ""}`}
            </span>
            <button
              type="button"
              onClick={() => {
                onChange({ checkIn: null, checkOut: null });
              }}
              className="text-[12px] font-medium text-[#1f1433] hover:underline"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

