import { createFileRoute } from "@tanstack/react-router";
import { AdminSettingsPage } from "@/pages/admin/AdminSettingsPage";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Admin Settings — Nearby Escapes" },
      { name: "description", content: "Configure platform settings." },
    ],
  }),
  component: AdminSettingsPage,
});
