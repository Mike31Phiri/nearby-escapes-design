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
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 md:px-6 md:py-20">
        <header className="max-w-3xl mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Account</p>
          <h1 className="mt-4 text-4xl md:text-6xl font-black tracking-tight">Your account</h1>
          <p className="mt-4 text-lg text-muted-foreground font-medium">
            Manage identity, payments, notifications and security from one place.
          </p>
        </header>

        <section className="grid gap-6 sm:grid-cols-3 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-border/60 shadow-sm rounded-[32px] overflow-hidden group hover:shadow-md transition-all">
            <CardContent className="p-8">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                Profile readiness
              </p>
              <p className="text-3xl font-black text-primary">82%</p>
              <div className="mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "82%" }} />
              </div>
              <p className="mt-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Add ID to reach 100%</p>
            </CardContent>
          </Card>
          <Card className="border-border/60 shadow-sm rounded-[32px] overflow-hidden group hover:shadow-md transition-all">
            <CardContent className="p-8">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                Saved settings
              </p>
              <p className="text-3xl font-black">7</p>
              <p className="mt-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider italic">Last updated today</p>
            </CardContent>
          </Card>
          <Card className="border-border/60 shadow-sm rounded-[32px] overflow-hidden group hover:shadow-md transition-all">
            <CardContent className="p-8">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                Security checks
              </p>
              <p className="text-3xl font-black text-amber-600">3 / 5</p>
              <p className="mt-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Enable 2-step to improve</p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {sections.map(({ to, icon: Icon, title, description, status }) => (
            <Link
              key={to}
              href={to}
              className="group rounded-[32px] border border-border/60 bg-card p-8 transition-all hover:border-primary/40 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex items-start gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/5 text-primary group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h2 className="text-xl font-bold tracking-tight">{title}</h2>
                    <span className="shrink-0 text-[10px] font-black uppercase tracking-widest bg-muted/50 px-3 py-1 rounded-full text-muted-foreground">
                      {status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">{description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary mt-1" />
              </div>
            </Link>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
