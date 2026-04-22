import { createFileRoute } from "@tanstack/react-router";
import { CommunityStandardsPage } from "@/pages/legal/CommunityStandardsPage";

export const Route = createFileRoute("/legal/community-standards")({
  head: () => ({
    meta: [
      { title: "Community standards — Wandr" },
      { name: "description", content: "Read Wandr community standards." },
      { property: "og:title", content: "Community standards — Wandr" },
      { property: "og:description", content: "Read Wandr community standards." },
    ],
  }),
  component: CommunityStandardsPage,
});
