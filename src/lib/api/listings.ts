// Listing drafts API facade using listingDraftStore.

import { useListingDraftStore } from "@/store/listingDraftStore";
import type { ListingDraft, ListingType } from "@/types/listing";

const HOST_ID = "host-1"; // TODO: derive from the authenticated host session

/** Human-friendly draft title derived from the form snapshot. */
export function deriveDraftTitle(type: ListingType, form: Record<string, unknown>): string {
  if (type === "stay") {
    const t = form.title;
    return typeof t === "string" && t.trim() ? t.trim() : "Untitled stay";
  }
  if (type === "transport") {
    const make = form.make;
    const model = form.model;
    if (typeof make === "string" && make.trim()) {
      return `${make.trim()}${typeof model === "string" && model.trim() ? ` ${model.trim()}` : ""}`;
    }
    return "Untitled vehicle";
  }
  const t = form.title;
  return typeof t === "string" && t.trim() ? t.trim() : "Untitled experience";
}

const generateId = () => `lst_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

const now = () => new Date().toISOString();

/** Create a new draft listing with the given type (status: draft). Instant client-side state. */
export async function createDraftListing(type: ListingType): Promise<ListingDraft> {
  const draft: ListingDraft = {
    id: generateId(),
    hostId: HOST_ID,
    type,
    status: "draft",
    form: {},
    currentStep: 0,
    progressPercent: 0,
    createdAt: now(),
    updatedAt: now(),
  };
  useListingDraftStore.getState().upsertDraft(draft);
  return draft;
}

export interface UpdateDraftPatch {
  form?: Record<string, unknown>;
  currentStep?: number;
  progressPercent?: number;
  title?: string;
}

/** Partial-update a draft (immediate state update). */
export async function updateDraftListing(
  id: string,
  patch: UpdateDraftPatch,
): Promise<ListingDraft> {
  const store = useListingDraftStore.getState();
  const existing = store.drafts[id];
  if (!existing) throw new Error("Draft not found");

  const merged: ListingDraft = {
    ...existing,
    ...patch,
    form: patch.form ? { ...existing.form, ...patch.form } : existing.form,
    title:
      patch.title !== undefined
        ? patch.title
        : patch.form
          ? deriveDraftTitle(existing.type, { ...existing.form, ...patch.form })
          : existing.title,
    updatedAt: now(),
  };
  store.upsertDraft(merged);
  return merged;
}

/** Publish a draft — marks it live and returns the published draft. */
export async function publishListing(id: string): Promise<ListingDraft> {
  const store = useListingDraftStore.getState();
  const existing = store.drafts[id];
  if (!existing) throw new Error("Draft not found");

  const published: ListingDraft = {
    ...existing,
    status: "live",
    progressPercent: 100,
    updatedAt: now(),
  };
  store.upsertDraft(published);
  return published;
}

/** Fetch a single draft by id (instant local store lookup with localStorage fallback). */
export async function getDraftListing(id: string): Promise<ListingDraft | null> {
  const draft = useListingDraftStore.getState().drafts[id];

  // LocalStorage fallback: read the raw persisted snapshot directly (kept in
  // sync by zustand's persist middleware) in case the in-memory map was reset.
  if (!draft && typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem("nearby-escapes-listing-drafts");
      if (raw) {
        const parsed = JSON.parse(raw) as { state?: { drafts?: Record<string, ListingDraft> } };
        const fallback = parsed?.state?.drafts?.[id] ?? null;
        if (fallback) useListingDraftStore.getState().upsertDraft(fallback);
        return fallback;
      }
    } catch {
      // ignore malformed storage — treat as missing draft
    }
  }

  return draft ?? null;
}

/** List all drafts for a host (most recently updated first). */
export async function listHostDrafts(hostId: string = HOST_ID): Promise<ListingDraft[]> {
  return Object.values(useListingDraftStore.getState().drafts)
    .filter((d) => d.hostId === hostId)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}
