"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Search,
  ChevronDown,
  Building2,
  CalendarDays,
  DollarSign,
  ShieldCheck,
  Users,
  MessageCircle,
  PhoneCall,
  Mail,
  Send,
  Sparkles,
  ArrowRight,
  FileText,
  Clock,
  CheckCircle2,
  Info,
} from "lucide-react";
import { HostPageHeader } from "@/components/layout/HostPageHeader";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { BACKDROP_CLASS, cn } from "@/lib/utils";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

type HostHelpCategory = "all" | "listings" | "calendar" | "bookings" | "payouts" | "safety";

interface CategoryTab {
  id: HostHelpCategory;
  label: string;
  icon: typeof HelpCircle;
}

const CATEGORIES: CategoryTab[] = [
  { id: "all", label: "All Topics", icon: HelpCircle },
  { id: "listings", label: "Listings & Setup", icon: Building2 },
  { id: "calendar", label: "Calendar & Pricing", icon: CalendarDays },
  { id: "bookings", label: "Bookings & Guests", icon: Users },
  { id: "payouts", label: "Payouts & Finances", icon: DollarSign },
  { id: "safety", label: "Policies & Safety", icon: ShieldCheck },
];

// ---------------------------------------------------------------------------
// Featured Guides
// ---------------------------------------------------------------------------

interface GuideCard {
  id: string;
  title: string;
  description: string;
  category: HostHelpCategory;
  readTime: string;
  icon: typeof HelpCircle;
  popular?: boolean;
}

const FEATURED_GUIDES: GuideCard[] = [
  {
    id: "guide-payouts",
    title: "How Host Payouts Work in Zambia",
    description:
      "Understand payout timelines, transfer methods to Zambian banks (Absa, Stanbic, Zanaco) and Airtel/MTN Mobile Money.",
    category: "payouts",
    readTime: "4 min read",
    icon: DollarSign,
    popular: true,
  },
  {
    id: "guide-pricing",
    title: "Setting Up Custom & Seasonal Pricing Rules",
    description:
      "Maximize occupancy by adjusting weekend rates, holiday premiums, and minimum night stay requirements.",
    category: "calendar",
    readTime: "3 min read",
    icon: CalendarDays,
    popular: true,
  },
  {
    id: "guide-checkin",
    title: "Managing Daily Check-ins & Departures",
    description:
      "Step-by-step guide to using your Today's Schedule queue, marking guest statuses, and key exchange protocols.",
    category: "bookings",
    readTime: "5 min read",
    icon: Users,
    popular: true,
  },
  {
    id: "guide-protection",
    title: "Host Protection Guarantee & Damage Claims",
    description:
      "How security deposit holds function, reporting damages within 48 hours, and required photo documentation.",
    category: "safety",
    readTime: "6 min read",
    icon: ShieldCheck,
  },
  {
    id: "guide-listing-quality",
    title: "Optimizing Your Listing for High Conversions",
    description:
      "Photo guidelines, writing compelling property descriptions, and highlighting amenities guests search for most.",
    category: "listings",
    readTime: "4 min read",
    icon: Building2,
  },
  {
    id: "guide-cancellations",
    title: "Choosing the Right Cancellation Policy",
    description:
      "Compare Flexible, Moderate, and Strict cancellation terms and how payouts are calculated upon guest cancellation.",
    category: "safety",
    readTime: "3 min read",
    icon: FileText,
  },
];

// ---------------------------------------------------------------------------
// Host FAQs
// ---------------------------------------------------------------------------

interface HostFAQ {
  id: string;
  question: string;
  answer: string;
  category: HostHelpCategory;
}

