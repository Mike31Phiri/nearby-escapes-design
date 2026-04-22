import type { ExploreParams } from "@/types/explore";

export type ExploreState = ExploreParams & { view: "grid" | "split" };
export const initialExploreState: ExploreState = { view: "grid" };
