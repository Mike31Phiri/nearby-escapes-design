"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Bell,
  Tag,
  Building2,
  TrendingUp,
  DollarSign,
  LogOut,
  ChevronLeft,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useProfileStore } from "@/store/profileStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const {
    phone: savedPhone,
    homeCity: savedHomeCity,
    travelPreferences,
    setPhone: savePhone,
    setHomeCity: saveHomeCity,
  } = useProfileStore();

  const [fullName, setFullName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(savedPhone || "+260 97 123 4567");
  const [showNotifications, setShowNotifications] = useState(true);
  const [showPromotions, setShowPromotions] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans pb-24">
      {/* Header */}
      <div className="sticky top-[64px] z-30 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto max-w-3xl px-4 h-16 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-muted transition-colors -ml-1"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold tracking-tight text-foreground">Settings</h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-10 space-y-12">
        {/* ── Account Details ── */}
        <section>
          <div className="flex items-center gap-3 mb-7">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-base font-bold tracking-tight text-foreground">Account Details</h2>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 h-12 rounded-2xl bg-muted/50 border-0 ring-1 ring-border/40 focus:ring-primary/50 focus:ring-2 transition-all placeholder:text-muted-foreground/40"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 rounded-2xl bg-muted/50 border-0 ring-1 ring-border/40 focus:ring-primary/50 focus:ring-2 transition-all placeholder:text-muted-foreground/40"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    savePhone(e.target.value);
                  }}
                  className="pl-10 h-12 rounded-2xl bg-muted/50 border-0 ring-1 ring-border/40 focus:ring-primary/50 focus:ring-2 transition-all placeholder:text-muted-foreground/40"
                />
              </div>
            </div>

            <Button
              className="rounded-2xl text-xs font-bold tracking-widest h-11 px-8 shadow-sm"
              onClick={() => toast.success("Profile updated successfully!")}
            >
              Save Changes
            </Button>
          </div>
        </section>

        {/* ── Travel Preferences ── */}
        <section>
          <div className="flex items-center gap-3 mb-7">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Travel Preferences
            </h2>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">
                Home City
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                <Input
                  value={savedHomeCity}
                  onChange={(e) => saveHomeCity(e.target.value)}
                  placeholder="e.g. Lusaka, Ndola"
                  className="pl-10 h-12 rounded-2xl bg-muted/50 border-0 ring-1 ring-border/40 focus:ring-primary/50 focus:ring-2 transition-all placeholder:text-muted-foreground/40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">
                Travel Interests
              </Label>
              {travelPreferences.travelInterests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {travelPreferences.travelInterests.map((interest) => (
                    <span
                      key={interest}
                      className="inline-flex items-center rounded-full bg-primary/8 text-primary px-3.5 py-1.5 text-xs font-semibold capitalize"
                    >
                      {interest.replace(/-/g, " ")}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground/60">No interests set yet</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="rounded-2xl bg-muted/30 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
                  Budget Range
                </p>
                <p className="text-sm font-bold text-foreground capitalize">
                  {travelPreferences.budgetRange}
                </p>
              </div>
              <div className="rounded-2xl bg-muted/30 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
                  Travel Group
                </p>
                <p className="text-sm font-bold text-foreground capitalize">
                  {travelPreferences.travelGroup}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="rounded-2xl text-xs font-semibold h-10 px-5 bg-muted/50 hover:bg-muted"
              onClick={() => {
                useProfileStore.getState().triggerTravelPreferences();
              }}
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Update Preferences
            </Button>
          </div>
        </section>

        {/* ── Notifications ── */}
        <section>
          <div className="flex items-center gap-3 mb-7">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-base font-bold tracking-tight text-foreground">Notifications</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between rounded-2xl bg-muted/30 p-4 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="h-9 w-9 rounded-xl bg-primary/8 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Email Notifications</p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">
                    Receive booking updates and confirmations
                  </p>
                </div>
              </div>
              <div
                onClick={() => setShowNotifications(!showNotifications)}
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full transition-colors cursor-pointer",
                  showNotifications ? "bg-primary" : "bg-muted-foreground/20",
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                    showNotifications ? "translate-x-5" : "translate-x-0",
                  )}
                />
              </div>
            </label>

            <label className="flex items-center justify-between rounded-2xl bg-muted/30 p-4 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="h-9 w-9 rounded-xl bg-primary/8 flex items-center justify-center">
                  <Tag className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Promotional Emails</p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">
                    Get deals, discounts, and travel inspiration
                  </p>
                </div>
              </div>
              <div
                onClick={() => setShowPromotions(!showPromotions)}
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full transition-colors cursor-pointer",
                  showPromotions ? "bg-primary" : "bg-muted-foreground/20",
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                    showPromotions ? "translate-x-5" : "translate-x-0",
                  )}
                />
              </div>
            </label>
          </div>
        </section>

        {/* ── Become a Host ── */}
        {(!user?.role || user.role === "guest") && (
          <section>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/[0.06] to-primary/[0.12] p-6 md:p-8">
              {/* Decorative blur */}
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

              <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="h-16 w-16 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-foreground">Become a Host</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-lg">
                    Share your property, tours, or transport with travelers. Start earning and grow
                    your hospitality business.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                      Set your own prices
                    </span>
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                      Earn extra income
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                      Reach thousands of travelers
                    </span>
                  </div>
                </div>
                <Button
                  className="rounded-2xl font-bold text-xs tracking-wider h-11 px-7 shrink-0 w-full md:w-auto shadow-lg shadow-primary/15"
                  asChild
                >
                  <Link href="/become-host">
                    Get Started <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* ── Account / Sign Out ── */}
        <section>
          <div className="rounded-3xl bg-destructive/[0.03] p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-destructive" />
              </div>
              <h2 className="text-base font-bold tracking-tight text-foreground">Account</h2>
            </div>
            <p className="text-sm text-muted-foreground/70 mb-5 max-w-md leading-relaxed">
              Sign out of your account or manage your profile settings. You can always come back and
              sign in again.
            </p>
            <Button
              variant="outline"
              className="rounded-2xl border-destructive/20 text-destructive hover:bg-destructive/5 hover:border-destructive/30 font-bold text-xs tracking-wider h-11 px-6"
              onClick={() => {
                logout();
                toast.success("Signed out successfully");
                router.push("/");
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
