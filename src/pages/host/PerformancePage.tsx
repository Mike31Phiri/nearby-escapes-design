import { TrendingUp, TrendingDown, Eye, MousePointerClick, BookCheck, Star, Lightbulb } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const series = [
  { d: "W1", v: 220 }, { d: "W2", v: 280 }, { d: "W3", v: 240 }, { d: "W4", v: 360 },
  { d: "W5", v: 410 }, { d: "W6", v: 380 }, { d: "W7", v: 470 }, { d: "W8", v: 520 },
];

const tips = [
  { id: "t1", title: "Add 3 more interior photos", body: "Listings with 12+ photos get 18% more clicks.", impact: "High" },
  { id: "t2", title: "Enable instant book on weekdays", body: "Half your enquiries happen Mon–Wed. Try instant book to convert faster.", impact: "Medium" },
  { id: "t3", title: "Drop minimum nights for May", body: "May has 6 unbooked weekday gaps that 1-night stays could fill.", impact: "Medium" },
];

export function PerformancePage() {
  const max = Math.max(...series.map((s) => s.v));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Performance</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">How your listings are doing</h1>
            <p className="mt-2 text-sm text-muted-foreground">Compare visits, conversion and ratings across all your properties.</p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px] h-9"><SelectValue /></SelectTrigger>
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
        </header>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric icon={Eye} label="Page views" value="3,481" delta="+18%" up />
          <Metric icon={MousePointerClick} label="Click-through" value="6.2%" delta="+0.4 pts" up />
          <Metric icon={BookCheck} label="Bookings" value="42" delta="+5" up />
          <Metric icon={Star} label="Avg rating" value="4.86" delta="-0.02" />
        </div>

        <Card className="mt-6 border-border/60">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-tight">Page views vs bookings</h2>
              <Badge variant="secondary" className="text-[11px]">Last 8 weeks</Badge>
            </div>
            <div className="mt-6 flex items-end gap-3 h-56">
              {series.map((s) => (
                <div key={s.d} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-muted rounded-t-md flex items-end" style={{ height: "100%" }}>
                    <div className="w-full bg-primary rounded-t-md transition-all" style={{ height: `${(s.v / max) * 100}%` }} />
                  </div>
                  <span className="text-[11px] text-muted-foreground">{s.d}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 border-border/60">
          <CardContent className="p-0">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold tracking-tight">Per-listing breakdown</h2>
            </div>
            <div className="divide-y divide-border">
              {[
                { name: "Mosi-oa-Tunya Lodge", views: 1840, bookings: 21, rating: 4.92 },
                { name: "Skyline Boutique Suite", views: 980, bookings: 14, rating: 4.78 },
                { name: "Luangwa Tented Camp", views: 661, bookings: 7, rating: 4.95 },
              ].map((l) => (
                <div key={l.name} className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-5 py-4 items-center text-sm">
                  <p className="font-medium col-span-2 sm:col-span-1 truncate">{l.name}</p>
                  <p><span className="text-muted-foreground text-xs">Views</span> {l.views}</p>
                  <p><span className="text-muted-foreground text-xs">Bookings</span> {l.bookings}</p>
                  <p className="sm:text-right"><Star className="h-3 w-3 inline fill-accent text-accent" /> {l.rating}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <section className="mt-8">
          <h2 className="text-sm font-semibold tracking-tight flex items-center gap-1"><Lightbulb className="h-4 w-4 text-primary" /> Suggestions to grow</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {tips.map((t) => (
              <Card key={t.id} className="border-border/60">
                <CardContent className="p-5">
                  <Badge variant={t.impact === "High" ? "default" : "secondary"} className="text-[11px]">{t.impact} impact</Badge>
                  <p className="mt-3 font-semibold text-sm">{t.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground leading-5">{t.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Metric({ icon: Icon, label, value, delta, up }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; delta: string; up?: boolean }) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <p className="mt-2 text-2xl font-bold">{value}</p>
        <p className={`mt-1 text-xs inline-flex items-center gap-1 ${up ? "text-primary" : "text-muted-foreground"}`}>
          {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />} {delta}
        </p>
      </CardContent>
    </Card>
  );
}
