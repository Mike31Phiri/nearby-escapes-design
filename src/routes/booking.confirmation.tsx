import { createFileRoute } from "@tanstack/react-router";
import { ConfirmationPage } from "@/pages/booking/ConfirmationPage";

export const Route = createFileRoute("/booking/confirmation")({
  head: () => ({
    meta: [
      { title: "Booking confirmed — Wandr" },
      { name: "description", content: "View booking confirmation and next steps." },
      { property: "og:title", content: "Booking confirmed — Wandr" },
      { property: "og:description", content: "View booking confirmation and next steps." },
    ],
  }),
  component: ConfirmationPage,
});
