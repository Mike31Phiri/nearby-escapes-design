import { createFileRoute } from "@tanstack/react-router";
import { AccessibilityPage } from "@/pages/account/AccessibilityPage";

export const Route = createFileRoute("/account/accessibility")({
  head: () => ({
    meta: [
      { title: "Accessibility — Wandr" },
      { name: "description", content: "Set accessibility preferences for travel and the app." },
      { property: "og:title", content: "Accessibility — Wandr" },
      { property: "og:description", content: "Set accessibility preferences for travel and the app." },
    ],
  }),
  component: AccessibilityPage,
});
