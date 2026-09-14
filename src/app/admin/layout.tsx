"use client";

import { useState } from "react";
import Link from "next/link";
import { LoadingProvider } from "@/lib/loading-context";
import { AdminSidebar, MobileAdminNav } from "@/components/admin/AdminSidebar";
import { Bell, User, Building2, Globe, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <LoadingProvider>
      <div className="min-h-screen bg-background">
        {/* Desktop Sidebar */}
        <AdminSidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Content Area */}
        <div
          className={`transition-all duration-300 ml-0 ${
            sidebarCollapsed ? "md:ml-[68px]" : "md:ml-[240px]"
          }`}
        >
          {/* Top Navbar — Solid, unglassy surface */}
          <header className="sticky top-0 z-30 bg-white border-b border-neutral-200/80 shadow-2xs">
            <div className="flex items-center justify-between h-16 px-4 md:px-6">
              <div className="flex items-center gap-3">
                <MobileAdminNav />
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-neutral-900 hidden md:block">
                    Admin Operations
                  </p>
                  <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-semibold text-purple bg-purple/10 border border-purple/15 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="h-3 w-3" />
                    Super Admin
                  </span>
                </div>
              </div>

              {/* Quick Portal Switcher & User Tools */}
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/host"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors border border-neutral-200/80"
                >
                  <Building2 className="h-3.5 w-3.5 text-purple" />
                  Host Portal
                </Link>
                <Link
                  href="/"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors border border-neutral-200/80"
                >
                  <Globe className="h-3.5 w-3.5 text-emerald-600" />
                  Live Site
                </Link>

                <button
                  type="button"
                  onClick={() => toast.info("No unread critical system alerts")}
                  className="relative p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                  aria-label="System Notifications"
                >
                  <Bell className="h-4.5 w-4.5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-purple rounded-full" />
                </button>

                <div className="flex items-center gap-2 pl-2 border-l border-neutral-200/80">
                  <div className="w-8 h-8 rounded-full bg-purple/10 border border-purple/20 flex items-center justify-center text-purple font-semibold text-xs">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="hidden xl:block text-left">
                    <p className="text-xs font-semibold text-neutral-900 leading-none">Operations</p>
                    <p className="text-[10px] text-neutral-500 leading-tight mt-0.5">Admin Team</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main>{children}</main>
        </div>
      </div>
    </LoadingProvider>
  );
}
