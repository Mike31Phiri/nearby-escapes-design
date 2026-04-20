import { Link, useNavigate } from "@tanstack/react-router";
import { Bed, Bus, Package, Menu, MapPin, HelpCircle, Settings as SettingsIcon, FileText, Home, Briefcase, ShieldCheck, LogOut, UserCircle, Globe } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth";

const primary = [
  { label: "Stays", icon: Bed, to: "/accommodations" as const },
  { label: "Transport", icon: Bus, to: "/bus-booking" as const },
  { label: "Packages", icon: Package, to: "/packages" as const },
];

export function MobileBottomNav() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <nav
        className="fixed bottom-0 inset-x-0 z-40 md:hidden border-t border-border bg-background/95 backdrop-blur-lg"
        aria-label="Primary"
      >
        <ul className="grid grid-cols-4">
          {primary.map(({ label, icon: Icon, to }) => (
            <li key={label}>
              <Link
                to={to}
                className="flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground"
                activeProps={{ className: "text-primary" }}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex w-full flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground"
            >
              <Menu className="h-5 w-5" />
              More
            </button>
          </li>
        </ul>
      </nav>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-80 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>More</SheetTitle>
          </SheetHeader>

          <div className="mt-4 space-y-6">
            <Group title="Discover">
              <RowLink to="/" onSelect={() => setOpen(false)} icon={Home} label="Home" />
              <RowLink to="/gems" onSelect={() => setOpen(false)} icon={MapPin} label="Hidden gems" />
            </Group>

            <Group title="Account">
              {user ? (
                <>
                  <RowLink to="/profile" onSelect={() => setOpen(false)} icon={UserCircle} label="Profile" />
                  <RowLink to="/profile/host" onSelect={() => setOpen(false)} icon={Briefcase} label="List your property" />
                  {user.role === "admin" && (
                    <RowLink to="/admin" onSelect={() => setOpen(false)} icon={ShieldCheck} label="Admin" />
                  )}
                </>
              ) : (
                <>
                  <RowAction onClick={() => { setOpen(false); navigate({ to: "/register" }); }} icon={Briefcase} label="List your property" />
                  <RowAction onClick={() => { setOpen(false); navigate({ to: "/login" }); }} icon={UserCircle} label="Sign in" />
                </>
              )}
            </Group>

            <Group title="Support">
              <RowLink to="/help" onSelect={() => setOpen(false)} icon={HelpCircle} label="Help & support" />
              <RowLink to="/profile/settings" onSelect={() => setOpen(false)} icon={SettingsIcon} label="Settings" />
              <RowLink to="/profile/settings" hash="languages" onSelect={() => setOpen(false)} icon={Globe} label="Languages & currency" />
            </Group>

            <Group title="Legal">
              <RowLink to="/help" onSelect={() => setOpen(false)} icon={FileText} label="Terms of service" />
              <RowLink to="/help" onSelect={() => setOpen(false)} icon={FileText} label="Privacy policy" />
              <RowLink to="/help" onSelect={() => setOpen(false)} icon={FileText} label="Cookie policy" />
            </Group>

            {user && (
              <button
                onClick={() => { setOpen(false); logout(); navigate({ to: "/" }); }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium hover:bg-muted text-left text-destructive"
              >
                <LogOut className="h-5 w-5" /> Sign out
              </button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function RowLink({
  to,
  hash,
  icon: Icon,
  label,
  onSelect,
}: {
  to: string;
  hash?: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onSelect: () => void;
}) {
  return (
    <Link
      to={to}
      hash={hash}
      onClick={onSelect}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
    >
      <Icon className="h-5 w-5 text-muted-foreground" />
      {label}
    </Link>
  );
}

function RowAction({
  onClick,
  icon: Icon,
  label,
}: {
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted text-left"
    >
      <Icon className="h-5 w-5 text-muted-foreground" />
      {label}
    </button>
  );
}
