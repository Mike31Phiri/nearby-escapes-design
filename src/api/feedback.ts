import { apiRequest } from "./client";

export const submitFeedback = <T>(payload: T) =>
  apiRequest("/feedback", { method: "POST", body: JSON.stringify(payload) });
