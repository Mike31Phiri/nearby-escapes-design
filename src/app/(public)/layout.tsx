"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isCheckout = pathname?.startsWith("/checkout");
  const isProfile = pathname?.startsWith("/profile");
  const shouldHideNavbar = pathname?.startsWith("/account") || isProfile;
  const shouldHideFooter = isProfile;

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
