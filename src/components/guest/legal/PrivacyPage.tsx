"use client";

import { PageShell, PageShellHeader, PageShellContent } from "@/components/layout/PageShell";

export function PrivacyPage() {
  return (
    <PageShell>
      <PageShellContent size="sm">
        <PageShellHeader
          breadcrumbs={[{ label: "Help", href: "/help" }, { label: "Privacy Policy" }]}
          title="Privacy Policy"
          description="Last updated: May 2025"
        />
        <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">1. Information We Collect</h2>
            <p>
              When you use Nearby Escapes, we collect information you provide directly: your name,
              email address, phone number, payment information, and communication preferences. We
              also automatically collect certain technical data including IP address, browser type,
              device information, and usage patterns to improve our service.
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
              (name, contact details, and booking preferences). Payment information is processed by
              our secure payment partners and is never shared directly with hosts. We may disclose
              information if required by law or to protect our rights.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">4. Data Security</h2>
            <p>
              We implement industry-standard encryption, secure servers, and regular security audits
              to protect your personal information. All payment transactions are processed through
              PCI-compliant gateways. However, no method of transmission over the Internet is 100%
              secure.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">5. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information at any time
              through your account settings. You may also request a copy of your data or withdraw
              consent for certain processing activities by contacting our support team.
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
      </PageShellContent>
    </PageShell>
  );
}
