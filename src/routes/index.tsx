import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/pages/home/HomePage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nearby Escapes — Discover Zambia's Best Stays & Travel" },
      {
        name: "description",
        content:
          "Book accommodations, buses, and curated travel packages across Zambia. From safari camps to city hotels.",
      },
      { property: "og:title", content: "Nearby Escapes — Discover Zambia" },
      {
        property: "og:description",
        content: "Book accommodations, buses, and packages across Zambia.",
      },
    ],
  }),
  component: HomePage,
});
