"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { User, Check, Loader2, Camera, ShieldCheck, Lock } from "lucide-react";
import { toast } from "sonner";
import { ProfileSubpageHeader } from "./ProfileSubpageHeader";
import { useAuth, useAuthStore } from "@/lib/store/authStore";
import { updateMyProfile, uploadAvatar } from "@/lib/api/users";

export function YourInfoPage() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrating } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Sync state once user is loaded
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
      if (user.avatar) setAvatar(user.avatar);
    }
  }, [user]);

  if (!isHydrating && !isAuthenticated) {
    router.replace("/auth/login?next=/settings/info");
    return null;
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Avatar image must be less than 5MB");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const res = await uploadAvatar(file);
      const newAvatarUrl = res.avatarUrl;
      if (newAvatarUrl) {
        setAvatar(newAvatarUrl);
        if (user) {
          useAuthStore.getState().setUser({
            ...user,
            avatar: newAvatarUrl,
          });
        }
        toast.success("Avatar photo updated successfully!");
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to upload photo. Please try again.",
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please provide your name.");
      return;
    }

    setIsSaving(true);
    try {
      const updated = await updateMyProfile({
        name: name.trim(),
        phone: phone.trim() || undefined,
      });

      // Update global auth store with fresh DB response
      if (user) {
        useAuthStore.getState().setUser({
          ...user,
          name: updated.name || name.trim(),
          phone: updated.phone || phone.trim(),
          avatar: updated.avatar || user.avatar,
        });
      }

      setIsSaved(true);
      toast.success("Profile information updated successfully!");
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to update profile. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfafc] font-sans pb-16">
      <ProfileSubpageHeader title="Personal info" />

      <main className="max-w-2xl mx-auto w-full px-4 md:px-6 pt-6 md:pt-8">
        {/* Profile Completion Tip */}
        <div className="bg-[#f8f5fc] border border-[#6b2bb8]/15 rounded-2xl p-4 mb-6 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-neutral-900">
              Keep your details up to date
            </p>
            <p className="text-xs text-neutral-500 mt-0.5">
              Accurate contact details ensure smooth host communication and booking confirmations.
            </p>
          </div>
          <span className="bg-[#6b2bb8]/10 text-[#6b2bb8] rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold shrink-0">
            i
          </span>
        </div>

        {/* Profile Card / Form */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-2xs">
          {/* Avatar Row */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-100">
            <div className="relative w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200 overflow-hidden flex items-center justify-center shrink-0">
              {avatar ? (
                <img
                  src={avatar}
                  className="w-full h-full object-cover"
                  alt={name || "User Avatar"}
                />
              ) : (
                <User className="w-7 h-7 text-neutral-400" />
              )}

              {isUploadingAvatar && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-900">Profile photo</p>
              <p className="text-xs text-neutral-500 mt-0.5">PNG, JPG or WEBP up to 5MB</p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />

              <button
                type="button"
                disabled={isUploadingAvatar}
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 text-xs font-semibold text-[#6b2bb8] hover:text-[#5a22a0] hover:underline cursor-pointer inline-flex items-center gap-1 disabled:opacity-50"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{isUploadingAvatar ? "Uploading..." : "Change photo"}</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Kondwani Banda"
                className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#6b2bb8]/20 focus:border-[#6b2bb8] transition bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-neutral-700">
                  Email Address
                </label>
                <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-neutral-400" />
                  Primary Account ID
                </span>
              </div>
              <input
                type="email"
                value={email}
                disabled
                readOnly
                className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm text-neutral-500 bg-neutral-50 cursor-not-allowed select-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Phone Number (WhatsApp)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+260 97 123 4567"
                className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#6b2bb8]/20 focus:border-[#6b2bb8] transition bg-white"
              />
              <p className="text-[11px] text-neutral-400 mt-1">
                Used for instant booking confirmation alerts and host coordination.
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="text-xs font-medium text-neutral-600 hover:text-neutral-900 px-4 py-2.5 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="bg-[#6b2bb8] hover:bg-[#5a22a0] text-white rounded-xl px-6 py-2.5 text-xs font-semibold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : isSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved</span>
                  </>
                ) : (
                  <span>Save changes</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
