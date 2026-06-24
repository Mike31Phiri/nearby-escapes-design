"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Menu,
  User,
  Heart,
  LogIn,
  Compass,
  ShieldCheck,
  Building2,
  Clock,
  Hotel,
  Search,
  HelpCircle,
  MessageSquare,
  LogOut,
  CalendarDays,
  TrainFront,
  Ticket,
  Gem,
  Tag,
  Settings,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useNotificationStore } from "@/store/notificationStore";

import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Discover", href: "/search", icon: Compass },
  { label: "Saved", href: "/wishlist", icon: Heart },
  { label: "Trips", href: "/trips", icon: CalendarDays },
  { label: "Profile", href: "/profile", icon: User },
];

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const isAdmin = user?.role === "admin";
  const pathname = usePathname();
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#2A1B3D]" style={{ height: 64 }}>
      <div
        className="mx-auto h-full flex items-center justify-between px-6"
        style={{ maxWidth: 1200 }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 no-underline outline-none focus-visible:outline-none"
        >
          <span className="text-[22px] font-semibold text-white tracking-tight">Nearby</span>
          <span className="font-script text-[#C5A059] font-normal text-[1.4em] leading-none -mt-1">
            Escapes
          </span>
        </Link>

        {/* Nav links — desktop only */}
        <nav className="hidden lg:flex items-center gap-2.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 no-underline outline-none",
                  active
                    ? "bg-[#C5A059]/15 text-[#C5A059]"
                    : "text-white/80 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-1">
          {/* List your property — tablet/desktop only */}
          <Link
            href="/become-host"
            className="hidden md:inline-flex items-center text-[13px] font-medium text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors"
          >
            List your property
          </Link>

          {/* Desktop auth links — unauthenticated only */}
          {!isAuthenticated && (
            <div className="hidden md:flex items-center gap-2 ml-1 border-l border-white/10 pl-3">
              <Link
                href="/auth/login"
                className="text-[13px] font-semibold text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/auth/register"
                className="text-[13px] font-bold text-[#111111] bg-[#C5A059] hover:bg-[#d5b069] px-5 py-2 rounded-full transition-colors shadow-sm"
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Menu / Account — all SheetTriggers inside the Sheet */}
          <Sheet>
            {/* Desktop profile icon — authenticated only */}
            {isAuthenticated && (
              <SheetTrigger asChild>
                <button
                  className="hidden lg:flex items-center justify-center bg-none border-none text-[#C5A059] cursor-pointer hover:opacity-80 transition-opacity"
                  aria-label="Account"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name ?? ""}
                      className="h-8 w-8 rounded-full object-cover border-2 border-[#C5A059]/30"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/30 flex items-center justify-center">
                      <User className="h-4 w-4" strokeWidth={2} />
                    </div>
                  )}
                </button>
              </SheetTrigger>
            )}

            {/* Notification icon — mobile & tablet only, replaces hamburger menu (meaning no menu on tablet) */}
            {isAuthenticated ? (
              <Link
                href="/notifications"
                className="lg:hidden flex items-center justify-center text-[#C5A059] cursor-pointer relative h-9 w-9 rounded-full border border-[#C5A059]/20 hover:bg-white/5 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" strokeWidth={2} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 h-3.5 w-3.5 rounded-full bg-rose-500 text-white text-[8px] font-black flex items-center justify-center shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </Link>
            ) : (
              <div className="lg:hidden w-9" />
            )}

            <SheetContent
              side="right"
              className="w-[300px] sm:w-[350px] p-0 flex flex-col bg-[#2A1B3D] border-l border-[rgba(201,168,76,0.15)]"
            >
              <SheetTitle className="sr-only">Account Menu</SheetTitle>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
                {isAuthenticated ? (
                  <>
                    {/* User Profile Header */}
                    <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                      <div className="h-10 w-10 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/30 flex items-center justify-center overflow-hidden shrink-0">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name ?? ""}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-[#C5A059]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-base truncate text-white">
                          {user?.name ?? "My Account"}
                        </p>
                        {user?.email && (
                          <p className="text-sm font-normal text-[#9B95A8] truncate">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quick Navigation */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] mb-2 px-2">
                        Quick Links
                      </p>
                      <div className="flex flex-col gap-1">
                        <SheetClose asChild>
                          <Link
                            href="/"
                            className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-white/10 text-white transition-all duration-200"
                          >
                            <Home className="h-4 w-4 text-[#9B95A8]" /> Home
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/search"
                            className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-white/10 text-white transition-all duration-200"
                          >
                            <Search className="h-4 w-4 text-[#9B95A8]" /> Discover
                          </Link>
                        </SheetClose>
                      </div>
                    </div>

                    <div className="h-px bg-white/10" />

                    {/* Traveler Section */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] mb-2 px-2">
                        Travel
                      </p>
                      <div className="flex flex-col gap-1">
                        <SheetClose asChild>
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-white/10 text-white transition-all duration-200"
                          >
                            <User className="h-4 w-4 text-[#9B95A8]" /> My Profile
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/trips"
                            className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-white/10 text-white transition-all duration-200"
                          >
                            <Compass className="h-4 w-4 text-[#9B95A8]" /> My Trips
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/wishlist"
                            className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-white/10 text-white transition-all duration-200"
                          >
                            <Heart className="h-4 w-4 text-[#9B95A8]" /> My Collections
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/notifications"
                            className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-white/10 text-white transition-all duration-200"
                          >
                            <MessageSquare className="h-4 w-4 text-[#9B95A8]" /> Messages & Updates
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/settings"
                            className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-white/10 text-white transition-all duration-200"
                          >
                            <Settings className="h-4 w-4 text-[#9B95A8]" /> Settings
                          </Link>
                        </SheetClose>
                      </div>
                    </div>

                    {/* Host Section */}
                    {user?.role === "host" && (
                      <>
                        <div className="h-px bg-white/10" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] mb-2 px-2">
                            Hosting
                          </p>
                          <div className="flex flex-col gap-1">
                            <SheetClose asChild>
                              <Link
                                href="/host"
                                className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-white/10 text-white transition-all duration-200"
                              >
                                <Building2 className="h-4 w-4 text-[#9B95A8]" /> Host Dashboard
                              </Link>
                            </SheetClose>
                            <SheetClose asChild>
                              <Link
                                href="/host/listings"
                                className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-white/10 text-white transition-all duration-200"
                              >
                                <Hotel className="h-4 w-4 text-[#9B95A8]" /> My Listings
                              </Link>
                            </SheetClose>
                            <SheetClose asChild>
                              <Link
                                href="/host/bookings"
                                className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-white/10 text-white transition-all duration-200"
                              >
                                <CalendarDays className="h-4 w-4 text-[#9B95A8]" /> Booking Requests
                              </Link>
                            </SheetClose>
                            <SheetClose asChild>
                              <Link
                                href="/host/availability"
                                className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-white/10 text-white transition-all duration-200"
                              >
                                <Clock className="h-4 w-4 text-[#9B95A8]" /> Availability
                              </Link>
                            </SheetClose>
                            <SheetClose asChild>
                              <Link
                                href="/host/create"
                                className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium text-[#C5A059] hover:bg-white/10 transition-all duration-200"
                              >
                                Create New Listing
                              </Link>
                            </SheetClose>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Become a Host — for guest users */}
                    {user?.role === "guest" && (
                      <>
                        <div className="h-px bg-white/10" />
                        <SheetClose asChild>
                          <Link
                            href="/become-host"
                            className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium text-[#C5A059] hover:bg-white/10 transition-all duration-200"
                          >
                            Become a Host
                          </Link>
                        </SheetClose>
                      </>
                    )}

                    {/* Admin Section */}
                    {isAdmin && (
                      <>
                        <div className="h-px bg-white/10" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] mb-2 px-2">
                            Admin
                          </p>
                          <SheetClose asChild>
                            <Link
                              href="/admin"
                              className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium text-[#C5A059] hover:bg-white/10 transition-all duration-200"
                            >
                              <ShieldCheck className="h-4 w-4" /> Admin Dashboard
                            </Link>
                          </SheetClose>
                        </div>
                      </>
                    )}

                    {/* Sign Out */}
                    <div className="h-px bg-white/10" />
                    <SheetClose asChild>
                      <button
                        onClick={logout}
                        className="flex items-center w-full gap-3 rounded-full px-3 py-2 text-sm font-medium text-[#E7000B] hover:bg-white/10 transition-all duration-200 text-left"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </SheetClose>
                  </>
                ) : (
                  <>
                    {/* Welcome Header */}
                    <div className="pb-4 border-b border-white/10">
                      <p className="font-bold text-lg text-white">Welcome</p>
                      <p className="text-sm font-normal text-[#9B95A8] mt-0.5">
                        Sign in to start exploring
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <SheetClose asChild>
                        <Link
                          href="/auth/login"
                          className="flex items-center justify-center gap-2 rounded-full bg-[#C5A059] text-[#334155] px-5 py-2.5 text-sm font-semibold transition-all duration-200"
                        >
                          <LogIn className="h-4 w-4" /> Sign In
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/auth/register"
                          className="flex items-center justify-center gap-2 rounded-full border border-white/20 text-white px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:bg-white/10"
                        >
                          <User className="h-4 w-4 text-[#9B95A8]" /> Create Account
                        </Link>
                      </SheetClose>
                    </div>

                    {/* Quick Links */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] mb-2 px-2">
                        Quick Links
                      </p>
                      <div className="flex flex-col gap-1">
                        <SheetClose asChild>
                          <Link
                            href="/"
                            className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-white/10 text-white transition-all duration-200"
                          >
                            <Home className="h-4 w-4 text-[#9B95A8]" /> Home
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/search"
                            className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-white/10 text-white transition-all duration-200"
                          >
                            <Search className="h-4 w-4 text-[#9B95A8]" /> Discover
                          </Link>
                        </SheetClose>
                      </div>
                    </div>

                    <div className="h-px bg-white/10" />

                    {/* Browse Section */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] mb-2 px-2">
                        Browse
                      </p>
                      <div className="flex flex-col gap-1">
                        <SheetClose asChild>
                          <Link
                            href="/search"
                            className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-white/10 text-white transition-all duration-200"
                          >
                            <Search className="h-4 w-4 text-[#9B95A8]" /> All Results
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/search?category=stays"
                            className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-white/10 text-white transition-all duration-200"
                          >
                            <Hotel className="h-4 w-4 text-[#9B95A8]" /> Stays
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/search?category=transport"
                            className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-white/10 text-white transition-all duration-200"
                          >
                            <TrainFront className="h-4 w-4 text-[#9B95A8]" /> Transport
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/search?category=attractions"
                            className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-white/10 text-white transition-all duration-200"
                          >
                            <Ticket className="h-4 w-4 text-[#9B95A8]" /> Experiences
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/search?category=gems"
                            className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-white/10 text-white transition-all duration-200"
                          >
                            <Gem className="h-4 w-4 text-[#9B95A8]" /> Learning Tours
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/search?category=packages"
                            className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-white/10 text-white transition-all duration-200"
                          >
                            <Tag className="h-4 w-4 text-[#9B95A8]" /> Packages
                          </Link>
                        </SheetClose>
                      </div>
                    </div>

                    <div className="h-px bg-white/10" />

                    <SheetClose asChild>
                      <Link
                        href="/become-host"
                        className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium text-[#C5A059] hover:bg-white/10 transition-all duration-200"
                      >
                        List your property
                      </Link>
                    </SheetClose>
                  </>
                )}
              </div>

              {/* Bottom Sticky Footer */}
              <div className="p-4 border-t border-white/10 bg-[#120A20] flex flex-col gap-1">
                <SheetClose asChild>
                  <Link
                    href="/help"
                    className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-white/10 text-white transition-all duration-200"
                  >
                    <HelpCircle className="h-4 w-4 text-[#9B95A8]" /> Help & Support
                  </Link>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
