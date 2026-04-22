import { createFileRoute } from "@tanstack/react-router";
import { StayDetailPage } from "@/pages/stays/StayDetailPage";

export const Route = createFileRoute("/stays/$stayId")({
  head: () => ({
    meta: [
      { title: "Stay detail — Wandr" },
      { name: "description", content: "Explore stay photos, amenities and booking details." },
      { property: "og:title", content: "Stay detail — Wandr" },
      { property: "og:description", content: "Explore stay photos, amenities and booking details." },
    ],
  }),
  component: StayDetailPage,
});
