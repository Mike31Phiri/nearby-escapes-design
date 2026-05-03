import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Filter } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DayState = "free" | "booked" | "pending" | "blocked";

function buildMonth(
  year: number,
  month: number,
): { date: Date; inMonth: boolean; state: DayState }[] {
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
  free: "bg-background hover:bg-muted text-foreground",
  booked: "bg-primary text-primary-foreground",
  pending: "bg-accent text-accent-foreground",
  blocked: "bg-muted text-muted-foreground line-through",
};

export function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const days = buildMonth(year, month);
  const monthName = new Date(year, month, 1).toLocaleString("en", {
    month: "long",
    year: "numeric",
  });

  function shift(delta: number) {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Host calendar
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              Manage availability
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Block dates, set seasonal pricing and respond to requests at a glance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[200px] h-9">
                <SelectValue placeholder="Property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All properties</SelectItem>
                <SelectItem value="mosi">Mosi-oa-Tunya Lodge</SelectItem>
                <SelectItem value="skyline">Skyline Boutique Suite</SelectItem>
                <SelectItem value="luangwa">Luangwa Tented Camp</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline">
              <Filter className="h-4 w-4 mr-1" /> Filters
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" /> Block dates
            </Button>
          </div>
        </header>

        <Card className="mt-6 border-border/60">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{monthName}</h2>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" onClick={() => shift(-1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setYear(today.getFullYear());
                    setMonth(today.getMonth());
                  }}
                >
                  Today
                </Button>
                <Button size="icon" variant="ghost" onClick={() => shift(1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-7 text-center text-[11px] uppercase tracking-widest text-muted-foreground">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d} className="py-2">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {days.map((d, i) => (
                <button
                  key={i}
                  className={`aspect-square rounded-lg text-sm font-medium border transition flex flex-col items-center justify-center ${
                    d.inMonth
                      ? `${stateStyles[d.state]} border-border`
                      : "bg-transparent text-muted-foreground/40 border-transparent"
                  }`}
                  disabled={!d.inMonth}
                >
                  <span>{d.date.getDate()}</span>
                  {d.inMonth && d.state === "free" && (
                    <span className="text-[10px] opacity-70 mt-0.5">$220</span>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <Legend color="bg-primary" label="Booked" />
              <Legend color="bg-accent" label="Pending" />
              <Legend color="bg-muted" label="Blocked" />
              <Legend color="bg-background border" label="Free" />
            </div>
          </CardContent>
        </Card>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <SummaryCard label="Occupancy this month" value="72%" />
          <SummaryCard label="Avg nightly rate" value="$215" />
          <SummaryCard
            label="Pending requests"
            value="2"
            pill={<Badge className="text-[10px]">Action</Badge>}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded-sm ${color}`} /> {label}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  pill,
}: {
  label: string;
  value: string;
  pill?: React.ReactNode;
}) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
          {pill}
        </div>
        <p className="mt-2 text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
