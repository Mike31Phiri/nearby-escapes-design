/**
 * Distance and travel-time formatting utilities for Nearby Escapes.
 * Distances are expressed relative to Lusaka, Zambia's capital.
 */

/**
 * Converts a raw minute count into a human-readable duration string.
 * - Exact hours (no remainder) → 'N hrs'
 * - Mixed hours + minutes     → 'Nh Nmin'
 * - Under one hour            → 'N min'
 *
 * @example
 * minutesToReadable(45)  // → '45 min'
 * minutesToReadable(90)  // → '1h 30min'
 * minutesToReadable(180) // → '3 hrs'
 */
export function minutesToReadable(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) {
    return `${hrs} hrs`;
  }

  return `${hrs}h ${mins}min`;
}

/**
 * Returns a contextual distance label relative to Lusaka.
 * Fractional hours are expressed to one decimal place.
 *
 * @example
 * distanceFromLusaka(90)  // → '1.5 hrs from Lusaka'
 * distanceFromLusaka(180) // → '3 hrs from Lusaka'
 */
export function distanceFromLusaka(minutes: number): string {
  const hrs = minutes / 60;
  // Trim unnecessary trailing zero (e.g. 3.0 → '3')
  const formatted = hrs % 1 === 0 ? `${hrs}` : hrs.toFixed(1);
  return `${formatted} hrs from Lusaka`;
}

/**
 * Formats a kilometre value as a rounded distance string.
 *
 * @example
 * formatKm(12) // → '12 km'
 */
export function formatKm(km: number): string {
  return `${km} km`;
}
