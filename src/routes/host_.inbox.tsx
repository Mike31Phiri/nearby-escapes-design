import { createFileRoute } from "@tanstack/react-router";
import { HostInboxPage } from "@/pages/host/HostInboxPage";

export const Route = createFileRoute("/host_/inbox")({
  head: () => ({
    meta: [
      { title: "Host inbox — Wandr" },
      { name: "description", content: "Manage host messages and guest questions." },
      { property: "og:title", content: "Host inbox — Wandr" },
      { property: "og:description", content: "Manage host messages and guest questions." },
    ],
  }),
  component: HostInboxPage,
});
