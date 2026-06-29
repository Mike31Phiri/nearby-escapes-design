"use client";

import { useState } from "react";
import {
  User,
  Bell,
  CreditCard,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  Building2,
  CheckCircle2,
  Globe,
  Palette,
  Trash2,
  AlertTriangle,
  Banknote,
  Plus,
  Pencil,
  Smartphone,
  Languages,
  Moon,
  Sun,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HostPageHeader } from "@/components/layout/HostPageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/store/authStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

//Toggle Switch ────────────────────────────────────────────────────────

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors cursor-pointer",
        enabled ? "bg-primary" : "bg-gray-200",
      )}
    >
      <div
        className={cn(
          "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
          enabled ? "translate-x-5" : "translate-x-0",
        )}
      />
    </div>
  );
}

//Saved Payment Method Card ────────────────────────────────────────────

interface SavedPaymentMethod {
  id: string;
  type: "bank" | "mobile-money" | "card";
  label: string;
  details: string;
  isDefault: boolean;
}

function PaymentMethodCard({
  method,
  onSetDefault,
  onEdit,
  onRemove,
}: {
  method: SavedPaymentMethod;
  onSetDefault: (id: string) => void;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const icons = {
    bank: Building2,
    "mobile-money": Smartphone,
    card: CreditCard,
  };
  const Icon = icons[method.type];

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border p-4 transition-all hover:shadow-sm",
        method.isDefault ? "border-primary/30 bg-primary/[0.02]" : "border-gray-200 bg-white",
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-[#111111]">{method.label}</p>
          {method.isDefault && (
            <span className="rounded-full bg-primary/10 text-primary text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5">
              Default
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{method.details}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onEdit(method.id)}
          className="h-8 w-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-primary transition-colors"
          aria-label={`Edit ${method.label}`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        {!method.isDefault && (
          <button
            onClick={() => onSetDefault(method.id)}
            className="h-8 rounded-lg px-2 hover:bg-gray-100 text-[9px] font-bold uppercase tracking-wider text-gray-400 hover:text-primary transition-colors"
          >
            Set Default
          </button>
        )}
        <button
          onClick={() => onRemove(method.id)}
          className="h-8 w-8 rounded-lg hover:bg-rose-50 flex items-center justify-center text-gray-400 hover:text-rose-500 transition-colors"
          aria-label={`Remove ${method.label}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

//Section Header ───────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="h-9 w-9 shrink-0 rounded-xl bg-primary/8 flex items-center justify-center text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h2 className="text-base font-bold tracking-tight text-[#111111]">{title}</h2>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
    </div>
  );
}

// MAIN SETTINGS PAGE

export function HostSettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  //Profile State ──
  const [name, setName] = useState(user?.name ?? "Chanda Bwalya");
  const [email, setEmail] = useState(user?.email ?? "chanda.bwalya@nearbyescapes.com");
  const [phone, setPhone] = useState("+260 97 765 4321");
  const [location, setLocation] = useState("Lusaka, Zambia");
  const [bio, setBio] = useState(
    "Zambian-born travel enthusiast and hospitality curator. I handpick the finest lodges, camps, and experiences across Zambia.",
  );
  const [responseTime, setResponseTime] = useState("within 1 hour");

  //Notification State ──
  const [notifyBookings, setNotifyBookings] = useState(true);
  const [notifyMessages, setNotifyMessages] = useState(true);
  const [notifyReviews, setNotifyReviews] = useState(true);
  const [notifyPromotions, setNotifyPromotions] = useState(false);

  //Preferences State ──
  const [language, setLanguage] = useState("english");
  const [currency, setCurrency] = useState("zmw");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");

  //Payment Methods ──
  const [paymentMethods, setPaymentMethods] = useState<SavedPaymentMethod[]>([
    {
      id: "pm-1",
      type: "bank",
      label: "Zambia National Bank",
      details: "Account **** 4832 · Branch: Lusaka",
      isDefault: true,
    },
    {
      id: "pm-2",
      type: "mobile-money",
      label: "Mobile Money",
      details: "+260 97 765 4321 · Airtel Money",
      isDefault: false,
    },
  ]);

  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newPaymentType, setNewPaymentType] = useState<"bank" | "mobile-money" | "card">("bank");
  const [newPaymentLabel, setNewPaymentLabel] = useState("");
  const [newPaymentDetails, setNewPaymentDetails] = useState("");

  //Delete Account Confirmation ──
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  //Handlers ─────────────────────────────────────────────────────────────

  const handleSaveProfile = () => {
    // Simulate saving
    toast.success("Host profile updated successfully!");
  };

  const handleSetDefaultPayment = (id: string) => {
    setPaymentMethods((prev) => prev.map((p) => ({ ...p, isDefault: p.id === id })));
    toast.success("Default payment method updated");
  };

  const handleEditPayment = (id: string) => {
    toast.info("Edit payment method — feature coming soon");
  };

  const handleRemovePayment = (id: string) => {
    setPaymentMethods((prev) => prev.filter((p) => p.id !== id));
    toast.success("Payment method removed");
  };

  const handleAddPayment = () => {
    if (!newPaymentLabel.trim() || !newPaymentDetails.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    const newMethod: SavedPaymentMethod = {
      id: `pm-${Date.now()}`,
      type: newPaymentType,
      label: newPaymentLabel,
      details: newPaymentDetails,
      isDefault: paymentMethods.length === 0,
    };
    setPaymentMethods((prev) => [...prev, newMethod]);
    setNewPaymentLabel("");
    setNewPaymentDetails("");
    setShowAddPayment(false);
    toast.success("Payment method added");
  };

  const handleDeleteAccount = () => {
    // Simulate deletion
    toast.error("Account deletion requested. This action cannot be undone.");
    setShowDeleteConfirm(false);
  };

  return (
    <div className="min-h-screen bg-[#faf9f5] pb-16">
      <HostPageHeader
        eyebrow="Preferences"
        title="Host Settings"
        description="Manage your profile, payments, and account preferences"
        actions={
          <button
            onClick={() => router.back()}
            className="flex h-10 px-4 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-colors text-white font-bold text-sm shadow-sm"
          >
            <ChevronLeft className="h-4 w-4 mr-1.5" />
            Back
          </button>
        }
      />
      <div className="mx-auto px-4 md:px-6 max-w-3xl mt-8">
        <div className="space-y-10">
          {/* 
              PROFILE SECTION
           */}
          <section>
            <SectionHeader
              icon={User}
              title="Host Profile"
              description="Your public host profile information"
            />

            <div className="space-y-5">
              {/* Avatar Upload */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-display text-2xl font-bold text-primary">CB</span>
                </div>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-lg text-xs font-semibold border-gray-200"
                  >
                    <Upload className="h-3.5 w-3.5 mr-1.5" />
                    Change Photo
                  </Button>
                  <p className="text-[10px] text-gray-400 mt-1">JPG or PNG. 1MB max.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Display Name
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-10 rounded-xl border-gray-200 text-sm focus:border-primary/30 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Email
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 rounded-xl border-gray-200 text-sm focus:border-primary/30 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Phone Number
                  </Label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-10 rounded-xl border-gray-200 text-sm focus:border-primary/30 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Location
                  </Label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-10 rounded-xl border-gray-200 text-sm focus:border-primary/30 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Bio
                </Label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#111111] placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Response Time Goal
                </Label>
                <select
                  value={responseTime}
                  onChange={(e) => setResponseTime(e.target.value)}
                  className="w-full h-10 rounded-xl border border-gray-200 px-4 text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all bg-white"
                >
                  <option value="within 1 hour">Within 1 hour</option>
                  <option value="within 2 hours">Within 2 hours</option>
                  <option value="within 6 hours">Within 6 hours</option>
                  <option value="within 24 hours">Within 24 hours</option>
                </select>
              </div>

              <Button
                className="rounded-xl text-xs font-bold h-10 px-6 shadow-sm"
                onClick={handleSaveProfile}
              >
                <CheckCircle2 className="h-4 w-4 mr-1.5" />
                Save Changes
              </Button>
            </div>
          </section>

          {/* 
              PAYMENT METHODS SECTION
           */}
          <section className="border-t border-gray-100 pt-10">
            <SectionHeader
              icon={CreditCard}
              title="Payment Methods"
              description="Manage how you receive payouts from bookings"
            />

            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <PaymentMethodCard
                  key={method.id}
                  method={method}
                  onSetDefault={handleSetDefaultPayment}
                  onEdit={handleEditPayment}
                  onRemove={handleRemovePayment}
                />
              ))}
            </div>

            {/* Add Payment Method Form */}
            {showAddPayment ? (
              <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50/50 p-5 space-y-4">
                <p className="text-sm font-bold text-[#111111]">Add Payment Method</p>

                <div className="flex items-center gap-3">
                  {(
                    [
                      { value: "bank", label: "Bank Transfer", icon: Building2 },
                      { value: "mobile-money", label: "Mobile Money", icon: Smartphone },
                      { value: "card", label: "Credit/Debit Card", icon: CreditCard },
                    ] as const
                  ).map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = newPaymentType === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setNewPaymentType(opt.value as typeof newPaymentType)}
                        className={cn(
                          "flex-1 flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all",
                          isSelected
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-[10px] font-semibold">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Account Name / Label
                  </Label>
                  <Input
                    value={newPaymentLabel}
                    onChange={(e) => setNewPaymentLabel(e.target.value)}
                    placeholder={
                      newPaymentType === "bank"
                        ? "e.g. Zambia National Bank"
                        : newPaymentType === "mobile-money"
                          ? "e.g. Airtel Money"
                          : "e.g. Visa ending in 1234"
                    }
                    className="h-10 rounded-xl border-gray-200 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    Account Details
                  </Label>
                  <Input
                    value={newPaymentDetails}
                    onChange={(e) => setNewPaymentDetails(e.target.value)}
                    placeholder={
                      newPaymentType === "bank"
                        ? "Account **** 4832"
                        : newPaymentType === "mobile-money"
                          ? "+260 97 765 4321"
                          : "**** 1234"
                    }
                    className="h-10 rounded-xl border-gray-200 text-sm"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="rounded-xl text-xs font-bold h-9"
                    onClick={handleAddPayment}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Method
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl text-xs h-9"
                    onClick={() => setShowAddPayment(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="mt-4 rounded-xl text-xs font-semibold border-gray-200 h-9"
                onClick={() => setShowAddPayment(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Payment Method
              </Button>
            )}

            {/* Payout Info */}
            <div className="mt-4 rounded-xl bg-blue-50 border border-blue-200 p-4 flex items-start gap-3">
              <Banknote className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-800 leading-relaxed">
                <p className="font-semibold mb-0.5">Payout Schedule</p>
                <p>
                  Payouts are processed within 24 hours after a guest checks in. Funds are sent to
                  your default payment method. Minimum payout threshold: ZMW 100.
                </p>
              </div>
            </div>
          </section>

          {/* 
              NOTIFICATIONS SECTION
           */}
          <section className="border-t border-gray-100 pt-10">
            <SectionHeader
              icon={Bell}
              title="Notifications"
              description="Choose what updates you receive"
            />

            <div className="space-y-2">
              {[
                {
                  label: "New Bookings",
                  desc: "Get notified when guests book your listings",
                  state: notifyBookings,
                  setter: setNotifyBookings,
                },
                {
                  label: "Messages",
                  desc: "Receive guest inquiries and messages",
                  state: notifyMessages,
                  setter: setNotifyMessages,
                },
                {
                  label: "New Reviews",
                  desc: "Be notified when guests leave reviews",
                  state: notifyReviews,
                  setter: setNotifyReviews,
                },
                {
                  label: "Promotions & Tips",
                  desc: "Get hosting tips and promotion opportunities",
                  state: notifyPromotions,
                  setter: setNotifyPromotions,
                },
              ].map(({ label, desc, state, setter }) => (
                <label
                  key={label}
                  className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                  <Toggle enabled={state} onChange={setter} />
                </label>
              ))}
            </div>
          </section>

          {/* 
              PREFERENCES SECTION
           */}
          <section className="border-t border-gray-100 pt-10">
            <SectionHeader
              icon={Globe}
              title="Preferences"
              description="Language, currency, and display settings"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  <Languages className="h-3 w-3 inline mr-1" />
                  Language
                </Label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full h-10 rounded-xl border border-gray-200 px-4 text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all bg-white"
                >
                  <option value="english">English</option>
                  <option value="french">French</option>
                  <option value="portuguese">Portuguese</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  <Banknote className="h-3 w-3 inline mr-1" />
                  Currency
                </Label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full h-10 rounded-xl border border-gray-200 px-4 text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all bg-white"
                >
                  <option value="zmw">ZMW — Zambian Kwacha</option>
                  <option value="usd">USD — US Dollar</option>
                  <option value="eur">EUR — Euro</option>
                  <option value="gbp">GBP — British Pound</option>
                </select>
              </div>
            </div>

            <div className="mt-4 space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <Palette className="h-3 w-3 inline mr-1" />
                Theme
              </Label>
              <div className="flex items-center gap-2">
                {[
                  { value: "light" as const, label: "Light", icon: Sun },
                  { value: "dark" as const, label: "Dark", icon: Moon },
                  { value: "system" as const, label: "System", icon: Globe },
                ].map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = theme === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setTheme(opt.value)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl border text-sm font-semibold transition-all",
                        isSelected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 
              ACCOUNT & DANGER ZONE SECTION
           */}
          <section className="border-t border-gray-100 pt-10">
            <SectionHeader
              icon={ShieldCheck}
              title="Account"
              description="Manage your account settings and data"
            />

            <div className="space-y-4">
              {/* Sign Out */}
              <div className="rounded-xl border border-gray-100 bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#111111]">Sign Out</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Sign out of your host account. Your listings will remain active.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-xl text-xs font-semibold border-gray-200"
                    onClick={() => {
                      logout();
                      toast.success("Signed out successfully");
                      router.push("/");
                    }}
                  >
                    <LogOut className="h-3.5 w-3.5 mr-1.5" />
                    Sign Out
                  </Button>
                </div>
              </div>

              {/* Delete Account — Danger Zone */}
              <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-500">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-rose-900">Danger Zone</p>
                    <p className="text-xs text-rose-700 mt-0.5">
                      Irreversible actions that affect your account and data
                    </p>
                  </div>
                </div>

                {showDeleteConfirm ? (
                  <div className="space-y-3 rounded-xl bg-white border border-rose-200 p-4">
                    <p className="text-sm font-semibold text-[#111111]">
                      Are you sure you want to delete your account?
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      This will permanently delete your host profile, all listings, booking history,
                      and earnings data. This action cannot be undone. If you&apos;re sure, type
                      &quot;DELETE&quot; below to confirm.
                    </p>
                    <Input
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder='Type "DELETE" to confirm'
                      className="h-10 rounded-xl border-rose-200 text-sm"
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="rounded-xl text-xs font-bold h-9 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmText !== "DELETE"}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Delete My Account
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-xl text-xs h-9"
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmText("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs font-bold h-9 border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Delete Account
                  </Button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
