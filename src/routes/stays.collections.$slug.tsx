import { createFileRoute } from "@tanstack/react-router";
import { CollectionPage } from "@/pages/stays/CollectionPage";

export const Route = createFileRoute("/stays/collections/$slug")({
  head: () => ({
    meta: [
      { title: "Stay collection — Wandr" },
      { name: "description", content: "Browse a curated stay collection." },
      { property: "og:title", content: "Stay collection — Wandr" },
      { property: "og:description", content: "Browse a curated stay collection." },
    ],
  }),
  component: CollectionPage,
});
