import { createFileRoute } from "@tanstack/react-router";
import { HostDashboardPage } from "@/pages/host/HostDashboardPage";

export const Route = createFileRoute("/host")({
  head: () => ({
    meta: [
      { title: "Host dashboard — Wandr" },
      { name: "description", content: "Manage your hosting workspace." },
      { property: "og:title", content: "Host dashboard — Wandr" },
      { property: "og:description", content: "Manage your hosting workspace." },
    ],
  }),
  component: HostDashboardPage,
});
