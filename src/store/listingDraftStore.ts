import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/safeStorage";
import type { ListingDraft } from "@/types/listing";

interface ListingDraftState {
  /** All drafts keyed by draft id. Persisted to localStorage (acts as the offline mirror). */
  drafts: Record<string, ListingDraft>;
  upsertDraft: (draft: ListingDraft) => void;
  removeDraft: (id: string) => void;
  reset: () => void;
}

export const useListingDraftStore = create<ListingDraftState>()(
  persist(
    (set) => ({
      drafts: {},

      upsertDraft: (draft) => set((state) => ({ drafts: { ...state.drafts, [draft.id]: draft } })),

      removeDraft: (id) =>
        set((state) => {
          const next = { ...state.drafts };
          delete next[id];
          return { drafts: next };
        }),

      reset: () => set({ drafts: {} }),
    }),
    {
      name: "nearby-escapes-listing-drafts",
      storage: createJSONStorage(() => safeLocalStorage),
    },
  ),
);

/** Reactive selector — all drafts belonging to a host. */
export const selectHostDrafts = (hostId: string) => (state: ListingDraftState) =>
  Object.values(state.drafts).filter((d) => d.hostId === hostId);
