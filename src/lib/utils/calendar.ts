export const DAY_NAMES = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export const MONTH_NAMES = [
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

export const DAY_FULL_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

/** Sun=0→6, Mon=1→0, ... so the week starts on Monday. */
export function adjustDay(d: number): number {
  return d === 0 ? 6 : d - 1;
}

export function formatDate(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function formatDateObj(date: Date): string {
  return formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export function isToday(dateStr: string): boolean {
  return dateStr === formatDateObj(new Date());
}

export function isPast(dateStr: string): boolean {
  return dateStr < formatDateObj(new Date());
}

export interface MonthCell {
  day: number;
  dateStr: string;
  isCurrent: boolean;
}

/** Build a 42-cell month grid (6 weeks) with leading/trailing days from adjacent months. */
export function buildMonthCells(year: number, month: number): MonthCell[] {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = adjustDay(getFirstDayOfMonth(year, month));
  const cells: MonthCell[] = [];

  const prevM = month === 1 ? 12 : month - 1;
  const prevY = month === 1 ? year - 1 : year;
  const prevDays = getDaysInMonth(prevY, prevM);
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({
      day: prevDays - i,
      dateStr: formatDate(prevY, prevM, prevDays - i),
      isCurrent: false,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, dateStr: formatDate(year, month, d), isCurrent: true });
  }

  const rem = 7 - (cells.length % 7 === 0 ? 7 : cells.length % 7);
  const nextM = month === 12 ? 1 : month + 1;
  const nextY = month === 12 ? year + 1 : year;
  for (let d = 1; d < (rem === 7 ? 0 : rem); d++) {
    cells.push({ day: d, dateStr: formatDate(nextY, nextM, d), isCurrent: false });
  }

  while (cells.length < 42) {
    const last = new Date(cells[cells.length - 1].dateStr + "T00:00:00");
    last.setDate(last.getDate() + 1);
    cells.push({ day: last.getDate(), dateStr: formatDateObj(last), isCurrent: false });
  }

  return cells;
}

/** 0 = Monday ... 6 = Sunday */
export function getWeekdayIndex(dateStr: string): number {
  return adjustDay(new Date(dateStr + "T00:00:00").getDay());
}

/** "09:00" → "09:00 AM" */
export function formatTime12h(time: string): string {
  const [hStr, mStr] = time.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr ?? "0", 10);
  const suffix = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** "2026-08-15" → "August 15" */
export function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
}
