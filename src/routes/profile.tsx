import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Briefcase, Camera, Mail, MapPin, Phone, Save, User, Settings as SettingsIcon, Calendar, MessageSquare, Star, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/profile")({
  beforeLoad: ({ location }) => {
    if (typeof window === "undefined") return;
    const sid = localStorage.getItem("ne.session");
    if (!sid) {
      throw redirect({ to: "/login", search: { redirect: location.href } as never });
    }
  },
  component: ProfileLayout,
});

import { redirect } from "@tanstack/react-router";

function ProfileLayout() {
  const { user, updateProfile, logout } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [location, setLocation] = useState(user?.location || "");
  const [bio, setBio] = useState(user?.bio || "");

  if (!user) return null;

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    updateProfile({ fullName, phone, location, bio });
    toast.success("Profile updated.");
  }

  const initials = user.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  const navItems = [
    { to: "/profile/", label: "Overview", icon: User },
    { to: "/profile/edit", label: "Edit Profile", icon: Camera },
    { to: "/profile/verification", label: "Verification", icon: SettingsIcon },
    { to: "/profile/bookings", label: "My Bookings", icon: Calendar },
    { to: "/profile/reviews", label: "Reviews", icon: Star },
    { to: "/profile/messages", label: "Messages", icon: MessageSquare },
    { to: "/profile/settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 md:px-6 py-8 space-y-6">
        {/* Profile Header */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[image:var(--gradient-hero)] text-2xl font-bold text-primary-foreground">
                {initials || "U"}
              </div>
              <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background shadow-sm">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight truncate">{user.fullName}</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> {user.email}
              </p>
              <div className="mt-1.5 inline-flex items-center rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary capitalize">
                {user.role}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          {/* Navigation Sidebar */}
          <nav className="rounded-3xl border border-border bg-card p-2 shadow-[var(--shadow-card)] h-max">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-border">
              <button
                onClick={() => { logout(); toast.success("Signed out."); window.location.href = "/"; }}
                className="w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </nav>

          {/* Content Area */}
          <div className="space-y-6">
            <Outlet />
            
            <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold leading-tight">
                      {user.role === "host" ? "Hosting on Nearby Escapes" : "Become a host"}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {user.role === "host"
                        ? "Switch to hosting to manage listings, calendar and earnings. You can switch back to traveling any time — same account."
                        : "List your lodge, guesthouse or experience and earn from travelers exploring Zambia. You'll keep this same account for your own trips."}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:flex-row md:shrink-0">
                  {user.role === "host" ? (
                    <Button asChild>
                      <Link to="/host">
                        Switch to hosting
                        <ArrowRight className="ml-1.5 h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild>
                      <Link to="/host">Get started</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
