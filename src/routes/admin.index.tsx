import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Nearby Escapes" },
      { name: "description", content: "Manage users, listings, and bookings." },
    ],
  }),
  component: AdminDashboardPage,
});
