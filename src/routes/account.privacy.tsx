import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "@/pages/account/PrivacyPage";

export const Route = createFileRoute("/account/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — Wandr" },
      { name: "description", content: "Control data, visibility and privacy preferences." },
      { property: "og:title", content: "Privacy — Wandr" },
      { property: "og:description", content: "Control data, visibility and privacy preferences." },
    ],
  }),
  component: PrivacyPage,
});
