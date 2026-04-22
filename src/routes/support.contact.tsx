import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/pages/support/ContactPage";

export const Route = createFileRoute("/support/contact")({
  head: () => ({
    meta: [
      { title: "Contact support — Wandr" },
      { name: "description", content: "Contact Wandr support." },
      { property: "og:title", content: "Contact support — Wandr" },
      { property: "og:description", content: "Contact Wandr support." },
    ],
  }),
  component: ContactPage,
});
