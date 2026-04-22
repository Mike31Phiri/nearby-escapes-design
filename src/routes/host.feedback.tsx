import { createFileRoute } from "@tanstack/react-router";
import { HostFeedbackPage } from "@/pages/host/HostFeedbackPage";

export const Route = createFileRoute("/host/feedback")({
  head: () => ({
    meta: [
      { title: "Guest feedback — Wandr" },
      { name: "description", content: "Review guest feedback and ratings." },
      { property: "og:title", content: "Guest feedback — Wandr" },
      { property: "og:description", content: "Review guest feedback and ratings." },
    ],
  }),
  component: HostFeedbackPage,
});
