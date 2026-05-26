"use client";

import { useState } from "react";
import { LoadingProvider } from "@/lib/loading-context";
import { AdminSidebar, MobileAdminNav } from "@/components/admin/AdminSidebar";
import { Navbar } from "@/components/layout/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <LoadingProvider>
      <div className="min-h-screen bg-[#fafafa]">
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
                  <p className="text-sm font-bold text-foreground hidden md:block">Admin Panel</p>
                </div>
              </div>
              <Navbar />
            </div>
          </div>

          {/* Page Content */}
          <main>{children}</main>
        </div>
      </div>
    </LoadingProvider>
  );
}
