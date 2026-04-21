import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/legal/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie policy — Nearby Escapes" },
      { name: "description", content: "How Nearby Escapes uses cookies and similar technologies to keep you signed in, remember preferences and measure performance." },
    ],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 md:px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Cookie policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: April 2026</p>
        <section className="mt-6 space-y-4 text-sm leading-relaxed">
          <p>We use cookies and similar technologies to make Nearby Escapes work and to improve it.</p>
          <h2 className="text-lg font-semibold mt-6">Essential cookies</h2>
          <p>Required to keep you signed in, remember your search and process bookings securely.</p>
          <h2 className="text-lg font-semibold mt-6">Analytics</h2>
          <p>Help us understand which pages and features are most useful so we can improve them.</p>
          <h2 className="text-lg font-semibold mt-6">Managing cookies</h2>
          <p>You can control cookies through your browser settings. Disabling essential cookies may affect functionality.</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
