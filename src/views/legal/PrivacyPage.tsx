"use client";

import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] font-sans">
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-12">
          <Link
            href="/help"
            className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mb-6"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Help Center
          </Link>
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
              <p className="text-sm text-muted-foreground">Last updated: May 2025</p>
            </div>
          </div>
          <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">1. Information We Collect</h2>
              <p>
                When you use Nearby Escapes, we collect information you provide directly: your name,
                email address, phone number, payment information, and communication preferences. We
                also automatically collect certain technical data including IP address, browser
                type, device information, and usage patterns to improve our service.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">
                2. How We Use Your Information
              </h2>
              <p>
                We use your information to: process and confirm bookings, facilitate communication
                between guests and hosts, send transaction updates and receipts, personalize your
                experience, improve our platform, and comply with legal obligations. We never sell
                your personal information to third parties.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">3. Information Sharing</h2>
              <p>
                We share your information with hosts only as necessary to complete your bookings
                (name, contact details, and booking preferences). Payment information is processed
                by our secure payment partners and is never shared directly with hosts. We may
                disclose information if required by law or to protect our rights.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">4. Data Security</h2>
              <p>
                We implement industry-standard encryption, secure servers, and regular security
                audits to protect your personal information. All payment transactions are processed
                through PCI-compliant gateways. However, no method of transmission over the Internet
                is 100% secure.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">5. Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal information at any
                time through your account settings. You may also request a copy of your data or
                withdraw consent for certain processing activities by contacting our support team.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">6. Contact</h2>
              <p>
                For privacy-related inquiries, contact us at privacy@nearbyescapes.com or write to:
                Nearby Escapes, PO Box 12345, Lusaka, Zambia.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
