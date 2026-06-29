/**
 * Currency formatting utilities for Nearby Escapes.
 * Zambian currency: Kwacha (ZMW), subdivided into 100 Ngwee.
 * All monetary values are stored as integers in Ngwee internally.
 */

/**
 * Converts an integer Ngwee value to a formatted Kwacha string.
 * Always prefixes with 'K'. Never shows decimals or 'ZMW'.
 * Rounds down to the nearest whole Kwacha.
 *
 * @example
 * ngweeToKwacha(50000) // → 'K500'
 * ngweeToKwacha(85050) // → 'K850'
 */
export function ngweeToKwacha(ngwee: number): string {
  const kwacha = Math.floor(ngwee / 100);
  return `K${kwacha}`;
}

/**
 * Converts a whole-Kwacha value to its integer Ngwee equivalent.
 *
 * @example
 * kwachaToNgwee(500) // → 50000
 */
export function kwachaToNgwee(kwacha: number): number {
  return kwacha * 100;
}

/**
 * Formats a price range from two Ngwee values.
 * Uses an en-dash (–) as the separator.
 *
 * @example
 * formatPriceRange(20000, 85000) // → 'K200 – K850'
 */
export function formatPriceRange(minNgwee: number, maxNgwee: number): string {
  return `${ngweeToKwacha(minNgwee)} – ${ngweeToKwacha(maxNgwee)}`;
}
