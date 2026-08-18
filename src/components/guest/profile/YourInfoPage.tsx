"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileSubpageHeader } from "./ProfileSubpageHeader";

export function YourInfoPage() {
  return (
    <div className="min-h-screen flex items-start justify-center py-0 lg:py-8">
      <div className="w-full max-w-5xl bg-white lg:rounded-3xl lg:shadow-xl min-h-screen lg:min-h-0 overflow-hidden flex flex-col">
        {/* Header */}
        <ProfileSubpageHeader title="Your info" />

        <div className="p-6 md:p-8 flex-1 flex flex-col">
          {/* Profile Banner (Explains the red exclamation on profile) */}
          <div className="bg-purple-muted border border-purple-border/20 rounded-xl p-4 mb-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-black">Complete your profile</p>
              <p className="text-xs text-black-soft mt-0.5">
                Adding your full name and a profile photo helps hosts trust you more!
              </p>
            </div>
            <span className="bg-gold text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
              !
            </span>
          </div>

          {/* Avatar Update */}
          <div className="flex items-center gap-4 mb-8 border-b border-white-soft pb-6">
            <div className="w-16 h-16 rounded-full bg-white-soft overflow-hidden border border-white-soft">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                className="w-full h-full object-cover"
                alt="Profile"
              />
            </div>
            <button className="text-purple text-sm font-semibold border border-purple bg-white px-4 py-1.5 rounded-full hover:bg-purple-muted transition">
              Change photo
            </button>
          </div>

          {/* Form Fields */}
          <form className="flex-1 flex flex-col gap-5">
            <div>
              <label className="block text-xs font-semibold text-black-muted mb-1">Full Name</label>
              <input
                type="text"
                defaultValue="Alex Smith"
                className="w-full border border-white-soft rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition text-black bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-black-muted mb-1">
                Email Address
              </label>
              <input
                type="email"
                defaultValue="alex.smith@example.com"
                className="w-full border border-white-soft rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition text-black bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-black-muted mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                defaultValue="+260 97 123 4567"
                className="w-full border border-white-soft rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition text-black bg-white"
              />
            </div>
            <div className="mt-auto pt-4">
              <button
                type="button"
                className="w-full bg-purple text-white rounded-xl py-3.5 font-semibold hover:bg-purple-hover transition shadow-md shadow-purple/20"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
