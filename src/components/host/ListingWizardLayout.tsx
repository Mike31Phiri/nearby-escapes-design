import { Link, useLocation } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const steps = [
  { path: "/host/new-property/step-1", label: "Type" },
  { path: "/host/new-property/step-2", label: "Location" },
  { path: "/host/new-property/step-3", label: "Floor plan" },
  { path: "/host/new-property/step-4", label: "Amenities" },
  { path: "/host/new-property/step-5", label: "Photos" },
  { path: "/host/new-property/step-6", label: "Title" },
  { path: "/host/new-property/step-7", label: "Description" },
  { path: "/host/new-property/step-8", label: "Pricing" },
  { path: "/host/new-property/step-9", label: "Availability" },
  { path: "/host/new-property/review", label: "Review" },
];

export function ListingWizardLayout({
  children,
  eyebrow,
  title,
  description,
  step,
  onNext,
  onBack,
  nextDisabled = false,
  nextLabel,
  backLabel,
}: {
  children: React.ReactNode;
  eyebrow?: string;
  title: string;
  description: string;
  step: number;
  onNext?: () => void;
  onBack?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  backLabel?: string;
}) {
  const location = useLocation();
  const currentIdx = steps.findIndex((s) => s.path === location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Progress bar */}
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-none">
            {steps.map((s, i) => {
              const isCompleted = i < currentIdx;
              const isCurrent = i === currentIdx;
              return (
                <Link
                  key={s.path}
                  to={s.path}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-[var(--transition-smooth)]",
                    isCurrent && "bg-primary-soft text-primary",
                    isCompleted && "text-primary hover:bg-primary-soft",
                    !isCurrent && !isCompleted && "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] ring-1 ring-current">
                      {i + 1}
                    </span>
                  )}
                  <span className="hidden sm:inline">{s.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-8 md:px-6 md:py-12">
        <header className="mb-8">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl font-display">
            {title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </header>

        <div className="space-y-6">{children}</div>

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between border-t border-border/50 pt-6">
          {step > 1 ? (
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {backLabel || "Back"}
            </Button>
          ) : (
            <Link to="/host/new-listing">
              <Button variant="ghost">Cancel</Button>
            </Link>
          )}

          {step < 10 ? (
            <Button
              onClick={onNext}
              disabled={nextDisabled}
              className="bg-[image:var(--gradient-hero)] hover:opacity-95"
            >
              {nextLabel || "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </main>
    </div>
  );
}
