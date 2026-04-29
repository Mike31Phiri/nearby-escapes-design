import { createFileRoute } from "@tanstack/react-router";
import { Step10Review } from "@/pages/host/new-property/Step10Review";

export const Route = createFileRoute("/host_/new-property/review")({
  head: () => ({
    meta: [
      { title: "Review listing — Wandr" },
      { name: "description", content: "Review and publish a new property." },
      { property: "og:title", content: "Review listing — Wandr" },
      { property: "og:description", content: "Review and publish a new property." },
    ],
  }),
  component: Step10Review,
});
