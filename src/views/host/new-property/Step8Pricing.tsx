"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ListingWizardLayout } from "@/components/host/ListingWizardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function Step8Pricing() {
  const router = useRouter();
  const [basePrice, setBasePrice] = useState("");
  const [weekendPrice, setWeekendPrice] = useState("");
  const [cleaningFee, setCleaningFee] = useState("");
  const [weeklyDiscount, setWeeklyDiscount] = useState("10");
  const [smartPricing, setSmartPricing] = useState(false);

  const base = Number(basePrice) || 0;
  const canProceed = base >= 10;

  return (
    <ListingWizardLayout
      eyebrow="Step 8 of 10"
      title="Set your pricing"
      description="Start with a base nightly rate. You can adjust anytime and add seasonal rates later."
      step={8}
      onNext={() => router.push("/host/new-property/step-9")}
      onBack={() => router.push("/host/new-property/step-7")}
      nextDisabled={!canProceed}
    >
      <div className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="base-price">Base price per night (USD)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              $
            </span>
            <Input
              id="base-price"
              type="number"
              min={0}
              placeholder="0"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              className="pl-7 h-11"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="weekend-price">Weekend price (USD, optional)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                $
              </span>
              <Input
                id="weekend-price"
                type="number"
                min={0}
                placeholder={base ? String(Math.round(base * 1.2)) : "0"}
                value={weekendPrice}
                onChange={(e) => setWeekendPrice(e.target.value)}
                className="pl-7"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cleaning-fee">Cleaning fee (USD, optional)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                $
              </span>
              <Input
                id="cleaning-fee"
                type="number"
                min={0}
                placeholder="0"
                value={cleaningFee}
                onChange={(e) => setCleaningFee(e.target.value)}
                className="pl-7"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="weekly-discount">Weekly discount (%)</Label>
          <Input
            id="weekly-discount"
            type="number"
            min={0}
            max={99}
            value={weeklyDiscount}
            onChange={(e) => setWeeklyDiscount(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Applied automatically for stays of 7+ nights.
          </p>
        </div>

        <Separator />

        <Card className="border-border/60">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-semibold">Smart pricing</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Automatically adjust prices based on demand.
              </p>
            </div>
            <Switch checked={smartPricing} onCheckedChange={setSmartPricing} />
          </CardContent>
        </Card>

        {/* Earnings preview */}
        {base > 0 && (
          <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Estimated earnings
            </p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Per night</span>
                <span className="font-medium">${base}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Per week (after discount)</span>
                <span className="font-medium">
                  ${Math.round(base * 7 * (1 - Number(weeklyDiscount || 0) / 100))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Per month (estimated)</span>
                <span className="font-medium">${Math.round(base * 30 * 0.75)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ListingWizardLayout>
  );
}
