import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Bus } from "lucide-react";

export const Route = createFileRoute("/bus-booking")({
  head: () => ({
    meta: [
      { title: "Bus Booking — Nearby Escapes" },
      { name: "description", content: "Book inter-city buses across Zambia with ease." },
      { property: "og:title", content: "Bus Booking — Nearby Escapes" },
      { property: "og:description", content: "Book inter-city buses across Zambia with ease." },
    ],
  }),
  component: () => (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <section className="mx-auto w-full max-w-3xl px-6 mt-16 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Bus className="h-7 w-7" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Bus Booking</h1>
        <p className="mt-3 text-muted-foreground">
          Coming next — book inter-city routes, choose seats, and pay securely.
        </p>
      </section>
      <div className="flex-1" />
      <SiteFooter />
    </div>
  ),
});
