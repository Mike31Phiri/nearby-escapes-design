import { createFileRoute } from "@tanstack/react-router";
import { CollectionsPage } from "@/pages/collections/CollectionsPage";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections — Wandr" },
      { name: "description", content: "Organize and revisit saved places." },
      { property: "og:title", content: "Collections — Wandr" },
      { property: "og:description", content: "Organize and revisit saved places." },
    ],
  }),
  component: CollectionsPage,
});
