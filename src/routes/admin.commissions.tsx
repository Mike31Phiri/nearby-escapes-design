import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { adminCommissions } from "@/lib/admin-mock";

export const Route = createFileRoute("/admin/commissions")({
  component: AdminCommissionsPage,
});

function AdminCommissionsPage() {
  const totalEarned = adminCommissions.reduce((s, c) => s + c.commission, 0);
  const pending = adminCommissions.filter((c) => c.payoutStatus === "pending").reduce((s, c) => s + c.commission, 0);
  const paid = totalEarned - pending;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Commissions</h1>
          <p className="text-sm text-muted-foreground">Platform fees earned per booking and host payouts.</p>
        </div>
        <Button className="bg-[image:var(--gradient-hero)] hover:opacity-95">Run payouts</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Total earned</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">${totalEarned.toFixed(2)}</p></CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Paid out</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">${paid.toFixed(2)}</p></CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Pending</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">${pending.toFixed(2)}</p></CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Host</TableHead>
                <TableHead>Booking</TableHead>
                <TableHead className="hidden md:table-cell">Gross</TableHead>
                <TableHead className="hidden md:table-cell">Rate</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Payout</TableHead>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminCommissions.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.host}</TableCell>
                  <TableCell className="font-mono text-xs">{c.bookingRef}</TableCell>
                  <TableCell className="hidden md:table-cell">${c.gross}</TableCell>
                  <TableCell className="hidden md:table-cell">{c.rate}%</TableCell>
                  <TableCell className="font-semibold">${c.commission.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={c.payoutStatus === "paid"
                        ? "bg-primary-soft text-primary border-transparent"
                        : "bg-accent/20 text-accent-foreground border-transparent"}
                    >
                      {c.payoutStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">{c.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
