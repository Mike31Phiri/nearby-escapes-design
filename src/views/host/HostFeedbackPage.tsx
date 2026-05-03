import { Star, MessageCircle, ThumbsUp, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const breakdown = [
  { label: "Cleanliness", score: 4.9 },
  { label: "Accuracy", score: 4.8 },
  { label: "Check-in", score: 4.95 },
  { label: "Communication", score: 4.85 },
  { label: "Location", score: 4.7 },
  { label: "Value", score: 4.6 },
];

const reviews = [
  {
    id: "r1",
    from: "Bwalya K.",
    listing: "Mosi-oa-Tunya Lodge",
    rating: 5,
    date: "Apr 26",
    text: "Spectacular setting and Chanda was a wonderful host. The plunge pool at sunset is unforgettable.",
    reply: "Thanks Bwalya — looking forward to the next trip!",
  },
  {
    id: "r2",
    from: "Joyce S.",
    listing: "Skyline Boutique Suite",
    rating: 5,
    date: "Apr 22",
    text: "Absolutely loved the location, the room was spotless and breakfast was a treat.",
  },
  {
    id: "r3",
    from: "Mulenga P.",
    listing: "Luangwa Tented Camp",
    rating: 4,
    date: "Apr 18",
    text: "Beautiful spot. The drive in is rough — bring a 4x4. Otherwise, perfect.",
  },
];

export function HostFeedbackPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Reviews & feedback
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              Hear from your guests
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Track ratings, reply to reviews and spot trends across stays.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
            <Star className="h-5 w-5 fill-accent text-accent" />
            <div>
              <p className="text-2xl font-bold leading-none">4.86</p>
              <p className="text-[11px] text-muted-foreground">217 reviews</p>
            </div>
          </div>
        </header>

        <Card className="mt-6 border-border/60">
          <CardContent className="p-6">
            <h2 className="text-sm font-semibold tracking-tight">Rating breakdown</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {breakdown.map((b) => (
                <div key={b.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{b.label}</span>
                    <span className="font-semibold">{b.score}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-muted">
                    <div
                      className="h-1.5 rounded-full bg-primary"
                      style={{ width: `${(b.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="mt-8">
          <TabsList>
            <TabsTrigger value="all">All ({reviews.length})</TabsTrigger>
            <TabsTrigger value="needs">Needs reply (1)</TabsTrigger>
            <TabsTrigger value="recent">Last 30 days</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4 space-y-3">
            {reviews.map((r) => (
              <Card key={r.id} className="border-border/60">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                        {r.from
                          .split(" ")
                          .map((w) => w[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm">
                          {r.from} ·{" "}
                          <span className="text-muted-foreground font-normal">{r.listing}</span>
                        </p>
                        <span className="text-xs text-muted-foreground shrink-0">{r.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${i < r.rating ? "fill-accent text-accent" : "text-muted-foreground/40"}`}
                          />
                        ))}
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{r.text}</p>
                      {r.reply ? (
                        <div className="mt-3 rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm">
                          <p className="text-[11px] font-semibold text-primary">Your reply</p>
                          <p className="text-muted-foreground">{r.reply}</p>
                        </div>
                      ) : (
                        <Separator className="my-3" />
                      )}
                      {!r.reply && (
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-4 w-4 mr-1" /> Reply
                          </Button>
                          <Badge variant="outline" className="text-[10px]">
                            Needs reply
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="needs" className="mt-4 text-sm text-muted-foreground">
            Filter applied · 1 review needs your reply.
          </TabsContent>
          <TabsContent value="recent" className="mt-4 text-sm text-muted-foreground">
            Last 30 days · 14 reviews collected.
          </TabsContent>
        </Tabs>

        <Card className="mt-8 border-border/60 bg-primary-soft/30">
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <ThumbsUp className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold">Tip from our hosting team</p>
                <p className="text-xs text-muted-foreground">
                  Replying to reviews within 7 days can lift your bookings up to 12%.
                </p>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="shrink-0">
              Learn more <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
