import { apiRequest } from "./client";
import type { Stay } from "@/types/stay";

export const getStays = () => apiRequest<Stay[]>("/stays");
export const getStay = (id: string) => apiRequest<Stay>(`/stays/${id}`);
