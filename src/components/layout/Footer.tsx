"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/store/authStore";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
  ChevronDown,
  ChevronUp,
  Youtube,
  Music2,
  ArrowRight,
} from "lucide-react";

const footerColumns = [
  {
    title: "Explore",
    links: [
      { label: "Stays", href: "/stays" },
      { label: "Transport", href: "/transport" },
      { label: "Experiences", href: "/experiences" },
      { label: "Hidden Gems", href: "/gems" },
      { label: "Packages", href: "/packages" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Contact Us", href: "/help" },
      { label: "FAQs", href: "/help" },
      { label: "Safety Tips", href: "/help" },
      { label: "Booking Guide", href: "/help" },
    ],
  },
  {
    title: "For Partners",
    links: [
      { label: "List Your Property", href: "/become-host" },
      { label: "Affiliate Program", href: "/help" },
      { label: "Partner Dashboard", href: "/host" },
      { label: "Advertising", href: "/help" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Cookie Policy", href: "/legal/cookies" },
      { label: "Accessibility", href: "/help" },
    ],
  },
];

export function Footer() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  if (
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/account") ||
    pathname?.startsWith("/settings") ||
    pathname?.startsWith("/trips") ||
    pathname?.startsWith("/wishlist") ||
    pathname?.startsWith("/notifications") ||
    pathname?.startsWith("/become-host")
  ) {
    return null;
  }

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Newsletter signup logic would go here
    setEmail("");
    // Show success toast or message
  };

  return (
    <footer className="mt-0 border-t border-transparent text-black">
      {/* Newsletter Pre-Footer — only on homepage for unauthenticated users */}
      {!isAuthenticated && pathname === "/" && (
        <div className="border-t border-black/5 bg-white-soft">
          <div className="mx-auto max-w-7xl px-6 pt-10 pb-10 md:pt-10 md:pb-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-display text-xl md:text-xl font-bold tracking-tight text-black">
                Get travel inspiration &amp; deals
              </h3>
              <p className="text-base text-black-muted mt-1 max-w-md leading-relaxed">
                Subscribe to receive curated travel guides, exclusive offers, and hidden gems
                straight to your inbox.
              </p>
            </div>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex w-full md:w-auto items-center gap-2 shrink-0"
            >
              <div className="relative flex-1 md:min-w-[280px]">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-black-faint" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full h-[44px] md:h-12 rounded-full bg-white border border-transparent pl-11 pr-4 text-[14px] md:text-[15px] text-black placeholder:text-black-faint outline-none focus:border-purple focus:ring-2 focus:ring-purple-muted transition-all duration-200 shadow-md"
                />
              </div>
              <button
                type="submit"
                className="btn-cta rounded-full h-[36px] md:h-12 px-4 md:px-6 text-[13px] md:text-[14px] shadow-sm shrink-0"
              >
                <span>Subscribe</span>
                <ArrowRight className="h-4 w-4 hidden md:block" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Footer Columns */}
      <div className="bg-white-soft">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
            {/* Brand column */}
            <div className="md:col-span-1">
              {/* Text-based logo matching Navbar (no broken image refs) */}
              <Link href="/" className="flex items-center gap-1.5 mb-4 group">
                <span className="font-display font-extrabold text-[1.2rem] tracking-tight text-black">
                  Nearby
                </span>
                <span className="font-script font-bold text-[1.5rem] text-purple">Escapes</span>
              </Link>
              <p className="text-base text-black-muted leading-relaxed mb-6">
                Your trusted partner for accommodation, transport, and experiences across Zambia.
              </p>
              {/* Contact details */}
              <ul className="space-y-2.5 text-base text-black-faint mb-6">
                <li className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 shrink-0 text-purple/50" />
                  <span>Lusaka, Zambia</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-purple/50" />
                  <span>+260 211 123 456</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-purple/50" />
                  <span>info@nearbyescapes.com</span>
                </li>
              </ul>
              {/* Social links — gold hover state */}
              <div className="flex items-center gap-2.5">
                {(["Facebook", "Instagram", "Twitter", "Youtube", "TikTok"] as const).map(
                  (label, i) => {
                    const icons = [Facebook, Instagram, Twitter, Youtube, Music2];
                    const Icon = icons[i];
                    return (
                      <a
                        key={label}
                        href="#"
                        aria-label={label}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 hover:bg-gold-muted text-black-faint hover:text-purple transition-all duration-200"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  },
                )}
              </div>
            </div>

            {/* Link columns */}
            {footerColumns.map((col) => (
              <div key={col.title} className="md:col-span-1">
                {/* Desktop: always visible */}
                <h4 className="hidden md:block text-sm font-bold uppercase tracking-[0.2em] text-purple/60 mb-4">
                  {col.title}
                </h4>

                {/* Mobile: accordion toggle */}
                <button
                  onClick={() => toggleSection(col.title)}
                  aria-expanded={openSections[col.title] || false}
                  aria-controls={`footer-section-${col.title.replace(/\s+/g, "-").toLowerCase()}`}
                  className="md:hidden flex w-full items-center justify-between py-3 text-sm font-bold uppercase tracking-[0.2em] text-purple/60 border-b border-black/8"
                >
                  {col.title}
                  {openSections[col.title] ? (
                    <ChevronUp className="h-3.5 w-3.5 text-purple/40" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-purple/40" />
                  )}
                </button>

                {/* Links */}
                <ul
                  id={`footer-section-${col.title.replace(/\s+/g, "-").toLowerCase()}`}
                  className={`md:space-y-3 mt-3 md:mt-0 overflow-hidden transition-all duration-300 ${
                    openSections[col.title]
                      ? "max-h-96 opacity-100"
                      : "max-h-0 md:max-h-96 opacity-0 md:opacity-100"
                  }`}
                >
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="block py-1.5 md:py-0 text-base text-black-muted hover:text-purple transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar — dark purple brand strip */}
      <div className="border-t border-white/10 bg-purple-deep">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-sm text-white/80">
              © {new Date().getFullYear()} Nearby Escapes. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              {[
                { label: "Privacy", href: "/legal/privacy" },
                { label: "Terms", href: "/legal/terms" },
                { label: "Cookies", href: "/legal/cookies" },
                { label: "Help", href: "/help" },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-sm text-white/90 hover:text-gold transition-colors duration-200"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
