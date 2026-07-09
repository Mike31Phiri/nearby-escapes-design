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
    <div className="w-full bg-white border-b border-white-soft px-4 py-4 sticky top-0 z-10 flex justify-between items-center">
      <button 
        onClick={() => router.back()} 
        className="p-1 hover:bg-white-soft rounded-full transition text-black"
        aria-label="Go back"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <h1 className="text-lg font-bold text-black">{title}</h1>
      {rightAction ? rightAction : <div className="w-6"></div>}
    </div>
  );
}
