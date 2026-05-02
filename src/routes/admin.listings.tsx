import { createFileRoute } from "@tanstack/react-router";
import { AdminListingsPage } from "@/pages/admin/AdminListingsPage";

export const Route = createFileRoute("/admin/listings")({
  head: () => ({
    meta: [
      { title: "Listing Management — Nearby Escapes" },
      { name: "description", content: "Moderate and manage property listings." },
    ],
  }),
  component: AdminListingsPage,
});
