"use client";

import Link from "next/link";
import { Cookie, ArrowLeft } from "lucide-react";

export function CookiesPage() {
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Cookie className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Cookie Policy</h1>
              <p className="text-sm text-muted-foreground">Last updated: May 2025</p>
            </div>
          </div>
          <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">1. What Are Cookies</h2>
              <p>
                Cookies are small text files stored on your device when you visit a website. They
                help us remember your preferences, understand how you use our platform, and improve
                your experience. Some cookies are essential for the platform to function properly.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">2. How We Use Cookies</h2>
              <p>
                We use the following types of cookies: Essential cookies required for authentication
                and secure transactions, Functional cookies that remember your preferences and
                settings, Analytics cookies to understand how you interact with our platform, and
                Marketing cookies (with your consent) to deliver relevant content and measure
                campaign effectiveness.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">3. Third-Party Cookies</h2>
              <p>
                We partner with trusted analytics and payment providers who may set their own
                cookies. These are subject to the respective partners&apos; privacy policies. We do
                not control third-party cookies and recommend reviewing their policies for more
                information.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">4. Managing Cookies</h2>
              <p>
                You can control cookie preferences through your browser settings. Most browsers
                allow you to block or delete cookies. Note that disabling certain cookies may affect
                platform functionality, including the ability to log in or complete bookings.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">5. Updates</h2>
              <p>
                We may update this Cookie Policy from time to time. We encourage you to review this
                page periodically for any changes. Continued use of the platform after changes
                constitutes acceptance of the updated policy.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
