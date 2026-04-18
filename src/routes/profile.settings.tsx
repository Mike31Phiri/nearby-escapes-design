import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/profile/settings")({
  head: () => ({ meta: [{ title: "Account settings — Nearby Escapes" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, logout } = useAuth();
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
