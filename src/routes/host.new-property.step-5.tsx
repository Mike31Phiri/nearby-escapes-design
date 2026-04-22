import { createFileRoute } from "@tanstack/react-router";
import { Step5PhotoTour } from "@/pages/host/new-property/Step5PhotoTour";

export const Route = createFileRoute("/host/new-property/step-5")({
  head: () => ({
    meta: [
      { title: "Photo tour — Wandr" },
      { name: "description", content: "Add listing photos and room context." },
      { property: "og:title", content: "Photo tour — Wandr" },
      { property: "og:description", content: "Add listing photos and room context." },
    ],
  }),
  component: Step5PhotoTour,
});
