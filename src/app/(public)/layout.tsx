"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isCheckout = pathname?.startsWith("/checkout");
  const shouldHideNavbar = pathname?.startsWith("/account");

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <div>{children}</div>

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
