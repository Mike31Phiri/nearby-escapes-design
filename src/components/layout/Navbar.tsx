"use client";

import Link from "next/link";
import {
  Menu,
  User,
  Heart,
  Compass,
  Building2,
  LogOut,
  CalendarDays,
  Settings,
  Bell,
} from "lucide-react";
import { EnvelopeSimple as MessageSquare } from "@phosphor-icons/react";
import { useAuth } from "@/lib/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet";

export function Navbar() {
  const { isAuthenticated, isHydrating, user, logout } = useAuth();
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;


  return (
    <header className="sticky top-0 z-50 bg-white" style={{ height: 64 }}>
      <div
        className="mx-auto h-full flex items-center justify-between px-6"
        style={{ maxWidth: 1200 }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 no-underline outline-none focus-visible:outline-none"
        >
          <span className="text-[22px] font-semibold text-black tracking-tight">Nearby</span>
          <span className="font-script text-purple font-normal text-[1.4em] leading-none">
            Escapes
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">

          {/* Become a host — hidden on mobile */}
          <Link
            href="/become-host"
            className="hidden md:inline-flex items-center text-[13px] font-medium text-black hover:text-purple hover:bg-black/10 px-4 py-2 rounded-full transition-colors"
          >
            Become a host
          </Link>

          {isHydrating ? (
            <div className="flex items-center gap-2 ml-1 border-l border-black/10 pl-3">
              <div className="w-16 h-8 rounded-full bg-white/10 animate-pulse hidden md:block" />
              <div className="w-[88px] h-9 rounded-full bg-white/10 animate-pulse hidden md:block" />
              <div className="w-[72px] h-[34px] rounded-full bg-white/10 animate-pulse ml-2" />
            </div>
          ) : (
            <>
              {/* Desktop auth links — unauthenticated only */}
              {!isAuthenticated && (
                <div className="hidden md:flex items-center gap-2 ml-1 border-l border-black/10 pl-3">
                  <Link
                    href="/auth/login"
                    className="text-[13px] font-semibold text-black hover:text-purple hover:bg-black/10 px-4 py-2 rounded-full transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/register"
                    className="text-[13px] font-bold text-black bg-gold hover:bg-gold-hover px-5 py-2 rounded-full transition-colors shadow-sm"
                  >
                    Sign up
                  </Link>
                </div>
              )}

              {/* Notification icon — mobile & tablet only */}
              {isAuthenticated && (
                <Link
                  href="/notifications"
                  className="lg:hidden flex items-center justify-center text-purple cursor-pointer relative h-8 w-8 rounded-full border border-purple/20 hover:bg-black/5 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" strokeWidth={2} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 h-3.5 w-3.5 rounded-full bg-gold text-black text-[8px] font-black flex items-center justify-center shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Profile Dropdown / Nav Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    className="flex items-center justify-center bg-black/5 border border-black/10 rounded-full px-3 py-2 text-black/90 hover:bg-black/10 hover:border-white/20 transition-all cursor-pointer shadow-sm"
                    aria-label="Menu"
                  >
                    {isAuthenticated ? (
                      user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name ?? ""}
                          className="h-7 w-7 rounded-full object-cover border border-purple/50"
                        />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-gold flex items-center justify-center">
                          <User className="h-4 w-4 text-black" strokeWidth={2} />
                        </div>
                      )
                    ) : (
                      <Menu className="h-[18px] w-[18px]" strokeWidth={2.5} />
                    )}
                  </button>
                </SheetTrigger>

                <SheetContent
                  side="right"
                  className="w-[300px] sm:w-[350px] p-0 flex flex-col bg-white border-l border-gold-muted"
                >
                  <SheetTitle className="sr-only">Account Menu</SheetTitle>
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
                    {isAuthenticated ? (
                      <>
                        {/* User Profile Header */}
                        <div className="flex items-center gap-3 pb-4 border-b border-black/10">
                          <div className="h-10 w-10 rounded-full bg-gold/20 border border-purple/30 flex items-center justify-center overflow-hidden shrink-0">
                            {user?.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name ?? ""}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <User className="h-5 w-5 text-purple" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-lg truncate text-black">
                              {user?.name ?? "My Account"}
                            </p>
                            {user?.email && (
                              <p className="text-base font-normal text-black-faint truncate">
                                {user.email}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Traveler Section */}
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-purple mb-2 px-2">
                            Account
                          </p>
                          <div className="flex flex-col gap-1">
                            <SheetClose asChild>
                              <Link
                                href="/"
                                className="flex items-center gap-3 rounded-full px-3 py-2 text-base font-medium hover:bg-black/10 text-black transition-all duration-200"
                              >
                                <Home className="h-4 w-4 text-black-faint" /> Home
                              </Link>
                            </SheetClose>
                            <SheetClose asChild>
                              <Link
                                href="/explore"
                                className="flex items-center gap-3 rounded-full px-3 py-2 text-base font-medium hover:bg-black/10 text-black transition-all duration-200"
                              >
                                <Compass className="h-4 w-4 text-black-faint" /> Explore
                              </Link>
                            </SheetClose>
                            <SheetClose asChild>
                              <Link
                                href="/profile"
                                className="flex items-center gap-3 rounded-full px-3 py-2 text-base font-medium hover:bg-black/10 text-black transition-all duration-200"
                              >
                                <User className="h-4 w-4 text-black-faint" /> Personal Info
                              </Link>
                            </SheetClose>
                            <SheetClose asChild>
                              <Link
                                href="/wishlist"
                                className="flex items-center gap-3 rounded-full px-3 py-2 text-base font-medium hover:bg-black/10 text-black transition-all duration-200"
                              >
                                <Heart className="h-4 w-4 text-black-faint" /> Saved
                              </Link>
                            </SheetClose>
                            <SheetClose asChild>
                              <Link
                                href="/trips"
                                className="flex items-center gap-3 rounded-full px-3 py-2 text-base font-medium hover:bg-black/10 text-black transition-all duration-200"
                              >
                                <CalendarDays className="h-4 w-4 text-black-faint" /> Trips
                              </Link>
                            </SheetClose>
                            <SheetClose asChild>
                              <Link
                                href="/notifications"
                                className="flex items-center gap-3 rounded-full px-3 py-2 text-base font-medium hover:bg-black/10 text-black transition-all duration-200"
                              >
                                <MessageSquare className="h-4 w-4 text-black-faint" /> Messages &
                                Updates
                              </Link>
                            </SheetClose>
                            <SheetClose asChild>
                              <Link
                                href="/settings"
                                className="flex items-center gap-3 rounded-full px-3 py-2 text-base font-medium hover:bg-black/10 text-black transition-all duration-200"
                              >
                                <Settings className="h-4 w-4 text-black-faint" /> Settings
                              </Link>
                            </SheetClose>
                          </div>
                        </div>

                        {/* Become a host */}
                        <SheetClose asChild>
                          <Link
                            href="/become-host"
                            className="flex items-center gap-3 rounded-full px-3 py-2 text-base font-medium hover:bg-black/10 text-black transition-all duration-200"
                          >
                            <Building2 className="h-4 w-4 text-black-faint" /> Become a host
                          </Link>
                        </SheetClose>

                        {/* Sign Out */}
                        <div className="h-px bg-white/10" />
                        <SheetClose asChild>
                          <button
                            onClick={logout}
                            className="flex items-center w-full gap-3 rounded-full px-3 py-2 text-base font-medium text-purple hover:bg-black/10 transition-all duration-200 text-left"
                          >
                            <LogOut className="h-4 w-4" /> Sign Out
                          </button>
                        </SheetClose>
                      </>
                    ) : (
                      <div className="flex flex-col gap-3 mt-4">
                        <p className="text-[14px] text-black/80 text-center">
                          Welcome to Nearby Escapes! Log in to save trips and access your reservations.
                        </p>
                        <div className="h-px bg-white/10 my-1" />
                        <SheetClose asChild>
                          <Link
                            href="/auth/register"
                            className="w-full bg-gold hover:bg-gold-hover text-black rounded-xl py-3.5 text-center text-[15px] font-bold transition-all shadow-md"
                          >
                            Sign up
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/auth/login"
                            className="w-full bg-black/5 hover:bg-black/10 text-black rounded-xl py-3.5 text-center text-[15px] font-bold transition-all"
                          >
                            Log in
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/explore"
                            className="flex items-center gap-3 rounded-full px-3 py-2 text-base font-medium hover:bg-black/10 text-black transition-all duration-200"
                          >
                            <Compass className="h-4 w-4 text-black-faint" /> Explore
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/become-host"
                            className="flex items-center gap-3 rounded-full px-3 py-2 text-base font-medium hover:bg-black/10 text-black transition-all duration-200"
                          >
                            <Building2 className="h-4 w-4 text-black-faint" /> Become a host
                          </Link>
                        </SheetClose>
                      </div>
                    )}
                  </div>

                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
