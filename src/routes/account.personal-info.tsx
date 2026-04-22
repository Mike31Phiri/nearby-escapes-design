import { createFileRoute } from "@tanstack/react-router";
import { PersonalInfoPage } from "@/pages/account/PersonalInfoPage";

export const Route = createFileRoute("/account/personal-info")({
  head: () => ({
    meta: [
      { title: "Personal information — Wandr" },
      { name: "description", content: "Update your traveler profile and contact details." },
      { property: "og:title", content: "Personal information — Wandr" },
      { property: "og:description", content: "Update your traveler profile and contact details." },
    ],
  }),
  component: PersonalInfoPage,
});
