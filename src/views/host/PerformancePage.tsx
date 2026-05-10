"use client";

import { TrendingUp, TrendingDown, Eye, MousePointerClick, BookCheck, Star, Lightbulb } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HostSidebar, HostMobileNav } from "./HostDashboardPage";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const series = [
  { d: "W1", v: 220 },
  { d: "W2", v: 280 },
  { d: "W3", v: 240 },
  { d: "W4", v: 360 },
  { d: "W5", v: 410 },
  { d: "W6", v: 380 },
  { d: "W7", v: 470 },
  { d: "W8", v: 520 },
];

const tips = [
  {
    id: "t1",
    title: "Add 3 more interior photos",
    body: "Listings with 12+ photos get 18% more clicks.",
    impact: "High",
  },
  {
    id: "t2",
    title: "Enable instant book on weekdays",
    body: "Half your enquiries happen Mon–Wed. Try instant book to convert faster.",
    impact: "Medium",
  },
  {
    id: "t3",
    title: "Drop minimum nights for May",
    body: "May has 6 unbooked weekday gaps that 1-night stays could fill.",
    impact: "Medium",
  },
];

export function PerformancePage() {
  const max = Math.max(...series.map(s => s.v));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="border-b border-border/50 bg-primary-soft/30">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-8 md:py-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Host</p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Performance</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">Compare visits, conversion and ratings across properties.</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Select defaultValue="all">
                <SelectTrigger className="w-[160px] h-9 hidden sm:flex"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All properties</SelectItem>
                  <SelectItem value="mosi">Mosi-oa-Tunya Lodge</SelectItem>
                  <SelectItem value="skyline">Skyline Boutique Suite</SelectItem>
                </SelectContent>
              </Select>
              <Tabs defaultValue="8w">
                <TabsList className="h-9">
                  <TabsTrigger value="4w" className="text-xs">4w</TabsTrigger>
                  <TabsTrigger value="8w" className="text-xs">8w</TabsTrigger>
                  <TabsTrigger value="12w" className="text-xs">12w</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          <div className="mt-6"><HostMobileNav /></div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 md:px-6 py-10">
        <div className="flex gap-10">
          <HostSidebar />
          <div className="flex-1 min-w-0 space-y-10">
            <section>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Overview</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Metric icon={Eye} label="Page views" value="3,481" delta="+18%" up />
                <Metric icon={MousePointerClick} label="Click-through" value="6.2%" delta="+0.4 pts" up />
                <Metric icon={BookCheck} label="Bookings" value="42" delta="+5" up />
                <Metric icon={Star} label="Avg rating" value="4.86" delta="-0.02" />
              </div>
            </section>

            <section>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Page views trend</p>
              <Card className="border-border/60">
                <CardContent className="p-6">
                  <div className="flex items-end gap-4 h-56">
                    {series.map(s => (
                      <div key={s.d} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-muted rounded-t-lg flex items-end" style={{ height: "100%" }}>
                          <div className="w-full bg-primary rounded-t-lg transition-all" style={{ height: `${(s.v / max) * 100}%` }} />
                        </div>
                        <span className="text-[11px] text-muted-foreground">{s.d}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            <section>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Per-listing breakdown</p>
              <Card className="border-border/60">
                <CardContent className="p-0">
                  <div className="hidden sm:grid grid-cols-4 gap-2 px-6 py-3 border-b border-border bg-muted/30 text-[11px] uppercase tracking-widest text-muted-foreground">
                    <span>Listing</span><span>Views</span><span>Bookings</span><span className="text-right">Rating</span>
                  </div>
                  <div className="divide-y divide-border">
                    {[
                      { name: "Mosi-oa-Tunya Lodge", views: 1840, bookings: 21, rating: 4.92 },
                      { name: "Skyline Boutique Suite", views: 980, bookings: 14, rating: 4.78 },
                      { name: "Luangwa Tented Camp", views: 661, bookings: 7, rating: 4.95 },
                    ].map(l => (
                      <div key={l.name} className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-6 py-4 items-center text-sm">
                        <p className="font-medium col-span-2 sm:col-span-1 truncate">{l.name}</p>
                        <p>{l.views}</p>
                        <p>{l.bookings}</p>
                        <p className="sm:text-right flex items-center sm:justify-end gap-1">
                          <Star className="h-3 w-3 fill-accent text-accent" /> {l.rating}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            <section>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5 text-primary" /> Suggestions to grow
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                {tips.map(t => (
                  <Card key={t.id} className="border-border/60">
                    <CardContent className="p-6">
                      <Badge variant={t.impact === "High" ? "default" : "secondary"} className="text-[11px]">{t.impact} impact</Badge>
                      <p className="mt-4 font-semibold">{t.title}</p>
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{t.body}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


function Metric({
  icon: Icon,
  label,
  value,
  delta,
  up,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  delta: string;
  up?: boolean;
}) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <p className="mt-2 text-2xl font-bold">{value}</p>
        <p
          className={`mt-1 text-xs inline-flex items-center gap-1 ${up ? "text-primary" : "text-muted-foreground"}`}
        >
          {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />} {delta}
        </p>
      </CardContent>
    </Card>
  );
}
