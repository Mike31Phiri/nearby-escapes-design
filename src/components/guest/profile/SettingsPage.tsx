"use client";

import { useRouter } from "next/navigation";
import {
  ChevronLeft,
} from "lucide-react";
import { ProfileSubpageHeader } from "./ProfileSubpageHeader";
import { AccountSettingsMenu } from "./AccountSettingsMenu";

export function SettingsPage() {
  return (
    <div className="min-h-screen flex items-start justify-center py-0 lg:py-8">
      <div className="w-full max-w-2xl bg-white lg:rounded-3xl lg:shadow-xl min-h-screen lg:min-h-0 overflow-hidden flex flex-col">
        
        {/* Header */}
        <ProfileSubpageHeader title="Settings" />

        <div className="p-4 md:p-8 flex-1 flex flex-col">
          <AccountSettingsMenu />
        </div>
      </div>
    </div>
  );
}
