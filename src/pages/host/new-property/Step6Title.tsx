import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ListingWizardLayout } from "@/components/host/ListingWizardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MAX = 50;

export function Step6Title() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");

  const charCount = title.length;
  const isValid = charCount >= 5 && charCount <= MAX;

  return (
    <ListingWizardLayout
      eyebrow="Step 6 of 10"
      title="Give your place a name"
      description="A short, memorable title works best. Highlight what makes it unique."
      step={6}
      onNext={() => navigate({ to: "/host/new-property/step-7" })}
      onBack={() => navigate({ to: "/host/new-property/step-5" })}
      nextDisabled={!isValid}
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="title">Listing title</Label>
          <Input
            id="title"
            placeholder="e.g. Riverside Lodge near Victoria Falls"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, MAX))}
            className="text-lg h-12"
          />
          <div className="flex justify-between text-xs">
            <span className={charCount < 5 ? "text-destructive" : "text-muted-foreground"}>
              {charCount < 5 ? `At least ${5 - charCount} more characters` : "Looks good"}
            </span>
            <span className={charCount > MAX - 10 ? "text-destructive" : "text-muted-foreground"}>
              {charCount}/{MAX}
            </span>
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-2xl border border-border/60 bg-muted/30 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Preview
          </p>
          <h2 className="text-xl font-bold tracking-tight font-display">
            {title || "Your listing title"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            This is how guests will see your listing in search results.
          </p>
        </div>
      </div>
    </ListingWizardLayout>
  );
}
