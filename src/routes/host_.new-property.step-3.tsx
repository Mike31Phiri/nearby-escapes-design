import { createFileRoute } from "@tanstack/react-router";
import { Step3FloorPlan } from "@/pages/host/new-property/Step3FloorPlan";

export const Route = createFileRoute("/host_/new-property/step-3")({
  head: () => ({
    meta: [
      { title: "Floor plan — Wandr" },
      { name: "description", content: "Set rooms, beds and guest capacity." },
      { property: "og:title", content: "Floor plan — Wandr" },
      { property: "og:description", content: "Set rooms, beds and guest capacity." },
    ],
  }),
  component: Step3FloorPlan,
});
