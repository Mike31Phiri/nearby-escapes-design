"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import logo from "@/assets/logo.png";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/auth")) {
    return null;
  }
  return (
    <footer
      className="mt-20 border-t border-transparent text-white"
      style={{ backgroundColor: "oklch(0.22 0.13 295)" }}
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img
              src={logo.src}
              alt="Nearby Escapes Travel Agency"
              width={40}
              height={40}
              className="h-10 w-10 rounded-xl object-contain bg-white"
            />
            <span className="font-bold text-lg">Nearby Escapes</span>
          </div>
          <p className="text-sm text-white/70 leading-relaxed">
            Your trusted partner for accommodation and travel across Zambia.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <Link href="/accommodations" className="hover:text-white transition-colors">
                Accommodations
              </Link>
            </li>
            <li>
              <Link href="/bus-booking" className="hover:text-white transition-colors">
                Bus Booking
              </Link>
            </li>
            <li>
              <Link href="/packages" className="hover:text-white transition-colors">
                Packages
              </Link>
            </li>
            <li>
              <Link href="/gems" className="hover:text-white transition-colors">
                Hidden Gems
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Lusaka, Zambia
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> +260 211 123 456
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> info@nearbyescapes.com
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Hours</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>Mon–Fri: 8am – 6pm</li>
            <li>Saturday: 9am – 4pm</li>
            <li>Sunday: 10am – 2pm</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>© {new Date().getFullYear()} Nearby Escapes. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/legal/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/legal/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/legal/cookies" className="hover:text-white transition-colors">
              Cookies
            </Link>
            <Link href="/help" className="hover:text-white transition-colors">
              Help
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="Facebook" className="hover:text-white transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-white transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-white transition-colors">
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
