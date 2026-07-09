/**
 * locationSlug.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Maps any known location slug to structured context used by the stays page
 * for breadcrumbs, page titles, and filtering.
 *
 * Resolution order: attraction → city → province → country (zambia)
 */

import {
  ATTRACTIONS,
  CITIES,
  PROVINCES,
  getProvince,
  getCity,
  getAttraction,
  type AttractionData,
  type CityData,
  type ProvinceData,
} from "@/lib/mock-explore-data";

export type LocationType = "country" | "province" | "city" | "attraction";

export interface ResolvedLocation {
  type: LocationType;
  slug: string;
  /** Display name of the current level (e.g. "Victoria Falls") */
  displayName: string;
  /** Province data if resolved at province level or below */
  province?: ProvinceData;
  /** City data if resolved at city level or below */
  city?: CityData;
  /** Attraction data if resolved at attraction level */
  attraction?: AttractionData;
}

/**
 * Breadcrumb item used for building the trail in the UI.
 */
export interface BreadcrumbItem {
  label: string;
  href?: string; // undefined means it's the current (last) item
}

/**
 * Resolve a URL slug to a structured location context.
 * Returns `null` for completely unknown slugs (triggers 404 in route).
 */
export function resolveLocationSlug(slug: string): ResolvedLocation | null {
  // ── Country fallback ──────────────────────────────────────────────────────
  if (slug === "zambia") {
    return { type: "country", slug: "zambia", displayName: "Zambia" };
  }

  // ── Attraction (most specific) ────────────────────────────────────────────
  const attraction = getAttraction(slug);
  if (attraction) {
    const city = getCity(attraction.city);
    const province = getProvince(attraction.province);
    return {
      type: "attraction",
      slug,
      displayName: attraction.name,
      province: province ?? undefined,
      city: city ?? undefined,
      attraction,
    };
  }

  // ── City ──────────────────────────────────────────────────────────────────
  const city = getCity(slug);
  if (city) {
    const province = getProvince(city.province);
    return {
      type: "city",
      slug,
      displayName: city.name,
      province: province ?? undefined,
      city,
    };
  }

  // ── Province ──────────────────────────────────────────────────────────────
  const province = getProvince(slug);
  if (province) {
    return { type: "province", slug, displayName: province.name, province };
  }

  return null;
}

/**
 * Build the breadcrumb trail for the stays page from a resolved location.
 * The last item (Stays) has no href — it is the current page.
 */
export function buildStaysBreadcrumbs(location: ResolvedLocation): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/explore" },
  ];

  if (location.type === "country") {
    crumbs.push({ label: "Zambia", href: "/explore" });
  }

  if (location.province) {
    crumbs.push({
      label: location.province.name,
      href: `/explore/${location.province.id}`,
    });
  }

  if (location.city) {
    crumbs.push({
      label: location.city.name,
      href: `/explore/${location.city.province}/${location.city.id}`,
    });
  }

  if (location.attraction) {
    crumbs.push({
      label: location.attraction.name,
      href: `/explore/${location.attraction.province}/${location.attraction.city}/${location.attraction.id}`,
    });
  }

  // Current page — no href
  crumbs.push({ label: "Stays" });

  return crumbs;
}

/**
 * Build the page headline for the stays page (h1 text).
 */
export function buildStaysHeadline(location: ResolvedLocation): string {
  switch (location.type) {
    case "country":
      return "Stays in Zambia";
    case "province":
      return `Stays in ${location.displayName}`;
    case "city":
      return `Stays in ${location.displayName}`;
    case "attraction":
      return `Stays near ${location.displayName}`;
  }
}

/**
 * Generate the canonical `/{slug}/stays` URL for a given location slug.
 */
export function staysByLocation(slug: string): string {
  return `/${slug}/stays`;
}

/**
 * Return known slugs for use in generateStaticParams.
 */
export function getAllLocationSlugs(): string[] {
  return [
    "zambia",
    ...PROVINCES.map((p) => p.id),
    ...CITIES.map((c) => c.id),
    ...ATTRACTIONS.map((a) => a.id),
  ];
}
