import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { ListingWizardLayout } from "@/components/host/ListingWizardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

function Counter({
  label,
  value,
  onChange,
  min = 0,
  max = 50,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-8 text-center text-sm font-semibold tabular-nums">{value}</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

export function Step3FloorPlan() {
  const navigate = useRouter();
  const [bedrooms, setBedrooms] = useState(1);
  const [beds, setBeds] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [maxGuests, setMaxGuests] = useState(2);
  const [roomName, setRoomName] = useState("");

  return (
    <ListingWizardLayout
      eyebrow="Step 3 of 10"
      title="How is your place laid out?"
      description="Accurate counts help guests pick the right stay. You can add room details later."
      step={3}
      onNext={() => router.push("/host/new-property/step-4")}
      onBack={() => router.push("/host/new-property/step-2")}
    >
      <Card className="border-border/60">
        <CardContent className="p-5 divide-y divide-border/50">
          <Counter label="Bedrooms" value={bedrooms} onChange={setBedrooms} min={1} />
          <Counter label="Beds" value={beds} onChange={setBeds} min={1} />
          <Counter label="Bathrooms" value={bathrooms} onChange={setBathrooms} min={1} />
          <Counter label="Max guests" value={maxGuests} onChange={setMaxGuests} min={1} max={30} />
        </CardContent>
      </Card>

      <div className="space-y-1.5">
        <Label htmlFor="room-name">Room name (optional)</Label>
        <Input
          id="room-name"
          placeholder="e.g. Master suite, Family room"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Name each sleeping area so guests know what to expect.
        </p>
      </div>
    </ListingWizardLayout>
  );
}
