import { createFileRoute } from "@tanstack/react-router";
import { NewRidePage } from "@/pages/host/NewRidePage";

export const Route = createFileRoute("/host/new-ride")({
  head: () => ({
    meta: [
      { title: "New ride listing — Nearby Escapes" },
      { name: "description", content: "Create a new transport route listing." },
      { property: "og:title", content: "New ride listing — Nearby Escapes" },
      { property: "og:description", content: "Create a new transport route listing." },
    ],
  }),
  component: NewRidePage,
});
