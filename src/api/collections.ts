import { apiRequest } from "./client";
import type { Collection } from "@/types/collection";

export const getCollections = () =>
  apiRequest<Collection[]>("/collections");

export const createCollection = (payload: { name: string; stayIds?: string[]; isShared?: boolean }) =>
  apiRequest<Collection>("/collections", { method: "POST", body: JSON.stringify(payload) });

export const updateCollection = (id: string, payload: { name?: string; stayIds?: string[]; isShared?: boolean }) =>
  apiRequest<Collection>(`/collections/${id}`, { method: "PATCH", body: JSON.stringify(payload) });

export const deleteCollection = (id: string) =>
  apiRequest<void>(`/collections/${id}`, { method: "DELETE" });

export const getCollectionBySlug = (slug: string) =>
  apiRequest<Collection>(`/collections/${slug}`);
