"use client";

import { HostNav } from "@/components/layout/HostNav";
import { HostFooter } from "@/components/layout/HostFooter";

export default function HostLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HostNav />
      <main className="flex-1">{children}</main>
      <HostFooter />
    </div>
  );
}
