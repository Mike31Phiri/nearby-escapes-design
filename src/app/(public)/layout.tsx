"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide mobile bottom nav on listing detail pages and checkout pages
  const shouldHideBottomNav =
    pathname?.startsWith("/listings/") || pathname?.startsWith("/checkout");
  const isCheckout = pathname?.startsWith("/checkout");
  const shouldHideNavbar = pathname?.startsWith("/account");

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <div className={shouldHideBottomNav ? "" : "pb-16 lg:pb-0"}>{children}</div>
      {!shouldHideBottomNav && <MobileBottomNav />}

      {isCheckout ? (
        <div className="hidden md:block">
          <Footer />
        </div>
      ) : (
        <Footer />
      )}
    </>
  );
}
