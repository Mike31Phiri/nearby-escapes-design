import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Package } from "lucide-react";

export const Route = createFileRoute("/packages")({
  head: () => ({
    meta: [
      { title: "Travel Packages — Nearby Escapes" },
      { name: "description", content: "Curated multi-day travel packages across Zambia." },
      { property: "og:title", content: "Travel Packages — Nearby Escapes" },
      { property: "og:description", content: "Curated multi-day travel packages across Zambia." },
    ],
  }),
  component: () => (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="mx-auto w-full max-w-3xl px-6 mt-16 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Package className="h-7 w-7" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Travel Packages</h1>
        <p className="mt-3 text-muted-foreground">
          Stay + transport + experiences, bundled — coming soon.
        </p>
      </section>
      <div className="flex-1" />
      <SiteFooter />
    </div>
  ),
});
