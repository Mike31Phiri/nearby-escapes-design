"use client";

import Link from "next/link";
import {
  ShieldCheck,
  BadgeCheck,
  Users,
  MessageSquare,
  AlertTriangle,
  ChevronLeft,
  Lock,
  Search,
  Star,
  Heart,
  Phone,
  Mail,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const trustPillars = [
  {
    icon: BadgeCheck,
    title: "Verified hosts & listings",
    desc: "Every host undergoes identity verification before their first listing goes live. We review property details, photos, and accuracy to ensure what you see is what you get.",
    items: [
      "Government ID or passport verification",
      "In-person or video call confirmation for new hosts",
      "Regular listing quality reviews",
      "Misrepresentation penalties for hosts",
    ],
  },
  {
    icon: Lock,
    title: "Secure payments",
    desc: "All transactions are processed through DPO PayPage, a PCI-compliant payment gateway. Your payment details are encrypted and never shared with hosts.",
    items: [
      "256-bit SSL encryption on all transactions",
      "Payment held securely until 24h after check-in",
      "Mobile Money and card payments accepted",
      "Clear fee breakdown before you confirm",
    ],
  },
  {
    icon: Users,
    title: "Guest protections",
    desc: "We stand behind every booking. If something goes wrong, we'll help make it right — from rebooking assistance to refunds when things can't be resolved.",
    items: [
      "Booking Guarantee — full refund if listing is cancelled by host",
      "24/7 support for urgent issues during your stay",
      "Dispute resolution process for fair outcomes",
      "Secure messaging to keep all communication on record",
    ],
  },
  {
    icon: Heart,
    title: "Host protections",
    desc: "Hosts are covered too. Our platform provides tools and safeguards to ensure a secure hosting experience.",
    items: [
      "Damage claim process for property incidents",
      "Identity verification of all guests",
      "Secure payment release after check-in",
      "Host guarantee programme for eligible listings",
    ],
  },
];

const guidelines = [
  {
    icon: Star,
    title: "Respectful behaviour",
    desc: "Treat others as you'd like to be treated. Harassment, discrimination, or disruptive behaviour is not tolerated.",
  },
  {
    icon: MessageSquare,
    title: "Honest communication",
    desc: "Be truthful in listings, reviews, and messages. Misrepresentation undermines trust in our community.",
  },
  {
    icon: Search,
    title: "Accuracy matters",
    desc: "Hosts must keep listings accurate and up to date. Guests should provide correct information about their group and plans.",
  },
  {
    icon: ShieldCheck,
    title: "Safety first",
    desc: "Follow safety guidelines provided by hosts. Report any safety concerns immediately through our platform.",
  },
];

const safetyTips = [
  {
    title: "Communicate on-platform",
    desc: "Keep all messages within Nearby Escapes. This ensures we can support you if issues arise.",
  },
  {
    title: "Review listings carefully",
    desc: "Read descriptions, amenities, cancellation policies, and recent reviews before booking.",
  },
  {
    title: "Know what's included",
    desc: "Check what's included in your booking — meals, transport, guides, entrance fees — so there are no surprises.",
  },
  {
    title: "Save emergency contacts",
    desc: "Save your host's contact details and our support number before you travel.",
  },
];

export function SafetyTrustPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F2]">
      {/*  Hero  */}
      <section className="relative overflow-hidden bg-[#1A0B2E] pt-16 pb-20 md:pt-20 md:pb-24">
        <div className="absolute inset-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A0B2E]/90 to-[#1A0B2E]" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-white/50 hover:text-white/80 transition-colors mb-8"
          >
            <ChevronLeft className="h-4 w-4" />
            Home
          </Link>
          <div className="max-w-3xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.12em] mb-3">
              Trust & safety
            </p>
            <h1 className="font-display text-3xl md:text-4xl lg:text-[3.25rem] font-black text-white leading-[1.1] mb-4">
              Your safety is our{" "}
              <span className="font-script text-[1.2em] font-normal text-[#D4AF37] lowercase">
                promise
              </span>
            </h1>
            <p className="text-white/60 text-[15px] leading-relaxed max-w-xl">
              We work hard to keep Nearby Escapes secure for everyone — guests and hosts alike. From
              verified profiles to secure payments, trust is built into everything we do.
            </p>
          </div>
        </div>
      </section>

      {/*  Trust Pillars  */}
      <main className="flex-1 mx-auto max-w-7xl px-4 md:px-8 py-14 md:py-16">
        <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.12em] mb-3 text-center">
          How we keep you safe
        </p>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-[#334155] text-center mb-10 md:mb-12">
          Our trust framework
        </h2>

        <div className="space-y-8">
          {trustPillars.map(({ icon: Icon, title, desc, items }) => (
            <div
              key={title}
              className="bg-white border border-[#E0DBD0] rounded-2xl p-6 md:p-8 shadow-sm"
            >
              <div className="flex items-start gap-4 md:gap-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1A0B2E]/5 text-[#1A0B2E]">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-[#334155] mb-1">{title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed mb-4">{desc}</p>
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                    {items.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm text-[#64748B]">
                        <CheckCircle2 className="h-4 w-4 text-[#D4AF37] mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/*  Community Guidelines  */}
        <section className="mt-14 md:mt-16">
          <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.12em] mb-3 text-center">
            Together we thrive
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-[#334155] text-center mb-3">
            Community guidelines
          </h2>
          <p className="text-sm text-[#64748B] text-center max-w-lg mx-auto mb-8">
            A few simple principles that help keep Nearby Escapes welcoming, safe, and fair for
            everyone.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {guidelines.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white border border-[#E0DBD0] rounded-2xl p-5 text-center"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A0B2E]/5 text-[#1A0B2E] mx-auto mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-[#334155] mb-1">{title}</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/*  Safety Tips  */}
        <section className="mt-14 md:mt-16">
          <div className="bg-white border border-[#E0DBD0] rounded-2xl p-6 md:p-8 shadow-sm">
            <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.12em] mb-3">
              For travellers
            </p>
            <h2 className="font-display text-xl md:text-2xl font-bold text-[#334155] mb-1">
              Stay safe while travelling
            </h2>
            <p className="text-sm text-[#64748B] mb-6 max-w-lg">
              A few practical tips to help you have a smooth and safe experience.
            </p>
            <div className="grid sm:grid-cols-2 gap-5">
              {safetyTips.map(({ title, desc }) => (
                <div key={title} className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-black">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#334155]">{title}</h3>
                    <p className="text-xs text-[#64748B] mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/*  Report an Issue  */}
        <section className="mt-14 md:mt-16 bg-gradient-to-br from-[#1A0B2E] to-[#1A0B2D] rounded-2xl p-8 md:p-10 text-center">
          <AlertTriangle className="h-8 w-8 text-[#D4AF37] mx-auto mb-4" />
          <h2 className="font-display text-xl md:text-2xl font-bold text-white mb-2">
            Report a concern
          </h2>
          <p className="text-[#9B95A8] text-sm max-w-md mx-auto mb-6">
            If you encounter an issue that needs our attention — whether it&apos;s a safety concern,
            a dispute, or a policy violation — our team is ready to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/help"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-[#D4AF37] text-[#334155] font-bold text-sm hover:bg-[#B48E3E] transition-colors"
            >
              <MessageSquare className="h-4 w-4" /> Contact support
            </Link>
            <a
              href="mailto:safety@nearbyescapes.com"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-xl border border-white/20 text-white font-bold text-sm hover:bg-white/5 transition-colors"
            >
              <Mail className="h-4 w-4" /> Email safety team
            </a>
          </div>
        </section>

        {/*  Contact Strip  */}
        <div className="mt-10 rounded-2xl border border-[#E0DBD0] bg-white p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-3 text-[#64748B]">
              <Phone className="h-4 w-4 text-[#D4AF37]" />
              <span>
                Emergency support:{" "}
                <a
                  href="tel:+260970000000"
                  className="text-[#334155] font-semibold hover:underline"
                >
                  +260 97 000 0000
                </a>
              </span>
            </div>
            <div className="flex items-center gap-3 text-[#64748B]">
              <Mail className="h-4 w-4 text-[#D4AF37]" />
              <span>
                General inquiries:{" "}
                <a
                  href="mailto:support@nearbyescapes.com"
                  className="text-[#334155] font-semibold hover:underline"
                >
                  support@nearbyescapes.com
                </a>
              </span>
            </div>
            <Link
              href="/legal/privacy"
              className="text-sm font-semibold text-[#334155] hover:text-[#1A0B2E] transition-colors flex items-center gap-1"
            >
              Privacy Policy <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
