import Link from "next/link";
import { Search, MessageCircle, Clock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const threads = [
  {
    id: "h1",
    guest: "Chanda M.",
    listing: "Mosi-oa-Tunya Lodge",
    snippet: "Will check-in be possible at 11am?",
    time: "5m",
    unread: 1,
    status: "Pre-arrival",
  },
  {
    id: "h2",
    guest: "Bwalya K.",
    listing: "Skyline Boutique Suite",
    snippet: "Thank you for the upgrade!",
    time: "1h",
    unread: 0,
    status: "In stay",
  },
  {
    id: "h3",
    guest: "Mulenga P.",
    listing: "Luangwa Tented Camp",
    snippet: "Could you suggest a transfer?",
    time: "Yesterday",
    unread: 2,
    status: "Pre-arrival",
  },
  {
    id: "h4",
    guest: "Joyce S.",
    listing: "Mosi-oa-Tunya Lodge",
    snippet: "Thanks again, will leave a review.",
    time: "2d",
    unread: 0,
    status: "Past",
  },
];

export function HostInboxPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <header className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Host inbox
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              Guest conversations
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Reply faster to maintain a high response rate.
            </p>
          </div>
          <Badge variant="secondary" className="text-[11px]">
            Avg reply: 18 min
          </Badge>
        </header>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card className="border-border/60">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Unread</p>
              <p className="mt-1 text-2xl font-bold">{threads.reduce((s, t) => s + t.unread, 0)}</p>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Active stays
              </p>
              <p className="mt-1 text-2xl font-bold">2</p>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Response rate
              </p>
              <p className="mt-1 text-2xl font-bold">96%</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search guests or listings" />
          </div>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pre">Pre-arrival</TabsTrigger>
              <TabsTrigger value="in">In stay</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Card className="mt-4 border-border/60">
          <CardContent className="p-0">
            {threads.map((t, i) => (
              <Link
                key={t.id}
                href="/inbox"
                className={`flex items-center gap-4 p-4 hover:bg-muted/40 transition ${i > 0 ? "border-t border-border" : ""}`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                    {t.guest
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-sm truncate">{t.guest}</p>
                    <span className="text-[11px] text-muted-foreground shrink-0 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {t.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {t.listing} · {t.snippet}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="text-[11px]">
                    {t.status}
                  </Badge>
                  {t.unread > 0 && <Badge className="text-[10px] h-4 px-1.5">{t.unread}</Badge>}
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
