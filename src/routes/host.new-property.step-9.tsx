import { createFileRoute } from "@tanstack/react-router";
import { Step9Availability } from "@/pages/host/new-property/Step9Availability";

export const Route = createFileRoute("/host/new-property/step-9")({
  head: () => ({
    meta: [
      { title: "Availability — Wandr" },
      { name: "description", content: "Open dates and set booking rules." },
      { property: "og:title", content: "Availability — Wandr" },
      { property: "og:description", content: "Open dates and set booking rules." },
    ],
  }),
  component: Step9Availability,
});
