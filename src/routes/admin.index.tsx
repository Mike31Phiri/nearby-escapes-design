import { createFileRoute } from "@tanstack/react-router";
import { DollarSign, CalendarCheck, Users, Wallet, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminBookings, adminMetrics } from "@/lib/admin-mock";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function fmt(n: number) {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function AdminDashboard() {
  const max = Math.max(...adminMetrics.revenueByMonth.map((m) => m.value));
  const recent = [...adminBookings].slice(0, 5);

  const stats = [
    { label: "Total revenue", value: fmt(adminMetrics.totalRevenue), icon: DollarSign, change: "+18.2%" },
    { label: "Bookings", value: adminMetrics.totalBookings.toString(), icon: CalendarCheck, change: "+5" },
    { label: "Active users", value: adminMetrics.activeUsers.toString(), icon: Users, change: "+12" },
    { label: "Pending payouts", value: fmt(adminMetrics.pendingPayouts), icon: Wallet, change: "—" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of bookings, revenue and platform health.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, change }) => (
          <Card key={label} className="border-border/60">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                  <p className="mt-2 text-2xl font-bold">{value}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-primary" /> {change} this month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Revenue · Last 6 months</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-48">
              {adminMetrics.revenueByMonth.map(({ month, value }) => (
                <div key={month} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-md bg-[image:var(--gradient-hero)]"
                    style={{ height: `${(value / max) * 100}%` }}
                    aria-label={`${month}: ${fmt(value)}`}
                  />
                  <span className="text-xs text-muted-foreground">{month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Quick stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <Row label="Avg booking value" value={fmt(adminMetrics.totalRevenue / adminMetrics.totalBookings)} />
            <Row label="Commission rate" value="12%" />
            <Row label="Conversion" value="3.4%" />
            <Row label="Refund rate" value="1.1%" />
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Recent bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead className="hidden md:table-cell">Listing</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-mono text-xs">{b.reference}</TableCell>
                  <TableCell>{b.guest}</TableCell>
                  <TableCell className="hidden md:table-cell">{b.listing}</TableCell>
                  <TableCell>{fmt(b.amount)}</TableCell>
                  <TableCell>
                    <StatusBadge status={b.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmed: "bg-primary-soft text-primary border-transparent",
    completed: "bg-muted text-foreground border-transparent",
    pending: "bg-accent/20 text-accent-foreground border-transparent",
    cancelled: "bg-destructive/10 text-destructive border-transparent",
  };
  return <Badge className={map[status] || ""} variant="outline">{status}</Badge>;
}
