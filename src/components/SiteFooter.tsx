import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import logo from "@/assets/logo.png";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img
              src={logo}
              alt="Nearby Escapes Travel Agency"
              className="h-10 w-10 rounded-xl object-contain bg-white"
            />
            <span className="font-bold text-lg">Nearby Escapes</span>
          </div>
          <p className="text-sm text-background/70 leading-relaxed">
            Your trusted partner for accommodation and travel across Zambia.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-background/70">
            <li><Link href="/accommodations" className="hover:text-background">Accommodations</Link></li>
            <li><Link href="/bus-booking" className="hover:text-background">Bus Booking</Link></li>
            <li><Link href="/packages" className="hover:text-background">Packages</Link></li>
            <li><Link href="/gems" className="hover:text-background">Hidden Gems</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-background/70">
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Lusaka, Zambia</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +260 211 123 456</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> info@nearbyescapes.com</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Hours</h4>
          <ul className="space-y-2 text-sm text-background/70">
            <li>Mon–Fri: 8am – 6pm</li>
            <li>Saturday: 9am – 4pm</li>
            <li>Sunday: 10am – 2pm</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/10">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-background/60">
          <p>© {new Date().getFullYear()} Nearby Escapes. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/legal/privacy" className="hover:text-background">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-background">Terms</Link>
            <Link href="/legal/cookies" className="hover:text-background">Cookies</Link>
            <Link href="/help" className="hover:text-background">Help</Link>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="Facebook" className="hover:text-background"><Facebook className="h-4 w-4" /></a>
            <a href="#" aria-label="Instagram" className="hover:text-background"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="Twitter" className="hover:text-background"><Twitter className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
