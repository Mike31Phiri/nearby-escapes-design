import { createFileRoute } from "@tanstack/react-router";
import { Step8Pricing } from "@/pages/host/new-property/Step8Pricing";

export const Route = createFileRoute("/host_/new-property/step-8")({
  head: () => ({
    meta: [
      { title: "Pricing — Wandr" },
      { name: "description", content: "Set nightly pricing and fees." },
      { property: "og:title", content: "Pricing — Wandr" },
      { property: "og:description", content: "Set nightly pricing and fees." },
    ],
  }),
  component: Step8Pricing,
});
