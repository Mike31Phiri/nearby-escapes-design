import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Briefcase, Camera, Mail, MapPin, Phone, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/profile/")({
  head: () => ({
    meta: [
      { title: "Profile Overview — Nearby Escapes" },
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

  return (
    <div className="space-y-6">
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
                <a href="/host">
                  Switch to hosting
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </a>
              </Button>
            ) : (
              <Button asChild>
                <a href="/host">Get started</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