const HOST_FAQS: HostFAQ[] = [
  {
    id: "faq-1",
    question: "When and how do I receive my booking payouts?",
    answer:
      "Payouts are automatically released 24 hours after your guest successfully checks in. If you have connected a Zambian bank account (e.g. Absa, Stanbic, Zanaco, Standard Chartered), funds typically reflect within 1–2 business days. If you use Airtel Money or MTN Mobile Money, payouts are credited almost immediately after release.",
    category: "payouts",
  },
  {
    id: "faq-2",
    question: "What service fees does Nearby Escapes charge hosts?",
    answer:
      "Nearby Escapes charges a low 3% host service fee on the booking subtotal to cover platform infrastructure, 24/7 host customer support, and DPO payment gateway processing. The exact breakdown is always visible on your Finances Ledger and booking details page before you confirm.",
    category: "payouts",
  },
  {
    id: "faq-3",
    question: "How do I block dates or prevent bookings on certain days?",
    answer:
      "Navigate to your Calendar page from the navigation bar. You can click on any individual date or drag across a date range to mark them as 'Blocked'. Blocked dates are instantly removed from guest search results. You can also use the 'Block a Date' quick action directly from your Home screen.",
    category: "calendar",
  },
  {
    id: "faq-4",
    question: "Can I require guests to request approval before booking?",
    answer:
      "Yes. In your Listing Settings, you can switch between 'Instant Book' (recommended for maximum bookings) and 'Request to Book'. With Request to Book enabled, you have 24 hours to review the guest profile, trip details, and either approve or decline the reservation.",
    category: "bookings",
  },
  {
    id: "faq-5",
    question: "What happens if a guest cancels their reservation?",
    answer:
      "Guest cancellations are governed by the cancellation policy you select for each listing (Flexible, Moderate, or Strict). If the cancellation falls within the non-refundable window, your portion of the payout is credited to your Finances ledger according to the policy schedule.",
    category: "safety",
  },
  {
    id: "faq-6",
    question: "What should I do if a guest damages my property?",
    answer:
      "First, document all damages immediately with clear photographs and keep receipts or replacement estimates. Within 48 hours of guest check-out, navigate to the Booking Details page and click 'File Damage Claim'. Our host resolution team will review your submission and initiate reimbursement through the security deposit.",
    category: "safety",
  },
  {
    id: "faq-7",
    question: "How do I add multiple units or rooms for the same lodge?",
    answer:
      "Visit the Inventory page in your host portal. For multi-unit properties (such as chalets, suites, or multi-room safari camps), you can create individual unit labels under your main property listing, set specific unit numbers, and block or release individual units independently.",
    category: "listings",
  },
  {
    id: "faq-8",
    question: "How do I contact my guest prior to arrival?",
    answer:
      "Once a booking is confirmed, you can view the guest's contact number and email on your Today's Schedule or Bookings page. You can also send in-app messages to share check-in directions, gate access codes, and arrival instructions.",
    category: "bookings",
  },
  {
    id: "faq-9",
    question: "How do reviews work for hosts and guests?",
    answer:
      "Both hosts and guests have 14 days after check-out to submit a review. Reviews are published simultaneously once both parties submit their feedback or when the 14-day window expires. You can view and publicly respond to all reviews on your Reviews page.",
    category: "listings",
  },
  {
    id: "faq-10",
    question: "Are taxes and the Zambian tourism levy handled automatically?",
    answer:
      "VAT and statutory tourism levies should be factored into your base nightly rate or configured in your listing pricing settings. You can download monthly tax invoices and ledger summaries directly from your Finances page for local accounting and ZRA filing.",
    category: "payouts",
  },
];

// ---------------------------------------------------------------------------
// Host Help Center Component
// ---------------------------------------------------------------------------

