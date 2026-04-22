import { createFileRoute } from "@tanstack/react-router";
import { BookingPage } from "@/pages/booking/BookingPage";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Booking — Wandr" },
      { name: "description", content: "Review trip details before checkout." },
      { property: "og:title", content: "Booking — Wandr" },
      { property: "og:description", content: "Review trip details before checkout." },
    ],
  }),
  component: BookingPage,
});
