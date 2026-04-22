import type { ExploreParams } from "@/types/explore";

export function parseExploreParams(search: URLSearchParams): ExploreParams {
  return { q: search.get("q") ?? undefined, location: search.get("location") ?? undefined };
}
