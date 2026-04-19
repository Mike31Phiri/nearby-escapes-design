import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, Mail, Phone, MapPin, Save, ShieldCheck, KeyRound, Bell } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin/profile")({
  head: () => ({
    meta: [
      { title: "Admin Profile — Nearby Escapes" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminProfilePage,
});

function AdminProfilePage() {
  const { user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [location, setLocation] = useState(user?.location || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  if (!user) return null;

  const initials = user.fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    updateProfile({ fullName, phone, location, bio });
    toast.success("Admin profile updated.");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your administrator account, security and notification preferences.
        </p>
      </div>

      {/* Identity card */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[image:var(--gradient-hero)] text-2xl font-bold text-primary-foreground">
              {initials || "A"}
            </div>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background shadow-sm hover:bg-muted"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold tracking-tight truncate">{user.fullName}</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Mail className="h-3.5 w-3.5" /> {user.email}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary">
                <ShieldCheck className="h-3 w-3" /> Administrator
              </span>
              <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal info */}
      <form
        onSubmit={onSave}
        className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] space-y-5"
      >
        <div>
          <h3 className="text-lg font-semibold">Personal information</h3>
          <p className="text-sm text-muted-foreground">Visible to other admins on the team.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-11" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-9 h-11"
                placeholder="+260 …"
              />
            </div>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-9 h-11"
                placeholder="Lusaka, Zambia"
              />
            </div>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Short bio shown on the admin team page."
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" className="bg-[image:var(--gradient-hero)] hover:opacity-95">
            <Save className="h-4 w-4 mr-2" /> Save changes
          </Button>
        </div>
      </form>

      {/* Security */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] space-y-5">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <KeyRound className="h-4 w-4" /> Security
          </h3>
          <p className="text-sm text-muted-foreground">Keep your administrator account safe.</p>
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Two-factor authentication</p>
            <p className="text-xs text-muted-foreground">
              Require a one-time code in addition to your password.
            </p>
          </div>
          <Switch
            checked={twoFactor}
            onCheckedChange={(v) => {
              setTwoFactor(v);
              toast.success(`2FA ${v ? "enabled" : "disabled"}.`);
            }}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Password</p>
            <p className="text-xs text-muted-foreground">Last changed never. Rotate every 90 days.</p>
          </div>
          <Button variant="outline" onClick={() => toast.info("Password change flow coming soon.")}>
            Change password
          </Button>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] space-y-5">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </h3>
          <p className="text-sm text-muted-foreground">Choose what we email you about.</p>
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Operational alerts</p>
            <p className="text-xs text-muted-foreground">
              New bookings, failed payments and host applications.
            </p>
          </div>
          <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
        </div>
      </div>
    </div>
  );
}
