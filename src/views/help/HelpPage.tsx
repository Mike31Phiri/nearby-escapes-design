"use client";

import { useState } from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown, Search, MessageSquare, Mail, BookOpen, Shield, CreditCard, User, Building2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How do I make a booking?",
    answer: "Browse listings, select your preferred dates and guests, then proceed to checkout. You'll receive a confirmation email once your booking is confirmed by the host.",
    category: "bookings",
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept all major credit/debit cards and mobile money payments (Airtel Money, MTN Mobile Money). All transactions are securely processed through our payment gateway.",
    category: "payments",
  },
  {
    question: "Can I cancel a booking?",
    answer: "Yes, you can cancel from your Trips page. Refunds depend on the host's cancellation policy, which is clearly displayed before you book.",
    category: "bookings",
  },
  {
    question: "How do I become a host?",
    answer: "Click 'Become a Host' in your account menu, fill in your details, and create your first listing. Our onboarding wizard will guide you through the process.",
    category: "hosts",
  },
  {
    question: "How do I contact my host?",
    answer: "After booking, you can message the host directly through the platform. Look for the contact options in your booking details or the listing page.",
    category: "bookings",
  },
  {
    question: "Is my personal information safe?",
    answer: "Absolutely. We use industry-standard encryption and security practices to protect your data. We never share your information with third parties without your consent.",
    category: "account",
  },
  {
    question: "How do I leave a review?",
    answer: "After your stay or experience is completed, you'll find a 'Review' button on your Trips page. You can rate and review your experience there.",
    category: "bookings",
  },
  {
    question: "Can I modify a booking after confirmation?",
    answer: "Modifications depend on the host's policy. We recommend contacting the host directly through the platform to discuss any changes to your booking.",
    category: "bookings",
  },
  {
    question: "How do I reset my password?",
    answer: "On the login page, click 'Forgot Password' and follow the instructions sent to your email. You'll be able to set a new password securely.",
    category: "account",
  },
  {
    question: "What fees does Nearby Escapes charge?",
    answer: "We charge a small service fee on each booking, which is clearly displayed before you confirm. This fee covers platform maintenance, support, and payment processing.",
    category: "payments",
  },
];

const categories = [
  { id: "all", label: "All", icon: HelpCircle },
  { id: "bookings", label: "Bookings", icon: BookOpen },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "account", label: "Account", icon: User },
  { id: "hosts", label: "Hosting", icon: Building2 },
];

export function HelpPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const filtered = faqs.filter((faq) => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch = searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <div className="relative bg-gradient-to-b from-primary/5 via-primary/[0.02] to-transparent pb-12">
          <div className="mx-auto max-w-3xl px-4 md:px-6 pt-8 md:pt-12 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
              Help Center
            </h1>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-8">
              Find answers to common questions or get in touch with our support team
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help..."
                className="h-12 pl-11 rounded-2xl border-border/60 shadow-sm text-sm"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-3xl px-4 md:px-6 -mt-6 pb-16">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mt-8 mb-8">
            {categories.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold border transition-all",
                  activeCategory === id
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border/60 hover:border-primary/30 hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <HelpCircle className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-1">No results found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Try different keywords or browse by category above.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((faq) => {
                const isOpen = openFaq === faq.question;
                return (
                  <div
                    key={faq.question}
                    className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : faq.question)}
                      className="w-full flex items-center justify-between gap-4 p-4 text-left"
                    >
                      <span className="text-sm font-semibold text-foreground">{faq.question}</span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                          isOpen && "rotate-180",
                        )}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1 duration-200">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Contact section */}
          <div className="mt-12 rounded-2xl border border-border/50 bg-card p-8 shadow-sm text-center">
            <MessageSquare className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">Still need help?</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              Our support team is available Monday to Friday, 8am–6pm, and Saturday 9am–4pm.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button className="rounded-full font-bold text-xs" asChild>
                <a href="mailto:support@nearbyescapes.com">
                  <Mail className="h-4 w-4 mr-1.5" />
                  Email Support
                </a>
              </Button>
              <Button variant="outline" className="rounded-full font-semibold text-xs border-border/60" asChild>
                <Link href="/legal/privacy">
                  <Shield className="h-4 w-4 mr-1.5" />
                  Privacy Policy
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
