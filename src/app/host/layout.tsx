"use client";

import { usePathname } from "next/navigation";
import { HostNav } from "@/components/layout/HostNav";
import { HostFooter } from "@/components/layout/HostFooter";

export default function HostLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCreatePage = pathname?.includes("/create");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!isCreatePage && <HostNav />}
      <main className="flex-1">{children}</main>
      {!isCreatePage && <HostFooter />}
    </div>
  );
}
