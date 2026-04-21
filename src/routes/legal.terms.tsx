import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [
      { title: "Terms of service — Nearby Escapes" },
      { name: "description", content: "Read the terms of service for using Nearby Escapes — bookings, payments, host responsibilities and traveler conduct." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 md:px-6 py-10 prose prose-sm md:prose-base">
        <h1 className="text-3xl font-bold tracking-tight">Terms of service</h1>
        <p className="text-sm text-muted-foreground">Last updated: April 2026</p>
        <section className="mt-6 space-y-4 text-sm leading-relaxed">
          <p>Welcome to Nearby Escapes. By accessing or using our platform you agree to these terms. Please read them carefully.</p>
          <h2 className="text-lg font-semibold mt-6">1. Bookings & payments</h2>
          <p>All bookings are subject to host availability and confirmation. Payments are processed securely; service fees are shown before checkout.</p>
          <h2 className="text-lg font-semibold mt-6">2. Cancellations & refunds</h2>
          <p>Cancellation policies are set by individual hosts and shown on each listing. Refunds follow the policy active at booking time.</p>
          <h2 className="text-lg font-semibold mt-6">3. Conduct</h2>
          <p>Travelers and hosts agree to treat each other respectfully and follow local laws and property rules.</p>
          <h2 className="text-lg font-semibold mt-6">4. Liability</h2>
          <p>Nearby Escapes is a marketplace and is not a party to bookings between travelers and hosts.</p>
          <h2 className="text-lg font-semibold mt-6">5. Contact</h2>
          <p>Questions? Reach our team via the Help Center.</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
