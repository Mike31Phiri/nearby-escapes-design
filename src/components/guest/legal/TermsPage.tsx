"use client";

import { PageShell, PageShellHeader, PageShellContent } from "@/components/layout/PageShell";

export function TermsPage() {
  return (
    <PageShell>
      <PageShellContent size="sm">
        <PageShellHeader
          breadcrumbs={[{ label: "Help", href: "/help" }, { label: "Terms of Service" }]}
          title="Terms of Service"
          description="Last updated: May 2025"
        />
        <div className="space-y-10 text-neutral-500 text-[14px] leading-7">
          <section>
            <h2 className="text-[15px] font-semibold text-neutral-800 mb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Nearby Escapes, you agree to be bound by these Terms of Service.
              If you do not agree, please do not use our platform. We reserve the right to update
              these terms at any time; continued use constitutes acceptance of changes.
            </p>
          </section>
          <section>
            <h2 className="text-[15px] font-semibold text-neutral-800 mb-2">
              2. User Responsibilities
            </h2>
            <p>
              You agree to provide accurate information when creating an account and making
              bookings. You are responsible for maintaining the confidentiality of your account
              credentials. You may not use the platform for any unlawful purpose or in violation of
              any applicable laws or regulations.
            </p>
          </section>
          <section>
            <h2 className="text-[15px] font-semibold text-neutral-800 mb-2">
              3. Bookings &amp; Payments
            </h2>
            <p>
              All bookings are subject to availability and host confirmation. Prices are displayed
              in Zambian Kwacha (K) and include applicable taxes unless otherwise stated.
              Cancellation policies vary by host and are displayed before booking. We process
              payments securely on behalf of hosts.
            </p>
          </section>
          <section>
            <h2 className="text-[15px] font-semibold text-neutral-800 mb-2">4. Host Obligations</h2>
            <p>
              Hosts agree to maintain accurate listings, honor confirmed bookings, respond promptly
              to guest inquiries, and provide services as described. Failure to meet these
              obligations may result in account suspension or removal from the platform.
            </p>
          </section>
          <section>
            <h2 className="text-[15px] font-semibold text-neutral-800 mb-2">
              5. Limitation of Liability
            </h2>
            <p>
              Nearby Escapes acts as a marketplace connecting guests and hosts. We are not
              responsible for the actual condition of listings, the conduct of guests or hosts, or
              any damages arising from bookings made through our platform. Our liability is limited
              to the maximum extent permitted by law.
            </p>
          </section>
          <section>
            <h2 className="text-[15px] font-semibold text-neutral-800 mb-2">6. Contact</h2>
            <p>For questions about these terms, contact legal@nearbyescapes.com.</p>
          </section>
        </div>
      </PageShellContent>
    </PageShell>
  );
}
