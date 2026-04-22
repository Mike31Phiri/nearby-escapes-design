import { createFileRoute } from "@tanstack/react-router";
import { CollectionDetailPage } from "@/pages/collections/CollectionDetailPage";

export const Route = createFileRoute("/collections/$collectionId")({
  head: () => ({
    meta: [
      { title: "Collection — Wandr" },
      { name: "description", content: "View saved stays in a collection." },
      { property: "og:title", content: "Collection — Wandr" },
      { property: "og:description", content: "View saved stays in a collection." },
    ],
  }),
  component: CollectionDetailPage,
});
