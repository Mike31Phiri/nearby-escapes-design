"use client";

import Link from "next/link";
import logo from "@/assets/logo.png";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-black text-lg">
          <img src={logo.src} alt="Nearby Escapes" width={36} height={36} className="h-9 w-9 rounded-xl object-contain bg-white" />
          Nearby Escapes
        </Link>
      </div>
    </header>
  );
}
