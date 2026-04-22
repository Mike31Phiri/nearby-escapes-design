import { createFileRoute } from "@tanstack/react-router";
import { EarningsPage } from "@/pages/host/EarningsPage";

export const Route = createFileRoute("/host/earnings")({
  head: () => ({
    meta: [
      { title: "Earnings — Wandr" },
      { name: "description", content: "Track host earnings and payouts." },
      { property: "og:title", content: "Earnings — Wandr" },
      { property: "og:description", content: "Track host earnings and payouts." },
    ],
  }),
  component: EarningsPage,
});
