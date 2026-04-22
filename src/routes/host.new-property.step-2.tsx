import { createFileRoute } from "@tanstack/react-router";
import { Step2Location } from "@/pages/host/new-property/Step2Location";

export const Route = createFileRoute("/host/new-property/step-2")({
  head: () => ({
    meta: [
      { title: "Location — Wandr" },
      { name: "description", content: "Add listing location and arrival guidance." },
      { property: "og:title", content: "Location — Wandr" },
      { property: "og:description", content: "Add listing location and arrival guidance." },
    ],
  }),
  component: Step2Location,
});
