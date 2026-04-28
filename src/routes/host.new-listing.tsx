import { createFileRoute } from "@tanstack/react-router";
import { NewListingPage } from "@/pages/host/NewListingPage";

export const Route = createFileRoute("/host/new-listing")({
  head: () => ({
    meta: [
      { title: "Create listing — Nearby Escapes" },
      { name: "description", content: "Choose what type of listing to create." },
      { property: "og:title", content: "Create listing — Nearby Escapes" },
      { property: "og:description", content: "Choose what type of listing to create." },
    ],
  }),
  component: NewListingPage,
});
