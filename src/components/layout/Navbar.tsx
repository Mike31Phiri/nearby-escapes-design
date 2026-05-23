"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User, Heart, LogIn, Search } from "lucide-react";
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

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();

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
            className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
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
                    {user?.name ?? "My Account"}
                    {user?.email && (
                      <p className="text-xs font-normal text-muted-foreground mt-0.5 truncate">
                        {user.email}
                      </p>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer rounded-xl font-medium">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" /> My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="cursor-pointer rounded-xl font-medium">
                      <Heart className="h-4 w-4 mr-2 text-muted-foreground" /> My Collections
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer rounded-xl text-destructive font-medium focus:text-destructive focus:bg-destructive/5"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel className="font-bold text-sm px-2 py-1.5 text-foreground">
                    Welcome
                    <p className="text-xs font-normal text-muted-foreground mt-0.5">
                      Sign in to access your account
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/auth/login" className="cursor-pointer rounded-xl font-semibold">
                      <LogIn className="h-4 w-4 mr-2 text-muted-foreground" /> Sign In
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/register" className="cursor-pointer rounded-xl font-medium">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" /> Create Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground px-2">
                    Are you a host?
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/host"
                      className="cursor-pointer rounded-xl font-medium text-primary"
                    >
                      List your property →
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
