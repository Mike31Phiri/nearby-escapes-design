import { createFileRoute } from "@tanstack/react-router";
import { PreferencesPage } from "@/pages/account/PreferencesPage";

export const Route = createFileRoute("/account/preferences")({
  head: () => ({
    meta: [
      { title: "Preferences — Wandr" },
      { name: "description", content: "Set travel, language and currency preferences." },
      { property: "og:title", content: "Preferences — Wandr" },
      { property: "og:description", content: "Set travel, language and currency preferences." },
    ],
  }),
  component: PreferencesPage,
});
