import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/gems")({
  head: () => ({
    meta: [
      { title: "Hidden Gems — Nearby Escapes" },
      { name: "description", content: "Discover Zambia's hidden attractions and local favorites." },
      { property: "og:title", content: "Hidden Gems — Nearby Escapes" },
      { property: "og:description", content: "Discover Zambia's hidden attractions and local favorites." },
    ],
  }),
  component: () => (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="mx-auto w-full max-w-3xl px-6 mt-16 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <MapPin className="h-7 w-7" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Hidden Gems</h1>
        <p className="mt-3 text-muted-foreground">
          A curated map of must-see spots across Zambia — coming soon.
        </p>
      </section>
      <div className="flex-1" />
      <SiteFooter />
    </div>
  ),
});
