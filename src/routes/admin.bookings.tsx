import { createFileRoute } from "@tanstack/react-router";
import { AdminBookingsPage } from "@/pages/admin/AdminBookingsPage";

export const Route = createFileRoute("/admin/bookings")({
  head: () => ({
    meta: [
      { title: "Booking Management — Nearby Escapes" },
      { name: "description", content: "View and manage all bookings." },
    ],
  }),
  component: AdminBookingsPage,
});
