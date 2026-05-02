import Link from "next/link";
import { Star, MapPin, Calendar, BadgeCheck, MessageCircle, Briefcase, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const reviews = [
  { id: "r1", from: "Chanda M.", rating: 5, text: "Easy to coordinate with and respectful of house rules. Welcome anytime!", listing: "Mosi-oa-Tunya Lodge", date: "Mar 2026" },
  { id: "r2", from: "Bwalya K.", rating: 5, text: "Quiet, considerate guest. Left the apartment spotless.", listing: "Skyline Boutique Suite", date: "Jan 2026" },
  { id: "r3", from: "Mulenga P.", rating: 4, text: "Communicated clearly and arrived on time.", listing: "Luangwa Tented Camp", date: "Nov 2025" },
];

const trips = [
  { id: "t1", title: "South Luangwa", date: "Mar 12 – Mar 15, 2026" },
  { id: "t2", title: "Livingstone", date: "Dec 22 – Dec 27, 2025" },
];

export function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <div className="grid gap-8 md:grid-cols-[280px_1fr]">
          <aside>
            <Card className="border-border/60">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 bg-primary text-primary-foreground">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">MP</AvatarFallback>
                </Avatar>
                <h1 className="mt-4 text-xl font-bold">Mike Phiri</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3.5 w-3.5" /> Lusaka, Zambia
                </p>
                <Badge variant="secondary" className="mt-3 text-[11px]"><BadgeCheck className="h-3 w-3 mr-1" /> ID verified</Badge>
                <div className="mt-5 grid grid-cols-2 w-full gap-3 text-center">
                  <div>
                    <p className="text-lg font-bold">12</p>
                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Trips</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">4.9</p>
                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Rating</p>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline" className="mt-5 w-full">
                  <Link href="/profile/edit">Edit profile</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-4 border-border/60">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-tight">Hosting on Nearby Escapes</p>
                    <p className="text-xs text-muted-foreground">Same account, different mode.</p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  You're currently in traveler mode. Switch to hosting to manage listings, calendar and earnings — switch back any time to keep booking trips.
                </p>
                <Button asChild size="sm" className="mt-4 w-full">
                  <Link href="/host">
                    Switch to hosting
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="mt-1 w-full text-xs text-muted-foreground">
                  <Link href="/host">Become a host</Link>
                </Button>
              </CardContent>
            </Card>
          </aside>

          <section>
            <Tabs defaultValue="about">
              <TabsList>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="trips">Trips</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-4 space-y-4">
                <Card className="border-border/60">
                  <CardContent className="p-6">
                    <h2 className="text-sm font-semibold tracking-tight">About me</h2>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      Software engineer who loves slow weekends in the bush, river boats and quiet boutique stays.
                      Travels light and respects house rules.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-border/60">
                  <CardContent className="p-6">
                    <h2 className="text-sm font-semibold tracking-tight">I like</h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {["Safari", "Boutique stays", "Hiking", "River trips", "Local food", "Photography"].map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-4 space-y-3">
                {reviews.map((r) => (
                  <Card key={r.id} className="border-border/60">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{r.from}</p>
                          <p className="text-xs text-muted-foreground">{r.listing} · {r.date}</p>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-accent text-accent" : "text-muted-foreground/40"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{r.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="trips" className="mt-4 space-y-3">
                {trips.map((t) => (
                  <Card key={t.id} className="border-border/60">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{t.title}</p>
                        <p className="text-xs text-muted-foreground">{t.date}</p>
                      </div>
                      <Button size="sm" variant="ghost"><MessageCircle className="h-4 w-4 mr-1" /> Host</Button>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
