import { createFileRoute } from "@tanstack/react-router";
import { PropertiesPage } from "@/pages/host/PropertiesPage";

export const Route = createFileRoute("/host/properties")({
  head: () => ({
    meta: [
      { title: "Properties — Wandr" },
      { name: "description", content: "Manage host listings and property details." },
      { property: "og:title", content: "Properties — Wandr" },
      { property: "og:description", content: "Manage host listings and property details." },
    ],
  }),
  component: PropertiesPage,
});
