import { createFileRoute } from "@tanstack/react-router";
import { ArticlePage } from "@/pages/support/ArticlePage";

export const Route = createFileRoute("/support/$articleId")({
  head: () => ({
    meta: [
      { title: "Help article — Wandr" },
      { name: "description", content: "Read help and support guidance." },
      { property: "og:title", content: "Help article — Wandr" },
      { property: "og:description", content: "Read help and support guidance." },
    ],
  }),
  component: ArticlePage,
});
