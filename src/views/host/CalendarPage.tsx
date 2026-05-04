"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Filter } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HostSidebar, HostMobileNav } from "./HostDashboardPage";
import { cn } from "@/lib/utils";

type DayState = "free" | "booked" | "pending" | "blocked";

function buildMonth(year: number, month: number): { date: Date; inMonth: boolean; state: DayState }[] {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const days: { date: Date; inMonth: boolean; state: DayState }[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(year, month, i - startOffset + 1);
    const inMonth = d.getMonth() === month;
    let state: DayState = "free";
    const day = d.getDate();
    if (inMonth) {
      if ([4, 5, 6, 11, 12, 19, 20, 21].includes(day)) state = "booked";
      else if ([15, 26].includes(day)) state = "pending";
      else if ([8, 23].includes(day)) state = "blocked";
    }
    days.push({ date: d, inMonth, state });
  }
  return days;
}

const stateStyles: Record<DayState, string> = {
  free: "bg-background hover:bg-primary-soft hover:text-primary text-foreground border-border",
  booked: "bg-primary text-primary-foreground border-primary",
  pending: "bg-accent text-accent-foreground border-accent",
  blocked: "bg-muted text-muted-foreground line-through border-border",
};

export function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const days = buildMonth(year, month);
  const monthName = new Date(year, month, 1).toLocaleString("en", { month: "long", year: "numeric" });

  function shift(delta: number) {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="border-b border-border/50 bg-primary-soft/30">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-8 md:py-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">Host</p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Calendar</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">Block dates, set pricing and respond to requests.</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px] h-9 hidden sm:flex"><SelectValue placeholder="Property" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All properties</SelectItem>
                  <SelectItem value="mosi">Mosi-oa-Tunya Lodge</SelectItem>
                  <SelectItem value="skyline">Skyline Boutique Suite</SelectItem>
                  <SelectItem value="luangwa">Luangwa Tented Camp</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline"><Filter className="h-4 w-4 mr-1.5" /> Filters</Button>
              <Button size="sm" className="bg-[image:var(--gradient-hero)] hover:opacity-95">
                <Plus className="h-4 w-4 mr-1.5" /> Block dates
              </Button>
            </div>
          </div>
          <div className="mt-6"><HostMobileNav /></div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 md:px-6 py-10">
        <div className="flex gap-10">
          <HostSidebar />

          <div className="flex-1 min-w-0 space-y-10">
            {/* Calendar */}
            <section>
              <Card className="border-border/60">
                <CardContent className="p-6 md:p-8">
                  {/* Month nav */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold">{monthName}</h2>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" onClick={() => shift(-1)}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); }}>
                        Today
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => shift(1)}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Day headers */}
                  <div className="grid grid-cols-7 mb-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                      <div key={d} className="text-center text-[11px] font-semibold uppercase tracking-widest text-muted-foreground py-2">
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Day grid */}
                  <div className="grid grid-cols-7 gap-1.5">
                    {days.map((d, i) => (
                      <button
                        key={i}
                        disabled={!d.inMonth}
                        className={cn(
                          "rounded-xl border text-sm font-medium transition-all flex flex-col items-center justify-center py-2.5 gap-0.5",
                          d.inMonth ? stateStyles[d.state] : "bg-transparent text-muted-foreground/30 border-transparent cursor-default"
                        )}
                      >
                        <span className="font-semibold">{d.date.getDate()}</span>
                        {d.inMonth && d.state === "free" && (
                          <span className="text-[10px] opacity-60">$220</span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="mt-6 pt-5 border-t border-border flex flex-wrap items-center gap-5 text-xs text-muted-foreground">
                    {[
                      { color: "bg-primary", label: "Booked" },
                      { color: "bg-accent", label: "Pending" },
                      { color: "bg-muted border border-border", label: "Blocked" },
                      { color: "bg-background border border-border", label: "Free" },
                    ].map(({ color, label }) => (
                      <div key={label} className="flex items-center gap-2">
                        <span className={cn("h-3.5 w-3.5 rounded-md", color)} />
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Summary stats */}
            <section>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">This month</p>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { label: "Occupancy", value: "72%" },
                  { label: "Avg nightly rate", value: "$215" },
                  { label: "Pending requests", value: "2", badge: <Badge className="text-[10px]">Action needed</Badge> },
                ].map(({ label, value, badge }) => (
                  <Card key={label} className="border-border/60">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
                        {badge}
                      </div>
                      <p className="text-3xl font-bold tracking-tight">{value}</p>
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
