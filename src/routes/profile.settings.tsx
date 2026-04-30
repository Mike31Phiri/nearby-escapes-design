import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  LogOut,
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
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
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

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCardForm, setShowCardForm] = useState(false);
  const [cards, setCards] = useState<{ id: string; brand: string; last4: string; exp: string; name: string }[]>([]);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  function detectBrand(num: string) {
    const n = num.replace(/\s+/g, "");
    if (/^4/.test(n)) return "Visa";
    if (/^(5[1-5]|2[2-7])/.test(n)) return "Mastercard";
    if (/^3[47]/.test(n)) return "Amex";
    return "Card";
  }

  function onChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Fill in all password fields.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    if (newPassword === currentPassword) {
      toast.error("New password must be different from your current one.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordForm(false);
    toast.success("Password updated successfully.");
  }

  function onAddCard(e: React.FormEvent) {
    e.preventDefault();
    const digits = cardNumber.replace(/\s+/g, "");
    if (!cardName.trim() || digits.length < 13 || !/^\d+$/.test(digits)) {
      toast.error("Enter a valid name and card number.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardExp)) {
      toast.error("Expiry must be in MM/YY format.");
      return;
    }
    if (!/^\d{3,4}$/.test(cardCvc)) {
      toast.error("CVC must be 3 or 4 digits.");
      return;
    }
    setCards((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        brand: detectBrand(digits),
        last4: digits.slice(-4),
        exp: cardExp,
        name: cardName.trim(),
      },
    ]);
    setCardName("");
    setCardNumber("");
    setCardExp("");
    setCardCvc("");
    setShowCardForm(false);
    toast.success("Card added.");
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 md:px-6 py-8 space-y-6">
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
              <div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Password</p>
                    <p className="text-xs text-muted-foreground">Rotate every 90 days for best security.</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowPasswordForm((v) => !v)}
                  >
                    {showPasswordForm ? "Cancel" : "Change password"}
                  </Button>
                </div>
                {showPasswordForm && (
                  <form onSubmit={onChangePassword} className="mt-4 space-y-3 rounded-2xl border border-border/60 bg-muted/30 p-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="current-password">Current password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        autoComplete="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="new-password">New password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          autoComplete="new-password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <p className="text-[11px] text-muted-foreground">At least 8 characters.</p>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="confirm-password">Confirm new password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setCurrentPassword("");
                          setNewPassword("");
                          setConfirmPassword("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-[image:var(--gradient-hero)] hover:opacity-95">
                        Update password
                      </Button>
                    </div>
                  </form>
                )}
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
              {cards.length > 0 && (
                <div className="space-y-2">
                  {cards.map((c) => (
                    <div key={c.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-12 items-center justify-center rounded-md bg-muted text-xs font-semibold">
                          {c.brand}
                        </div>
                        <div>
                          <p className="text-sm font-medium">•••• {c.last4}</p>
                          <p className="text-xs text-muted-foreground">{c.name} · exp {c.exp}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCards((prev) => prev.filter((x) => x.id !== c.id));
                          toast.success("Card removed.");
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {!showCardForm ? (
                <div className="rounded-2xl border border-dashed border-border p-6 text-center">
                  <CreditCard className="h-6 w-6 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium">
                    {cards.length > 0 ? "Add another card" : "No payment methods yet"}
                  </p>
                  <p className="text-xs text-muted-foreground">Add a card to speed up checkout.</p>
                  <Button
                    className="mt-4 bg-[image:var(--gradient-hero)] hover:opacity-95"
                    onClick={() => setShowCardForm(true)}
                  >
                    Add payment method
                  </Button>
                </div>
              ) : (
                <form onSubmit={onAddCard} className="space-y-3 rounded-2xl border border-border/60 bg-muted/30 p-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="card-name">Cardholder name</Label>
                    <Input
                      id="card-name"
                      placeholder="Full name on card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="card-number">Card number</Label>
                    <Input
                      id="card-number"
                      inputMode="numeric"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="card-exp">Expiry (MM/YY)</Label>
                      <Input
                        id="card-exp"
                        placeholder="04/28"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="card-cvc">CVC</Label>
                      <Input
                        id="card-cvc"
                        inputMode="numeric"
                        placeholder="123"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setShowCardForm(false);
                        setCardName("");
                        setCardNumber("");
                        setCardExp("");
                        setCardCvc("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-[image:var(--gradient-hero)] hover:opacity-95">
                      Save card
                    </Button>
                  </div>
                </form>
              )}
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
      </main>
      <SiteFooter />
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
