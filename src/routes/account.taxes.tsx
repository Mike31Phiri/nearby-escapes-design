import { createFileRoute } from "@tanstack/react-router";
import { TaxesPage } from "@/pages/account/TaxesPage";

export const Route = createFileRoute("/account/taxes")({
  head: () => ({
    meta: [
      { title: "Taxes — Wandr" },
      { name: "description", content: "Manage tax information, invoices and statements." },
      { property: "og:title", content: "Taxes — Wandr" },
      { property: "og:description", content: "Manage tax information, invoices and statements." },
    ],
  }),
  component: TaxesPage,
});
