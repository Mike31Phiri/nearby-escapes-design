"use client";

import { useState } from "react";
import { LoadingProvider } from "@/lib/loading-context";
import { AdminSidebar, MobileAdminNav } from "@/components/admin/AdminSidebar";
import { Bell, User } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <LoadingProvider>
      <div className="min-h-screen bg-muted">
        {/* Desktop Sidebar */}
        <AdminSidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Content Area */}
        <div
          className="transition-all duration-300"
          style={{ marginLeft: sidebarCollapsed ? "68px" : "240px" }}
        >
          {/* Top Navbar */}
          <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/30">
            <div className="flex items-center justify-between h-16 px-4 md:px-6 ml-0">
              <div className="flex items-center gap-3">
                <MobileAdminNav />
                <div>
                  <p className="text-base font-bold text-foreground hidden md:block">Admin Panel</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="relative p-2 rounded-xl hover:bg-accent/80 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
                </button>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
                  <User className="h-4 w-4 text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <main>{children}</main>
        </div>
      </div>
    </LoadingProvider>
  );
}
