"use client";

import Link from "next/link";
import { Menu, User, Heart, LogIn, Compass, ShieldCheck, Building2, Clock, Hotel, Search, HelpCircle, MessageSquare, LogOut, CalendarDays, TrainFront, Ticket, Gem, Tag } from "lucide-react";
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
export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const isAdmin = user?.role === "admin";

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
                    <Link href="/search" className="cursor-pointer rounded-xl font-medium">
                      <Search className="h-4 w-4 mr-2.5 text-muted-foreground" /> Search
                    </Link>
                  </DropdownMenuItem>
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
                    <Link href="/search" className="cursor-pointer rounded-xl font-medium">
                      <Search className="h-4 w-4 mr-2.5 text-muted-foreground" /> Search
                    </Link>
                  </DropdownMenuItem>
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
