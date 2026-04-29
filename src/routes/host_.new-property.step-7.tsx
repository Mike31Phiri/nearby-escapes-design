import { createFileRoute } from "@tanstack/react-router";
import { Step7Description } from "@/pages/host/new-property/Step7Description";

export const Route = createFileRoute("/host_/new-property/step-7")({
  head: () => ({
    meta: [
      { title: "Description — Wandr" },
      { name: "description", content: "Describe the property and guest experience." },
      { property: "og:title", content: "Description — Wandr" },
      { property: "og:description", content: "Describe the property and guest experience." },
    ],
  }),
  component: Step7Description,
});
