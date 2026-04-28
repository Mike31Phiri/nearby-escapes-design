import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Briefcase, Compass } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function ModeSwitcher({ className }: { className?: string }) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isHostMode = location.pathname.startsWith("/host");

  if (!user) return null;

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border/60 bg-muted/50 p-1",
        className
      )}
    >
      <Link
        to="/"
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-[var(--transition-smooth)]",
          !isHostMode
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Compass className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Travel</span>
      </Link>
      <Link
        to="/host"
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-[var(--transition-smooth)]",
          isHostMode
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Briefcase className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Host</span>
      </Link>
    </div>
  );
}
