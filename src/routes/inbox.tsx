import { createFileRoute } from "@tanstack/react-router";
import { InboxPage } from "@/pages/inbox/InboxPage";

export const Route = createFileRoute("/inbox")({
  head: () => ({
    meta: [
      { title: "Inbox — Wandr" },
      { name: "description", content: "Manage travel and host messages." },
      { property: "og:title", content: "Inbox — Wandr" },
      { property: "og:description", content: "Manage travel and host messages." },
    ],
  }),
  component: InboxPage,
});
