import { Download, TrendingUp, ArrowUpRight, Wallet, Calendar } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const transactions = [
  { id: "p1", date: "Apr 26", listing: "Mosi-oa-Tunya Lodge", guest: "Bwalya K.", nights: 3, gross: 660, fee: 66, net: 594, status: "Paid" },
  { id: "p2", date: "Apr 22", listing: "Skyline Boutique Suite", guest: "Joyce S.", nights: 2, gross: 290, fee: 29, net: 261, status: "Paid" },
  { id: "p3", date: "Apr 18", listing: "Luangwa Tented Camp", guest: "Mulenga P.", nights: 4, gross: 1240, fee: 124, net: 1116, status: "Paid" },
  { id: "p4", date: "May 02", listing: "Mosi-oa-Tunya Lodge", guest: "Chanda M.", nights: 3, gross: 660, fee: 66, net: 594, status: "Pending" },
];

const months = [
  { m: "Nov", value: 1820 }, { m: "Dec", value: 2410 }, { m: "Jan", value: 1980 },
  { m: "Feb", value: 2240 }, { m: "Mar", value: 2620 }, { m: "Apr", value: 2971 },
];

export function EarningsPage() {
  const max = Math.max(...months.map((m) => m.value));
  const total = transactions.reduce((s, t) => s + t.net, 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Earnings</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">Your payouts</h1>
            <p className="mt-2 text-sm text-muted-foreground">Track what you've earned and what's coming up.</p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="2026">
              <SelectTrigger className="w-[110px] h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" /> Export</Button>
          </div>
        </header>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <Stat label="This month" value="$2,971" delta="+13%" />
          <Stat label="Pending payout" value="$594" />
          <Stat label="Year to date" value="$14,420" delta="+8%" />
          <Stat label="Average per night" value="$210" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <Card className="border-border/60">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-tight">Last 6 months</h2>
                <Tabs defaultValue="net">
                  <TabsList className="h-8">
                    <TabsTrigger value="net" className="text-xs h-6">Net</TabsTrigger>
                    <TabsTrigger value="gross" className="text-xs h-6">Gross</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="mt-6 flex items-end gap-3 h-48">
                {months.map((m) => (
                  <div key={m.m} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-muted rounded-t-md flex items-end" style={{ height: "100%" }}>
                      <div className="w-full bg-primary rounded-t-md transition-all" style={{ height: `${(m.value / max) * 100}%` }} />
                    </div>
                    <span className="text-[11px] text-muted-foreground">{m.m}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardContent className="p-6">
              <h2 className="text-sm font-semibold tracking-tight">Next payout</h2>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary"><Wallet className="h-5 w-5" /></div>
                <div>
                  <p className="text-2xl font-bold">$594</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> Arrives May 03</p>
                </div>
              </div>
              <Separator className="my-4" />
              <p className="text-xs text-muted-foreground">Sent to <span className="font-medium text-foreground">FNB · ••• 4421</span></p>
              <Button variant="outline" className="mt-4 w-full" size="sm">Change payout method</Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 border-border/60">
          <CardContent className="p-0">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-tight">Transactions</h2>
              <Badge variant="secondary" className="text-[11px]">Total ${total.toLocaleString()}</Badge>
            </div>
            <div className="divide-y divide-border">
              {transactions.map((t) => (
                <div key={t.id} className="grid grid-cols-2 sm:grid-cols-6 gap-2 px-5 py-4 text-sm items-center">
                  <div>
                    <p className="text-xs text-muted-foreground">{t.date}</p>
                    <p className="font-medium truncate">{t.listing}</p>
                  </div>
                  <p className="text-xs text-muted-foreground hidden sm:block">{t.guest}</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">{t.nights} nights</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">Gross ${t.gross}</p>
                  <p className="font-semibold sm:text-right">${t.net}</p>
                  <Badge variant={t.status === "Paid" ? "secondary" : "outline"} className="text-[10px] sm:justify-self-end">{t.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

function Stat({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-5">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="mt-2 text-2xl font-bold">{value}</p>
        {delta && (
          <p className="mt-1 text-xs text-primary inline-flex items-center gap-1">
            <ArrowUpRight className="h-3 w-3" /> {delta} <TrendingUp className="h-3 w-3" />
          </p>
        )}
      </CardContent>
    </Card>
  );
}
