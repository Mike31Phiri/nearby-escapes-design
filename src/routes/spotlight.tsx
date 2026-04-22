import { createFileRoute } from "@tanstack/react-router";
import { SpotlightHomePage } from "@/pages/spotlight/SpotlightHomePage";

export const Route = createFileRoute("/spotlight")({
  head: () => ({
    meta: [
      { title: "Spotlight — Wandr" },
      { name: "description", content: "Featured stays and local stories." },
      { property: "og:title", content: "Spotlight — Wandr" },
      { property: "og:description", content: "Featured stays and local stories." },
    ],
  }),
  component: SpotlightHomePage,
});
