import { apiRequest } from "./client";
import type { Stay } from "@/types/stay";

export const getRecommendations = () =>
  apiRequest<Stay[]>("/recommendations");
