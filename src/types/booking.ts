export type Booking = { id: string; stayId: string; checkIn: string; checkOut: string; guests: number; status: "pending" | "confirmed" | "cancelled" };
