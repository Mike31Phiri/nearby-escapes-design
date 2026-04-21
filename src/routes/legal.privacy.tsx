import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy policy — Nearby Escapes" },
      { name: "description", content: "Learn how Nearby Escapes collects, uses, stores and protects your personal data when you book stays, transport and packages." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 md:px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Privacy policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: April 2026</p>
        <section className="mt-6 space-y-4 text-sm leading-relaxed">
          <p>We respect your privacy. This policy explains what data we collect and how it is used.</p>
          <h2 className="text-lg font-semibold mt-6">Data we collect</h2>
          <p>Account details, booking history, communications with hosts and basic device information for security and analytics.</p>
          <h2 className="text-lg font-semibold mt-6">How we use it</h2>
          <p>To facilitate bookings, prevent fraud, improve our service and personalize your experience.</p>
          <h2 className="text-lg font-semibold mt-6">Sharing</h2>
          <p>We share booking details with the host you book with. We do not sell your personal data.</p>
          <h2 className="text-lg font-semibold mt-6">Your rights</h2>
          <p>You can access, export or delete your account data at any time from Account settings.</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
