"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User, Heart, LogIn, Compass, ShieldCheck, Building2, Bell, CheckCheck, Clock, Inbox, Hotel, Search, HelpCircle, MessageSquare, LogOut, CalendarDays, TrainFront, Ticket, Gem, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import logo from "@/assets/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/store/notificationStore";
import { timeAgo } from "@/lib/utils";

const NOTIF_TYPE_CONFIG: Record<string, { color: string }> = {
  booking_confirmed: { color: "text-emerald-500" },
  booking_cancelled: { color: "text-rose-500" },
  booking_request: { color: "text-amber-500" },
  review_received: { color: "text-amber-400" },
  message: { color: "text-blue-500" },
  system: { color: "text-primary" },
  listing_approved: { color: "text-emerald-500" },
  listing_rejected: { color: "text-rose-500" },
  payout: { color: "text-emerald-500" },
  promotion: { color: "text-purple-500" },
};

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const isAdmin = user?.role === "admin";
  const { notifications, getUnreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const unreadCount = getUnreadCount();
  const recentNotifications = notifications
    .slice()
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);
  const hasUnread = unreadCount > 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-black text-lg shrink-0">
          <img
            src={logo.src}
            alt="Nearby Escapes"
            width={36}
            height={36}
            className="h-9 w-9 rounded-xl object-contain bg-white"
          />
          <span className="hidden sm:inline tracking-tight">Nearby Escapes</span>
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Search icon shortcut */}
          <Link
            href="/search"
            className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
            aria-label="Search"
          >
            <Search className="h-4.5 w-4.5" />
          </Link>

          {/* Wishlist */}
          {isAuthenticated && (
            <Link
              href="/wishlist"
              className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
              aria-label="My wishlist"
            >
              <Heart className="h-4.5 w-4.5" />
            </Link>
          )}

          {/* Notifications bell */}
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="relative h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                  aria-label={`Notifications${hasUnread ? ` (${unreadCount} unread)` : ""}`}
                >
                  <Bell className="h-4.5 w-4.5" />
                  {hasUnread && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground shadow-sm ring-2 ring-background">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-80 rounded-2xl p-2 shadow-xl border-border/50"
              >
                <DropdownMenuLabel className="flex items-center justify-between px-2 py-1.5">
                  <span className="font-bold text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      <CheckCheck className="h-3.5 w-3.5 inline mr-0.5" />
                      Mark all read
                    </button>
                  )}
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {recentNotifications.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-center px-4">
                    <Inbox className="h-8 w-8 text-muted-foreground/30 mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">No notifications yet</p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">
                      Updates will appear here when they arrive.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-[360px] overflow-y-auto space-y-0.5">
                    {recentNotifications.map((n) => {
                      const cfg = NOTIF_TYPE_CONFIG[n.type] ?? { color: "text-muted-foreground" };
                      return (
                        <DropdownMenuItem
                          key={n.id}
                          onClick={() => markAsRead(n.id)}
                          className={cn(
                            "cursor-pointer rounded-xl px-3 py-2.5 flex items-start gap-3",
                            !n.read && "bg-primary/[0.03]",
                          )}
                          asChild
                        >
                          <div>
                            <div
                              className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                                n.read ? "bg-muted" : "bg-primary/10",
                              )}
                            >
                              <Bell className={cn("h-4 w-4", n.read ? "text-muted-foreground/50" : cfg.color)} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={cn(
                                  "text-xs leading-snug",
                                  n.read ? "font-medium text-foreground" : "font-bold text-foreground",
                                )}
                              >
                                {n.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                {!n.read && (
                                  <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                )}
                                <span className="text-[9px] text-muted-foreground/60 font-medium">
                                  {timeAgo(n.timestamp)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      );
                    })}
                  </div>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link
                    href="/notifications"
                    className="cursor-pointer rounded-xl font-semibold text-center justify-center text-primary"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    View All Notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Become a Host CTA — always visible for non-admin users */}
          {!isAdmin && (
            <Link
              href={user?.role === "host" ? "/host" : "/become-host"}
              className={cn(
                "hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                user?.role === "host"
                  ? "border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20",
              )}
            >
              {user?.role === "host" ? "Host Dashboard" : "Become a Host"}
            </Link>
          )}

          {/* Profile / Auth dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                id="navbar-profile-menu"
                className="flex items-center gap-2 h-9 rounded-xl border border-border/60 bg-card px-2.5 hover:border-primary/30 hover:bg-primary/3 transition-all shadow-sm"
                aria-label="Account menu"
              >
                <Menu className="h-4 w-4 text-muted-foreground" />
                <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  {isAuthenticated && user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name ?? "Profile"}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-3.5 w-3.5 text-primary" />
                  )}
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 rounded-2xl p-2 shadow-xl border-border/50"
            >
              {isAuthenticated ? (
                <>
                  <DropdownMenuLabel className="font-bold text-sm px-2 py-1.5">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden shrink-0">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name ?? ""}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-3.5 w-3.5 text-primary" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate">{user?.name ?? "My Account"}</p>
                        {user?.email && (
                          <p className="text-xs font-normal text-muted-foreground truncate">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Traveler section */}
                  <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-2 pb-1">
                    Travel
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer rounded-xl font-medium">
                      <User className="h-4 w-4 mr-2.5 text-muted-foreground" /> My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/trips" className="cursor-pointer rounded-xl font-medium">
                      <Compass className="h-4 w-4 mr-2.5 text-muted-foreground" /> My Trips
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="cursor-pointer rounded-xl font-medium">
                      <Heart className="h-4 w-4 mr-2.5 text-muted-foreground" /> My Collections
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/notifications" className="cursor-pointer rounded-xl font-medium">
                      <MessageSquare className="h-4 w-4 mr-2.5 text-muted-foreground" /> Messages & Updates
                    </Link>
                  </DropdownMenuItem>

                  {/* Host Section */}
                  {user?.role === "host" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-2 pb-1">
                        Hosting
                      </DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href="/host" className="cursor-pointer rounded-xl font-medium">
                          <Building2 className="h-4 w-4 mr-2.5 text-muted-foreground" /> Host Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/host/listings" className="cursor-pointer rounded-xl font-medium">
                          <Hotel className="h-4 w-4 mr-2.5 text-muted-foreground" /> My Listings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/host/bookings" className="cursor-pointer rounded-xl font-medium">
                          <CalendarDays className="h-4 w-4 mr-2.5 text-muted-foreground" /> Booking Requests
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/host/availability" className="cursor-pointer rounded-xl font-medium">
                          <Clock className="h-4 w-4 mr-2.5 text-muted-foreground" /> Availability
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/host/create" className="cursor-pointer rounded-xl font-medium text-primary">
                          Create New Listing
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {/* Become a Host — for guest users only (CTA also visible in navbar) */}
                  {user?.role === "guest" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/become-host" className="cursor-pointer rounded-xl font-medium text-primary">
                          Become a Host
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {/* Admin Section */}
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-2 pb-1">
                        Admin
                      </DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer rounded-xl font-medium text-primary">
                          <ShieldCheck className="h-4 w-4 mr-2.5" /> Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/help" className="cursor-pointer rounded-xl font-medium">
                      <HelpCircle className="h-4 w-4 mr-2.5 text-muted-foreground" /> Help & Support
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer rounded-xl font-medium text-destructive focus:text-destructive focus:bg-destructive/5"
                  >
                    <LogOut className="h-4 w-4 mr-2.5" />
                    Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel className="font-bold text-sm px-2 py-1.5 text-foreground">
                    Welcome
                    <p className="text-xs font-normal text-muted-foreground mt-0.5">
                      Sign in to start exploring
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href="/auth/login" className="cursor-pointer rounded-xl font-semibold">
                      <LogIn className="h-4 w-4 mr-2.5 text-muted-foreground" /> Sign In
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/register" className="cursor-pointer rounded-xl font-medium">
                      <User className="h-4 w-4 mr-2.5 text-muted-foreground" /> Create Account
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-2 pb-1">
                    Browse
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href="/search?category=stays" className="cursor-pointer rounded-xl font-medium">
                      <Hotel className="h-4 w-4 mr-2.5 text-muted-foreground" /> Stays
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/search?category=transport" className="cursor-pointer rounded-xl font-medium">
                      <TrainFront className="h-4 w-4 mr-2.5 text-muted-foreground" /> Transport
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/search?category=attractions" className="cursor-pointer rounded-xl font-medium">
                      <Ticket className="h-4 w-4 mr-2.5 text-muted-foreground" /> Experiences
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/search?category=gems" className="cursor-pointer rounded-xl font-medium">
                      <Gem className="h-4 w-4 mr-2.5 text-muted-foreground" /> Hidden Gems
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/search?category=packages" className="cursor-pointer rounded-xl font-medium">
                      <Tag className="h-4 w-4 mr-2.5 text-muted-foreground" /> Packages
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/become-host" className="cursor-pointer rounded-xl font-medium text-primary">
                      List your property
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/help" className="cursor-pointer rounded-xl font-medium">
                      <HelpCircle className="h-4 w-4 mr-2.5 text-muted-foreground" /> Help & Support
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
