import { createFileRoute } from "@tanstack/react-router";
import { PerformancePage } from "@/pages/host/PerformancePage";

export const Route = createFileRoute("/host/performance")({
  head: () => ({
    meta: [
      { title: "Performance — Wandr" },
      { name: "description", content: "Measure listing visibility and conversion." },
      { property: "og:title", content: "Performance — Wandr" },
      { property: "og:description", content: "Measure listing visibility and conversion." },
    ],
  }),
  component: PerformancePage,
});
