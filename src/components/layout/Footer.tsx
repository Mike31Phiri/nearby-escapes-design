"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
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
      { label: "Stays", href: "/search?category=stays" },
      { label: "Transport", href: "/search?category=transport" },
      { label: "Experiences", href: "/search?category=attractions" },
      { label: "Hidden Gems", href: "/search?category=gems" },
      { label: "Packages", href: "/search?category=packages" },
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
    pathname?.startsWith("/profile") ||
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
    <footer className="mt-0 border-t border-transparent text-white">
      {/* ── Newsletter Pre-Footer — only on homepage for unauthenticated users ── */}
      {!isAuthenticated && pathname === "/" && (
        <div className="border-b border-white/5" style={{ backgroundColor: "#2A1B3D" }}>
          <div className="mx-auto max-w-7xl px-6 py-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-display text-lg md:text-xl font-bold tracking-tight text-white">
                Get travel inspiration &amp; deals
              </h3>
              <p className="text-sm text-white/50 mt-1 max-w-md leading-relaxed">
                Subscribe to receive curated travel guides, exclusive offers, and hidden gems
                straight to your inbox.
              </p>
            </div>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex w-full md:w-auto gap-2 shrink-0"
            >
              <div className="relative flex-1 md:min-w-[280px]">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C5A059]/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-full bg-white/8 border border-white/15 pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-[#C5A059]/40 focus:bg-white/12 transition-all duration-200"
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-full bg-[#C5A059] text-[#111111] hover:bg-[#C5A059]/90 px-6 py-3 text-sm font-bold transition-all duration-200 active:scale-[0.97] shadow-sm"
              >
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Main Footer Columns ── */}
      <div style={{ backgroundColor: "#2A1B3D" }}>
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
            {/* Brand column */}
            <div className="md:col-span-1">
              {/* Text-based logo matching Navbar (no broken image refs) */}
              <Link href="/" className="flex items-center gap-1.5 mb-4 group">
                <span className="font-display font-extrabold text-[1.2rem] tracking-tight text-white group-hover:text-[#C5A059] transition-colors duration-200">
                  Nearby
                </span>
                <span className="font-script font-bold text-[1.5rem] text-[#C5A059] -mt-1 group-hover:text-white transition-colors duration-200">
                  Escapes
                </span>
              </Link>
              <p className="text-sm text-white/50 leading-relaxed mb-6">
                Your trusted partner for accommodation, transport, and experiences across Zambia.
              </p>
              {/* Contact details */}
              <ul className="space-y-2.5 text-sm text-white/40 mb-6">
                <li className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 shrink-0 text-[#C5A059]/50" />
                  <span>Lusaka, Zambia</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-[#C5A059]/50" />
                  <span>+260 211 123 456</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-[#C5A059]/50" />
                  <span>info@nearbyescapes.com</span>
                </li>
              </ul>
              {/* Social links — gold hover state */}
              <div className="flex items-center gap-2.5">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 hover:bg-[#C5A059]/20 text-white/50 hover:text-[#C5A059] transition-all duration-200"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 hover:bg-[#C5A059]/20 text-white/50 hover:text-[#C5A059] transition-all duration-200"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  aria-label="Twitter"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 hover:bg-[#C5A059]/20 text-white/50 hover:text-[#C5A059] transition-all duration-200"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  aria-label="Youtube"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 hover:bg-[#C5A059]/20 text-white/50 hover:text-[#C5A059] transition-all duration-200"
                >
                  <Youtube className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  aria-label="TikTok"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 hover:bg-[#C5A059]/20 text-white/50 hover:text-[#C5A059] transition-all duration-200"
                >
                  <Music2 className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Link columns */}
            {footerColumns.map((col) => (
              <div key={col.title} className="md:col-span-1">
                {/* Desktop: always visible */}
                <h4 className="hidden md:block text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059]/60 mb-4">
                  {col.title}
                </h4>

                {/* Mobile: accordion toggle */}
                <button
                  onClick={() => toggleSection(col.title)}
                  aria-expanded={openSections[col.title] || false}
                  aria-controls={`footer-section-${col.title.replace(/\s+/g, "-").toLowerCase()}`}
                  className="md:hidden flex w-full items-center justify-between py-3 text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059]/60 border-b border-white/8"
                >
                  {col.title}
                  {openSections[col.title] ? (
                    <ChevronUp className="h-3.5 w-3.5 text-[#C5A059]/40" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-[#C5A059]/40" />
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
                        className="block py-1.5 md:py-0 text-sm text-white/50 hover:text-[#C5A059] transition-colors duration-200"
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

      {/* ── Bottom Bar: Minimal — just copyright + legal links ── */}
      <div className="border-t border-white/8" style={{ backgroundColor: "#120A20" }}>
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} Nearby Escapes. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              <Link
                href="/legal/privacy"
                className="text-xs text-white/40 hover:text-[#C5A059] transition-colors duration-200"
              >
                Privacy
              </Link>
              <Link
                href="/legal/terms"
                className="text-xs text-white/40 hover:text-[#C5A059] transition-colors duration-200"
              >
                Terms
              </Link>
              <Link
                href="/legal/cookies"
                className="text-xs text-white/40 hover:text-[#C5A059] transition-colors duration-200"
              >
                Cookies
              </Link>
              <Link
                href="/help"
                className="text-xs text-white/40 hover:text-[#C5A059] transition-colors duration-200"
              >
                Help
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
