import Link from "next/link";
import {
  User,
  Bell,
  Sliders,
  CreditCard,
  Receipt,
  ShieldCheck,
  Lock,
  Accessibility,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const sections = [
  {
    to: "/account/personal-info",
    icon: User,
    title: "Personal info",
    description: "Name, email, phone and ID details used across your trips.",
    status: "Complete",
  },
  {
    to: "/account/notifications",
    icon: Bell,
    title: "Notifications",
    description: "Choose how we reach you about trips, deals and host updates.",
    status: "3 active",
  },
  {
    to: "/account/preferences",
    icon: Sliders,
    title: "Preferences",
    description: "Currency, language and travel preferences.",
    status: "ZMW · English",
  },
  {
    to: "/account/payments",
    icon: CreditCard,
    title: "Payments & payouts",
    description: "Saved cards, mobile money and host payout destinations.",
    status: "0 cards",
  },
  {
    to: "/account/taxes",
    icon: Receipt,
    title: "Taxes",
    description: "Invoices, tax residency and host tax documents.",
    status: "Draft",
  },
  {
    to: "/account/security",
    icon: ShieldCheck,
    title: "Login & security",
    description: "Password, two-step verification and active sessions.",
    status: "2-step off",
  },
  {
    to: "/account/privacy",
    icon: Lock,
    title: "Privacy & data",
    description: "Manage data sharing, downloads and account deletion.",
    status: "Standard",
  },
  {
    to: "/account/accessibility",
    icon: Accessibility,
    title: "Accessibility",
    description: "Captions, motion preferences and reading aids.",
    status: "Default",
  },
] as const;

export function AccountPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Account</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Your account</h1>
          <p className="mt-3 text-base text-muted-foreground">
            Manage identity, payments, notifications and security from one place.
          </p>
        </header>

        <section className="mt-8 grid gap-3 sm:grid-cols-3">
          <Card className="border-border/60">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Profile readiness</p>
              <p className="mt-1 text-2xl font-bold">82%</p>
              <p className="text-xs text-muted-foreground">Add ID to reach 100%</p>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Saved settings</p>
              <p className="mt-1 text-2xl font-bold">7</p>
              <p className="text-xs text-muted-foreground">Last updated today</p>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Security checks</p>
              <p className="mt-1 text-2xl font-bold">3 / 5</p>
              <p className="text-xs text-muted-foreground">Enable 2-step to improve</p>
            </CardContent>
          </Card>
        </section>

        <section className="mt-8 grid gap-3 md:grid-cols-2">
          {sections.map(({ to, icon: Icon, title, description, status }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-semibold tracking-tight">{title}</h2>
                    <Badge variant="secondary" className="shrink-0 text-[11px]">
                      {status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
              </div>
            </Link>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
