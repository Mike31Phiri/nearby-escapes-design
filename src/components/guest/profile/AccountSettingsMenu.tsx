"use client";

import { useRouter } from "next/navigation";
import {
  UserCircle,
  History,
  CreditCard,
  ShieldQuestion,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/store/authStore";

export function AccountSettingsMenu() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const settingsItems = [
    {
      id: "info",
      icon: UserCircle,
      title: "Personal info",
      description: "Update your name, email, and phone number",
      href: "/settings/info",
    },
    {
      id: "history",
      icon: History,
      title: "Trip history",
      description: "View all past stays, tours, and transfers",
      href: "/settings/history",
    },
    {
      id: "support",
      icon: ShieldQuestion,
      title: "Support & safety",
      description: "Get help, report an issue, or contact team",
      href: "/settings/support",
    },
  ];

  return (
    <div className="space-y-1.5">
      {settingsItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            onClick={() => router.push(item.href)}
            className="group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-neutral-200/80 hover:bg-neutral-50/80 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-[#6b2bb8]/8 text-[#6b2bb8] flex items-center justify-center shrink-0 group-hover:bg-[#6b2bb8]/15 transition-colors">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">{item.title}</p>
                <p className="text-xs text-neutral-500 truncate mt-0.5">{item.description}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </div>
        );
      })}

      {isAuthenticated && (
        <div
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-rose-200 hover:bg-rose-50/50 transition-all cursor-pointer mt-2 pt-2 border-t border-neutral-100"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-100 transition-colors">
              <LogOut className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-rose-600">Sign out</p>
              <p className="text-xs text-neutral-500 mt-0.5">Log out of your account</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition-all shrink-0" />
        </div>
      )}
    </div>
  );
}
