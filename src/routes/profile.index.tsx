import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Briefcase, Camera, Mail, MapPin, Phone, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/profile/")({
  head: () => ({
    meta: [
      { title: "Profile overview — Nearby Escapes" },
      { name: "description", content: "Your Nearby Escapes profile overview." },
    ],
  }),
  component: ProfileOverview,
});

function ProfileOverview() {
  const { user, updateProfile } = useAuth();
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 md:px-6 py-8 space-y-6">
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

      <form onSubmit={onSave} className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] space-y-5">
        <h2 className="text-lg font-semibold">Personal information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-11" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-9 h-11" placeholder="+260 …" />
            </div>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="pl-9 h-11" placeholder="Lusaka, Zambia" />
            </div>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="bio">About you</Label>
            <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} placeholder="Tell hosts a little about yourself…" />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" className="bg-[image:var(--gradient-hero)] hover:opacity-95">
            <Save className="h-4 w-4 mr-2" /> Save changes
          </Button>
        </div>
      </form>

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
      </main>
      <SiteFooter />
    </div>
  );
}
