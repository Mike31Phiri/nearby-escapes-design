/**
 * Date formatting utilities for Nearby Escapes.
 * Uses date-fns for reliable, locale-independent formatting.
 */

import { format, differenceInDays, isPast, addDays, parseISO } from "date-fns";

/**
 * Normalises a Date or ISO string to a Date object.
 */
function toDate(date: Date | string): Date {
  return typeof date === "string" ? parseISO(date) : date;
}

/**
 * Formats a date as a full display string.
 *
 * @example
 * formatDisplayDate(new Date('2025-07-18')) // → 'Fri 18 Jul 2025'
 */
export function formatDisplayDate(date: Date | string): string {
  return format(toDate(date), "EEE dd MMM yyyy");
}

/**
 * Formats a date as a short day-month string.
 *
 * @example
 * formatShortDate(new Date('2025-07-18')) // → '18 Jul'
 */
export function formatShortDate(date: Date | string): string {
  return format(toDate(date), "dd MMM");
}

/**
 * Formats a date as month and year.
 *
 * @example
 * formatMonthYear(new Date('2025-07-18')) // → 'July 2025'
 */
export function formatMonthYear(date: Date | string): string {
  return format(toDate(date), "MMMM yyyy");
}

/**
 * Formats a check-in/check-out date range.
 * Shares the year suffix on the trailing date only.
 *
 * @example
 * formatDateRange('2025-07-18', '2025-07-20') // → 'Fri 18 Jul – Sun 20 Jul 2025'
 */
export function formatDateRange(checkIn: Date | string, checkOut: Date | string): string {
  const inDate = toDate(checkIn);
  const outDate = toDate(checkOut);
  const inStr = format(inDate, "EEE dd MMM");
  const outStr = format(outDate, "EEE dd MMM yyyy");
  return `${inStr} – ${outStr}`;
}

/**
 * Returns the number of nights between check-in and check-out.
 *
 * @example
 * countNights('2025-07-18', '2025-07-20') // → 2
 */
export function countNights(checkIn: Date | string, checkOut: Date | string): number {
  return differenceInDays(toDate(checkOut), toDate(checkIn));
}

/**
 * Returns true if the given date is in the past (before now).
 */
export function isDateInPast(date: Date | string): boolean {
  return isPast(toDate(date));
}

/**
 * Returns a new Date with the specified number of days added.
 */
export function addDaysToDate(date: Date | string, days: number): Date {
  return addDays(toDate(date), days);
}
