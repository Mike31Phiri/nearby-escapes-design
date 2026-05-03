import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CircleCheck as CheckCircle2,
  Hop as Home,
  MapPin,
  Bed,
  Wifi,
  Camera,
  Type,
  FileText,
  DollarSign,
  CalendarDays,
  Eye,
  Loader as Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const sections = [
  { id: "type", label: "Property type", icon: Home, step: 1, path: "/host/new-property/step-1" },
  { id: "location", label: "Location", icon: MapPin, step: 2, path: "/host/new-property/step-2" },
  { id: "floor", label: "Floor plan", icon: Bed, step: 3, path: "/host/new-property/step-3" },
  { id: "amenities", label: "Amenities", icon: Wifi, step: 4, path: "/host/new-property/step-4" },
  { id: "photos", label: "Photo tour", icon: Camera, step: 5, path: "/host/new-property/step-5" },
  { id: "title", label: "Title", icon: Type, step: 6, path: "/host/new-property/step-6" },
  {
    id: "description",
    label: "Description",
    icon: FileText,
    step: 7,
    path: "/host/new-property/step-7",
  },
  { id: "pricing", label: "Pricing", icon: DollarSign, step: 8, path: "/host/new-property/step-8" },
  {
    id: "availability",
    label: "Availability",
    icon: CalendarDays,
    step: 9,
    path: "/host/new-property/step-9",
  },
];

export function Step10Review() {
  const router = useRouter();
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  async function handlePublish() {
    setPublishing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setPublishing(false);
    setPublished(true);
    toast.success("Your listing is live! Guests can now find and book your property.");
  }

  if (published) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight font-display">Listing published</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your property is now visible to travelers. You can edit details anytime from your host
              dashboard.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Button
                className="bg-[image:var(--gradient-hero)] hover:opacity-95"
                onClick={() => router.push("/host/properties")}
              >
                View my properties
              </Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                Back to home
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:px-6 md:py-12">
        <Link
          href="/host/new-property/step-9"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to availability
        </Link>

        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Step 10 of 10
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl font-display">
            Review your listing
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Check every section before publishing. Click any section to edit.
          </p>
        </header>

        <div className="mt-8 space-y-3">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.id} href={section.path} className="group block">
                <Card className="border-border/60 transition-[var(--transition-smooth)] hover:border-primary/40 hover:shadow-[var(--shadow-card)]">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          Step {section.step}
                        </span>
                        <Badge
                          variant="outline"
                          className="bg-primary-soft text-primary border-transparent text-[10px]"
                        >
                          Complete
                        </Badge>
                      </div>
                      <p className="font-semibold text-sm mt-0.5">{section.label}</p>
                    </div>
                    <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <Separator className="my-6" />

        <div className="flex items-center gap-3">
          <Button
            onClick={handlePublish}
            disabled={publishing}
            className="bg-[image:var(--gradient-hero)] hover:opacity-95"
          >
            {publishing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Publishing...
              </>
            ) : (
              "Publish listing"
            )}
          </Button>
          <Button variant="outline" onClick={() => toast.info("Draft saved.")}>
            Save as draft
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
