"use client";

import Link from "next/link";
import { Compass } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-black text-lg">
          <Compass className="h-5 w-5 text-primary" />
          Nearby Escapes
        </Link>
        <p className="text-xs text-muted-foreground uppercase tracking-widest">
          © {new Date().getFullYear()} Nearby Escapes. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
