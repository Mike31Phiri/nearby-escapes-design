import { useMemo } from "react";
import type { ExploreParams } from "@/types/explore";

export function useExplore(params: ExploreParams = {}) {
  return useMemo(() => params, [params]);
}
