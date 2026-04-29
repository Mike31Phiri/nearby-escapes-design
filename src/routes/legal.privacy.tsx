import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPolicyPage } from "@/pages/legal/PrivacyPolicyPage";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy policy — Nearby Escapes" },
      { name: "description", content: "Learn how Nearby Escapes collects, uses, stores and protects your personal data when you book stays, transport and packages." },
    ],
  }),
  component: PrivacyPolicyPage,
});
