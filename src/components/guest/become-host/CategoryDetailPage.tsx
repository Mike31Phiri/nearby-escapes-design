"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bed,
  Ticket,
  Bus,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Percent,
} from "lucide-react";

// ── Category Data ─────────────────────────────────────────────────────

type CategoryId = "stays" | "experiences" | "transport";

interface CategoryData {
  name: string;
  label: string;
  plural: string;
  heroTitle: string;
  heroDesc: string;
  howItWorks: { title: string; desc: string }[];
  commission: string;
  commissionNote: string;
  requirements: string[];
  faqs: { q: string; a: string }[];
  onboardSearchParam: string;
}

const CATEGORY_DATA: Record<CategoryId, CategoryData> = {
  stays: {
    name: "Stays",
    label: "Stays / Accommodation",
    plural: "stays",
    heroTitle: "Turn your property into a destination",
    heroDesc:
      "From safari lodges to city guesthouses, list your accommodation and earn income every time a traveller books.",
    howItWorks: [
      {
        title: "Create your listing",
        desc: "Add photos, describe your space, set nightly rates, and define house rules. Our team can help optimise your listing for more bookings.",
      },
      {
        title: "Set availability",
        desc: "Use our calendar to block off dates, set minimum stays, and manage instant booking or require approval for each reservation.",
      },
      {
        title: "Receive guests",
        desc: "We handle payments, guest communication, and support. You focus on providing an unforgettable stay.",
      },
      {
        title: "Get paid",
        desc: "Earnings are transferred to your bank account within 48 hours of check-in. Track all your payouts from your host dashboard.",
      },
    ],
    commission: "15% per booking",
    commissionNote:
      "Commission is deducted from the booking total before payout. No listing fees, no subscription costs — you only pay when you earn.",
    requirements: [
      "Located in Zambia or within easy reach of major tourist routes",
      "Clean, safe, and well-maintained accommodation",
      "Clear photos and accurate description of your space",
      "Reliable communication with guests (we help with this)",
      "Compliance with local tourism regulations and tax obligations",
    ],
    faqs: [
      {
        q: "How do I set my nightly rate?",
        a: "You have full control over your pricing. Set your base rate, add seasonal pricing, and offer discounts for longer stays. We provide market insights to help you price competitively.",
      },
      {
        q: "Can I list multiple properties?",
        a: "Absolutely. You can manage all your listings from a single host account. Each property gets its own page, calendar, and booking settings.",
      },
      {
        q: "What if a guest cancels?",
        a: "We offer flexible cancellation policies that you choose. Your payout depends on when the guest cancels relative to check-in. You keep a portion or full amount based on your policy.",
      },
      {
        q: "Do I need insurance?",
        a: "We recommend having appropriate liability insurance for your property. We also provide host protection for eligible claims during a guest's stay.",
      },
    ],
    onboardSearchParam: "interestedTypes=stay",
  },
  experiences: {
    name: "Experiences",
    label: "Experiences / Activities",
    plural: "experiences",
    heroTitle: "Share what makes Zambia special",
    heroDesc:
      "Lead safaris, walking tours, cultural workshops, or adventure activities — earn doing what you love.",
    howItWorks: [
      {
        title: "Create your experience",
        desc: "Describe your activity, set group sizes, choose what's included, and upload photos that showcase the experience.",
      },
      {
        title: "Set schedule & pricing",
        desc: "Choose your availability, set price per person or per group, and define duration and meeting point details.",
      },
      {
        title: "Receive bookings",
        desc: "Guests book directly through our platform. We handle payments, send confirmations, and share guest details with you.",
      },
      {
        title: "Get paid",
        desc: "Payouts are processed within 48 hours of the experience taking place. Track everything from your host dashboard.",
      },
    ],
    commission: "15% per booking",
    commissionNote:
      "Commission is deducted from the total booking amount. No upfront fees, no monthly subscriptions — you earn when guests book.",
    requirements: [
      "Based in Zambia with knowledge of the local area or activity",
      "Valid operating licences or permits where applicable",
      "Safety measures and equipment in good condition",
      "Clear pricing, inclusions, and exclusions listed upfront",
      "Ability to accommodate guests in English (additional languages a plus)",
    ],
    faqs: [
      {
        q: "What kinds of experiences are popular?",
        a: "Safaris, walking tours, cooking classes, cultural village visits, photography tours, and adventure activities like kayaking or zip-lining consistently perform well.",
      },
      {
        q: "Can I set my own group sizes?",
        a: "Yes. You control the minimum and maximum group size for each experience. Private bookings can also be offered at a premium rate.",
      },
      {
        q: "What if I need to cancel?",
        a: "You can cancel or reschedule bookings through your dashboard. We recommend giving guests as much notice as possible. Your cancellation rate can affect your listing visibility.",
      },
      {
        q: "Do I need a guide licence?",
        a: "Licensing requirements vary by activity and location. We can advise on what permits or certifications you may need for your specific experience type.",
      },
    ],
    onboardSearchParam: "interestedTypes=experience",
  },
  transport: {
    name: "Transport",
    label: "Transport / Routes",
    plural: "transport",
    heroTitle: "Connect travellers across Zambia",
    heroDesc:
      "Offer shuttle services, intercity bus routes, or private transfers — earn by helping travellers get where they need to go.",
    howItWorks: [
      {
        title: "Create your route",
        desc: "Define pickup and drop-off locations, set your schedule, choose your vehicle type, and set pricing per seat or per trip.",
      },
      {
        title: "Set availability",
        desc: "Mark available departure times, set capacity limits, and manage recurring routes or one-off trips from your dashboard.",
      },
      {
        title: "Accept bookings",
        desc: "Travellers book seats directly. We handle payment collection, send e-tickets, and provide you with passenger manifests.",
      },
      {
        title: "Get paid",
        desc: "Receive payouts within 48 hours of departure. All transactions are tracked in your host dashboard for easy reconciliation.",
      },
    ],
    commission: "10% per booking",
    commissionNote:
      "Lower commission on transport to help you remain competitive. No listing fees, no monthly charges — you only pay when a seat is booked.",
    requirements: [
      "Registered transport operator in Zambia",
      "Valid road service permit or operating licence",
      "Vehicles in good condition with valid roadworthiness certificate",
      "Professional driver with appropriate licence class",
      "Clear safety protocols and insurance coverage for passengers",
    ],
    faqs: [
      {
        q: "Can I offer private transfers as well as shared routes?",
        a: "Yes. You can offer both shared seats on scheduled routes and private transfers. Each option can have its own pricing and booking rules.",
      },
      {
        q: "How do I set my route pricing?",
        a: "Set your price per seat for scheduled routes or a flat rate for private transfers. We provide market rate insights to help you stay competitive.",
      },
      {
        q: "What if a passenger doesn't show up?",
        a: "No-show passengers are still charged. You still receive the payout for their booked seat, and the empty seat is released 15 minutes after departure.",
      },
      {
        q: "Can I add multiple vehicles?",
        a: "Absolutely. Add as many vehicles as you operate, each with its own capacity, features, and route assignments.",
      },
    ],
    onboardSearchParam: "interestedTypes=transport",
  },
};

