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
  ArrowLeft,
  ShieldCheck,
  ArrowRight,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/store/authStore";
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
    <div className="min-h-screen flex flex-col bg-background font-sans pb-24">
      {/* COVER HERO */}
      <div className="relative h-[180px] md:h-[220px] w-full overflow-hidden bg-gradient-to-br from-[#1f1433] via-[#2E154A] to-[#3A1A5A]">
        <img
          src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1600&q=60"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30 md:opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f1433] via-[#1f1433]/60 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 md:top-6 md:left-6 h-10 w-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all text-white hover:scale-105"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 md:px-8 -mt-16 relative z-10">
        {/* PAGE HEADER */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 md:p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-[#1f1433]/20 to-[#1f1433]/5 flex items-center justify-center border border-[#1f1433]/20 shrink-0">
              <Palette className="h-7 w-7 text-[#1f1433]" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">
                Settings
              </h1>
              <p className="text-base text-gray-500 mt-0.5">
                Manage your account, preferences, and notifications
              </p>
            </div>
          </div>
        </div>

        {/* ACCOUNT DETAILS */}
        <section className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="flex items-center gap-3 px-5 md:px-6 pt-5 md:pt-6 pb-4 border-b border-gray-50">
            <div className="h-9 w-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <User className="h-4 w-4 text-indigo-600" strokeWidth={1.5} />
            </div>
            <h2 className="text-base font-bold tracking-tight text-gray-900">Account Details</h2>
          </div>

          <div className="p-5 md:p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-gray-200 bg-white focus:border-[#1f1433] focus:ring-2 focus:ring-[#1f1433]/10 transition-all text-base"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-gray-200 bg-white focus:border-[#1f1433] focus:ring-2 focus:ring-[#1f1433]/10 transition-all text-base"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    savePhone(e.target.value);
                  }}
                  className="pl-10 h-11 rounded-xl border-gray-200 bg-white focus:border-[#1f1433] focus:ring-2 focus:ring-[#1f1433]/10 transition-all text-base"
                />
              </div>
            </div>

            <Button
              className="rounded-xl bg-[#f2ba0d] hover:bg-[#2E154A] text-white text-sm font-bold tracking-wider h-11 px-8 shadow-lg shadow-[#1f1433]/20"
              onClick={() => toast.success("Profile updated successfully!")}
            >
              Save Changes
            </Button>
          </div>
        </section>

        {/* TRAVEL PREFERENCES */}
        <section className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="flex items-center gap-3 px-5 md:px-6 pt-5 md:pt-6 pb-4 border-b border-gray-50">
            <div className="h-9 w-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-emerald-600" strokeWidth={1.5} />
            </div>
            <h2 className="text-base font-bold tracking-tight text-gray-900">Travel Preferences</h2>
          </div>

          <div className="p-5 md:p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Home City
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={savedHomeCity}
                    onChange={(e) => saveHomeCity(e.target.value)}
                    placeholder="e.g. Lusaka, Ndola"
                    className="pl-10 h-11 rounded-xl border-gray-200 bg-white focus:border-[#1f1433] focus:ring-2 focus:ring-[#1f1433]/10 transition-all text-base"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Travel Interests
                </Label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {travelPreferences.travelInterests.length > 0 ? (
                    travelPreferences.travelInterests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-3 py-1.5 text-[11px] font-semibold capitalize border border-emerald-200"
                      >
                        {interest.replace(/-/g, " ")}
                      </span>
                    ))
                  ) : (
                    <p className="text-base text-gray-400">No interests set yet</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
                <p className="text-[9px] font-bold uppercase tracking-widest text-amber-700 mb-1">
                  Budget Range
                </p>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-amber-500" />
                  <p className="text-base font-bold text-amber-900 capitalize">
                    {travelPreferences.budgetRange}
                  </p>
                </div>
              </div>
              <div className="rounded-xl bg-sky-50 border border-sky-100 p-4">
                <p className="text-[9px] font-bold uppercase tracking-widest text-sky-700 mb-1">
                  Travel Group
                </p>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-sky-500" />
                  <p className="text-base font-bold text-sky-900 capitalize">
                    {travelPreferences.travelGroup}
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-bold h-10 px-5"
              onClick={() => {
                useProfileStore.getState().triggerTravelPreferences();
              }}
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
              Update Preferences
            </Button>
          </div>
        </section>

        {/* NOTIFICATIONS */}
        <section className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="flex items-center gap-3 px-5 md:px-6 pt-5 md:pt-6 pb-4 border-b border-gray-50">
            <div className="h-9 w-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
              <Bell className="h-4 w-4 text-amber-600" strokeWidth={1.5} />
            </div>
            <h2 className="text-base font-bold tracking-tight text-gray-900">Notifications</h2>
          </div>

          <div className="p-5 md:p-6 space-y-3">
            <label className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-4 cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-indigo-600" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Receive booking updates and confirmations
                  </p>
                </div>
              </div>
              <div
                onClick={() => setShowNotifications(!showNotifications)}
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full transition-colors cursor-pointer",
                  showNotifications ? "bg-[#f2ba0d]" : "bg-gray-200",
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

            <label className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-4 cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center">
                  <Tag className="h-4 w-4 text-rose-600" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">Promotional Emails</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Get deals, discounts, and travel inspiration
                  </p>
                </div>
              </div>
              <div
                onClick={() => setShowPromotions(!showPromotions)}
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full transition-colors cursor-pointer",
                  showPromotions ? "bg-[#f2ba0d]" : "bg-gray-200",
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

        {/* BECOME A HOST */}
        {(!user?.role || user.role === "guest") && (
          <section className="mb-6">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1f1433] to-[#2E154A] p-6 md:p-8">
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[#f2ba0d]/10 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/5 blur-3xl" />

              <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="h-14 w-14 shrink-0 rounded-xl bg-[#f2ba0d]/15 border border-[#1f1433]/20 flex items-center justify-center">
                  <Building2 className="h-7 w-7 text-[#1f1433]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white">Become a Host</h3>
                  <p className="text-base text-white/60 mt-1 leading-relaxed max-w-lg">
                    Share your property, tours, or transport with travelers. Start earning and grow
                    your hospitality business.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-white/50">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-[#1f1433]" />
                      Set your own prices
                    </span>
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 text-[#1f1433]" />
                      Earn extra income
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-[#1f1433]" />
                      Reach thousands of travelers
                    </span>
                  </div>
                </div>
                <Button
                  className="rounded-xl bg-[#f2ba0d] hover:bg-[#d4b065] text-[#111111] font-bold text-sm tracking-wider h-11 px-7 shrink-0 w-full md:w-auto shadow-lg shadow-[#1f1433]/25"
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

        {/* ACCOUNT / SIGN OUT */}
        <section className="bg-white border border-red-100 rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-5 md:px-6 pt-5 md:pt-6 pb-4 border-b border-red-50">
            <div className="h-9 w-9 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-red-600" strokeWidth={1.5} />
            </div>
            <h2 className="text-base font-bold tracking-tight text-gray-900">Account</h2>
          </div>
          <div className="p-5 md:p-6">
            <p className="text-base text-gray-500 mb-5 max-w-md leading-relaxed">
              Sign out of your account. You can always come back and sign in again.
            </p>
            <Button
              variant="outline"
              className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold text-sm tracking-wider h-11 px-6"
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
      </main>
    </div>
  );
}
