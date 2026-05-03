import { useState } from "react";
import { useRouter } from "next/navigation";
import { ListingWizardLayout } from "@/components/host/ListingWizardLayout";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const amenityGroups = [
  {
    title: "Essentials",
    items: [
      "Wi-Fi",
      "Air conditioning",
      "Hot water",
      "Towels & linens",
      "Soap & shampoo",
      "Toilet paper",
    ],
  },
  {
    title: "Comfort",
    items: ["Pool", "Kitchen", "Washer", "Free parking", "TV", "Workspace"],
  },
  {
    title: "Safety & access",
    items: [
      "Smoke alarm",
      "Fire extinguisher",
      "First aid kit",
      "Step-free access",
      "Wide doorways",
    ],
  },
  {
    title: "Outdoor",
    items: [
      "Garden",
      "Patio / balcony",
      "Braai / BBQ",
      "Fire pit",
      "River view",
      "Wildlife viewing",
    ],
  },
];

export function Step4Amenities() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(item: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  }

  return (
    <ListingWizardLayout
      eyebrow="Step 4 of 10"
      title="What amenities do you offer?"
      description="Select everything available to guests. You can add more later."
      step={4}
      onNext={() => router.push("/host/new-property/step-5")}
      onBack={() => router.push("/host/new-property/step-3")}
      nextLabel={`Next (${selected.size} selected)`}
    >
      <div className="space-y-6">
        {amenityGroups.map((group, gi) => (
          <div key={group.title}>
            {gi > 0 && <Separator className="mb-6" />}
            <h3 className="text-sm font-semibold mb-3">{group.title}</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {group.items.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-border/60 p-3 cursor-pointer hover:bg-muted/50 transition-colors has-[button[data-state=checked]]:border-primary has-[button[data-state=checked]]:bg-primary-soft/30"
                >
                  <Checkbox checked={selected.has(item)} onCheckedChange={() => toggle(item)} />
                  <Label className="cursor-pointer text-sm font-normal">{item}</Label>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ListingWizardLayout>
  );
}
