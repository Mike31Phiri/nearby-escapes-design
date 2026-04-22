import { createFileRoute } from "@tanstack/react-router";
import { SupportPage } from "@/pages/support/SupportPage";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support center — Wandr" },
      { name: "description", content: "Find support articles and contact options." },
      { property: "og:title", content: "Support center — Wandr" },
      { property: "og:description", content: "Find support articles and contact options." },
    ],
  }),
  component: SupportPage,
});
