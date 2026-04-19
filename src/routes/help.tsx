import { createFileRoute, Link } from "@tanstack/react-router";
import { LifeBuoy, MessageCircle, Mail, BookOpen } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help center — Nearby Escapes" },
      { name: "description", content: "Find answers, contact support, and get help with bookings on Nearby Escapes." },
    ],
  }),
  component: HelpPage,
});

const topics = [
  { icon: BookOpen, title: "Getting started", desc: "Create an account, search stays, and make your first booking." },
  { icon: LifeBuoy, title: "Bookings & cancellations", desc: "Manage upcoming trips, refunds, and reschedules." },
  { icon: MessageCircle, title: "Hosting", desc: "Become a host, manage listings, and payouts." },
  { icon: Mail, title: "Account & security", desc: "Login issues, two-factor authentication, and privacy." },
];

function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 md:px-6 py-10 space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">How can we help?</h1>
          <p className="text-muted-foreground">Browse common topics or reach our support team.</p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2">
          {topics.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold">{title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] text-center">
          <h2 className="font-semibold text-lg">Still need help?</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Email us at <a className="text-primary underline" href="mailto:support@nearbyescapes.zm">support@nearbyescapes.zm</a> or visit your{" "}
            <Link to="/profile/settings" className="text-primary underline">account settings</Link>.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
