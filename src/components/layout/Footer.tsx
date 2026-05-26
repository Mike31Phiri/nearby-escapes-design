"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CreditCard,
  Youtube,
  Music2,
  ArrowRight,
} from "lucide-react";
import logo from "@/assets/logo.png";

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
  const [email, setEmail] = useState("");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  if (pathname?.startsWith("/auth")) {
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
    <footer className="mt-20 border-t border-transparent text-white">
      {/* ── Newsletter Pre-Footer ── */}
      <div
        className="border-b border-white/10"
        style={{ backgroundColor: "oklch(0.22 0.13 295)" }}
      >
        <div className="mx-auto max-w-7xl px-6 py-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-lg md:text-xl font-bold tracking-tight">
              Get travel inspiration & deals
            </h3>
            <p className="text-sm text-white/60 mt-1 max-w-md">
              Subscribe to receive curated travel guides, exclusive offers, and hidden gems straight
              to your inbox.
            </p>
          </div>
          <form
            onSubmit={handleNewsletterSubmit}
            className="flex w-full md:w-auto gap-2 shrink-0"
          >
            <div className="relative flex-1 md:min-w-[280px]">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full rounded-xl bg-white/10 border border-white/20 pl-10 pr-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-white/50 focus:bg-white/15 transition-all"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-white text-[oklch(0.22_0.13_295)] hover:bg-white/90 px-5 py-3 text-sm font-semibold transition-all active:scale-[0.97]"
            >
              Subscribe
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* ── Main Footer Columns ── */}
      <div style={{ backgroundColor: "oklch(0.22 0.13 295)" }}>
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
            {/* Brand column */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={logo.src}
                  alt="Nearby Escapes Travel Agency"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-xl object-contain bg-white"
                />
                <span className="font-bold text-lg">Nearby Escapes</span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed mb-6">
                Your trusted partner for accommodation, transport, and experiences across Zambia.
              </p>
              {/* Contact details */}
              <ul className="space-y-2.5 text-sm text-white/50 mb-6">
                <li className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 shrink-0 text-white/40" />
                  <span>Lusaka, Zambia</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-white/40" />
                  <span>+260 211 123 456</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-white/40" />
                  <span>info@nearbyescapes.com</span>
                </li>
              </ul>
              {/* Social links */}
              <div className="flex items-center gap-2.5">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  aria-label="Twitter"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  aria-label="Youtube"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Youtube className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  aria-label="TikTok"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Music2 className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Link columns */}
            {footerColumns.map((col) => (
              <div key={col.title} className="md:col-span-1">
                {/* Desktop: always visible */}
                <h4 className="hidden md:block text-sm font-semibold uppercase tracking-widest text-white/50 mb-4">
                  {col.title}
                </h4>

                {/* Mobile: accordion toggle */}
                <button
                  onClick={() => toggleSection(col.title)}
                  aria-expanded={openSections[col.title] || false}
                  aria-controls={`footer-section-${col.title.replace(/\s+/g, "-").toLowerCase()}`}
                  className="md:hidden flex w-full items-center justify-between py-3 text-sm font-semibold uppercase tracking-widest text-white/50 border-b border-white/10"
                >
                  {col.title}
                  {openSections[col.title] ? (
                    <ChevronUp className="h-4 w-4 text-white/40" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-white/40" />
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
                        className="block py-1.5 md:py-0 text-sm text-white/60 hover:text-white transition-colors"
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

      {/* ── Bottom Bar: Trust + Legal ── */}
      <div
        className="border-t border-white/10"
        style={{ backgroundColor: "oklch(0.19 0.12 295)" }}
      >
        <div className="mx-auto max-w-7xl px-6 py-6">
          {/* Payment methods & trust */}
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-4 mb-5">
            <div className="flex items-center gap-3 text-white/40">
              <span className="text-xs font-medium uppercase tracking-wider">We accept</span>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-10 items-center justify-center rounded bg-white/10 text-[10px] font-bold text-white/50">
                  VISA
                </span>
                <span className="flex h-7 w-10 items-center justify-center rounded bg-white/10 text-[10px] font-bold text-white/50">
                  MC
                </span>
                <span className="flex h-7 w-10 items-center justify-center rounded bg-white/10 text-[10px] font-bold text-white/50">
                  AMEX
                </span>
                <span className="flex h-7 w-10 items-center justify-center rounded bg-white/10 text-[10px] font-bold text-white/50">
                  PayPal
                </span>
                <CreditCard className="h-4 w-4 text-white/30" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/40">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs font-medium">SSL Secure • Verified Company</span>
            </div>
          </div>

          {/* Copyright & legal links */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40">
            <p>
              © {new Date().getFullYear()} Nearby Escapes. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/legal/privacy"
                className="hover:text-white/70 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/legal/terms"
                className="hover:text-white/70 transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/legal/cookies"
                className="hover:text-white/70 transition-colors"
              >
                Cookies
              </Link>
              <Link href="/help" className="hover:text-white/70 transition-colors">
                Help
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
