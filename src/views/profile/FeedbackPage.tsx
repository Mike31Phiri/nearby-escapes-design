import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ThumbsUp, Bug, Lightbulb, Heart } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const types = [
  { id: "praise", label: "Praise", icon: Heart },
  { id: "bug", label: "Bug report", icon: Bug },
  { id: "idea", label: "Idea", icon: Lightbulb },
  { id: "other", label: "Other", icon: ThumbsUp },
];

export function FeedbackPage() {
  const [type, setType] = useState("idea");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Thanks for the feedback!");
    }, 600);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Profile
        </Link>

        <header className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Feedback</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">Help us improve</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Tell us what's working and what isn't. We read every message.
          </p>
        </header>

        <Card className="mt-8 border-border/60">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label className="block mb-2">Type</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {types.map((t) => {
                    const active = type === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setType(t.id)}
                        className={`rounded-xl border p-3 text-sm flex flex-col items-center gap-1.5 transition ${
                          active
                            ? "border-primary bg-primary-soft text-primary"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <t.icon className="h-4 w-4" />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Short summary" required />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={6}
                  placeholder="Walk us through what you saw or what you'd like."
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contact">Contact email (optional)</Label>
                <Input id="contact" type="email" placeholder="If you want a reply" />
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Sending…" : "Send feedback"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
