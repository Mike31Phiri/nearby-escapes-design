import { createFileRoute } from "@tanstack/react-router";
import { NewGemPage } from "@/pages/host/NewGemPage";

export const Route = createFileRoute("/host_/new-gem")({
  head: () => ({
    meta: [
      { title: "New gem listing — Nearby Escapes" },
      { name: "description", content: "Create a new hidden gem or experience listing." },
      { property: "og:title", content: "New gem listing — Nearby Escapes" },
      { property: "og:description", content: "Create a new hidden gem or experience listing." },
    ],
  }),
  component: NewGemPage,
});
