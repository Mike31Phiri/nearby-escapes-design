/**
 * Slug generation and conversion utilities for Nearby Escapes.
 * Slugs are used in URLs for listings, provinces, and categories.
 */

/**
 * Converts arbitrary text to a URL-safe slug.
 * - Lowercases the string
 * - Strips special characters (retains hyphens between words)
 * - Replaces whitespace with hyphens
 * - Collapses consecutive hyphens
 *
 * @example
 * generateSlug('Farm Stay & Lodge') // → 'farm-stay-lodge'
 * generateSlug('Eco Camp!')        // → 'eco-camp'
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // strip special chars, keep alphanum, spaces, hyphens
    .trim()
    .replace(/\s+/g, "-") // spaces → hyphens
    .replace(/-+/g, "-"); // collapse consecutive hyphens
}

/**
 * Converts a slug back to title-cased text.
 * Hyphens are replaced with spaces and each word is capitalised.
 *
 * @example
 * slugToTitle('farm-stay-lodge') // → 'Farm Stay Lodge'
 */
export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Converts a province label to its slug form.
 * Preserves existing hyphens (e.g. 'North-Western' stays hyphenated).
 *
 * @example
 * provinceToSlug('North-Western') // → 'north-western'
 * provinceToSlug('Lusaka')        // → 'lusaka'
 */
export function provinceToSlug(province: string): string {
  return province.toLowerCase().replace(/\s+/g, "-");
}
