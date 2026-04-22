import { createFileRoute } from "@tanstack/react-router";
import { PaymentPage } from "@/pages/booking/PaymentPage";

export const Route = createFileRoute("/booking/payment")({
  head: () => ({
    meta: [
      { title: "Payment — Wandr" },
      { name: "description", content: "Complete secure checkout for your booking." },
      { property: "og:title", content: "Payment — Wandr" },
      { property: "og:description", content: "Complete secure checkout for your booking." },
    ],
  }),
  component: PaymentPage,
});
