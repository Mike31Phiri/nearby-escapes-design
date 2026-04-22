import { apiRequest } from "./client";

export const createBooking = <T>(payload: T) => apiRequest("/bookings", { method: "POST", body: JSON.stringify(payload) });
