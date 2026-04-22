import { apiRequest } from "./client";

export const createPaymentIntent = <T>(payload: T) => apiRequest("/payments/intent", { method: "POST", body: JSON.stringify(payload) });
