import { createFileRoute } from "@tanstack/react-router";
import { NotificationsPage } from "@/pages/account/NotificationsPage";

export const Route = createFileRoute("/account/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Wandr" },
      { name: "description", content: "Choose booking and account notification preferences." },
      { property: "og:title", content: "Notifications — Wandr" },
      { property: "og:description", content: "Choose booking and account notification preferences." },
    ],
  }),
  component: NotificationsPage,
});
