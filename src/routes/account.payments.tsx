import { createFileRoute } from "@tanstack/react-router";
import { PaymentsPage } from "@/pages/account/PaymentsPage";

export const Route = createFileRoute("/account/payments")({
  head: () => ({
    meta: [
      { title: "Payments — Wandr" },
      { name: "description", content: "Manage payment methods and payout details." },
      { property: "og:title", content: "Payments — Wandr" },
      { property: "og:description", content: "Manage payment methods and payout details." },
    ],
  }),
  component: PaymentsPage,
});
