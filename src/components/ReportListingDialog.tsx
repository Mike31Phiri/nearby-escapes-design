import { useState, type FormEvent } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Flag } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  reason: z.string().min(1, "Pick a reason"),
  details: z.string().trim().min(10, "Add a few details").max(1000, "Too long"),
});

const REASONS = [
  "Inaccurate information",
  "Misleading photos",
  "Suspected scam",
  "Inappropriate content",
  "Safety concern",
  "Other",
];

export function ReportListingDialog({
  listingId,
  listingName,
}: {
  listingId: string;
  listingName: string;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      reason,
      details: data.get("details"),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      // TODO: POST to NestJS backend at /api/reports
      await new Promise((r) => setTimeout(r, 500));
      toast.success("Report submitted. Our team will review it.");
      setOpen(false);
      setReason("");
    } catch {
      toast.error("Couldn't submit the report. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <Flag className="h-4 w-4" /> Report this listing
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report listing</DialogTitle>
          <DialogDescription>
            Tell us what's wrong with{" "}
            <span className="font-medium text-foreground">{listingName}</span>. Reports are
            confidential.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <input type="hidden" name="listingId" value={listingId} />
          <div className="space-y-1.5">
            <Label htmlFor="reason">Reason</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Choose a reason" />
              </SelectTrigger>
              <SelectContent>
                {REASONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="details">Details</Label>
            <Textarea id="details" name="details" rows={4} maxLength={1000} required />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-[image:var(--gradient-hero)] hover:opacity-95"
            >
              {submitting ? "Sending…" : "Submit report"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
