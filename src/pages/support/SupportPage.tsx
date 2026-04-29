import { Link } from "@tanstack/react-router";
import { Search, BookOpen, CreditCard, Plane, Home, Shield, MessageCircle, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const topics = [
  { id: "bookings", label: "Bookings & changes", icon: Plane },
  { id: "payments", label: "Payments & refunds", icon: CreditCard },
  { id: "hosting", label: "Hosting", icon: Home },
  { id: "safety", label: "Safety & trust", icon: Shield },
];

const articles = [
  { id: "cancellation-policy", title: "How cancellation policies work", topic: "Bookings" },
  { id: "edit-trip", title: "Change dates or guests on a trip", topic: "Bookings" },
  { id: "refund-timeline", title: "When will my refund arrive?", topic: "Payments" },
  { id: "host-payout", title: "Setting up host payouts", topic: "Hosting" },
  { id: "report-issue", title: "Report a safety concern", topic: "Safety" },
  { id: "id-verification", title: "Verifying your ID", topic: "Account" },
];

export function SupportPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <section className="bg-primary-soft/40">
          <div className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Help center</p>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">How can we help?</h1>
            <p className="mt-2 text-sm text-muted-foreground">Search articles or browse by topic.</p>
            <div className="mt-6 max-w-xl mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10 h-11 bg-background" placeholder="Search 'cancel my trip', 'payout' …" />
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
          <h2 className="text-lg font-bold tracking-tight">Browse topics</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {topics.map((t) => (
              <Card key={t.id} className="border-border/60 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary"><t.icon className="h-5 w-5" /></div>
                  <p className="mt-3 font-semibold text-sm">{t.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">12 articles</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <h2 className="mt-12 text-lg font-bold tracking-tight">Popular articles</h2>
          <Card className="mt-4 border-border/60">
            <CardContent className="p-0">
              {articles.map((a, i) => (
                <Link
                  key={a.id}
                  to="/support/$articleId"
                  params={{ articleId: a.id }}
                  className={`flex items-center gap-4 p-4 hover:bg-muted/40 transition ${i > 0 ? "border-t border-border" : ""}`}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary"><BookOpen className="h-4 w-4" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{a.title}</p>
                    <Badge variant="outline" className="mt-1 text-[10px]">{a.topic}</Badge>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card className="mt-8 border-border/60 bg-primary-soft/30">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold">Still need help?</h3>
                <p className="text-sm text-muted-foreground">Our team replies in under an hour, every day.</p>
              </div>
              <Button asChild><Link to="/support/contact"><MessageCircle className="h-4 w-4 mr-1" /> Contact us</Link></Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
