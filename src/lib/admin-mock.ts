// Mock data for the admin dashboard. Replace with API calls when backend is ready.

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  role: "guest" | "host" | "admin";
  status: "active" | "suspended";
  joinedAt: string;
};

export type AdminBooking = {
  id: string;
  reference: string;
  guest: string;
  listing: string;
  checkIn: string;
  checkOut: string;
  amount: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
};

export type AdminPayment = {
  id: string;
  bookingRef: string;
  payer: string;
  method: "Card" | "Mobile Money" | "Bank Transfer";
  amount: number;
  status: "paid" | "pending" | "refunded";
  date: string;
};

export type AdminCommission = {
  id: string;
  host: string;
  bookingRef: string;
  gross: number;
  rate: number; // percent
  commission: number;
  payoutStatus: "pending" | "paid";
  date: string;
};

export const adminUsers: AdminUser[] = [
  { id: "u1", fullName: "Chanda Mwale", email: "chanda@nearbyescapes.zm", role: "host", status: "active", joinedAt: "2024-08-12" },
  { id: "u2", fullName: "Bwalya Phiri", email: "bwalya@gmail.com", role: "guest", status: "active", joinedAt: "2024-09-03" },
  { id: "u3", fullName: "Mutinta Hamooya", email: "mutinta@yahoo.com", role: "guest", status: "active", joinedAt: "2024-10-21" },
  { id: "u4", fullName: "Joseph Banda", email: "joseph.banda@host.zm", role: "host", status: "active", joinedAt: "2024-06-30" },
  { id: "u5", fullName: "Patricia Lungu", email: "trish@example.com", role: "guest", status: "suspended", joinedAt: "2025-01-14" },
  { id: "u6", fullName: "Admin Root", email: "admin@nearbyescapes.zm", role: "admin", status: "active", joinedAt: "2024-01-01" },
];

export const adminBookings: AdminBooking[] = [
  { id: "b1", reference: "NE-10245", guest: "Bwalya Phiri", listing: "Mosi-oa-Tunya Lodge", checkIn: "2025-04-22", checkOut: "2025-04-25", amount: 660, status: "confirmed" },
  { id: "b2", reference: "NE-10246", guest: "Mutinta Hamooya", listing: "Skyline Boutique Suite", checkIn: "2025-04-19", checkOut: "2025-04-21", amount: 290, status: "completed" },
  { id: "b3", reference: "NE-10247", guest: "Patricia Lungu", listing: "Kafue Bush Camp", checkIn: "2025-05-02", checkOut: "2025-05-06", amount: 480, status: "pending" },
  { id: "b4", reference: "NE-10248", guest: "Joseph Banda", listing: "Riverside Guesthouse", checkIn: "2025-04-15", checkOut: "2025-04-17", amount: 180, status: "cancelled" },
  { id: "b5", reference: "NE-10249", guest: "Chanda Mwale", listing: "Mosi-oa-Tunya Lodge", checkIn: "2025-05-10", checkOut: "2025-05-13", amount: 660, status: "confirmed" },
];

export const adminPayments: AdminPayment[] = [
  { id: "p1", bookingRef: "NE-10245", payer: "Bwalya Phiri", method: "Card", amount: 660, status: "paid", date: "2025-04-10" },
  { id: "p2", bookingRef: "NE-10246", payer: "Mutinta Hamooya", method: "Mobile Money", amount: 290, status: "paid", date: "2025-04-12" },
  { id: "p3", bookingRef: "NE-10247", payer: "Patricia Lungu", method: "Bank Transfer", amount: 480, status: "pending", date: "2025-04-18" },
  { id: "p4", bookingRef: "NE-10248", payer: "Joseph Banda", method: "Card", amount: 180, status: "refunded", date: "2025-04-09" },
  { id: "p5", bookingRef: "NE-10249", payer: "Chanda Mwale", method: "Mobile Money", amount: 660, status: "paid", date: "2025-04-15" },
];

export const adminCommissions: AdminCommission[] = [
  { id: "c1", host: "Joseph Banda", bookingRef: "NE-10245", gross: 660, rate: 12, commission: 79.2, payoutStatus: "paid", date: "2025-04-11" },
  { id: "c2", host: "Chanda Mwale", bookingRef: "NE-10246", gross: 290, rate: 12, commission: 34.8, payoutStatus: "paid", date: "2025-04-13" },
  { id: "c3", host: "Joseph Banda", bookingRef: "NE-10247", gross: 480, rate: 12, commission: 57.6, payoutStatus: "pending", date: "2025-04-18" },
  { id: "c4", host: "Chanda Mwale", bookingRef: "NE-10249", gross: 660, rate: 12, commission: 79.2, payoutStatus: "pending", date: "2025-04-16" },
];

export const adminMetrics = {
  totalRevenue: adminPayments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0),
  totalBookings: adminBookings.length,
  activeUsers: adminUsers.filter((u) => u.status === "active").length,
  pendingPayouts: adminCommissions.filter((c) => c.payoutStatus === "pending").reduce((s, c) => s + c.commission, 0),
  revenueByMonth: [
    { month: "Nov", value: 4200 },
    { month: "Dec", value: 5100 },
    { month: "Jan", value: 4800 },
    { month: "Feb", value: 6200 },
    { month: "Mar", value: 7400 },
    { month: "Apr", value: 8900 },
  ],
};
