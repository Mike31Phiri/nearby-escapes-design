import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  LogOut,
  ShieldCheck,
  User as UserIcon,
  KeyRound,
  Lock,
  Bell,
  CreditCard,
  Globe,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/profile/settings")({
  head: () => ({ meta: [{ title: "Account settings — Nearby Escapes" }] }),
  component: SettingsPage,
});

type SectionId =
  | "account"
  | "personal"
  | "security"
  | "privacy"
  | "notifications"
  | "payments"
  | "languages";

const sections: { id: SectionId; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
  { id: "account", label: "Account settings", icon: UserIcon, desc: "Email, role and account status." },
  { id: "personal", label: "Personal information", icon: UserIcon, desc: "Name, phone and location." },
  { id: "security", label: "Login & security", icon: KeyRound, desc: "Password and two-factor auth." },
  { id: "privacy", label: "Privacy", icon: Lock, desc: "Data sharing and visibility." },
  { id: "notifications", label: "Notifications", icon: Bell, desc: "Email and push preferences." },
  { id: "payments", label: "Payments", icon: CreditCard, desc: "Cards and payout methods." },
  { id: "languages", label: "Languages & currency", icon: Globe, desc: "Display language and currency." },
];

function SettingsPage() {
  const { user, logout, setRole, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState<SectionId>("account");

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [location, setLocation] = useState(user?.location || "");
  const [twoFactor, setTwoFactor] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [tripReminders, setTripReminders] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);
  const [shareActivity, setShareActivity] = useState(false);
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("USD");

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account, preferences and privacy.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        {/* Sidebar nav */}
        <nav className="rounded-3xl border border-border bg-card p-2 shadow-[var(--shadow-card)] h-max">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`w-full flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active === id
                  ? "bg-primary-soft text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                {label}
              </span>
              <ChevronRight className="h-4 w-4 opacity-60" />
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="space-y-6 min-w-0">
          {active === "account" && (
            <Section title="Account settings" desc="Your core account details.">
              <Row label="Email" value={user.email} />
              <Row label="Role" value={user.role} capitalize />
              <Row label="Member since" value={new Date(user.createdAt).toLocaleDateString()} />
              <Separator />
              <div className="rounded-2xl border border-border p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">Admin access (dev)</h3>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Toggle admin role to test the admin section.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {user.role !== "admin" ? (
                    <Button
                      size="sm"
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
                      <Button size="sm" className="bg-[image:var(--gradient-hero)] hover:opacity-95" onClick={() => navigate({ to: "/admin" })}>
                        Open admin
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setRole("guest"); toast.success("Admin role removed."); }}>
                        Revoke admin
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold text-sm">Sign out</h3>
                <p className="text-xs text-muted-foreground mt-1">You can sign back in any time.</p>
                <Button
                  variant="outline"
                  className="mt-3"
                  onClick={() => {
                    logout();
                    toast.success("Signed out.");
                    navigate({ to: "/" });
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" /> Sign out
                </Button>
              </div>
            </Section>
          )}

          {active === "personal" && (
            <Section title="Personal information" desc="Update how others see you on Nearby Escapes.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="fullName" label="Full name" value={fullName} onChange={setFullName} />
                <Field id="phone" label="Phone" value={phone} onChange={setPhone} placeholder="+260 …" />
                <div className="sm:col-span-2">
                  <Field id="location" label="Location" value={location} onChange={setLocation} placeholder="Lusaka, Zambia" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  className="bg-[image:var(--gradient-hero)] hover:opacity-95"
                  onClick={() => { updateProfile({ fullName, phone, location }); toast.success("Profile updated."); }}
                >
                  Save changes
                </Button>
              </div>
            </Section>
          )}

          {active === "security" && (
            <Section title="Login & security" desc="Keep your account safe.">
              <ToggleRow
                label="Two-factor authentication"
                desc="Require a one-time code in addition to your password."
                checked={twoFactor}
                onChange={(v) => { setTwoFactor(v); toast.success(`2FA ${v ? "enabled" : "disabled"}.`); }}
              />
              <Separator />
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Password</p>
                  <p className="text-xs text-muted-foreground">Rotate every 90 days for best security.</p>
                </div>
                <Button variant="outline" onClick={() => toast.info("Password change flow coming soon.")}>Change password</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Active sessions</p>
                  <p className="text-xs text-muted-foreground">Sign out from devices you no longer use.</p>
                </div>
                <Button variant="outline" onClick={() => toast.success("All other sessions signed out.")}>Sign out everywhere</Button>
              </div>
            </Section>
          )}

          {active === "privacy" && (
            <Section title="Privacy" desc="Control how your information is shared.">
              <ToggleRow
                label="Public profile"
                desc="Let other travellers and hosts view your profile."
                checked={profileVisible}
                onChange={setProfileVisible}
              />
              <Separator />
              <ToggleRow
                label="Share activity for recommendations"
                desc="Use your search and booking history to personalise suggestions."
                checked={shareActivity}
                onChange={setShareActivity}
              />
              <Separator />
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Download your data</p>
                  <p className="text-xs text-muted-foreground">Get a copy of your account data.</p>
                </div>
                <Button variant="outline" onClick={() => toast.success("We'll email you a download link.")}>Request data</Button>
              </div>
            </Section>
          )}

          {active === "notifications" && (
            <Section title="Notifications" desc="Choose what we contact you about.">
              <ToggleRow
                label="Trip reminders"
                desc="Reminders before check-in and travel dates."
                checked={tripReminders}
                onChange={setTripReminders}
              />
              <Separator />
              <ToggleRow
                label="Promotions & offers"
                desc="Discounts, hidden gems and seasonal deals."
                checked={marketingEmails}
                onChange={setMarketingEmails}
              />
            </Section>
          )}

          {active === "payments" && (
            <Section title="Payments" desc="Manage cards and payout methods.">
              <div className="rounded-2xl border border-dashed border-border p-6 text-center">
                <CreditCard className="h-6 w-6 mx-auto text-muted-foreground" />
                <p className="mt-2 text-sm font-medium">No payment methods yet</p>
                <p className="text-xs text-muted-foreground">Add a card to speed up checkout.</p>
                <Button className="mt-4 bg-[image:var(--gradient-hero)] hover:opacity-95" onClick={() => toast.info("Payment setup coming soon.")}>
                  Add payment method
                </Button>
              </div>
            </Section>
          )}

          {active === "languages" && (
            <Section title="Languages & currency" desc="Set your preferred language and display currency.">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ny">Nyanja</SelectItem>
                      <SelectItem value="bem">Bemba</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD — US Dollar</SelectItem>
                      <SelectItem value="ZMW">ZMW — Zambian Kwacha</SelectItem>
                      <SelectItem value="EUR">EUR — Euro</SelectItem>
                      <SelectItem value="GBP">GBP — British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  className="bg-[image:var(--gradient-hero)] hover:opacity-95"
                  onClick={() => toast.success("Preferences saved.")}
                >
                  Save preferences
                </Button>
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] space-y-5">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      {children}
    </div>
  );
}

function Row({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`text-sm font-medium ${capitalize ? "capitalize" : ""}`}>{value}</p>
    </div>
  );
}

function Field({ id, label, value, onChange, placeholder }: { id: string; label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-11" />
    </div>
  );
}

function ToggleRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
