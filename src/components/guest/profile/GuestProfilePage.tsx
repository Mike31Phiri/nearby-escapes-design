"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Share,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileSubpageHeader } from "./ProfileSubpageHeader";
import { AccountSettingsMenu } from "./AccountSettingsMenu";

export function GuestProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"trips" | "reviews">("trips");

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Full-Width Header */}
      <ProfileSubpageHeader 
        title="Profile" 
        rightAction={
          <button className="p-1 hover:bg-white-soft rounded-full transition text-black">
            <Share className="w-5 h-5" />
          </button>
        } 
      />

      {/* Centered Content Container */}
      <div className="max-w-5xl mx-auto w-full px-4 py-6 md:py-10 flex flex-col lg:flex-row gap-6 lg:gap-12">
        
        {/* ================= LEFT COLUMN ================= */}
        <div className="w-full lg:w-2/3 flex flex-col items-center">
          
          <div className="flex flex-col items-center w-full mb-4">
            <div className="relative mb-3">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full p-1 bg-white shadow-sm border border-white-soft">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" 
                  className="w-full h-full rounded-full object-cover" 
                  alt="Profile" 
                />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-black tracking-tight">Alex Smith</h2>
            <div className="mt-1 flex items-center gap-2">
              <span className="bg-purple-muted text-purple text-xs font-bold px-3 py-0.5 rounded-full border border-purple-border/20">
                Guest
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="w-full flex justify-around py-4 border-y border-white-soft bg-white-soft/80 rounded-lg mb-4">
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-black md:text-2xl">12</span>
              <span className="text-xs text-black-muted font-medium">Trips</span>
            </div>
            <div className="h-8 w-px bg-white-soft"></div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-black md:text-2xl flex items-center gap-1">
                <Star className="w-4 h-4 fill-black" /> 4.9
              </span>
              <span className="text-xs text-black-muted font-medium">Rating</span>
            </div>
            <div className="h-8 w-px bg-white-soft"></div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-black md:text-2xl">8</span>
              <span className="text-xs text-black-muted font-medium">Reviews</span>
            </div>
          </div>

          {/* Become a Host CTA */}
          <div className="w-full mb-6 bg-purple-muted/50 border border-purple-border/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-purple-muted transition">
            <div>
              <p className="font-semibold text-black text-sm">Share your space, earn extra income</p>
              <p className="text-xs text-black-soft mt-0.5">List your guest house, lodge, or transport.</p>
            </div>
            <button className="bg-purple text-white px-4 py-2 sm:py-1.5 rounded-full text-xs font-semibold hover:bg-purple-hover transition shadow-sm whitespace-nowrap">
              Become a host
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-4 w-full mb-6">
            <button 
              onClick={() => setActiveTab("trips")}
              className={cn(
                "py-2 px-6 rounded-full text-sm font-semibold transition shadow-sm",
                activeTab === "trips" ? "bg-purple text-white" : "bg-white-soft text-black-soft hover:bg-white-soft/80"
              )}
            >
              Recent trips
            </button>
            <button 
              onClick={() => setActiveTab("reviews")}
              className={cn(
                "py-2 px-6 rounded-full text-sm font-semibold transition shadow-sm",
                activeTab === "reviews" ? "bg-purple text-white" : "bg-white-soft text-black-soft hover:bg-white-soft/80"
              )}
            >
              Reviews
            </button>
          </div>

          {/* Content: Trips */}
          {activeTab === "trips" && (
            <div className="w-full space-y-4">
              <div className="bg-white border border-white-soft p-4 rounded-xl flex justify-between items-center hover:border-purple/30 transition">
                <div>
                  <p className="font-semibold text-sm text-black">Chisanga's Lakeside Lodge</p>
                  <p className="text-xs text-black-muted mt-0.5">Livingstone, Zambia · Aug 2025</p>
                </div>
                <span className="text-[10px] font-bold text-green-700 bg-green-100 border border-green-200 px-2 py-1 rounded-full">Completed</span>
              </div>
              <div className="bg-white border border-white-soft p-4 rounded-xl flex justify-between items-center hover:border-purple/30 transition">
                <div>
                  <p className="font-semibold text-sm text-black">Mosi-oa-Tunya Safari & Cruise</p>
                  <p className="text-xs text-black-muted mt-0.5">Livingstone, Zambia · Jan 2026</p>
                </div>
                <span className="text-[10px] font-bold text-purple bg-purple-muted border border-purple-border/30 px-2 py-1 rounded-full">Upcoming</span>
              </div>
              <div className="bg-white border border-white-soft p-4 rounded-xl flex justify-between items-center hover:border-purple/30 transition">
                <div>
                  <p className="font-semibold text-sm text-black">Lusaka to Livingstone Express</p>
                  <p className="text-xs text-black-muted mt-0.5">Bus transport · Dec 2025</p>
                </div>
                <span className="text-[10px] font-bold text-green-700 bg-green-100 border border-green-200 px-2 py-1 rounded-full">Completed</span>
              </div>
              <button 
                onClick={() => router.push("/settings/history")}
                className="w-full py-3 mt-2 border border-white-soft rounded-xl text-sm font-semibold text-black hover:bg-white-soft transition"
              >
                See all trips
              </button>
            </div>
          )}

          {/* Content: Reviews */}
          {activeTab === "reviews" && (
            <div className="w-full space-y-4">
              <div className="bg-white border border-white-soft p-4 rounded-xl hover:border-purple/30 transition">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-semibold text-sm text-black">Chisanga's Lakeside Lodge</p>
                  <span className="text-xs font-bold text-black flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-gold text-gold" /> 5.0</span>
                </div>
                <p className="text-sm text-black-soft mt-1.5">"The room was spotless, the breakfast was amazing!"</p>
              </div>
              <div className="bg-white border border-white-soft p-4 rounded-xl hover:border-purple/30 transition">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-semibold text-sm text-black">Mosi-oa-Tunya Safari</p>
                  <span className="text-xs font-bold text-black flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-gold text-gold" /> 4.8</span>
                </div>
                <p className="text-sm text-black-soft mt-1.5">"Kapasa was an incredible guide! We saw hippos up close."</p>
              </div>
            </div>
          )}
        </div>

        {/* ================= RIGHT COLUMN (Settings) ================= */}
        <div className="w-full lg:w-1/3 flex flex-col border-t lg:border-t-0 lg:border-l border-white-soft pt-6 lg:pt-0 lg:pl-10">
          <h3 className="text-xl font-bold text-black mb-4">Account settings</h3>
          <AccountSettingsMenu />
        </div>

      </div>
    </div>
  );
}
