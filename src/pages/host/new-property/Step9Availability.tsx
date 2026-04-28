import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ListingWizardLayout } from "@/components/host/ListingWizardLayout";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function Step9Availability() {
  const navigate = useNavigate();
  const [minStay, setMinStay] = useState("1");
  const [maxStay, setMaxStay] = useState("30");
  const [instantBook, setInstantBook] = useState(false);
  const [checkInTime, setCheckInTime] = useState("14:00");
  const [checkOutTime, setCheckOutTime] = useState("11:00");
  const [advanceNotice, setAdvanceNotice] = useState("1");

  return (
    <ListingWizardLayout
      eyebrow="Step 9 of 10"
      title="Set availability rules"
      description="Define when and how guests can book. You can block specific dates from your calendar later."
      step={9}
      onNext={() => navigate({ to: "/host/new-property/review" })}
      onBack={() => navigate({ to: "/host/new-property/step-8" })}
    >
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="min-stay">Minimum stay (nights)</Label>
            <Input
              id="min-stay"
              type="number"
              min={1}
              max={365}
              value={minStay}
              onChange={(e) => setMinStay(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="max-stay">Maximum stay (nights)</Label>
            <Input
              id="max-stay"
              type="number"
              min={1}
              max={365}
              value={maxStay}
              onChange={(e) => setMaxStay(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Check-in time</Label>
            <Input
              type="time"
              value={checkInTime}
              onChange={(e) => setCheckInTime(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Checkout time</Label>
            <Input
              type="time"
              value={checkOutTime}
              onChange={(e) => setCheckOutTime(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Advance booking notice</Label>
          <Select value={advanceNotice} onValueChange={setAdvanceNotice}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Same day</SelectItem>
              <SelectItem value="1">1 day</SelectItem>
              <SelectItem value="2">2 days</SelectItem>
              <SelectItem value="7">1 week</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="border-border/60">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-semibold">Instant Book</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Let guests book without waiting for your approval.
              </p>
            </div>
            <Switch checked={instantBook} onCheckedChange={setInstantBook} />
          </CardContent>
        </Card>

        <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Calendar
          </p>
          <p className="text-sm text-muted-foreground">
            After publishing, you can block specific dates, set seasonal pricing, and manage
            availability from your host calendar.
          </p>
        </div>
      </div>
    </ListingWizardLayout>
  );
}
