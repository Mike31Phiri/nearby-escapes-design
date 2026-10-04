"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  User,
  Heart,
  LogOut,
  CalendarDays,
  Bell,
  HelpCircle,
  DollarSign,
  Shield,
  Search,
  MapPin,
  Ticket,
  Building2,
  ChevronRight,
} from "lucide-react";
import { EnvelopeSimple as MessageSquare } from "@phosphor-icons/react";
import { useAuth } from "@/lib/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { WishlistPopover } from "@/components/guest/wishlist/WishlistPopover";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet";
import { DateRangePicker, serializeDates, type DateRange } from "@/components/ui/DateRangePicker";

export function Navbar() {
  const { isAuthenticated, isHydrating, user, logout } = useAuth();
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const router = useRouter();
  const pathname = usePathname();
  // Return the user to this page after they log in / sign up
  const authNext =
    pathname && pathname !== "/" && !pathname.startsWith("/auth")
      ? `?next=${encodeURIComponent(pathname)}`
      : "";

  // Show compact header search only on search results pages (NOT individual listing detail pages)
  const isSearchPage = Boolean(
    pathname &&
    // /stays (exact or with query string)
    (pathname === "/stays" ||
      // /experiences (exact or with query string)
      pathname === "/experiences" ||
      // /transport (exact or with query string)
      pathname === "/transport" ||
      // /[location]/stays  e.g. /lusaka/stays
      /^\/[^/]+\/stays$/.test(pathname) ||
      // /[location]/experiences
      /^\/[^/]+\/experiences$/.test(pathname) ||
      // /[location]/transport
      /^\/[^/]+\/transport$/.test(pathname)),
  );

  const [showCompactSearch, setShowCompactSearch] = useState(false);
  const [headerWhere, setHeaderWhere] = useState("");
  const [headerDates, setHeaderDates] = useState<DateRange>({ checkIn: null, checkOut: null });

  useEffect(() => {
    if (!isSearchPage) {
      setShowCompactSearch(false);
      return;
    }
    const handleScroll = () => {
      setShowCompactSearch(window.scrollY > 120);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isSearchPage, pathname]);

  const headerDateLabel = headerDates.checkIn
    ? `${headerDates.checkIn.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}${
        headerDates.checkOut
          ? `–${headerDates.checkOut.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`
          : ""
      }`
    : "";

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    const term = headerWhere.trim();
    if (term) params.set("q", term);
    else params.delete("q");

    if (headerDates.checkIn) {
      const datesStr = serializeDates(headerDates);
      if (datesStr) params.set("dates", datesStr);
    } else {
      params.delete("dates");
    }

    const targetPath = pathname === "/" ? "/stays" : pathname;
    router.push(`${targetPath}?${params.toString()}`);
  };

  return (
    <header
      className="sticky top-0 z-50 bg-white border-b border-neutral-100 shadow-xs"
      style={{ height: 64 }}
    >
      <div className="w-full h-full flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 no-underline outline-none focus-visible:outline-none shrink-0"
        >
          <span className="text-[22px] font-semibold text-black tracking-tight">Nearby</span>
          <span className="font-script text-purple font-normal text-[1.4em] leading-none">
            Escapes
          </span>
        </Link>

        {/* Compact Interactive Header Search Bar (Appears on scroll on stays/experiences/transport pages) */}
        {isSearchPage && showCompactSearch && (
          <form
            onSubmit={handleHeaderSearch}
            className="hidden md:flex items-center border border-neutral-300 rounded-full bg-white shadow-xs hover:shadow-md transition-all duration-200 pl-3.5 pr-1.5 py-1 gap-2.5 animate-in fade-in slide-in-from-top-2"
          >
            {/* Where input */}
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="h-3.5 w-3.5 text-purple shrink-0" />
              <input
                type="text"
                value={headerWhere}
                onChange={(e) => setHeaderWhere(e.target.value)}
                placeholder="Where to?"
                className="bg-transparent text-xs font-semibold text-neutral-800 placeholder:text-neutral-400 focus:outline-none w-24 lg:w-32 truncate"
              />
            </div>

            <span className="h-3.5 w-px bg-neutral-200 shrink-0" />

            {/* When date picker */}
            <div className="flex items-center gap-1.5 min-w-0">
              <DateRangePicker value={headerDates} onChange={setHeaderDates} variant="compact">
                <span
                  className={cn(
                    "text-xs font-semibold whitespace-nowrap cursor-pointer hover:text-purple transition-colors",
                    headerDateLabel ? "text-neutral-800 font-bold" : "text-neutral-400",
                  )}
                >
                  {headerDateLabel || "When?"}
                </span>
              </DateRangePicker>
            </div>

            {/* Search submit button */}
            <button
              type="submit"
              className="bg-purple text-white p-1.5 rounded-full hover:bg-purple-hover transition-colors shrink-0 flex items-center justify-center shadow-xs cursor-pointer"
              aria-label="Search"
              title="Search"
            >
              <Search className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
          </form>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Help Center Icon */}
          <Link
            href="/help"
            className="flex items-center justify-center text-neutral-700 hover:text-purple hover:bg-neutral-100 h-9 w-9 rounded-full transition-colors"
            title="Help & Support"
            aria-label="Help & Support"
          >
            <HelpCircle className="h-5 w-5" strokeWidth={1.8} />
          </Link>

          {/* Saved / Wishlist Popover (shows for all users including authenticated) */}
          {!isHydrating && <WishlistPopover />}

          {/* Notifications bell icon — authenticated users (desktop & mobile) */}
          {!isHydrating && isAuthenticated && (
            <Link
              href="/notifications"
              className="flex items-center justify-center text-purple cursor-pointer relative h-9 w-9 rounded-full hover:bg-purple/10 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" strokeWidth={1.8} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white shadow-2xs" />
              )}
            </Link>
          )}

          {/* Auth links / Loading skeleton (unauthenticated only) */}
          {isHydrating ? (
            <div className="hidden md:flex items-center gap-2 ml-1 border-l border-neutral-200 pl-3">
              <div className="w-16 h-8 rounded-full bg-neutral-100 animate-pulse" />
              <div className="w-20 h-8 rounded-full bg-neutral-100 animate-pulse" />
            </div>
          ) : (
            !isAuthenticated && (
              <div className="hidden md:flex items-center gap-2 ml-1 border-l border-neutral-200 pl-3">
                <Link
                  href={`/auth/login${authNext}`}
                  className="text-[13px] font-semibold text-neutral-800 hover:text-purple hover:bg-neutral-100 px-3.5 py-1.5 rounded-full transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href={`/auth/register${authNext}`}
                  className="text-[13px] font-bold text-neutral-900 bg-gold hover:bg-gold-hover px-4 py-1.5 rounded-full transition-colors shadow-xs"
                >
                  Sign up
                </Link>
              </div>
            )
          )}

          {/* Profile Dropdown / Nav Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="flex items-center md:gap-2 p-1.5 rounded-lg text-neutral-800 hover:text-purple hover:bg-neutral-100 transition-colors cursor-pointer outline-none focus-visible:outline-none"
                aria-label="Menu"
              >
                <Menu className="h-6 w-6 shrink-0" strokeWidth={2.2} />
                {!isHydrating &&
                  isAuthenticated &&
                  (user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name ?? ""}
                      className="hidden md:block h-7 w-7 rounded-full object-cover border border-purple/50"
                    />
                  ) : (
                    <div className="hidden md:flex h-7 w-7 rounded-full bg-gold items-center justify-center">
                      <User className="h-4 w-4 text-black" strokeWidth={2} />
                    </div>
                  ))}
              </button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[320px] sm:w-[375px] p-0 flex flex-col bg-white border-l border-neutral-200/80 shadow-2xl"
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

              {/* Sheet Top Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 pr-12">
                <Link href="/" className="flex items-center gap-1.5 group">
                  <span className="text-[20px] font-semibold text-black tracking-tight">
                    Nearby
                  </span>
                  <span className="font-script text-purple font-normal text-[1.3em] leading-none">
                    Escapes
                  </span>
                </Link>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
                {/* 1. Auth Card */}
                {!isHydrating && isAuthenticated ? (
                  <div className="flex items-center gap-3 bg-[#f8f5fc] border border-purple/15 rounded-2xl p-3.5">
                    <SheetClose asChild>
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 flex-1 min-w-0 group cursor-pointer"
                      >
                        <div className="h-10 w-10 rounded-full bg-gold/20 border border-purple/30 flex items-center justify-center overflow-hidden shrink-0 group-hover:ring-2 group-hover:ring-purple/40 transition-all">
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
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate text-neutral-900 group-hover:text-[#6b2bb8] transition-colors">
                            {user?.name ?? "My Account"}
                          </p>
                          {user?.email && (
                            <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                          )}
                        </div>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <button
                        onClick={logout}
                        className="text-xs font-semibold text-purple hover:text-purple-hover px-2.5 py-1.5 rounded-lg hover:bg-purple/10 transition-colors shrink-0 cursor-pointer"
                      >
                        Sign out
                      </button>
                    </SheetClose>
                  </div>
                ) : !isHydrating ? (
                  <div className="bg-[#f8f5fc] border border-purple/10 rounded-2xl p-4">
                    <p className="font-semibold text-sm text-neutral-900 mb-1">
                      Welcome to Nearby Escapes
                    </p>
                    <p className="text-xs text-neutral-500 mb-3">
                      Sign in to book stays, tours &amp; transfers across Zambia
                    </p>
                    <div className="flex gap-2">
                      <SheetClose asChild>
                        <Link
                          href={`/auth/login${authNext}`}
                          className="flex-1 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-900 rounded-xl py-2 text-center text-xs font-semibold transition-all shadow-2xs"
                        >
                          Log in
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href={`/auth/register${authNext}`}
                          className="flex-1 bg-gold hover:bg-gold-hover text-neutral-900 rounded-xl py-2 text-center text-xs font-semibold transition-all shadow-xs"
                        >
                          Sign up
                        </Link>
                      </SheetClose>
                    </div>
                  </div>
                ) : null}

                {/* 2. My Account (Authenticated Only) */}
                {isAuthenticated && (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-3 mb-1.5">
                      My Account
                    </p>
                    <div className="space-y-0.5">
                      <SheetClose asChild>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-[#6b2bb8] transition-colors duration-150"
                        >
                          <User className="h-4 w-4 text-neutral-400 shrink-0" />
                          Profile
                        </Link>
                      </SheetClose>

                      {user?.roles?.includes("host") && (
                        <SheetClose asChild>
                          <Link
                            href="/host/listings"
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-[#6b2bb8] transition-colors duration-150"
                          >
                            <Building2 className="h-4 w-4 text-neutral-400 shrink-0" />
                            My Listings
                          </Link>
                        </SheetClose>
                      )}

                      <SheetClose asChild>
                        <Link
                          href="/trips"
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-[#6b2bb8] transition-colors duration-150"
                        >
                          <CalendarDays className="h-4 w-4 text-neutral-400 shrink-0" />
                          Bookings &amp; Trips
                        </Link>
                      </SheetClose>

                      <SheetClose asChild>
                        <Link
                          href="/wishlist"
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-[#6b2bb8] transition-colors duration-150"
                        >
                          <Heart className="h-4 w-4 text-neutral-400 shrink-0" />
                          Wishlist
                        </Link>
                      </SheetClose>

                      <SheetClose asChild>
                        <Link
                          href="/notifications"
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-[#6b2bb8] transition-colors duration-150"
                        >
                          <Bell className="h-4 w-4 text-neutral-400 shrink-0" />
                          <span>Notifications</span>
                          {unreadCount > 0 && (
                            <span className="ml-auto h-2 w-2 rounded-full bg-[#6b2bb8]" />
                          )}
                        </Link>
                      </SheetClose>
                    </div>
                  </div>
                )}

                {/* 3. List Your Property Feature Card — ONLY for unauthenticated visitors, REMOVED for authenticated users */}
                {!isAuthenticated && (
                  <div className="pt-1">
                    <SheetClose asChild>
                      <Link
                        href="/become-host"
                        className="group flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-br from-[#f8f5fc] via-[#f3eafb]/60 to-[#f8f5fc] border border-[#6b2bb8]/20 hover:border-[#6b2bb8]/45 hover:shadow-xs transition-all duration-200"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-9 w-9 rounded-xl bg-[#6b2bb8] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                            <Building2 className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-[#1a1a1f] group-hover:text-[#6b2bb8] transition-colors leading-tight">
                              List Your Property
                            </p>
                            <p className="text-[11px] text-neutral-500 font-medium leading-tight mt-0.5">
                              Earn as a host with Nearby Escapes
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-[#6b2bb8] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </SheetClose>
                  </div>
                )}

                {/* 5. Support (Least Important / Bottom) */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-3 mb-1.5">
                    Support
                  </p>
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-neutral-700">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-4 w-4 text-neutral-400" />
                        <span>Currency</span>
                      </div>
                      <span className="text-xs font-bold bg-[#6b2bb8]/10 text-[#6b2bb8] px-2.5 py-0.5 rounded-full">
                        ZMW (K)
                      </span>
                    </div>

                    <SheetClose asChild>
                      <Link
                        href="/help"
                        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-black transition-colors"
                      >
                        <HelpCircle className="h-4 w-4 text-neutral-400" />
                        <span>Help Center</span>
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link
                        href="/help#contact"
                        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-black transition-colors"
                      >
                        <MessageSquare className="h-4 w-4 text-neutral-400" />
                        <span>Contact Support</span>
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link
                        href="/legal/privacy"
                        className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-black transition-colors"
                      >
                        <Shield className="h-4 w-4 text-neutral-400" />
                        <span>Privacy & Terms</span>
                      </Link>
                    </SheetClose>
                  </div>
                </div>
              </div>

              {/* Sheet Bottom Footer */}
              <div className="px-5 py-3.5 border-t border-neutral-100 bg-[#f8f5fc]/50 text-center">
                <p className="text-[11px] text-neutral-400 font-medium">
                  © {new Date().getFullYear()} Nearby Escapes · Zambia
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
