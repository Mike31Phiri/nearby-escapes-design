import { createFileRoute } from "@tanstack/react-router";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [
      { title: "User Management — Nearby Escapes" },
      { name: "description", content: "Manage user accounts and permissions." },
    ],
  }),
  component: AdminUsersPage,
});
