import { createFileRoute } from "@tanstack/react-router";
import { AccountPage } from "@/pages/account/AccountPage";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account — Wandr" },
      { name: "description", content: "Manage your Wandr account." },
      { property: "og:title", content: "Account — Wandr" },
      { property: "og:description", content: "Manage your Wandr account." },
    ],
  }),
  component: AccountPage,
});
