import { createFileRoute } from "@tanstack/react-router";
import { SharedCollectionPage } from "@/pages/collections/SharedCollectionPage";

export const Route = createFileRoute("/collections/shared/$shareId")({
  head: () => ({
    meta: [
      { title: "Shared collection — Wandr" },
      { name: "description", content: "View a shared travel collection." },
      { property: "og:title", content: "Shared collection — Wandr" },
      { property: "og:description", content: "View a shared travel collection." },
    ],
  }),
  component: SharedCollectionPage,
});