// ── Icon Map ──────────────────────────────────────────────────────────

const ICONS = {
  Bed,
  Ticket,
  Bus,
} as const;

// ── Component ─────────────────────────────────────────────────────────

export function CategoryDetailPage({
  category,
  heroImage,
}: {
  category: CategoryId;
  heroImage: string;
}) {
  const data = CATEGORY_DATA[category];
  const Icon = ICONS[category === "stays" ? "Bed" : category === "experiences" ? "Ticket" : "Bus"];

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      {/* Hero */}
      <section className="relative pt-16 pb-12 md:pt-24 md:pb-16 overflow-hidden bg-[#1f1433]">
        <div
          className="absolute inset-0 opacity-25 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1f1433]/90 via-[#1f1433]/80 to-[#1f1433]" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <Link
            href="/become-host"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/60 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to hosting options
          </Link>

          <div className="max-w-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37]/15 text-[#D4AF37] mb-5">
              <Icon className="h-6 w-6" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white leading-[1.1] mb-3">
              {data.heroTitle}
            </h1>
            <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-xl">
              {data.heroDesc}
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="font-script text-xl text-gold mb-1 text-center">Simple process</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1f1433] text-center mb-10">
              How hosting {data.name.toLowerCase()} works
            </h2>

            <div className="space-y-8">
              {data.howItWorks.map((step, idx) => (
                <div key={step.title} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1f1433] text-white text-sm font-black">
                      {idx + 1}
                    </div>
                    {idx < data.howItWorks.length - 1 && (
                      <div className="w-0.5 flex-1 bg-[#E0DBD0] mt-2" />
                    )}
                  </div>
                  <div className="pb-6">
                    <h3 className="text-lg font-bold text-[#1f1433] mb-1">{step.title}</h3>
                    <p className="text-sm text-[#64748B] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Commission */}
      <section className="py-12 bg-[#F9F7F2] border-t border-[#E0DBD0]">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <Percent className="h-5 w-5 text-[#D4AF37]" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#1f1433]">
                Commission & Fees
              </p>
            </div>
            <h2 className="font-display text-2xl font-bold text-[#1f1433] mb-3">
              {data.commission}
            </h2>
            <p className="text-sm text-[#64748B] leading-relaxed mb-6">{data.commissionNote}</p>

            <div className="rounded-xl border border-[#E0DBD0] bg-white p-5">
              <h3 className="text-sm font-bold text-[#1f1433] mb-3 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
                What&apos;s included
              </h3>
              <ul className="space-y-2">
                {[
                  "Listing page on Nearby Escapes with photos and description",
                  "24/7 guest support and communication handling",
                  "Secure payment processing and fraud protection",
                  "Marketing and promotion across our channels",
                  "Host dashboard with earnings, bookings, and analytics",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[#64748B]">
                    <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="font-script text-xl text-gold mb-1 text-center">Get ready</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1f1433] text-center mb-10">
              Requirements
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {data.requirements.map((req) => (
                <div
                  key={req}
                  className="flex items-start gap-3 rounded-xl border border-[#E0DBD0] bg-white p-4"
                >
                  <CheckCircle2 className="h-5 w-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <p className="text-sm text-[#64748B] leading-relaxed">{req}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 md:py-16 bg-[#F9F7F2] border-t border-[#E0DBD0]">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <p className="font-script text-xl text-gold mb-1 text-center">Questions?</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1f1433] text-center mb-10">
              Frequently asked questions
            </h2>

            <div className="space-y-3">
              {data.faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-xl border border-[#E0DBD0] bg-white overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-4 cursor-pointer list-none text-sm font-semibold text-[#334155] hover:text-[#1f1433] transition-colors">
                    {faq.q}
                    <ChevronRight className="h-4 w-4 text-[#64748B] transition-transform duration-200 group-open:rotate-90 shrink-0 ml-2" />
                  </summary>
                  <div className="px-4 pb-4">
                    <p className="text-sm text-[#64748B] leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Sparkles className="h-8 w-8 text-[#D4AF37] mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-[#1f1433] mb-3">
            Ready to host {data.name.toLowerCase()}?
          </h2>
          <p className="text-[#64748B] text-sm max-w-md mx-auto leading-relaxed mb-8">
            Set up your listing in minutes. Our team is here to help you every step of the way.
          </p>
          <Link
            href={`/become-host/onboard?${data.onboardSearchParam}`}
            className="inline-flex items-center gap-2 bg-[#1f1433] hover:bg-[#2A154A] text-white text-base font-bold px-10 py-3.5 rounded-xl transition-all duration-200"
          >
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

// ── Local ChevronRight ───────────────────────────────────────────────

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
