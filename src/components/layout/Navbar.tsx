"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  User,
  Heart,
  Compass,
  LogOut,
  CalendarDays,
  Bell,
  HelpCircle,
  DollarSign,
  Shield,
  Search,
  MapPin,
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

  // Show compact header search only on search results pages (NOT individual listing detail pages)
  const isSearchPage = Boolean(
    pathname &&
      (
        // /stays (exact or with query string)
        pathname === "/stays" ||
        // /experiences (exact or with query string)
        pathname === "/experiences" ||
        // /transport (exact or with query string)
        pathname === "/transport" ||
        // /[location]/stays  e.g. /lusaka/stays
        /^\/[^/]+\/stays$/.test(pathname) ||
        // /[location]/experiences
        /^\/[^/]+\/experiences$/.test(pathname) ||
        // /[location]/transport
        /^\/[^/]+\/transport$/.test(pathname)
      )
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
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-100 shadow-xs" style={{ height: 64 }}>
      <div
        className="mx-auto h-full flex items-center justify-between px-4 md:px-6"
        style={{ maxWidth: 1200 }}
      >
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
                    headerDateLabel ? "text-neutral-800 font-bold" : "text-neutral-400"
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

          {/* Saved / Wishlist Popover */}
          <WishlistPopover />

          {/* Auth links / Loading skeleton */}
          {isHydrating ? (
            <div className="hidden md:flex items-center gap-2 ml-1 border-l border-neutral-200 pl-3">
              <div className="w-16 h-8 rounded-full bg-neutral-100 animate-pulse" />
              <div className="w-20 h-8 rounded-full bg-neutral-100 animate-pulse" />
            </div>
          ) : (
            !isAuthenticated && (
              <div className="hidden md:flex items-center gap-2 ml-1 border-l border-neutral-200 pl-3">
                <Link
                  href="/auth/login"
                  className="text-[13px] font-semibold text-neutral-800 hover:text-purple hover:bg-neutral-100 px-3.5 py-1.5 rounded-full transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  className="text-[13px] font-bold text-neutral-900 bg-gold hover:bg-gold-hover px-4 py-1.5 rounded-full transition-colors shadow-xs"
                >
                  Sign up
                </Link>
              </div>
            )
          )}

          {/* Notification icon — mobile & tablet authenticated */}
          {!isHydrating && isAuthenticated && (
            <Link
              href="/notifications"
              className="lg:hidden flex items-center justify-center text-purple cursor-pointer relative h-8 w-8 rounded-full border border-purple/20 hover:bg-neutral-100 transition-colors"
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
                className="flex items-center gap-2 p-1.5 rounded-lg text-neutral-800 hover:text-purple hover:bg-neutral-100 transition-colors cursor-pointer outline-none focus-visible:outline-none"
                aria-label="Menu"
              >
                <Menu className="h-6 w-6 shrink-0" strokeWidth={2.2} />
                {!isHydrating && isAuthenticated && (
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
                )}
              </button>
            </SheetTrigger>

                <SheetContent
                  side="right"
                  className="w-[300px] sm:w-[350px] p-0 flex flex-col bg-white border-l border-gold-muted"
                >
                  <SheetTitle className="sr-only">Account Menu</SheetTitle>
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
                    {/* Auth links at the top */}
                    {isAuthenticated ? (
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gold/20 border border-purple/30 flex items-center justify-center overflow-hidden shrink-0">
                          {user?.avatar ? (
                            <img src={user.avatar} alt={user.name ?? ""} className="h-full w-full object-cover" />
                          ) : (
                            <User className="h-5 w-5 text-purple" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate text-black">{user?.name ?? "My Account"}</p>
                          {user?.email && <p className="text-xs text-black-faint truncate">{user.email}</p>}
                        </div>
                        <SheetClose asChild>
                          <button onClick={logout} className="text-xs font-bold text-purple hover:text-purple-hover transition-colors">
                            Sign out
                          </button>
                        </SheetClose>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <SheetClose asChild>
                          <Link href="/auth/login" className="flex-1 bg-black/5 hover:bg-black/10 text-black rounded-xl py-2.5 text-center text-[13px] font-bold transition-all">
                            Log in
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link href="/auth/register" className="flex-1 bg-gold hover:bg-gold-hover text-black rounded-xl py-2.5 text-center text-[13px] font-bold transition-all shadow-md">
                            Sign up
                          </Link>
                        </SheetClose>
                      </div>
                    )}

                    <div className="h-px bg-neutral-100" />

                    {/* Quick Links (both auth and unauth) */}
                    <div className="flex flex-col gap-1">
                      <SheetClose asChild>
                        <Link
                          href="/trips"
                          className="flex items-center gap-3 rounded-full px-3 py-2 text-base font-medium hover:bg-black/10 text-black transition-all duration-200"
                        >
                          <CalendarDays className="h-4 w-4 text-black-faint" /> Bookings
                        </Link>
                      </SheetClose>
                      <div className="flex items-center gap-3 rounded-full px-3 py-2 text-base font-medium text-black">
                        <DollarSign className="h-4 w-4 text-black-faint" /> Currency
                        <span className="ml-auto text-xs font-bold bg-gold/10 text-gold px-2 py-0.5 rounded-full">ZMW</span>
                      </div>
                      <SheetClose asChild>
                        <Link
                          href="/notifications"
                          className="flex items-center gap-3 rounded-full px-3 py-2 text-base font-medium hover:bg-black/10 text-black transition-all duration-200"
                        >
                          <Bell className="h-4 w-4 text-black-faint" /> Notifications
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/help"
                          className="flex items-center gap-3 rounded-full px-3 py-2 text-base font-medium hover:bg-black/10 text-black transition-all duration-200"
                        >
                          <HelpCircle className="h-4 w-4 text-black-faint" /> Help
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/legal/privacy"
                          className="flex items-center gap-3 rounded-full px-3 py-2 text-base font-medium hover:bg-black/10 text-black transition-all duration-200"
                        >
                          <Shield className="h-4 w-4 text-black-faint" /> Privacy Policy
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/help#contact"
                          className="flex items-center gap-3 rounded-full px-3 py-2 text-base font-medium hover:bg-black/10 text-black transition-all duration-200"
                        >
                          <MessageSquare className="h-4 w-4 text-black-faint" /> Contact Support
                        </Link>
                      </SheetClose>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
        </div>
      </div>
    </header>
  );
}