import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/profile/settings")({
  head: () => ({ meta: [{ title: "Account settings — Nearby Escapes" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, logout, setRole } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] space-y-2">
        <h2 className="font-semibold">Account</h2>
        <p className="text-sm text-muted-foreground">Email: {user.email}</p>
        <p className="text-sm text-muted-foreground">
          Member since: {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <h2 className="font-semibold">Admin access (dev)</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Current role: <span className="font-medium capitalize text-foreground">{user.role}</span>.
          Toggle admin role to test the admin section. Replace with real role management when wiring a backend.
        </p>
        <div className="mt-4 flex gap-2">
          {user.role !== "admin" ? (
            <Button
              className="bg-[image:var(--gradient-hero)] hover:opacity-95"
              onClick={() => {
                setRole("admin");
                toast.success("You are now an admin.");
              }}
            >
              Promote me to admin
            </Button>
          ) : (
            <>
              <Button
                className="bg-[image:var(--gradient-hero)] hover:opacity-95"
                onClick={() => navigate({ to: "/admin" })}
              >
                Open admin
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setRole("guest");
                  toast.success("Admin role removed.");
                }}
              >
                Revoke admin
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-destructive/30 bg-card p-6 shadow-[var(--shadow-card)]">
        <h2 className="font-semibold">Sign out</h2>
        <p className="mt-1 text-sm text-muted-foreground">You can sign back in any time.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            logout();
            toast.success("Signed out.");
            navigate({ to: "/" });
          }}
        >
          <LogOut className="h-4 w-4 mr-2" /> Sign out
        </Button>
      </div>
    </div>
  );
}
