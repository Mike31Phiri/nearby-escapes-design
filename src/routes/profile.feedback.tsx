import { createFileRoute } from "@tanstack/react-router";
import { FeedbackPage } from "@/pages/profile/FeedbackPage";

export const Route = createFileRoute("/profile/feedback")({
  head: () => ({
    meta: [
      { title: "Profile feedback — Wandr" },
      { name: "description", content: "View reviews and feedback." },
      { property: "og:title", content: "Profile feedback — Wandr" },
      { property: "og:description", content: "View reviews and feedback." },
    ],
  }),
  component: FeedbackPage,
});
