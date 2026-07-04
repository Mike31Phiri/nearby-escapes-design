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
  LogOut,
  CalendarDays,
  TrainFront,
  Ticket,
  Gem,
  Tag,
  Settings,
  Bell,
} from "lucide-react";
import { EnvelopeSimple as MessageSquare } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet";

export function Navbar() {
  const { isAuthenticated, isHydrating, user, logout } = useAuth();
  const isAdmin = user?.role === "admin";
  const pathname = usePathname();
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

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
          <span className="text-[22px] font-semibold text-[#111111] tracking-tight">Nearby</span>
          <span className="font-script text-[#1f1433] font-normal text-[1.4em] leading-none">Escapes</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* List your property — tablet/desktop only */}
          <Link
            href="/become-host"
            className="hidden md:inline-flex items-center text-[13px] font-medium text-[#111111] hover:text-[#1f1433] hover:bg-[#111111]/10 px-4 py-2 rounded-full transition-colors"
          >
            List your property
          </Link>

          {isHydrating ? (
            <div className="flex items-center gap-2 ml-1 border-l border-[#111111]/10 pl-3">
              <div className="w-16 h-8 rounded-full bg-white/10 animate-pulse hidden md:block" />
              <div className="w-[88px] h-9 rounded-full bg-white/10 animate-pulse hidden md:block" />
              <div className="w-[72px] h-[34px] rounded-full bg-white/10 animate-pulse ml-2" />
            </div>
          ) : (
            <>
              {/* Desktop auth links — unauthenticated only */}
              {!isAuthenticated && (
                <div className="hidden md:flex items-center gap-2 ml-1 border-l border-[#111111]/10 pl-3">
                  <Link
                    href="/auth/login"
                    className="text-[13px] font-semibold text-[#111111] hover:text-[#1f1433] hover:bg-[#111111]/10 px-4 py-2 rounded-full transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/register"
                    className="text-[13px] font-bold text-[#111111] bg-[#f2ba0d] hover:bg-[#d4b065] px-5 py-2 rounded-full transition-colors shadow-sm"
                  >
                    Sign up
                  </Link>
                </div>
              )}

              {/* Notification icon — mobile & tablet only */}
              {isAuthenticated && (
                <Link
                  href="/notifications"
                  className="lg:hidden flex items-center justify-center text-[#1f1433] cursor-pointer relative h-8 w-8 rounded-full border border-[#1f1433]/20 hover:bg-[#111111]/5 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" strokeWidth={2} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 h-3.5 w-3.5 rounded-full bg-rose-500 text-[#111111] text-[8px] font-black flex items-center justify-center shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Profile Dropdown / Nav Menu */}
              <Sheet>
                  <SheetTrigger asChild>
                    <button
                      className={cn(
                        "flex items-center gap-2.5 bg-[#111111]/5 border border-[#111111]/10 rounded-full py-1.5 pl-3.5 pr-1.5 text-[#111111]/90 hover:bg-[#111111]/10 hover:border-white/20 transition-all cursor-pointer shadow-sm",
                        !isAuthenticated && "md:hidden",
                      )}
                      aria-label="Menu"
                    >
                      <Menu
                        className={cn("h-[18px] w-[18px]", isAuthenticated && "lg:hidden")}
                        strokeWidth={2.5}
                      />
                      {isAuthenticated && user?.name && (
                        <span className="hidden lg:inline-block text-[13px] font-bold text-[#111111] pl-1 pr-2">
                          {user.name.split(" ")[0]}
                        </span>
                      )}
                      {isAuthenticated && user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name ?? ""}
                          className="h-7 w-7 rounded-full object-cover border border-[#1f1433]/50"
                        />
                      ) : isAuthenticated ? (
                        <div className="h-7 w-7 rounded-full bg-[#f2ba0d] flex items-center justify-center">
                          <User className="h-4 w-4 text-[#111111]" strokeWidth={2} />
                        </div>
                      ) : null}
                    </button>
                  </SheetTrigger>

                  <SheetContent
                    side="right"
                    className="w-[300px] sm:w-[350px] p-0 flex flex-col bg-white border-l border-[rgba(201,168,76,0.15)]"
                  >
                    <SheetTitle className="sr-only">Account Menu</SheetTitle>
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
                      {isAuthenticated ? (
                        <>
                          {/* User Profile Header */}
                          <div className="flex items-center gap-3 pb-4 border-b border-[#111111]/10">
                            <div className="h-10 w-10 rounded-full bg-[#f2ba0d]/20 border border-[#1f1433]/30 flex items-center justify-center overflow-hidden shrink-0">
                              {user?.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.name ?? ""}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <User className="h-5 w-5 text-[#1f1433]" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-base truncate text-[#111111]">
                                {user?.name ?? "My Account"}
                              </p>
                              {user?.email && (
                                <p className="text-sm font-normal text-[#9B95A8] truncate">
                                  {user.email}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Traveler Section */}
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#1f1433] mb-2 px-2">
                              Account
                            </p>
                            <div className="flex flex-col gap-1">
                              <SheetClose asChild>
                                <Link
                                  href="/"
                                  className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-[#111111]/10 text-[#111111] transition-all duration-200"
                                >
                                  <Home className="h-4 w-4 text-[#9B95A8]" /> Home
                                </Link>
                              </SheetClose>
                              <SheetClose asChild>
                                <Link
                                  href="/search"
                                  className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-[#111111]/10 text-[#111111] transition-all duration-200"
                                >
                                  <Compass className="h-4 w-4 text-[#9B95A8]" /> Discover
                                </Link>
                              </SheetClose>
                              <SheetClose asChild>
                                <Link
                                  href="/account/dashboard"
                                  className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-[#111111]/10 text-[#111111] transition-all duration-200"
                                >
                                  <User className="h-4 w-4 text-[#9B95A8]" /> Personal Info
                                </Link>
                              </SheetClose>
                              <SheetClose asChild>
                                <Link
                                  href="/wishlist"
                                  className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-[#111111]/10 text-[#111111] transition-all duration-200"
                                >
                                  <Heart className="h-4 w-4 text-[#9B95A8]" /> Saved
                                </Link>
                              </SheetClose>
                              <SheetClose asChild>
                                <Link
                                  href="/trips"
                                  className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-[#111111]/10 text-[#111111] transition-all duration-200"
                                >
                                  <CalendarDays className="h-4 w-4 text-[#9B95A8]" /> Trips
                                </Link>
                              </SheetClose>
                              <SheetClose asChild>
                                <Link
                                  href="/notifications"
                                  className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-[#111111]/10 text-[#111111] transition-all duration-200"
                                >
                                  <MessageSquare className="h-4 w-4 text-[#9B95A8]" /> Messages &
                                  Updates
                                </Link>
                              </SheetClose>
                              <SheetClose asChild>
                                <Link
                                  href="/settings"
                                  className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-[#111111]/10 text-[#111111] transition-all duration-200"
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
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1f1433] mb-2 px-2">
                                  Hosting
                                </p>
                                <div className="flex flex-col gap-1">
                                  <SheetClose asChild>
                                    <Link
                                      href="/host"
                                      className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-[#111111]/10 text-[#111111] transition-all duration-200"
                                    >
                                      <Building2 className="h-4 w-4 text-[#9B95A8]" /> Host
                                      Dashboard
                                    </Link>
                                  </SheetClose>
                                  <SheetClose asChild>
                                    <Link
                                      href="/host/listings"
                                      className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-[#111111]/10 text-[#111111] transition-all duration-200"
                                    >
                                      <Hotel className="h-4 w-4 text-[#9B95A8]" /> My Listings
                                    </Link>
                                  </SheetClose>
                                  <SheetClose asChild>
                                    <Link
                                      href="/host/bookings"
                                      className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-[#111111]/10 text-[#111111] transition-all duration-200"
                                    >
                                      <CalendarDays className="h-4 w-4 text-[#9B95A8]" /> Booking
                                      Requests
                                    </Link>
                                  </SheetClose>
                                  <SheetClose asChild>
                                    <Link
                                      href="/host/availability"
                                      className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-[#111111]/10 text-[#111111] transition-all duration-200"
                                    >
                                      <Clock className="h-4 w-4 text-[#9B95A8]" /> Availability
                                    </Link>
                                  </SheetClose>
                                  <SheetClose asChild>
                                    <Link
                                      href="/host/create"
                                      className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium text-[#1f1433] hover:bg-[#111111]/10 transition-all duration-200"
                                    >
                                      Create New Listing
                                    </Link>
                                  </SheetClose>
                                </div>
                              </div>
                            </>
                          )}

                          {/* Become a Host — for guest users */}
                          {user?.role !== "host" && (
                            <>
                              <div className="h-px bg-white/10" />
                              <SheetClose asChild>
                                <Link
                                  href="/become-host"
                                  className="flex items-center justify-center gap-2 rounded-full px-4 py-3 mt-1 text-[14px] font-bold bg-transparent border border-[#1f1433]/50 text-[#1f1433] hover:bg-[#111111]/5 transition-all duration-200 shadow-sm"
                                >
                                  <Building2 className="h-[18px] w-[18px]" /> List your property
                                </Link>
                              </SheetClose>
                            </>
                          )}

                          {/* Admin Section */}
                          {isAdmin && (
                            <>
                              <div className="h-px bg-white/10" />
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1f1433] mb-2 px-2">
                                  Admin
                                </p>
                                <SheetClose asChild>
                                  <Link
                                    href="/admin"
                                    className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium text-[#1f1433] hover:bg-[#111111]/10 transition-all duration-200"
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
                              className="flex items-center w-full gap-3 rounded-full px-3 py-2 text-sm font-medium text-[#E7000B] hover:bg-[#111111]/10 transition-all duration-200 text-left"
                            >
                              <LogOut className="h-4 w-4" /> Sign Out
                            </button>
                          </SheetClose>
                        </>
                      ) : (
                        <div className="flex flex-col gap-3 mt-4">
                          {/* Navigation */}
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#1f1433] mb-2 px-2">
                              Explore
                            </p>
                            <div className="flex flex-col gap-1">
                              <SheetClose asChild>
                                <Link
                                  href="/"
                                  className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-[#111111]/10 text-[#111111] transition-all duration-200"
                                >
                                  <Home className="h-4 w-4 text-[#9B95A8]" /> Home
                                </Link>
                              </SheetClose>
                              <SheetClose asChild>
                                <Link
                                  href="/search"
                                  className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-[#111111]/10 text-[#111111] transition-all duration-200"
                                >
                                  <Compass className="h-4 w-4 text-[#9B95A8]" /> Discover
                                </Link>
                              </SheetClose>
                            </div>
                          </div>
                          <div className="h-px bg-white/10" />
                          <p className="text-[14px] text-[#111111]/80 text-center mb-6">
                            Welcome to Nearby Escapes! Log in to save trips and access your
                            reservations.
                          </p>
                          <SheetClose asChild>
                            <Link
                              href="/search"
                              className="w-full bg-white border border-[#1f1433]/30 hover:border-[#1f1433] text-[#111111] rounded-xl py-3.5 text-center text-[15px] font-bold transition-all shadow-md flex justify-center items-center gap-2"
                            >
                              <Compass className="h-4 w-4 text-[#1f1433]" /> Discover escapes
                            </Link>
                          </SheetClose>
                          <div className="h-px bg-white/10 my-1" />
                          <SheetClose asChild>
                            <Link
                              href="/auth/register"
                              className="w-full bg-[#f2ba0d] hover:bg-[#d4b065] text-[#111111] rounded-xl py-3.5 text-center text-[15px] font-bold transition-all shadow-md"
                            >
                              Sign up
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link
                              href="/auth/login"
                              className="w-full bg-white/10 hover:bg-white/20 text-[#111111] rounded-xl py-3.5 text-center text-[15px] font-bold transition-all"
                            >
                              Log in
                            </Link>
                          </SheetClose>
                          <div className="h-px bg-white/10 my-4" />
                          <SheetClose asChild>
                            <Link
                              href="/become-host"
                              className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-[#111111]/5 border border-[#1f1433]/50 text-[#1f1433] rounded-xl py-3.5 text-[15px] font-bold transition-all"
                            >
                              <Building2 className="h-[18px] w-[18px]" /> List your property
                            </Link>
                          </SheetClose>
                        </div>
                      )}
                    </div>

                    {/* Bottom Sticky Footer */}
                    <div className="p-4 border-t border-[#111111]/10 bg-[#120A20] flex flex-col gap-1">
                      <SheetClose asChild>
                        <Link
                          href="/help"
                          className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium hover:bg-[#111111]/10 text-[#111111] transition-all duration-200"
                        >
                          <HelpCircle className="h-4 w-4 text-[#9B95A8]" /> Help & Support
                        </Link>
                      </SheetClose>
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