export function HostHelpPage() {
  const [activeCategory, setActiveCategory] = useState<HostHelpCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  // Ticket form state
  const [ticketTopic, setTicketTopic] = useState("payout");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSubmitting, setTicketSubmitting] = useState(false);

  // Filter FAQs
  const filteredFaqs = useMemo(() => {
    return HOST_FAQS.filter((faq) => {
      const matchesCat = activeCategory === "all" || faq.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Filter Guides
  const filteredGuides = useMemo(() => {
    return FEATURED_GUIDES.filter((guide) => {
      const matchesCat = activeCategory === "all" || guide.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        guide.title.toLowerCase().includes(q) ||
        guide.description.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      toast.error("Please fill in both subject and message");
      return;
    }

    setTicketSubmitting(true);
    setTimeout(() => {
      setTicketSubmitting(false);
      setTicketModalOpen(false);
      setTicketSubject("");
      setTicketMessage("");
      toast.success("Support ticket submitted! A host specialist will respond within 2 hours.");
    }, 900);
  };

  return (
    <div className="min-h-screen bg-background pb-28 sm:pb-20 xl:pb-16 font-sans">
      <HostPageHeader
        title="Host Help Center"
        description="Everything you need to manage your properties, calendar, guest check-ins, and payouts."
        actions={
          <button
            onClick={() => setTicketModalOpen(true)}
            className="inline-flex items-center gap-1.5 border border-neutral-200 hover:border-purple/40 bg-white hover:bg-purple/5 text-neutral-700 hover:text-purple text-xs font-semibold px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <Send className="h-3.5 w-3.5 text-purple" />
            <span>Contact Host Support</span>
          </button>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-6 sm:py-8 space-y-8 sm:space-y-10">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search host guides, payout questions, or policies..."
            className="w-full h-12 pl-12 pr-4 rounded-2xl border border-neutral-200/90 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple/20 focus:border-purple transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600 px-1.5 py-0.5 rounded cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Tabs (Airbnb-style unconfined straight line) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide py-1">
          {CATEGORIES.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={cn(
                  "inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs sm:text-sm transition-colors cursor-pointer shrink-0 whitespace-nowrap",
                  isActive
                    ? "bg-purple/10 text-purple font-semibold"
                    : "text-black-subtle hover:text-black hover:bg-neutral-100/80 font-medium",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive ? "text-purple" : "text-black-muted",
                  )}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Featured Host Guides Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold text-black leading-snug">
              Recommended Host Guides
            </h2>
            <span className="text-xs text-black-muted">Curated for partners</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGuides.map((guide) => {
              const Icon = guide.icon;
              return (
                <div
                  key={guide.id}
                  className="bg-white border border-neutral-200/80 rounded-2xl p-5 flex flex-col justify-between transition-colors shadow-2xs hover:border-purple/30"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-9 h-9 rounded-xl bg-purple/10 text-purple border border-purple/20 flex items-center justify-center shrink-0">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      {guide.popular && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple bg-purple/10 px-2 py-0.5 rounded-full">
                          <Sparkles className="h-3 w-3" /> Popular
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-neutral-900 leading-snug">
                      {guide.title}
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed line-clamp-3">
                      {guide.description}
                    </p>
                  </div>
                  <div className="pt-4 mt-3 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {guide.readTime}
                    </span>
                    <button
                      onClick={() => {
                        const targetFaq = HOST_FAQS.find((f) => f.category === guide.category);
                        if (targetFaq) {
                          setExpandedFaqId(targetFaq.id);
                          const el = document.getElementById("host-faqs-section");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="text-xs font-semibold text-purple hover:text-purple-hover inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Read guide</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Host FAQs Accordion */}
        <section id="host-faqs-section" className="space-y-4 scroll-mt-24">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-black leading-snug">
                Frequently Asked Host Questions
              </h2>
              <p className="text-xs text-black-muted mt-0.5">
                Quick answers to standard hosting, payouts, and calendar management questions
              </p>
            </div>
          </div>

          <div className="bg-white border border-neutral-200/80 rounded-2xl divide-y divide-neutral-100 shadow-2xs overflow-hidden">
            {filteredFaqs.length === 0 ? (
              <div className="p-10 text-center">
                <Info className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-neutral-800">No matching articles found</p>
                <p className="text-xs text-neutral-500 mt-1">
                  Try adjusting your search keywords or reach out directly to host support.
                </p>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = expandedFaqId === faq.id;
                return (
                  <div key={faq.id} className="transition-colors">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-5 sm:px-6 py-4 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-neutral-50/50 transition-colors"
                    >
                      <span className="text-sm font-semibold text-neutral-900 leading-snug">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-neutral-400 shrink-0 transition-transform duration-200",
                          isOpen && "rotate-180 text-purple",
                        )}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-4 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-50 bg-neutral-50/30">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Dedicated Host Support Channels */}
        <section className="space-y-4">
          <h2 className="text-base sm:text-lg font-semibold text-black leading-snug">
            Need Direct Assistance?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Phone */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple/10 text-purple border border-purple/20 flex items-center justify-center shrink-0">
                  <PhoneCall className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900">Priority Host Hotline</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Available 24/7 for urgent check-in issues or on-site property emergencies.
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-neutral-100">
                <a
                  href="tel:+2602115554678"
                  className="text-xs font-semibold text-purple hover:text-purple-hover inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>+260 211 555 4678</span>
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple/10 text-purple border border-purple/20 flex items-center justify-center shrink-0">
                  <MessageCircle className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900">WhatsApp Host Desk</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Fast messaging with our Lusaka-based host partner operations team.
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-neutral-100">
                <a
                  href="https://wa.me/260971234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-purple hover:text-purple-hover inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Chat on WhatsApp</span>
                  <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Email / Ticket */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple/10 text-purple border border-purple/20 flex items-center justify-center shrink-0">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900">Host Partner Support</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  For ledger reconciliations, listing approvals, or policy inquiries.
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-neutral-100">
                <button
                  onClick={() => setTicketModalOpen(true)}
                  className="text-xs font-semibold text-purple hover:text-purple-hover inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Submit Support Ticket</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Support Ticket Dialog */}
      <Dialog open={ticketModalOpen} onOpenChange={setTicketModalOpen}>
        <DialogContent
          overlayClassName={BACKDROP_CLASS}
          className="w-[min(92vw,460px)] max-w-md p-0 overflow-hidden flex flex-col max-h-[85dvh] rounded-2xl border border-neutral-200/80 shadow-xl font-sans"
        >
          <DialogTitle className="sr-only">Submit Host Support Request</DialogTitle>

          {/* Modal Header */}
          <div className="bg-neutral-50/70 border-b border-neutral-200/80 px-5 pt-6 pb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple/10 text-purple border border-purple/20 flex items-center justify-center shrink-0">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-semibold text-neutral-900 leading-tight">
                  Contact Host Partner Support
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Our dedicated host relations desk responds within 2 hours.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmitTicket} className="p-5 space-y-4 overflow-y-auto flex-1">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">Topic</label>
              <select
                value={ticketTopic}
                onChange={(e) => setTicketTopic(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-white text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-purple/20 focus:border-purple"
              >
                <option value="payout">Payout or Bank Transfer Query</option>
                <option value="calendar">Calendar Sync / Date Blocking</option>
                <option value="guest">Guest Resolution or Policy Dispute</option>
                <option value="verification">Listing Verification / Photos</option>
                <option value="other">General Account Inquiry</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">Subject</label>
              <input
                type="text"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="Brief summary of your query"
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple/20 focus:border-purple"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">Detailed Message</label>
              <textarea
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                rows={4}
                placeholder="Include listing name, booking reference, or date details..."
                className="w-full p-3 rounded-xl border border-neutral-200 bg-white text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple/20 focus:border-purple resize-none"
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setTicketModalOpen(false)}
                className="h-9 px-4 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={ticketSubmitting}
                className="h-9 px-5 rounded-xl bg-purple text-white text-xs font-semibold hover:bg-purple-hover transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {ticketSubmitting ? "Submitting..." : "Send Request"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
