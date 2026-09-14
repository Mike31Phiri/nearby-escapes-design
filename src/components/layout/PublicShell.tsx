"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isCheckout = pathname?.startsWith("/checkout");
  const isBecomeHost = pathname?.startsWith("/become-host");
  const shouldHideNavbar = pathname?.startsWith("/account") || isBecomeHost;
  const shouldHideFooter = false;

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <div>{children}</div>

      {!shouldHideFooter &&
        (isCheckout ? (
          <div className="hidden md:block">
            <Footer />
          </div>
        ) : (
          <Footer />
        ))}
    </>
  );
}
