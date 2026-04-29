import { useParams, Link } from "@tanstack/react-router";
import { ArrowLeft, ThumbsUp, ThumbsDown, MessageCircle, BookOpen } from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const articles: Record<string, { topic: string; title: string; body: string[] }> = {
  "cancellation-policy": {
    topic: "Bookings",
    title: "How cancellation policies work",
    body: [
      "Each stay sets one of three policies: flexible, moderate or strict. The active policy is shown on the stay page and on your booking confirmation.",
      "Flexible: full refund up to 24 hours before check-in. After that, the first night is non-refundable but the rest is returned.",
      "Moderate: full refund up to 5 days before check-in. After that, 50% is refunded up to 24 hours before.",
      "Strict: 50% refund up to 7 days before check-in. After that, the booking is non-refundable.",
      "If your travel is disrupted by an event covered by our trip protection (severe weather, transport closure, illness with proof), we work with the host to offer a fair refund or rebooking.",
    ],
  },
  "edit-trip": {
    topic: "Bookings",
    title: "Change dates or guests on a trip",
    body: [
      "Open Trips, choose the booking and tap Change. Pick new dates or guest counts and the host will receive a request.",
      "If the new dates cost more, you'll be charged the difference once the host accepts. If they cost less, the difference is refunded.",
      "Hosts have 24 hours to respond. If they don't reply, the original booking stays in place at no cost to you.",
    ],
  },
  "refund-timeline": {
    topic: "Payments",
    title: "When will my refund arrive?",
    body: [
      "Refunds are issued the moment a cancellation is confirmed. The time to land in your account depends on your payment method.",
      "Cards usually take 5–10 business days. Mobile money lands in 1–3 business days. Bank transfers can take up to 14 business days.",
      "If it has been longer, message support with your reference and we'll trace it with the processor.",
    ],
  },
  "host-payout": {
    topic: "Hosting",
    title: "Setting up host payouts",
    body: [
      "Add a payout method in Account → Payments. We support bank accounts and mobile money in Zambia, with more options coming soon.",
      "Payouts are sent 24 hours after each guest checks in. The first payout for a new method takes a little longer while we verify the account.",
      "You can change your payout method any time. Pending payouts will go to the previously verified account.",
    ],
  },
  "report-issue": {
    topic: "Safety",
    title: "Report a safety concern",
    body: [
      "If you feel unsafe, leave the property and call local emergency services first. Then open the trip in your inbox and tap Report.",
      "Our safety team responds within 30 minutes, day or night. Where needed we'll book an alternative stay at no cost to you.",
    ],
  },
  "id-verification": {
    topic: "Account",
    title: "Verifying your ID",
    body: [
      "Verification is required for some bookings and to host. We accept national ID, passport and driver's license.",
      "Photos are encrypted and never shared with hosts. Verification usually takes a few minutes; complex cases can take up to 24 hours.",
    ],
  },
};

export function ArticlePage() {
  const { articleId } = useParams({ from: "/support/$articleId" });
  const a = articles[articleId] ?? { topic: "Help", title: "Article", body: ["This article is not available yet."] };
  const [voted, setVoted] = useState<"up" | "down" | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <Link to="/support" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Help center
        </Link>

        <header className="mt-6">
          <Badge variant="secondary" className="text-[11px]">{a.topic}</Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{a.title}</h1>
          <p className="mt-2 text-xs text-muted-foreground">Updated April 28, 2026 · 4 min read</p>
        </header>

        <div className="mt-8 space-y-5 text-foreground/90 leading-7">
          {a.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        <Card className="mt-10 border-border/60">
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <p className="text-sm font-medium">Was this article helpful?</p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={voted === "up" ? "default" : "outline"}
                onClick={() => { setVoted("up"); toast.success("Thanks for the feedback"); }}
              >
                <ThumbsUp className="h-4 w-4 mr-1" /> Yes
              </Button>
              <Button
                size="sm"
                variant={voted === "down" ? "default" : "outline"}
                onClick={() => { setVoted("down"); toast.success("We'll improve this article"); }}
              >
                <ThumbsDown className="h-4 w-4 mr-1" /> No
              </Button>
            </div>
          </CardContent>
        </Card>

        <section className="mt-10">
          <h2 className="text-lg font-bold tracking-tight">Related articles</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {Object.entries(articles).filter(([id]) => id !== articleId).slice(0, 4).map(([id, art]) => (
              <Link key={id} to="/support/$articleId" params={{ articleId: id }}>
                <Card className="border-border/60 transition hover:border-primary/40">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary"><BookOpen className="h-4 w-4" /></div>
                    <div>
                      <p className="text-sm font-medium">{art.title}</p>
                      <p className="text-xs text-muted-foreground">{art.topic}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-8 rounded-2xl border border-border bg-primary-soft/30 p-5 flex items-center justify-between gap-4">
          <p className="text-sm">Still need help? Our team is one message away.</p>
          <Button asChild size="sm"><Link to="/support/contact"><MessageCircle className="h-4 w-4 mr-1" /> Contact</Link></Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
