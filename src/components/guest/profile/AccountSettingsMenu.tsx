"use client";

import { useRouter } from "next/navigation";
import { UserCircle, History, CreditCard, ShieldQuestion, ChevronRight } from "lucide-react";

export function AccountSettingsMenu() {
  const router = useRouter();

  const settingsItems = [
    {
      id: "info",
      icon: UserCircle,
      title: "Your info",
      description: "Update your email, phone, and payment",
      href: "/settings/info"
    },
    {
      id: "history",
      icon: History,
      title: "Trip history",
      description: "View all past stays and experiences",
      href: "/settings/history"
    },
    {
      id: "payments",
      icon: CreditCard,
      title: "Payment methods",
      description: "Manage mobile money, cards, and cash",
      href: "/settings/payments"
    },
    {
      id: "support",
      icon: ShieldQuestion,
      title: "Support & safety",
      description: "Get help, report an issue, or contact us",
      href: "/settings/support"
    }
  ];

  return (
    <div className="space-y-1">
      {settingsItems.map((item) => {
        const Icon = item.icon;
        return (
          <div 
            key={item.id}
            onClick={() => router.push(item.href)}
            className="flex items-center justify-between py-4 border-b border-white-soft cursor-pointer hover:bg-white-warm transition px-3 -mx-3 rounded-xl last:border-0"
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-white-soft rounded-full text-black flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-black">{item.title}</p>
                <p className="text-xs text-black-muted mt-0.5">{item.description}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-black-faint shrink-0" />
          </div>
        );
      })}
    </div>
  );
}
