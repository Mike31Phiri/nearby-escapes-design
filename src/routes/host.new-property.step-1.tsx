import { createFileRoute } from "@tanstack/react-router";
import { Step1PropertyType } from "@/pages/host/new-property/Step1PropertyType";

export const Route = createFileRoute("/host/new-property/step-1")({
  head: () => ({
    meta: [
      { title: "Property type — Wandr" },
      { name: "description", content: "Choose the property type for a new listing." },
      { property: "og:title", content: "Property type — Wandr" },
      { property: "og:description", content: "Choose the property type for a new listing." },
    ],
  }),
  component: Step1PropertyType,
});
