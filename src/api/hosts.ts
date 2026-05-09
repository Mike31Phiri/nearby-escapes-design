import { apiRequest } from "./client";
import type { Host } from "@/types/host";

export const registerAsHost = (payload: { businessName: string }) =>
  apiRequest<Host>("/hosts", { method: "POST", body: JSON.stringify(payload) });

export const getMyHostProfile = () =>
  apiRequest<Host>("/hosts/me");

export const getHostProfile = (id: string) =>
  apiRequest<Host>(`/hosts/${id}`);
