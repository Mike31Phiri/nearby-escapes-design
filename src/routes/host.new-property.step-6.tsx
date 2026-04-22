import { createFileRoute } from "@tanstack/react-router";
import { Step6Title } from "@/pages/host/new-property/Step6Title";

export const Route = createFileRoute("/host/new-property/step-6")({
  head: () => ({
    meta: [
      { title: "Listing title — Wandr" },
      { name: "description", content: "Write a memorable listing title." },
      { property: "og:title", content: "Listing title — Wandr" },
      { property: "og:description", content: "Write a memorable listing title." },
    ],
  }),
  component: Step6Title,
});
