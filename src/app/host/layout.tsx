"use client";

import { HostNav } from "@/components/layout/HostNav";

export default function HostLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HostNav />
      {children}
    </>
  );
}
