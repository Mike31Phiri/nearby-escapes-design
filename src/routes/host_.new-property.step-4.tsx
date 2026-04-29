import { createFileRoute } from "@tanstack/react-router";
import { Step4Amenities } from "@/pages/host/new-property/Step4Amenities";

export const Route = createFileRoute("/host_/new-property/step-4")({
  head: () => ({
    meta: [
      { title: "Amenities — Wandr" },
      { name: "description", content: "Select amenities and accessibility details." },
      { property: "og:title", content: "Amenities — Wandr" },
      { property: "og:description", content: "Select amenities and accessibility details." },
    ],
  }),
  component: Step4Amenities,
});
