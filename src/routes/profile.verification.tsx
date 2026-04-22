import { createFileRoute } from "@tanstack/react-router";
import { VerificationPage } from "@/pages/profile/VerificationPage";

export const Route = createFileRoute("/profile/verification")({
  head: () => ({
    meta: [
      { title: "Verification — Wandr" },
      { name: "description", content: "Manage identity and trust verification." },
      { property: "og:title", content: "Verification — Wandr" },
      { property: "og:description", content: "Manage identity and trust verification." },
    ],
  }),
  component: VerificationPage,
});
