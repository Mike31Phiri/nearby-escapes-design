import { createFileRoute } from "@tanstack/react-router";
import { SecurityPage } from "@/pages/account/SecurityPage";

export const Route = createFileRoute("/account/security")({
  head: () => ({
    meta: [
      { title: "Login and security — Wandr" },
      { name: "description", content: "Manage password, sessions and account security." },
      { property: "og:title", content: "Login and security — Wandr" },
      { property: "og:description", content: "Manage password, sessions and account security." },
    ],
  }),
  component: SecurityPage,
});
