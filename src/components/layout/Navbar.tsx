"use client";

import Link from "next/link";
import { Compass } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-black text-lg">
          <Compass className="h-5 w-5 text-primary" />
          Nearby Escapes
        </Link>
      </div>
    </header>
  );
}
