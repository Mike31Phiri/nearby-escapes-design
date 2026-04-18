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
import { adminBookings } from "@/lib/admin-mock";

export const Route = createFileRoute("/admin/bookings")({
  component: AdminBookingsPage,
});

const statuses = ["all", "pending", "confirmed", "completed", "cancelled"] as const;
type Status = (typeof statuses)[number];

function AdminBookingsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<Status>("all");

  const rows = useMemo(() => {
    return adminBookings.filter((b) => {
      const matchesQ = !q ||
        b.reference.toLowerCase().includes(q.toLowerCase()) ||
        b.guest.toLowerCase().includes(q.toLowerCase()) ||
        b.listing.toLowerCase().includes(q.toLowerCase());
      const matchesStatus = status === "all" || b.status === status;
      return matchesQ && matchesStatus;
    });
  }, [q, status]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Bookings</h1>
          <p className="text-sm text-muted-foreground">All reservations across the platform.</p>
        </div>
        <Button variant="outline">Export CSV</Button>
      </div>

      <Card className="border-border/60">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Search by reference, guest or listing"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="flex-1"
          />
          <div className="flex gap-1 rounded-xl bg-muted p-1 overflow-x-auto">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize whitespace-nowrap ${
                  status === s ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead className="hidden md:table-cell">Listing</TableHead>
                <TableHead className="hidden lg:table-cell">Dates</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-mono text-xs">{b.reference}</TableCell>
                  <TableCell>{b.guest}</TableCell>
                  <TableCell className="hidden md:table-cell">{b.listing}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">
                    {b.checkIn} → {b.checkOut}
                  </TableCell>
                  <TableCell>${b.amount}</TableCell>
                  <TableCell>
                    <StatusBadge status={b.status} />
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                    No bookings match your filters.
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

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmed: "bg-primary-soft text-primary border-transparent",
    completed: "bg-muted text-foreground border-transparent",
    pending: "bg-accent/20 text-accent-foreground border-transparent",
    cancelled: "bg-destructive/10 text-destructive border-transparent",
  };
  return <Badge className={map[status] || ""} variant="outline">{status}</Badge>;
}
