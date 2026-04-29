import { createFileRoute } from "@tanstack/react-router";
import { TermsPage } from "@/pages/legal/TermsPage";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [
      { title: "Terms of service — Nearby Escapes" },
      { name: "description", content: "Read the terms of service for using Nearby Escapes — bookings, payments, host responsibilities and traveler conduct." },
    ],
  }),
  component: TermsPage,
});
