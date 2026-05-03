import { useState } from "react";
import { useRouter } from "next/navigation";
import { ListingWizardLayout } from "@/components/host/ListingWizardLayout";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const MAX = 4000;

export function Step7Description() {
  const router = useRouter();
  const [description, setDescription] = useState("");

  const charCount = description.length;
  const isValid = charCount >= 20;

  return (
    <ListingWizardLayout
      eyebrow="Step 7 of 10"
      title="Describe your place"
      description="Tell guests what makes your property special — the setting, the experience, the little details."
      step={7}
      onNext={() => router.push("/host/new-property/step-8")}
      onBack={() => router.push("/host/new-property/step-6")}
      nextDisabled={!isValid}
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="description">Listing description</Label>
          <Textarea
            id="description"
            placeholder="Describe the space, surroundings, and what guests can expect during their stay..."
            rows={8}
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, MAX))}
            className="text-sm leading-relaxed resize-y"
          />
          <div className="flex justify-between text-xs">
            <span className={!isValid ? "text-destructive" : "text-muted-foreground"}>
              {!isValid ? `At least ${20 - charCount} more characters` : "Great description"}
            </span>
            <span className={charCount > MAX - 200 ? "text-destructive" : "text-muted-foreground"}>
              {charCount}/{MAX}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Tips
          </p>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li>Mention the setting — river, bush, city center</li>
            <li>Describe the sleeping arrangements and bathrooms</li>
            <li>Highlight unique experiences — game drives, sunset cruises</li>
            <li>Note any limitations honestly — dirt road access, no Wi-Fi</li>
          </ul>
        </div>
      </div>
    </ListingWizardLayout>
  );
}
