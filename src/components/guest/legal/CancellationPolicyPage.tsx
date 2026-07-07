"use client";

import {
  ShieldCheck,
  Clock,
  RefreshCw,
  ArrowLeftRight,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { PageShell, PageShellHeader, PageShellContent } from "@/components/layout/PageShell";

const policies = [
  {
    id: "flexible",
    label: "Flexible",
    icon: RefreshCw,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    refund: "Full refund",
    window: "Up to 24 hours before check-in",
    description:
      "Cancel up to 24 hours before check-in for a full refund. No questions asked. If you cancel within 24 hours of check-in, the first night is non-refundable.",
    details: [
      "Full refund if cancelled at least 24 hours before check-in",
      "First night non-refundable if cancelled within 24 hours",
      "No refund if you cancel after check-in",
      "Host may offer a partial refund for extenuating circumstances",
    ],
  },
  {
    id: "moderate",
    label: "Moderate",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
    refund: "Full refund",
    window: "Up to 5 days before check-in",
    description:
      "Cancel up to 5 days before check-in for a full refund. If you cancel between 5 days and 24 hours before check-in, the first night is non-refundable.",
    details: [
      "Full refund if cancelled at least 5 days before check-in",
      "First night non-refundable if cancelled 5 days to 24 hours before check-in",
      "No refund if you cancel within 24 hours of check-in",
      "No refund after check-in",
    ],
  },
  {
    id: "strict",
    label: "Strict",
    icon: ShieldCheck,
    color: "text-rose-600",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
    borderColor: "border-rose-200 dark:border-rose-800",
    refund: "50% refund",
    window: "Up to 7 days before check-in",
    description:
      "Cancel up to 7 days before check-in for a 50% refund. No refund if you cancel within 7 days of check-in or after check-in.",
    details: [
      "50% refund if cancelled at least 7 days before check-in",
      "No refund if cancelled within 7 days of check-in",
      "No refund after check-in",
      "Recommended for peak season and exclusive bookings",
    ],
  },
];

const experiencePolicies = [
  {
    scenario: "Host cancels",
    icon: AlertTriangle,
    explanation:
      "If a host cancels a confirmed booking, you will receive a full refund plus a 10% travel credit as compensation. The host's account may be subject to penalties.",
  },
  {
    scenario: "Weather or safety",
    icon: HelpCircle,
    explanation:
      "If a tour or experience is cancelled due to unsafe weather conditions or government restrictions, you'll receive a full refund or the option to reschedule at no extra cost.",
  },
  {
    scenario: "Guest cancellation",
    icon: ArrowLeftRight,
    explanation:
      "Guest cancellations for experiences follow a standard policy: full refund up to 48 hours before the start time, 50% refund up to 24 hours before, and no refund within 24 hours.",
  },
  {
    scenario: "No-show",
    icon: AlertTriangle,
    explanation:
      "If you do not show up for a booked experience without prior notice, no refund will be issued. We recommend contacting the host if you're running late.",
  },
];

const steps = [
  {
    step: 1,
    title: "Go to My Trips",
    description: "Navigate to your Trips page and find the booking you'd like to cancel.",
  },
  {
    step: 2,
    title: "Click Cancel",
    description:
      "Select the Cancel button on the booking card. Review the cancellation policy and refund amount shown.",
  },
  {
    step: 3,
    title: "Confirm",
    description:
      "Confirm your cancellation. You'll receive a confirmation email and the refund will be processed within 5-7 business days.",
  },
];

export function CancellationPolicyPage() {
  return (
    <PageShell>
      <PageShellContent size="sm">
        <PageShellHeader
          breadcrumbs={[
            { label: "Help", href: "/help" },
            { label: "Cancellation & Refund Policy" },
          ]}
          title="Cancellation & Refund Policy"
          description="Last updated: June 2025"
        />

        {/* Intro */}
        <section className="mb-8">
          <p className="text-muted-foreground text-base leading-relaxed">
            At Nearby Escapes, we understand that plans can change. Our cancellation policies are
            designed to be fair to both guests and hosts while providing clarity on what to expect.
            Each listing displays its cancellation policy before you book, so you can make an
            informed choice.
          </p>
        </section>

        {/* Accommodation Policies */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-2">Accommodation Policies</h2>
          <p className="text-base text-muted-foreground mb-6">
            Hosts choose from three standard cancellation policies for their property. The policy is
            clearly displayed on each listing page before you book.
          </p>
          <div className="space-y-4">
            {policies.map((policy) => {
              const Icon = policy.icon;
              return (
                <div
                  key={policy.id}
                  className={`rounded-2xl border ${policy.borderColor} ${policy.bgColor} overflow-hidden`}
                >
                  {/* Header */}
                  <div className="flex items-start gap-4 p-5 pb-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${policy.bgColor} ${policy.color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-lg text-foreground">{policy.label}</h3>
                        <span
                          className={`text-sm font-bold px-2 py-0.5 rounded-full ${policy.bgColor} ${policy.color}`}
                        >
                          {policy.refund}
                        </span>
                      </div>
                      <p className="text-base text-muted-foreground mt-1">Cancel {policy.window}</p>
                    </div>
                  </div>
                  <div className="px-5 pb-3">
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {policy.description}
                    </p>
                  </div>
                  <div className="border-t border-inherit px-5 py-3">
                    <ul className="space-y-2">
                      {policy.details.map((detail, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-base text-muted-foreground"
                        >
                          <CheckCircle2 className="h-4 w-4 text-muted-foreground/40 mt-0.5 shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Experience & Tour Policies */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-2">Experience & Tour Policies</h2>
          <p className="text-base text-muted-foreground mb-6">
            For booked experiences, tours, and activities, the following cancellation terms apply:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experiencePolicies.map(({ scenario, icon: Icon, explanation }) => (
              <div
                key={scenario}
                className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="h-5 w-5 text-primary/70" />
                  <h3 className="font-bold text-base text-foreground">{scenario}</h3>
                </div>
                <p className="text-base text-muted-foreground leading-relaxed">{explanation}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Transport Policies */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-2">Transport Policies</h2>
          <p className="text-base text-muted-foreground mb-4">
            For bus, shuttle, and transfer bookings, cancellation policies are set by the transport
            operator and are displayed on the booking page. General guidelines:
          </p>
          <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-base text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>
                  <strong className="text-foreground">100% refund</strong> if cancelled at least 24
                  hours before departure
                </span>
              </li>
              <li className="flex items-start gap-2 text-base text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <span>
                  <strong className="text-foreground">50% refund</strong> if cancelled between 24
                  hours and 2 hours before departure
                </span>
              </li>
              <li className="flex items-start gap-2 text-base text-muted-foreground">
                <AlertTriangle className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
                <span>
                  <strong className="text-foreground">No refund</strong> within 2 hours of departure
                  or for no-shows
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* How to Cancel */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-2">How to Cancel a Booking</h2>
          <p className="text-base text-muted-foreground mb-6">
            Cancelling a booking is simple and can be done directly from your account:
          </p>
          <div className="space-y-4">
            {steps.map(({ step, title, description }) => (
              <div key={step} className="flex gap-4 p-4 rounded-xl border border-border/50 bg-card">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-black text-base">
                  {step}
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">{title}</h3>
                  <p className="text-base text-muted-foreground mt-0.5">{description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-base text-muted-foreground mt-4 leading-relaxed">
            If you experience any issues cancelling, please contact our support team at{" "}
            <a
              href="mailto:support@nearbyescapes.com"
              className="text-primary underline underline-offset-2"
            >
              support@nearbyescapes.com
            </a>{" "}
            or call{" "}
            <a href="tel:+260970000000" className="text-primary underline underline-offset-2">
              +260 97 000 0000
            </a>
            .
          </p>
        </section>

        {/* Exceptions */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-foreground mb-2">
            Exceptions & Extenuating Circumstances
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            In certain situations beyond anyone&apos;s control, our Extenuating Circumstances policy
            may apply. This includes serious illness or injury, travel restrictions, natural
            disasters, or government-mandated closures. If you believe your situation qualifies,
            please contact our support team with supporting documentation and we&apos;ll review your
            case within 48 hours.
          </p>
        </section>

        {/* Note at bottom */}
        <div className="rounded-xl bg-muted/50 border border-border/40 p-4 text-base text-muted-foreground">
          <p className="flex items-start gap-2">
            <HelpCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span>
              <strong className="text-foreground">Have questions?</strong> Visit our{" "}
              <a href="/help" className="text-primary underline underline-offset-2">
                Help Centre
              </a>{" "}
              for FAQs or contact our support team. We&apos;re here to help.
            </span>
          </p>
        </div>
      </PageShellContent>
    </PageShell>
  );
}
