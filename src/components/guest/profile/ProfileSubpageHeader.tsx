"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface ProfileSubpageHeaderProps {
  title: string;
  rightAction?: React.ReactNode;
}

export function ProfileSubpageHeader({ title, rightAction }: ProfileSubpageHeaderProps) {
  const router = useRouter();

  return (
    <div className="w-full bg-white border-b border-neutral-200/80 px-4 py-3.5 sticky top-0 z-10 flex justify-between items-center">
      <button
        onClick={() => router.back()}
        className="p-1.5 hover:bg-neutral-100 rounded-full transition text-neutral-700 hover:text-neutral-900"
        aria-label="Go back"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <h1 className="text-base font-semibold text-neutral-900">{title}</h1>
      {rightAction ? rightAction : <div className="w-8"></div>}
    </div>
  );
}
