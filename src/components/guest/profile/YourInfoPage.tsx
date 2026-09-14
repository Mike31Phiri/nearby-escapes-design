"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { ProfileSubpageHeader } from "./ProfileSubpageHeader";
import { useAuth } from "@/lib/store/authStore";

export function YourInfoPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || "Alex Smith");
  const [email, setEmail] = useState(user?.email || "alex.smith@example.com");
  const [phone, setPhone] = useState(user?.phone || "+260 97 123 4567");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    toast.success("Profile information updated successfully!");
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#fbfafc] font-sans pb-16">
      <ProfileSubpageHeader title="Personal info" />

      <main className="max-w-2xl mx-auto w-full px-4 md:px-6 pt-6 md:pt-8">
        {/* Profile Completion Tip */}
        <div className="bg-[#f8f5fc] border border-[#6b2bb8]/15 rounded-2xl p-4 mb-6 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-neutral-900">Keep your details up to date</p>
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
            <div className="w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200 overflow-hidden flex items-center justify-center shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} className="w-full h-full object-cover" alt={name} />
              ) : (
                <User className="w-7 h-7 text-neutral-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">Profile photo</p>
              <p className="text-xs text-neutral-500 mt-0.5">PNG, JPG or WEBP up to 5MB</p>
              <button
                type="button"
                className="mt-2 text-xs font-medium text-[#6b2bb8] hover:text-[#5a22a0] hover:underline"
              >
                Change photo
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#6b2bb8]/20 focus:border-[#6b2bb8] transition bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#6b2bb8]/20 focus:border-[#6b2bb8] transition bg-white"
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
                className="w-full border border-neutral-200 rounded-xl px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#6b2bb8]/20 focus:border-[#6b2bb8] transition bg-white"
              />
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="text-xs font-medium text-neutral-600 hover:text-neutral-900 px-4 py-2.5 rounded-xl transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-[#6b2bb8] hover:bg-[#5a22a0] text-white rounded-xl px-6 py-2.5 text-xs font-semibold transition shadow-xs flex items-center gap-1.5"
              >
                {isSaved ? (
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
