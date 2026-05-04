"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ListingWizardLayout } from "@/components/host/ListingWizardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const provinces = [
  "Lusaka Province",
  "Copperbelt Province",
  "Southern Province",
  "Eastern Province",
  "Western Province",
  "Central Province",
  "North-Western Province",
  "Muchinga Province",
  "Northern Province",
  "Luapula Province",
];

export function Step2Location() {
  const router = useRouter();
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");

  const canProceed = street.trim() && city.trim() && province;

  return (
    <ListingWizardLayout
      eyebrow="Step 2 of 10"
      title="Where's your property located?"
      description="Guests will see the neighborhood after booking. Your exact address stays private until then."
      step={2}
      onNext={() => router.push("/host/new-property/step-3")}
      onBack={() => router.push("/host/new-property/step-1")}
      nextDisabled={!canProceed}
    >
      <div className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="street">Street address</Label>
          <Input
            id="street"
            placeholder="e.g. 12 Mosi-oa-Tunya Road"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="city">City / Town</Label>
            <Input
              id="city"
              placeholder="e.g. Livingstone"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Province</Label>
            <Select value={province} onValueChange={setProvince}>
              <SelectTrigger>
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="directions">Arrival directions (optional)</Label>
          <Textarea
            id="directions"
            placeholder="Help guests find your place — landmarks, gate codes, driving tips..."
            rows={3}
          />
          <p className="text-xs text-muted-foreground">Only shared with guests after they book.</p>
        </div>
      </div>
    </ListingWizardLayout>
  );
}
