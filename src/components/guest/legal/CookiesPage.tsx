"use client";

import { PageShell, PageShellHeader, PageShellContent } from "@/components/layout/PageShell";

export function CookiesPage() {
  return (
    <PageShell>
      <PageShellContent size="sm">
        <PageShellHeader
          breadcrumbs={[{ label: "Help", href: "/help" }, { label: "Cookie Policy" }]}
          title="Cookie Policy"
          description="Last updated: May 2025"
        />
        <div className="space-y-6 text-muted-foreground text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. What Are Cookies</h2>
            <p>
              Cookies are small text files stored on your device when you visit a website. They help
              us remember your preferences, understand how you use our platform, and improve your
              experience. Some cookies are essential for the platform to function properly.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">2. How We Use Cookies</h2>
            <p>
              We use the following types of cookies: Essential cookies required for authentication
              and secure transactions, Functional cookies that remember your preferences and
              settings, Analytics cookies to understand how you interact with our platform, and
              Marketing cookies (with your consent) to deliver relevant content and measure campaign
              effectiveness.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">3. Third-Party Cookies</h2>
            <p>
              We partner with trusted analytics and payment providers who may set their own cookies.
              These are subject to the respective partners&apos; privacy policies. We do not control
              third-party cookies and recommend reviewing their policies for more information.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. Managing Cookies</h2>
            <p>
              You can control cookie preferences through your browser settings. Most browsers allow
              you to block or delete cookies. Note that disabling certain cookies may affect
              platform functionality, including the ability to log in or complete bookings.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">5. Updates</h2>
            <p>
              We may update this Cookie Policy from time to time. We encourage you to review this
              page periodically for any changes. Continued use of the platform after changes
              constitutes acceptance of the updated policy.
            </p>
          </section>
        </div>
      </PageShellContent>
    </PageShell>
  );
}
