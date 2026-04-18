import { createFileRoute } from "@tanstack/react-router";
import { Plus, Home, Calendar, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/profile/host")({
  head: () => ({ meta: [{ title: "Host dashboard — Nearby Escapes" }] }),
  component: HostDashboard,
});

function HostDashboard() {
  const { user, becomeHost } = useAuth();
  if (!user) return null;

  if (user.role === "guest") {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-[var(--shadow-card)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Home className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-xl font-bold">Become a host</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          Share your space with travelers from across Africa and beyond. It only takes a minute to start.
        </p>
        <Button
          className="mt-5 bg-[image:var(--gradient-hero)] hover:opacity-95"
          onClick={() => {
            becomeHost();
            toast.success("You're now a host! 🎉");
          }}
        >
          Activate host account
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Host dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your listings and bookings.</p>
        </div>
        <Button className="bg-[image:var(--gradient-hero)] hover:opacity-95">
          <Plus className="h-4 w-4 mr-2" /> New listing
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={Home} label="Active listings" value="0" />
        <Stat icon={Calendar} label="Upcoming bookings" value="0" />
        <Stat icon={DollarSign} label="Earnings (mo.)" value="$0" />
      </div>

      <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">No listings yet. Create your first one to get started.</p>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  );
}
