import { useState } from "react";
import { useRouter } from "next/navigation";
import { Hop as Home, Building2, Tent, Hotel, Castle } from "lucide-react";
import { ListingWizardLayout } from "@/components/host/ListingWizardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const propertyTypes = [
  { id: "lodge", label: "Lodge", icon: Castle, desc: "Riverside or bush lodge" },
  { id: "hotel", label: "Hotel", icon: Building2, desc: "Full-service hotel" },
  { id: "camp", label: "Camp", icon: Tent, desc: "Tented or bush camp" },
  { id: "guesthouse", label: "Guesthouse", icon: Home, desc: "Private home or B&B" },
  { id: "boutique-hotel", label: "Boutique hotel", icon: Hotel, desc: "Small designer hotel" },
];

export function Step1PropertyType() {
  const navigate = useRouter();
  const [selected, setSelected] = useState<string>("");

  return (
    <ListingWizardLayout
      eyebrow="Step 1 of 10"
      title="What kind of place are you listing?"
      description="Pick the category that best matches your property. You can change this later."
      step={1}
      onNext={() => router.push("/host/new-property/step-2")}
      onBack={() => router.push("/host/properties")}
      nextDisabled={!selected}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {propertyTypes.map((pt) => {
          const Icon = pt.icon;
          const active = selected === pt.id;
          return (
            <Card
              key={pt.id}
              className={cn(
                "cursor-pointer border-border/60 transition-[var(--transition-smooth)] hover:shadow-[var(--shadow-card)]",
                active && "border-primary ring-2 ring-primary/20"
              )}
              onClick={() => setSelected(pt.id)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors",
                    active ? "bg-primary-soft text-primary" : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{pt.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{pt.desc}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ListingWizardLayout>
  );
}
