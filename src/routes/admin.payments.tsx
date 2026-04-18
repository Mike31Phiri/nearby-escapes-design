import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminPayments } from "@/lib/admin-mock";

export const Route = createFileRoute("/admin/payments")({
  component: AdminPaymentsPage,
});

function AdminPaymentsPage() {
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    return adminPayments.filter((p) =>
      !q ||
      p.bookingRef.toLowerCase().includes(q.toLowerCase()) ||
      p.payer.toLowerCase().includes(q.toLowerCase()),
    );
  }, [q]);

  const totals = {
    paid: adminPayments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0),
    pending: adminPayments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0),
    refunded: adminPayments.filter((p) => p.status === "refunded").reduce((s, p) => s + p.amount, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Payments</h1>
          <p className="text-sm text-muted-foreground">Track collections, pending charges and refunds.</p>
        </div>
        <Button variant="outline">Export CSV</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Collected" value={`$${totals.paid.toLocaleString()}`} tone="primary" />
        <SummaryCard label="Pending" value={`$${totals.pending.toLocaleString()}`} tone="accent" />
        <SummaryCard label="Refunded" value={`$${totals.refunded.toLocaleString()}`} tone="destructive" />
      </div>

      <Card className="border-border/60">
        <CardContent className="p-4">
          <Input placeholder="Search by reference or payer" value={q} onChange={(e) => setQ(e.target.value)} />
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking</TableHead>
                <TableHead>Payer</TableHead>
                <TableHead className="hidden md:table-cell">Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.bookingRef}</TableCell>
                  <TableCell>{p.payer}</TableCell>
                  <TableCell className="hidden md:table-cell">{p.method}</TableCell>
                  <TableCell>${p.amount}</TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{p.date}</TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                    No payments match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({ label, value, tone }: { label: string; value: string; tone: "primary" | "accent" | "destructive" }) {
  const toneMap = {
    primary: "bg-primary-soft text-primary",
    accent: "bg-accent/20 text-accent-foreground",
    destructive: "bg-destructive/10 text-destructive",
  };
  return (
    <Card className="border-border/60">
      <CardContent className="p-5">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-2 text-2xl font-bold">{value}</p>
        <span className={`inline-block mt-3 px-2 py-0.5 text-xs rounded-full ${toneMap[tone]}`}>{label}</span>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "bg-primary-soft text-primary border-transparent",
    pending: "bg-accent/20 text-accent-foreground border-transparent",
    refunded: "bg-destructive/10 text-destructive border-transparent",
  };
  return <Badge className={map[status] || ""} variant="outline">{status}</Badge>;
}
