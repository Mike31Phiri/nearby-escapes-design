"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCircle2, MessageCircle, AlertCircle, Trash2, MoreVertical, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const initialNotifications = [
  { id: 1, type: "booking", title: "Booking Confirmed", desc: "Your stay at Victoria Falls Waterfront Lodge is confirmed for May 15.", time: "2 hours ago", unread: true, icon: CheckCircle2, iconColor: "text-emerald-500", iconBg: "bg-emerald-50" },
  { id: 2, type: "message", title: "New message from Bwalya", desc: "Hello! Looking forward to hosting you soon. Let me know if you need...", time: "5 hours ago", unread: true, icon: MessageCircle, iconColor: "text-blue-500", iconBg: "bg-blue-50" },
  { id: 3, type: "review", title: "Rate your recent stay", desc: "How was your experience at Mazhandu Family Bus? Leave a review now.", time: "1 day ago", unread: false, icon: Bell, iconColor: "text-primary", iconBg: "bg-primary/10" },
  { id: 4, type: "security", title: "New Login Detected", desc: "A new login was detected on a Windows device from Lusaka, Zambia.", time: "3 days ago", unread: false, icon: AlertCircle, iconColor: "text-orange-500", iconBg: "bg-orange-50" },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    if (confirm("Clear all notifications?")) {
      setNotifications([]);
    }
  };

  const deleteOne = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 md:px-6 py-10 md:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground text-lg mt-2">Stay updated on your bookings and account activity.</p>
          </div>
          {notifications.length > 0 && (
            <div className="flex items-center gap-4">
              <button 
                onClick={markAllRead}
                className="text-sm font-bold text-primary hover:underline"
              >
                Mark all as read
              </button>
              <button 
                onClick={clearAll}
                className="text-sm font-bold text-muted-foreground hover:text-red-500 underline transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {notifications.length > 0 ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {notifications.map((n) => (
              <Card key={n.id} className={cn(
                "border-border/60 shadow-sm rounded-3xl overflow-hidden transition-all duration-300",
                n.unread ? "bg-primary/[0.02] border-primary/20" : "bg-card"
              )}>
                <CardContent className="p-6 md:p-8 flex items-start gap-6">
                  <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm", n.iconBg)}>
                    <n.icon className={cn("h-7 w-7", n.iconColor)} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className={cn("font-bold text-lg", n.unread ? "text-foreground" : "text-muted-foreground")}>{n.title}</h3>
                      <p className="text-xs text-muted-foreground font-medium">{n.time}</p>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{n.desc}</p>
                    <div className="pt-4 flex items-center gap-4">
                      {n.type === "booking" && (
                        <Link href="/account/bookings">
                          <Button size="sm" className="rounded-xl font-bold h-9 bg-primary">View booking</Button>
                        </Link>
                      )}
                      {n.type === "message" && (
                        <Link href="/host/messages">
                          <Button size="sm" className="rounded-xl font-bold h-9 bg-primary">Reply</Button>
                        </Link>
                      )}
                      {n.type === "review" && (
                        <Link href="/booking/review/1">
                          <Button size="sm" className="rounded-xl font-bold h-9 bg-primary">Write review</Button>
                        </Link>
                      )}
                      <button 
                        onClick={() => deleteOne(n.id)}
                        className="text-xs font-bold text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1.5"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                  {n.unread && (
                    <div className="h-3 w-3 rounded-full bg-primary animate-pulse flex-shrink-0 mt-2" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center animate-in zoom-in fade-in duration-700">
            <div className="w-24 h-24 bg-muted rounded-[40px] flex items-center justify-center mb-8 rotate-[-12deg]">
              <Bell className="h-12 w-12 text-muted-foreground/30" />
            </div>
            <h2 className="text-3xl font-extrabold mb-4">No new notifications</h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              We&apos;ll let you know when something important happens. In the meantime, go explore some new escapes!
            </p>
            <Link href="/search">
              <Button className="mt-10 h-14 rounded-2xl px-12 bg-primary font-extrabold text-lg shadow-xl">
                Start Exploring
              </Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
