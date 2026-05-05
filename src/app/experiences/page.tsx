"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function ExperiencesPage() {
  useEffect(() => {
    redirect("/packages");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F3FF]">
        <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-black uppercase tracking-widest text-primary/60">Finding Experiences...</p>
        </div>
    </div>
  );
}
