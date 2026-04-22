import { createFileRoute } from "@tanstack/react-router";
import { SpotlightDetailPage } from "@/pages/spotlight/SpotlightDetailPage";

export const Route = createFileRoute("/spotlight/$storyId")({
  head: () => ({
    meta: [
      { title: "Spotlight story — Wandr" },
      { name: "description", content: "Read a featured travel story." },
      { property: "og:title", content: "Spotlight story — Wandr" },
      { property: "og:description", content: "Read a featured travel story." },
    ],
  }),
  component: SpotlightDetailPage,
});
