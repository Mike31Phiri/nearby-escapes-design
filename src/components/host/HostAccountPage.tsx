"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  CreditCard,
  Building2,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  Trash2,
  Banknote,
  Plus,
  Pencil,
  Smartphone,
  Star,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn, BACKDROP_CLASS } from "@/lib/utils";
import { useAuth, useAuthStore } from "@/lib/store/authStore";
import { mockHostProfile } from "@/lib/mock-profile-data";
import { toast } from "sonner";

// Toggle Switch

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors cursor-pointer",
        enabled ? "bg-purple" : "bg-neutral-200",
      )}
    >
      <div
        className={cn(
          "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-xs transition-transform",
          enabled ? "translate-x-5" : "translate-x-0",
        )}
      />
    </div>
  );
}

// Saved Payment Method Card

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
        "flex items-center gap-4 rounded-xl border p-4 transition-all shadow-2xs hover:shadow-xs",
        method.isDefault ? "border-purple/30 bg-purple/[0.02]" : "border-neutral-200/80 bg-white",
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple/10 text-purple">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-base font-bold text-neutral-900">{method.label}</p>
          {method.isDefault && (
            <span className="rounded-full bg-purple/10 text-purple text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 border border-purple/20">
              Default
            </span>
          )}
        </div>
        <p className="text-xs text-neutral-500 mt-0.5">{method.details}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onEdit(method.id)}
          className="h-8 w-8 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-purple transition-colors"
          aria-label={`Edit ${method.label}`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        {!method.isDefault && (
          <button
            onClick={() => onSetDefault(method.id)}
            className="h-8 rounded-xl px-2.5 hover:bg-neutral-100 text-[11px] font-semibold uppercase tracking-wide text-black-muted hover:text-purple transition-colors"
          >
            Set Default
          </button>
        )}
        <button
          onClick={() => onRemove(method.id)}
          className="h-8 w-8 rounded-lg hover:bg-rose-50 flex items-center justify-center text-neutral-400 hover:text-rose-500 transition-colors"
          aria-label={`Remove ${method.label}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// Section Header

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
      <div className="h-9 w-9 shrink-0 rounded-xl bg-purple/10 flex items-center justify-center text-purple">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h2 className="text-lg font-bold tracking-tight text-neutral-900">{title}</h2>
        {description && <p className="text-xs text-neutral-500 mt-0.5">{description}</p>}
      </div>
    </div>
  );
}

// Profile info row

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-neutral-200/80 bg-white p-4 shadow-2xs">
      <div className="h-9 w-9 shrink-0 rounded-xl bg-purple/10 flex items-center justify-center text-purple">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-black-muted">{label}</p>
        <p className="text-sm font-semibold text-neutral-900 truncate mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// Settings section label (below the profile)

function SettingsSectionLabel() {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-black-muted">
        Settings
      </span>
      <div className="h-px flex-1 bg-neutral-200" />
    </div>
  );
}

// MAIN ACCOUNT PAGE (profile on top, settings below)

export function HostAccountPage() {
  const { user } = useAuth();

  // Profile State
  const [name, setName] = useState(user?.name ?? "Chanda Bwalya");
  const [email, setEmail] = useState(user?.email ?? "chanda.bwalya@nearbyescapes.com");
  const [phone, setPhone] = useState("+260 97 765 4321");
  const [location, setLocation] = useState("Lusaka, Zambia");
  const [responseTime, setResponseTime] = useState("within 1 hour");
  const [avatar, setAvatar] = useState(mockHostProfile.avatar);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    useAuthStore.getState().fetchProfile().catch(() => null);
  }, []);

  useEffect(() => {
    if (user?.name) setName(user.name);
    if (user?.email) setEmail(user.email);
    if (user?.avatar) setAvatar(user.avatar);
  }, [user]);

  // Notification State
  const [notifyBookings, setNotifyBookings] = useState(true);
  const [notifyReviews, setNotifyReviews] = useState(true);

  // Payment Methods
  const [paymentMethods, setPaymentMethods] = useState<SavedPaymentMethod[]>([
    {
      id: "pm-1",
      type: "bank",
      label: "Zambia National Bank",
      details: "Account **** 4832 · Branch: Lusaka",
      isDefault: false,
    },
    {
      id: "pm-2",
      type: "mobile-money",
      label: "Mobile Money",
      details: "+260 97 765 4321 · Airtel Money",
      isDefault: true,
    },
  ]);

  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newPaymentType, setNewPaymentType] = useState<"bank" | "mobile-money" | "card">("bank");
  const [newPaymentLabel, setNewPaymentLabel] = useState("");
  const [newPaymentDetails, setNewPaymentDetails] = useState("");

  // Handlers

  const handleSaveProfile = () => {
    // Simulate saving
    toast.success("Host profile updated successfully!");
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
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

  return (
    <div className="min-h-screen bg-background pb-16 font-sans">
      <div className="mx-auto px-4 sm:px-6 md:px-8 max-w-4xl mt-8">
        <div className="space-y-10">
          {/* 
              PROFILE (top of the account page)
           */}
          <section>
            <div className="relative rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs">
              <button
                onClick={() => setEditOpen(true)}
                aria-label="Edit profile"
                className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200/80 bg-white text-neutral-500 shadow-2xs transition-colors hover:border-purple/40 hover:text-purple cursor-pointer"
              >
                <Pencil className="h-4 w-4" />
              </button>
              {/* Avatar + name */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl overflow-hidden bg-purple/10 shrink-0 border border-purple/20">
                  <img src={avatar} alt={name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-neutral-900 truncate">{name}</h3>
                  <p className="text-xs text-neutral-500 truncate mt-0.5">{email}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                    <span className="flex items-center gap-1 font-semibold text-neutral-700">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {mockHostProfile.rating.toFixed(2)}
                    </span>
                    <span className="text-neutral-300">·</span>
                    <span>{mockHostProfile.responseRate}% response</span>
                    <span className="text-neutral-300">·</span>
                    <span>{mockHostProfile.joined}</span>
                  </div>
                </div>
              </div>

              {/* Profile info rows */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                <InfoRow icon={Mail} label="Email" value={email} />
                <InfoRow icon={Phone} label="Phone" value={phone} />
                <InfoRow icon={MapPin} label="Location" value={location} />
                <InfoRow icon={Clock} label="Response time" value={responseTime} />
              </div>
            </div>

            {/* Edit profile popover — takes everything on the profile as inputs */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogContent
                overlayClassName={BACKDROP_CLASS}
                className="w-[min(94vw,448px)] max-w-md p-0 overflow-hidden flex flex-col max-h-[90dvh] rounded-2xl border border-neutral-200/80"
              >
                <DialogTitle className="sr-only">Edit profile</DialogTitle>

                {/* Header */}
                <div className="shrink-0 border-b border-neutral-200/80 px-5 pt-8 pb-4">
                  <h3 className="text-base font-bold text-neutral-900 leading-tight">
                    Edit profile
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Update the details shown on your public host profile.
                  </p>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl overflow-hidden bg-purple/10 flex items-center justify-center shrink-0 border border-purple/20">
                      <img src={avatar} alt={name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        id="host-avatar-input"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="host-avatar-input"
                        className="inline-flex items-center h-9 rounded-xl border border-neutral-200/80 bg-white px-3.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 hover:border-purple/40 cursor-pointer transition-colors shadow-2xs"
                      >
                        <Upload className="h-3.5 w-3.5 mr-1.5" />
                        Change Photo
                      </label>
                      <p className="text-xs text-black-muted mt-1">JPG or PNG. 1MB max.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-neutral-700">Display Name</Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-10 rounded-xl border-neutral-200/80 text-sm focus:border-purple focus:ring-1 focus:ring-purple/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-neutral-700">Email</Label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-10 rounded-xl border-neutral-200/80 text-sm focus:border-purple focus:ring-1 focus:ring-purple/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-neutral-700">Phone Number</Label>
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-10 rounded-xl border-neutral-200/80 text-sm focus:border-purple focus:ring-1 focus:ring-purple/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-neutral-700">Location</Label>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="h-10 rounded-xl border-neutral-200/80 text-sm focus:border-purple focus:ring-1 focus:ring-purple/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-neutral-700">
                      Response Time Goal
                    </Label>
                    <select
                      value={responseTime}
                      onChange={(e) => setResponseTime(e.target.value)}
                      className="w-full h-10 rounded-xl border border-neutral-200/80 px-3 text-sm text-neutral-900 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple/20 transition-all bg-white"
                    >
                      <option value="within 1 hour">Within 1 hour</option>
                      <option value="within 2 hours">Within 2 hours</option>
                      <option value="within 6 hours">Within 6 hours</option>
                      <option value="within 24 hours">Within 24 hours</option>
                    </select>
                  </div>
                </div>

                {/* Footer */}
                <div className="shrink-0 border-t border-neutral-200/80 bg-white p-4 flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl text-xs font-semibold h-10 px-4"
                    onClick={() => setEditOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="rounded-xl text-xs font-semibold h-10 px-5 bg-purple hover:bg-purple-hover text-white shadow-xs"
                    onClick={() => {
                      handleSaveProfile();
                      setEditOpen(false);
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1.5" />
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </section>

          {/* 
              SETTINGS (below the profile)
           */}
          <SettingsSectionLabel />

          {/* Payment Methods */}
          <section>
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
              <div className="mt-4 rounded-2xl border border-neutral-200/80 bg-neutral-50/80 p-6 space-y-4 shadow-2xs">
                <p className="text-base font-bold text-neutral-900">Add Payment Method</p>

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
                            ? "border-purple bg-purple/5 text-purple"
                            : "border-neutral-200/80 bg-white text-neutral-500 hover:border-purple/30 hover:text-neutral-700",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-[11px] font-semibold">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-neutral-700">
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
                    className="h-10 rounded-xl border-neutral-200/80 text-sm focus:border-purple focus:ring-1 focus:ring-purple/20 bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-neutral-700">Account Details</Label>
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
                    className="h-10 rounded-xl border-neutral-200/80 text-sm focus:border-purple focus:ring-1 focus:ring-purple/20 bg-white"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    className="rounded-xl text-xs font-semibold h-10 px-5 bg-purple hover:bg-purple-hover text-white shadow-xs"
                    onClick={handleAddPayment}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Method
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl text-xs font-semibold h-10 px-4"
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
                className="mt-4 rounded-xl text-xs font-semibold border-neutral-200/80 h-10 px-4 hover:border-purple/40 hover:text-purple shadow-2xs"
                onClick={() => setShowAddPayment(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Payment Method
              </Button>
            )}

            {/* Payout Info */}
            <div className="mt-5 rounded-xl bg-purple/[0.04] border border-purple/20 p-4 flex items-start gap-3">
              <Banknote className="h-4 w-4 text-purple shrink-0 mt-0.5" />
              <div className="text-xs text-neutral-600 leading-relaxed">
                <p className="font-bold text-neutral-900 mb-0.5">Payout Schedule</p>
                <p>
                  Payouts are processed within 24 hours after a guest checks in. Funds are sent to
                  your default payment method. Minimum payout threshold: ZMW 100.
                </p>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="border-t border-neutral-200/80 pt-10">
            <SectionHeader
              icon={Bell}
              title="Notifications"
              description="Choose what updates you receive"
            />

            <div className="space-y-2.5">
              {[
                {
                  label: "New Bookings",
                  desc: "Get notified when guests book your listings",
                  state: notifyBookings,
                  setter: setNotifyBookings,
                },
                {
                  label: "New Reviews",
                  desc: "Be notified when guests leave reviews",
                  state: notifyReviews,
                  setter: setNotifyReviews,
                },
              ].map(({ label, desc, state, setter }) => (
                <label
                  key={label}
                  className="flex items-center justify-between rounded-xl border border-neutral-200/80 bg-white p-4 cursor-pointer hover:bg-neutral-50/70 transition-colors shadow-2xs"
                >
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{label}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>
                  </div>
                  <Toggle enabled={state} onChange={setter} />
                </label>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
